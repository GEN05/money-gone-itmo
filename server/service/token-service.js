const jwt = require("jsonwebtoken");
const TokenModel = require("../models/token-model");

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "30m"});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"});
        const resetToken = jwt.sign(payload, process.env.JWT_RESET_SECRET, {expiresIn: 3600});
        
        return {
            accessToken,
            refreshToken,
            resetToken,
        };
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    validateResetToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_RESET_SECRET);
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await TokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken) {
        return await TokenModel.deleteOne({refreshToken});
    }

    async findToken(refreshToken) {
        return await TokenModel.findOne({refreshToken});
    }
}

module.exports = new TokenService();
