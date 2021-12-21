'use strict';

class CartItem {

    static create (data, cart) {
        data = data || {};
        return new this(data.id, data.quantity, cart);
    }

    constructor (id, quantity, cart) {
        this.id = id;
        this.quantity = quantity;
        this.price = 0;
        this.cart = cart;
    }

    getTotalPrice () {
        return Cart.roundPrice(this.quantity * this.price);
    }

    changeQuantity (delta) {
        const quantity = this.quantity + delta;
        if (quantity < 1 || (delta > 0 && quantity > this.inStock)) {
            return false;
        }
        this.quantity = quantity;
        return quantity;
    }

    remove () {
        return this.cart.remove(this.id);
    }

    serialize () {
        return {
            id: this.id,
            quantity: this.quantity
        };
    }

    sync (data) {
        this.inStock = data.inStock;
        this.price = data.price;
        if (this.quantity > this.inStock) {
            this.quantity = this.inStock;
        }
        data.cartItem = this;
    }
}