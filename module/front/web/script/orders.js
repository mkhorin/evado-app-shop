'use strict';

Vue.component('orders', {
    props: {
        pageSize: {
            type: Number,
            default: 5
        },
        cart: Object
    },
    data () {
        return {
            items: []
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        onDetails (id) {
            this.$root.$emit('order', id);
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const {pageSize} = this;
            const data = await this.fetchJson('list', {
                class: 'order',
                view: 'listByCustomer',
                length: pageSize,
                start: page * pageSize
            });
            this.$emit('load', {...data, pageSize, page});
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                agreed: item.agreed,
                paid: item.paid,
                shipped: item.shipped,
                cancelled: item.cancelled,
                date: item._createdAt
            }));
        },
    },
    template: '#orders'
});