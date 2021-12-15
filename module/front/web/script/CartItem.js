'use strict';

class CartItem {

    static create (data, cart) {
        data = data || {};
        return new this(data.id, data.qty, cart);
    }

    constructor (id, qty, cart) {
        this.id = id;
        this.qty = qty;
        this.price = 0;
        this.cart = cart;
    }

    getTotalPrice () {
        return Cart.roundPrice(this.qty * this.price);
    }

    changeQty (delta) {
        const qty = this.qty + delta;
        if (qty < 1 || (delta > 0 && qty > this.inStock)) {
            return false;
        }
        this.qty = qty;
        return qty;
    }

    remove () {
        return this.cart.remove(this.id);
    }

    serialize () {
        return {
            id: this.id,
            qty: this.qty
        };
    }

    sync (data) {
        this.inStock = data.inStock;
        this.price = data.price;
        if (this.qty > this.inStock) {
            this.qty = this.inStock;
        }
        data.cartItem = this;
    }
}