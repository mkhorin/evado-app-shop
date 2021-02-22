/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.CartToggle = class CartToggle extends Shop.Element {

    init () {
        this.shop.on('change:cart', this.onChange.bind(this));
        this.onChange();
    }

    onChange () {
        const counter = this.shop.cart.items.length;
        this.$container.toggleClass('has-item', counter > 0);
        this.find('.num').html(counter);
    }
};