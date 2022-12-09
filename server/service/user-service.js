const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const TransactionsDto = require('../dtos/transactions-dto');
const ApiError = require('../exceptions/api-error');

const applyDto = (user) => {
    let userDto = (new UserDto(user))
    userDto.transactions = userDto.transactions.map(trns => new TransactionsDto(trns));
    return userDto;
}

class UserService {
    async registration(email, password, firstName, lastName) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({email, password: hashPassword, firstName, lastName, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = applyDto(user) // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('No user exists with such email')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password');
        }
        const userDto = applyDto(user) ;
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = applyDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async addTransaction(userId, date, category, value) {
        await UserModel
            .findById(userId)
            .updateOne(
                {},
                {$push: {"transactions": {date: date, category: category, value: value}}},
                {new: true})

        const user = await UserModel.findById(userId)
        return applyDto(user).transactions;
    }

    async deleteTransaction(userId, trnsId) {
        await UserModel
            .findById(userId)
            .updateOne(
                {},
                {$pull: {"transactions": {_id: trnsId}}},
                {multi: true})

        const user = await UserModel.findById(userId)
        console.log(user)
        return applyDto(user).transactions;
    }
}

module.exports = new UserService();
