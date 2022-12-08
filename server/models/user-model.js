const {Schema, model} = require('mongoose');

const TransactionSchema = new Schema({
    date: {type: Number, required: true},
    category: {type: String, default: 'default'},
    value: {type: Number, required: true},
})

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    transactions: {type: [TransactionSchema], default: []}
})

module.exports = model('User', UserSchema);
