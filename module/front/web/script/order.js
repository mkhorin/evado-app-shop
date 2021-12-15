'use strict';

Vue.component('order', {
    props: {
        order: String,
        cart: Object
    },
    data () {
        return {
            id: null,
            date: null,
            agreed: true,
            cancelled: false,
            paid: false,
            shipped: false,
            items: [],
            total: null
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onItem (id) {
            this.$root.$emit('item', id);
        },
        async onDelete () {
            await Jam.dialog.confirmDeletion('Delete this order permanently?');
            await this.deleteOrder();
        },
        async deleteOrder () {
            try {
                await this.fetchText('delete', {
                    class: 'order',
                    view: 'deleteByCustomer',
                    id: this.order
                });
                this.toOrders();
            } catch (err) {
                this.showError(err);
            }
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'order',
                view: 'viewByCustomer',
                id: this.order
            });
            this.id = data._id;
            this.agreed = data.agreed;
            this.cancelled = data.cancelled;
            this.paid = data.paid;
            this.shipped = data.shipped;
            this.date = data._createdAt;
            this.items = this.formatItems(data.items);
            this.total = this.getTotalPrice();
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                itemId: item.item?._id,
                name: item.item?.name,
                photo: this.getThumbnailUrl('photo', item.item?.mainPhoto, 'xs'),
                price: item.price,
                qty: item.quantity
            }));
        },
        getTotalPrice () {
            return this.items.reduce((total, item) => item.price + total, 0);
        }
    },
    template: '#order'
});