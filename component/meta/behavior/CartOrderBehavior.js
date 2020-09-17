/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/behavior/Behavior');

module.exports = class CartOrderBehavior extends Base {

    afterValidate () {
        if (!this.owner.hasError()) {
            return this.validate();
        }
    }

    async validate () {
        const items = this.get('items');
        if (!Array.isArray(items) || !items.length) {
            return this.addItemError('Invalid items');
        }
        const ids = items.map(item => item.id);
        const query = this.getMetaClass('item').findById(ids);
        const itemMap = await query.and({active: true}).raw().indexByKey().all();
        if (Object.values(itemMap).length !== items.length) {
            return this.addItemError('Item not found');
        }
        for (const item of items) {
            const source = itemMap[item.id];
            if (!Number.isInteger(item.qty) || item.qty < 1) {
                return this.addItemError(`Invalid quantity: ${source.name}`);
            }
            if (item.qty > source.inStock) {
                return this.addItemError(`Invalid quantity: ${source.name}: In stock: ${source.inStock}`);
            }
        }
        this._items = items;
    }

    addItemError (message) {
        return this.owner.addError('items', message);
    }

    beforeInsert () {
        this.owner.set('customer', this.owner.user.getId());
    }

    async afterInsert () {
        await this.createOrderItems();
    }

    async createOrderItems (items) {
        if (Array.isArray(this._items)) {
            const order = this.owner.getId();
            const itemClass = this.getMetaClass('orderItem');
            for (const item of this._items) {
                const model = this.owner.createByView(itemClass);
                model.assign({
                    order,
                    item: itemClass.key.normalize(item.id),
                    quantity: item.qty
                });
                await model.insert();
            }
        }
    }
};