/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.Meta = class Meta {

    constructor (shop) {
        this.shop = shop;
        this._classMap = {};
    }

    getClass (name) {
        return this._classMap.hasOwnProperty(name)
            ? $.Deferred().resolve(this._classMap[name])
            : this.load('class', {class: name}).done(data => this._classMap[name] = data);
    }

    getUrl (key) {
        return this.shop.getData('meta-'+ key);
    }

    load (key, data) {
        return $.post(this.getUrl(key), data).fail(this.onFail.bind(this));
    }

    onFail () {
    }
};