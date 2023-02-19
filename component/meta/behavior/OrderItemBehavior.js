/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/behavior/Behavior');

module.exports = class OrderItemBehavior extends Base {

    afterValidate () {
        if (this.owner.isNew() && !this.owner.hasError()) {
            return this.validate();
        }
    }

    async validate () {
        const item = await this.resolveItem();
        if (!item || !item.get('active')) {
            return this.owner.addError('item', 'Active item required');
        }
        const quantity = this.getQuantity();
        const inStock = item.get('inStock');
        if (quantity < 1 || quantity > inStock) {
            return this.owner.addError('quantity', 'Out of stock');
        }
    }

    getQuantity () {
        return this.get('quantity');
    }

    resolveItem () {
        return this.owner.related.resolve('item');
    }

    async beforeInsert () {
        await this.setPrice();
        await this.updateStock(-this.getQuantity());
    }

    afterDelete () {
        return this.updateStock(this.getQuantity());
    }

    async setPrice () {
        const item = await this.resolveItem();
        const quantity = this.getQuantity();
        const price = item.get('price');
        const result = MathHelper.round(price * quantity, 2);
        this.owner.set('price', result);
    }

    async updateStock (delta) {
        const item = await this.resolveItem();
        if (item) {
            const inStock = item.get('inStock') + delta;
            const query = item.findSelf();
            return query.update({inStock});
        }
    }
};

const MathHelper = require('areto/helper/MathHelper');