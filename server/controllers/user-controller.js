const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, firstName, lastName} = req.body;
            const userData = await userService.registration(email, password, firstName, lastName);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            console.log(req.user)
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async addTransaction(req, res, next) {
        try {
            const {date, category, value} = req.body;
            // console.log(category, value)
            const userTransactions = await userService.addTransaction(req.user.id, date, category, value);
            // const transactions = await userService.addTransaction(req.user.id, "12345", category, value);
            // return res.json(transactions);
            // console.log(userTransactions)
            return res.json(userTransactions);
        } catch (e) {
            next(e);
        }
    }

    async deleteTransaction(req, res, next) {
        try {
            const {id} = req.body;
            const userTransactions = await userService.deleteTransaction(req.user.id, id);
            // const transactions = await userService.addTransaction(req.user.id, "12345", category, value);
            // return res.json(transactions);
            // console.log(userTransactions)
            return res.json(userTransactions);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new UserController();
