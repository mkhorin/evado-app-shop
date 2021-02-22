/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.CartItemList = class CartItemList extends Shop.Loadable {

    init () {
        super.init();
        this.cart = this.shop.cart;
        this.on('click', '[data-command="increase"]', this.onIncrease.bind(this));
        this.on('click', '[data-command="reduce"]', this.onReduce.bind(this));
        this.on('click', '[data-command="remove"]', this.onRemove.bind(this));
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'item',
            view: 'publicList',
            start: 0,
            length: 0,
            filter: this.getFilter()
        };
    }

    getFilter () {
        if (!this.cart.items.length) {
            return [{
                attr: '_id',
                op: 'equal',
                value: false
            }];
        }
        return this.cart.items.map(item => ({
            or: true,
            attr: '_id',
            op: 'equal',
            value: item.id
        }));
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        this.cart.sync(items);
        items = items.map(this.renderItem, this).join('');
        return this.resolveTemplate('list', {items});
    }

    renderItem (data) {
        data.photo = data.mainPhoto?._id;
        const item = this.cart.getItem(data._id);
        data.qty = item.qty;
        data.price = item.getTotalPrice();
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    resolveContent () {
        if (this.cart.items.length) {
            this.find('.cart-total .num').html(this.cart.getTotalPrice());
        } else {
            this.$content.html(this.resolveTemplate('empty'));
        }
        Jam.t(this.$container);
    }

    changeQty (delta, element) {
        const $item = $(element).closest('.cart-item');
        const item = this.cart.getItem($item.data('id'));
        item.changeQty(delta);
        this.cart.save();
        $item.find('.qty').html(item.qty);
        $item.find('.price').html(item.getTotalPrice());
        this.resolveContent();
    }

    onDone (data) {
        super.onDone(data);
        this.resolveContent();
    }

    onIncrease (event) {
        this.changeQty(1, event.currentTarget);
    }

    onReduce (event) {
        this.changeQty(-1, event.currentTarget);
    }

    onRemove (event) {
        const $item = $(event.currentTarget).closest('.cart-item');
        this.cart.remove($item.data('id'));
        $item.remove();
        this.resolveContent();
    }

    setOrderDone () {
        Jam.t(this.$content.html(this.resolveTemplate('ordered')));
    }

    setOrderError (text) {
        Jam.t(this.$content.append(this.resolveTemplate('error', {text})));
    }
};