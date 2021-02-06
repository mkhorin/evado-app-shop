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

Shop.AjaxQueue = class AjaxQueue {

    constructor () {
        this._tasks = [];
    }

    post (...args) {
        const deferred = $.Deferred();
        this._tasks.push({deferred, args});
        this.execute();
        return deferred;
    }

    remove (deferred) {
        const index = this.getTaskIndex(deferred);
        if (index !== undefined) {
            this._tasks.splice(index, 1);
        }
    }

    getTaskIndex (deferred) {
        for (let i = 0; i < this._tasks.length; ++i) {
            if (this._tasks[i].deferred === deferred) {
                return i;
            }
        }
    }

    execute () {
        if (this._xhr || !this._tasks.length) {
            return false;
        }
        const {deferred, args} = this._tasks.splice(0, 1)[0];
        const csrf = Jam.getCsrfToken();
        const data = {csrf, ...args[1]};
        const params = {
            method: 'post',
            contentType: 'application/json',
            url: args[0],
            data: JSON.stringify(data)
        };
        this._xhr = $.ajax(params)
            .always(() => this._xhr = null)
            .done(data => deferred.resolve(data))
            .fail(data => deferred.reject(data));
        deferred.done(this.next.bind(this));
        deferred.fail(this.next.bind(this));
    }

    next () {
        this.execute();
    }

    abort () {
        this._xhr?.abort();
        this._xhr = null;
    }
};

Shop.Loadable = class Loadable extends Shop.Element {

    init () {
        this.$content = this.$container.children('.loadable-content');
    }

    isLoading () {
        return this.$container.hasClass('loading');
    }

    getUrl (key = 'url') {
        return this.getData(key) || this.shop.getData(key);
    }

    setInstance (id) {
        if (id && this.id !== id) {
            this.id = id;
            this.clear();
            this.load();
        }
    }

    load () {
        if (this.isLoading()) {
            return false;
        }
        this.toggleLoader(true);
        this._deferred = this.shop.ajaxQueue
            .post(this.getUrl(), this.getPostData())
            .done(this.onDone.bind(this))
            .done(this.onAfterDone.bind(this))
            .fail(this.onFail.bind(this));
        return this._deferred;
    }

    getPostData () {
        return null;
    }

    toggleLoader (state) {
        this.$container.toggleClass('loading', state);
    }

    onDone (data) {
        this.toggleLoader(false);
        this.$content.html(this.render(data));
        Jam.t(this.$container);
        Jam.Helper.executeSerialImageLoading(this.$container);
    }

    onAfterDone () {
        this.createHandlers();
    }

    onFail (data) {
        this.toggleLoader(false);
        this.$content.html(this.renderError(data));
    }

    clear () {
        this.$content.html('');
    }

    render (data) {
        return data;
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }
};

Shop.Pagination = class Pagination {

    constructor (list) {
        this.list = list;
        this.page = 0;
        this.pageSize = 10;
        this.list.on('click', '.pagination [data-action="first"]', this.onFirst.bind(this));
        this.list.on('click', '.pagination [data-action="prev"]', this.onPrev.bind(this));
        this.list.on('click', '.pagination [data-action="next"]', this.onNext.bind(this));
        this.list.on('click', '.pagination [data-action="last"]', this.onLast.bind(this));
        this.list.on('click', '.pagination [data-page]', this.onPage.bind(this));
    }

    isValidPage (page) {
        return Number.isInteger(page) && page >= 0 && page < this.numPages;
    }

    getOffset () {
        return this.page * this.pageSize;
    }

    getPageSize () {
        return this.pageSize;
    }

    onFirst (event) {
        event.preventDefault();
        this.setPage(0);
    }

    onPrev (event) {
        event.preventDefault();
        this.setPage(this.page - 1);
    }

    onLast (event) {
        event.preventDefault();
        this.setPage(this.numPages - 1);
    }

    onNext (event) {
        event.preventDefault();
        this.setPage(this.page + 1);
    }

    onPage (event) {
        event.preventDefault();
        this.setPage(event.target.dataset.page);
    }

    setPage (page) {
        page = Number(page);
        if (page !== this.page && this.isValidPage(page)) {
            this.page = page;
            this.list.trigger('change:pagination', {page});
        }
    }

    setTotal (total) {
        total = Number.isInteger(total) ? total : 0;
        this.numPages = Math.ceil(total / this.pageSize);
    }

    render () {
        if (this.numPages < 2) {
            return '';
        }
        const template = this.list.getTemplate('pagination');
        const pages = this.renderPages();
        return Shop.resolveTemplate(template, {pages});
    }

    renderPages () {
        const template = this.list.getTemplate('page');
        const result = [];
        for (let page = 0; page < this.numPages; ++page) {
            const active = page === this.page ? 'active' : '';
            const text = page + 1;
            result.push(Shop.resolveTemplate(template, {active, page, text}));
        }
        return result.join('');
    }
};

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