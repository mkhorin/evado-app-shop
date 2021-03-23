/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

class Shop {

    static getElementClass (name) {
        return Shop[name]?.prototype instanceof Shop.Element ? Shop[name] : null;
    }

    static toggle ($element, state) {
        return $element.toggleClass('hidden', !state);
    }

    static getTemplate (name, container) {
        return container.querySelector(`template[data-id="${name}"]`)?.innerHTML;
    }

    static resolveTemplate (text, data) {
        return text.replace(/{{(\w+)}}/gm, (match, key)=> {
            const value = data[key];
            return data.hasOwnProperty(key) && value !== undefined && value !== null ? value : '';
        });
    }

    static setPageTitle (text) {
        const $title = $(document.head).find('title');
        const base = $title.data('title');        
        $title.html(text ? `${Jam.t(text)} - ${base}` : base);
    }

    static escapeData (data, keys) {
        for (const key of keys || Object.keys(data)) {
            data[key] = this.escapeHtml(data[key]);
        }
    }

    static escapeHtml (value) {
        return typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
    }

    static createHandlers (shop, container) {
        const handlers = [];
        for (const element of container.querySelectorAll('[data-handler]')) {
            const name = element.dataset.handler;
            if (typeof name === 'string') {
                const Class = this.getElementClass(name);
                if (Class) {
                    handlers.push(new Class(element, shop));
                } else {
                    console.error(`Handler not found: ${name}`);
                }
            }
        }
        for (const handler of handlers) {
            if (handler.init) {
                handler.init();
            }
        }
    }

    static roundPrice (value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    constructor () {
        this.ajaxQueue = new Shop.AjaxQueue;
        this.$container = $('.shop');
        this.meta = new Shop.Meta(this);
        this.cart = new Shop.Cart(this);
        this.constructor.createHandlers(this, document);
        this.on('click', '[data-action="main"]', this.onMain.bind(this));
        this.on('click', '[data-action="cart"]', this.onCart.bind(this));
        this.on('click', '[data-action="category"]', this.onCategory.bind(this));
        this.on('click', '[data-action="item"]', this.onItem.bind(this));
        this.on('click', '[data-action="order"]', this.onOrder.bind(this));
        this.on('click', '[data-action="orders"]', this.onOrders.bind(this));
        this.on('action:auth', this.onAuth.bind(this));
    }

    isGuest () {
        return this.getData('guest');
    }

    getData (key) {
        return this.$container.data(key);
    }

    showPage (name, data) {
        this.trigger('show:page', Object.assign({name}, data));
    }

    getPage (name) {
        return this.getPages().filter(`[data-page="${name}"]`);
    }

    getPages () {
        return this.$container.children('.page');
    }

    togglePage (name) {
        this.getPages().removeClass('active');
        this.getPage(name).addClass('active');
    }

    getActionTarget (event) {
        return $(event.currentTarget).closest('[data-id]').data('id');
    }

    getHandler (name) {
        return this.$container.find(`[data-handler="${name}"]`).data('handler');
    }

    getAuthAction (action) {
        return `action:${this.isGuest() ? 'auth' : action}`;
    }

    toggleLoader (state) {
        $('.global-loader').toggle(state);
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }

    onMain (event) {
        event.preventDefault();
        this.showPage('main');
    }

    onCart (event) {
        event.preventDefault();
        this.trigger('action:cart');
    }

    onCategory (event) {
        event.preventDefault();
        const category = this.getActionTarget(event);
        this.trigger('action:category', {category});
    }

    onItem (event) {
        event.preventDefault();
        const item = this.getActionTarget(event);
        this.trigger('action:item', {item});
    }

    onOrder (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('order'));
    }

    onOrders (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('orders'));
    }

    onAuth (event) {
        event.preventDefault();
        location.assign('auth/sign-in?returnUrl=/front');
    }
}