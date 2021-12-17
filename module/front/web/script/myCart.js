'use strict';

Vue.component('my-cart', {
    props: {
        cart: Object
    },
    data () {
        return {
            items: []
        };
    },
    computed: {
        empty () {
            return !this.cart.count();
        },
        totalPrice () {
            let total = 0;
            for (let item of this.items) {
                total += item.cartItem.getTotalPrice();
            }
            return total;
        }
    },
    watch: {
        'cart.items': 'reload'
    },
    async created () {
        await this.load();
    },
    methods: {
        onItem (id) {
            this.$root.$emit('item', id);
        },
        onIncrease (item) {
            this.changeQty(item, 1);
        },
        onReduce (item) {
            this.changeQty(item, -1);
        },
        async onRemove (item) {
            await Jam.dialog.confirm('Remove this item from cart?');
            item.cartItem.remove();
        },
        onOrder () {
            if (this.requireAuth()) {
                this.createOrder();
            }
        },
        async createOrder () {
            try {
                const items = this.formatItemsForOrder();
                await this.fetchText('create', {
                    class: 'order',
                    view: 'createFromCart',
                    data: {items}
                });
                this.cart.clear();
                this.$root.$emit('orders');
            } catch (err) {
                this.showError(err);
            }
        },
        formatItemsForOrder () {
            return this.items.map(({id, qty}) => ({id, qty}));
        },
        changeQty (item, delta) {
            if (item.cartItem.changeQty(delta)) {
                item.qty = item.cartItem.qty;
                item.price = item.cartItem.getTotalPrice();
                item.cartItem.cart.save();
            }
        },
        async reload () {
            await this.load();
        },
        async load () {
            if (this.empty) {
                this.items = [];
                return;
            }
            const {items} = await this.fetchJson('list', {
                class: 'item',
                view: 'publicList',
                filter: this.getFilter()
            });
            this.cart.sync(items);
            this.items = this.prepareItems(items);
        },
        getFilter () {
            return this.cart.items.map(item => ({
                or: true,
                attr: '_id',
                op: 'equal',
                value: item.id
            }));
        },
        prepareItems (items) {
            return items.map((item, index) => this.prepareItem(item));
        },
        prepareItem (item) {
            return {
                id: item._id,
                name: item.name,
                photo: this.getThumbnailUrl('photo', item.mainPhoto?._id, 'xs'),
                price: item.price,
                qty: item.cartItem.qty,
                cartItem: item.cartItem
            };
        }
    },
    template: '#my-cart'
});