/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.Element = class Element {

    constructor (container, shop) {
        this.shop = shop;
        this.container = container;
        this.$container = $(container);
        this.$container.data('handler', this);
    }

    find () {
        return this.$container.find(...arguments);
    }

    getData (key) {
        return this.$container.data(key);
    }

    getHandler (name) {
        return this.find(`[data-handler="${name}"]`).data('handler');
    }

    createHandlers () {
        Shop.createHandlers(this.shop, this.container);
    }

    getTemplate (name) {
        return Shop.getTemplate(name, this.container);
    }

    resolveTemplate (name, data) {
        return Shop.resolveTemplate(this.getTemplate(name), data);
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }
};