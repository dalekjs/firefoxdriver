module.exports = {
  client: null,
  setClient: function (client) {
    this.client = client;
  },
  getClient: function () {
    return this.client;
  }
}