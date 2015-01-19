var Cache = function () {
    this.store = {};
};

Cache.prototype.set = function (url, data) {
    this.store[url] = data;
};

Cache.prototype.get = function (url) {
    return this.store[url];
};

Cache.prototype.exists = function (url) {
    return this.store.hasOwnProperty(url);
};