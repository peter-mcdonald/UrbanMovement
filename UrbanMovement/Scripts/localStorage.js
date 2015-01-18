var Cache = function () {
    this.store = {};
    log("** New Storage **");
};

Cache.prototype.set = function (url, data) {
    log("set url " + url);
    this.store[url] = data;
};

Cache.prototype.get = function (url) {
    log("get url " + url);
    return this.store[url];
};

Cache.prototype.exists = function (url) {
    log("exists url " + url + " " + this.store.hasOwnProperty(url));
    return this.store.hasOwnProperty(url);
};