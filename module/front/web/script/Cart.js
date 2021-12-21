'use strict';

class Cart {

    static roundPrice (value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    constructor () {
        this.storeKey = 'evadoShopCart';
        this.items = this.load();
    }

    count () {
        return this.items.length;
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
        return this.constructor.roundPrice(total);
    }

    add (id, quantity) {
        let item = this.getItem(id);
        if (item) {
            item.quantity += quantity;
        } else {
            this.items.push(CartItem.create({id, quantity}, this));
        }
        return this.save();
    }

    clear () {
        this.items.splice(0, this.items.length);
        return this.save();
    }

    remove (id) {
        const item = this.getItem(id);
        if (item) {
            this.items.splice(this.items.indexOf(item), 1);
            return this.save();
        }
    }

    load () {
        const values = Jam.localStorage.get(this.storeKey);
        return Array.isArray(values)
            ? values.map(data => CartItem.create(data, this))
            : [];
    }

    save () {
        const data = this.items.map(item => item.serialize());
        return Jam.localStorage.set(this.storeKey, data);
    }

    sync (items) {
        const result = [];
        for (const data of items) {
            const item = this.getItem(data._id);
            if (item) {
                item.sync(data);
                result.push(item);
            }
        }
        if (this.items.length !== result.length) {
            this.items.splice(0, this.items.length, ...result);
        }
        return this.save();
    }
}