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
        const query = this.getMetadataClass('item').findById(ids);
        const itemMap = await query.and({active: true}).raw().indexByKey().all();
        if (Object.values(itemMap).length !== items.length) {
            return this.addItemError('Item not found');
        }
        for (const item of items) {
            const source = itemMap[item.id];
            if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                return this.addItemError(`Invalid quantity: ${source.name}`);
            }
            if (item.quantity > source.inStock) {
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
            for (const item of this._items) {
                await this.createOrderItem(item);
            }
        }
    }

    createOrderItem (data) {
        const itemClass = this.getMetadataClass('orderItem');
        const model = this.owner.createByView(itemClass);
        model.assign({
            item: itemClass.key.normalize(data.id),
            quantity: data.quantity,
            order: this.owner.getId()
        });
        return model.insert();
    }
};