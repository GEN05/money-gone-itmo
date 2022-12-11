const {Schema, model} = require("mongoose");

const TokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    refreshToken: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        required: false,
    },
    createdAt: { type: Date, expires: 3600 },
});

module.exports = model("Token", TokenSchema);
