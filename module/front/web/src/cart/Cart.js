/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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