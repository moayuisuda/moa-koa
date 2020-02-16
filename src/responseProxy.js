module.exports = {
  get body() {
    return this._body;
  },
  set body(data) {
    this._body = data;
  },

  get end() {
    return this.response.end.bind(this.response);
  }
};
