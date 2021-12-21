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
        const quantity = this.get('quantity');
        const inStock = item.get('inStock');
        if (quantity < 1 || quantity > inStock) {
            return this.owner.addError('quantity', 'Out of stock');
        }
    }

    resolveItem () {
        return this.owner.related.resolve('item');
    }

    async beforeInsert () {
        await this.setPrice();
        await this.updateStock(1);
    }

    afterDelete () {
        return this.updateStock(-1);
    }

    async setPrice () {
        const item = await this.resolveItem();
        const price = MathHelper.round(item.get('price') * this.get('quantity'), 2);
        this.owner.set('price', price);
    }

    async updateStock (sign) {
        const quantity = this.get('quantity');
        const item = await this.resolveItem();
        if (item) {
            const inStock = item.get('inStock') - sign * quantity;
            return item.findSelf().update({inStock});
        }
    }
};

const MathHelper = require('areto/helper/MathHelper');