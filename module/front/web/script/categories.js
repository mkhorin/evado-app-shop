'use strict';

Vue.component('categories', {
    props: {
        pageSize: {
            type: Number,
            default: 3
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
        onCategory (id) {
            this.$root.$emit('category', id);
        },
        onSearch (text) {
            this.search = text;
            this.reload();
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const {pageSize} = this;
            const data = await this.fetchJson('list', {
                class: 'category',
                view: 'publicList',
                length: pageSize,
                start: page * pageSize,
                filter: this.getFilter()
            });
            this.$emit('load', {...data, pageSize, page});
        },
        getFilter () {
            if (!this.search) {
                return null;
            }
            return [{
                attr: 'name',
                op: 'contains',
                value: this.search
            }];
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                name: Jam.t(item.name),
                icon: this.getThumbnailUrl('clipart', item.icon),
                description: item.description
            }));
        },
    },
    template: '#categories'
});