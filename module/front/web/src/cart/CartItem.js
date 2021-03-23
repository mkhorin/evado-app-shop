/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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