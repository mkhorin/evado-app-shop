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
        const targets = this.get('items');
        if (!Array.isArray(targets) || !targets.length) {
            return this.addItemError('Invalid items');
        }
        const ids = targets.map(item => item.id);
        const itemMap = await this.getActiveItemMap(ids);
        if (Object.values(itemMap).length !== targets.length) {
            return this.addItemError('Item not found');
        }
        for (const target of targets) {
            if (!this.validateTarget(target, itemMap[target.id])) {
                return false;
            }
        }
        this._targets = targets;
    }

    getActiveItemMap (ids) {
        const query = this.getMetadataClass('item').findById(ids);
        return query.and({active: true}).raw().indexByKey().all();
    }

    validateTarget ({quantity}, {name, inStock}) {
        if (!Number.isInteger(quantity) || quantity < 1) {
            return this.addItemError(`Invalid quantity: ${name}`);
        }
        if (quantity > inStock) {
            return this.addItemError(`Out of stock: ${name}: In stock: ${inStock}`);
        }
        return true;
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

    async createOrderItems () {
        if (Array.isArray(this._targets)) {
            for (const target of this._targets) {
                await this.createOrderItem(target);
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