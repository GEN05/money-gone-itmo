module.exports = class UserDto {
    constructor(model) {
        this.email = model.email;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.avatar = model.avatar;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.transactions = model.transactions;
        this.transactionsFromBank = model.transactionsFromBank;
    }
}
