'use strict';

Shop.Cart = class Cart {

    constructor (shop) {
        this.storeKey = 'evadoShopCart';
        this.items = this.load();
        this.shop = shop;
        this.shop.on('action:order', this.onOrder.bind(this));
    }

    getCartPage () {
        return this.shop.getHandler('CartPage');
    }

    getItem (id) {
        for (const item of this.items) {
            if (item.id === id) {
                return item;
            }
        }
    }

    getTotalPrice () {
        let total = 0;
        for (const item of this.items) {
            total += item.getTotalPrice();
        }
        return Shop.roundPrice(total);
    }

    add (id, qty) {
        let item = this.getItem(id);
        if (item) {
            item.qty += qty;
        } else {
            item = new Shop.CartItem(id, qty);
            this.items.push(item);
        }
        this.save();
    }

    remove (id) {
        const item = this.getItem(id);
        if (item) {
            this.items.splice(this.items.indexOf(item), 1);
            this.save();
        }
    }

    load () {
        const values = Jam.localStorage.get(this.storeKey);
        return Array.isArray(values)
            ? values.map(Shop.CartItem.create, Shop.CartItem)
            : [];
    }

    save () {
        Jam.localStorage.set(this.storeKey, this.items.map(item => item.serialize()));
        this.shop.trigger('change:cart');
    }

    sync (items) {
        const result = [];
        for (const data of items) {
            const item = this.getItem(data._id);
            if (item) {
                item.price = data.price;
                item.inStock = data.inStock;
                result.push(item);
            }
        }
        this.items = result;
        this.save();
    }

    onOrder () {
        if (!this.items.length) {
            return false;
        }
        const items = this.items.map(item => item.serialize());
        const params = {
            class: 'order',
            view: 'createFromCart',
            data: {items}
        };
        const url = this.shop.getData('create');
        this.shop.ajaxQueue.post(url, params)
            .done(this.onOrderDone.bind(this))
            .fail(this.onOrderFail.bind(this));
    }

    onOrderDone () {
        this.items = [];
        this.save();
        this.getCartPage().list.setOrderDone();
    }

    onOrderFail (data) {
        this.getCartPage().list.setOrderError(data.responseText);
    }
};

Shop.CartItem = class CartItem {

    static create (data) {
        data = data || {};
        return new this(data.id, data.qty);
    }

    constructor (id, qty) {
        this.id = id;
        this.qty = qty;
        this.price = 0;
    }

    getTotalPrice () {
        return Shop.roundPrice(this.qty * this.price);
    }

    changeQty (delta) {
        const qty = this.qty + delta;
        if (qty < 1 || (delta > 0 && qty > this.inStock)) {
            return false;
        }
        this.qty = qty;
    }

    serialize () {
        return {
            id: this.id,
            qty: this.qty
        };
    }
};

Shop.CartItemList = class CartItemList extends Shop.Loadable {

    init () {
        super.init();
        this.cart = this.shop.cart;
        this.on('click', '[data-command="increase"]', this.onIncrease.bind(this));
        this.on('click', '[data-command="reduce"]', this.onReduce.bind(this));
        this.on('click', '[data-command="remove"]', this.onRemove.bind(this));
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'item',
            view: 'publicList',
            start: 0,
            length: 0,
            filter: this.getFilter()
        };
    }

    getFilter () {
        if (!this.cart.items.length) {
            return [{
                attr: '_id',
                op: 'equal',
                value: false
            }];
        }
        return this.cart.items.map(item => ({
            or: true,
            attr: '_id',
            op: 'equal',
            value: item.id
        }));
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        this.cart.sync(items);
        items = items.map(this.renderItem, this).join('');
        return this.resolveTemplate('list', {items});
    }

    renderItem (data) {
        data.photo = data.mainPhoto?._id;
        const item = this.cart.getItem(data._id);
        data.qty = item.qty;
        data.price = item.getTotalPrice();
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    resolveContent () {
        if (this.cart.items.length) {
            this.find('.cart-total .num').html(this.cart.getTotalPrice());
        } else {
            this.$content.html(this.resolveTemplate('empty'));
        }
        Jam.t(this.$container);
    }

    changeQty (delta, element) {
        const $item = $(element).closest('.cart-item');
        const item = this.cart.getItem($item.data('id'));
        item.changeQty(delta);
        this.cart.save();
        $item.find('.qty').html(item.qty);
        $item.find('.price').html(item.getTotalPrice());
        this.resolveContent();
    }

    onDone (data) {
        super.onDone(data);
        this.resolveContent();
    }

    onIncrease (event) {
        this.changeQty(1, event.currentTarget);
    }

    onReduce (event) {
        this.changeQty(-1, event.currentTarget);
    }

    onRemove (event) {
        const $item = $(event.currentTarget).closest('.cart-item');
        this.cart.remove($item.data('id'));
        $item.remove();
        this.resolveContent();
    }

    setOrderDone () {
        Jam.t(this.$content.html(this.resolveTemplate('ordered')));
    }

    setOrderError (text) {
        Jam.t(this.$content.append(this.resolveTemplate('error', {text})));
    }
};

Shop.CartToggle = class CartToggle extends Shop.Element {

    init () {
        this.shop.on('change:cart', this.onChange.bind(this));
        this.onChange();
    }

    onChange () {
        const counter = this.shop.cart.items.length;
        this.$container.toggleClass('has-item', counter > 0);
        this.find('.num').html(counter);
    }
};