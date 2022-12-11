module.exports = class TransactionDto {
  constructor(model) {
    this.id = model._id;
    this.date = model.date;
    this.category = model.category;
    this.value = model.value;
  }
};
