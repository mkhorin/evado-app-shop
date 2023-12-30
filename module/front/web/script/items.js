'use strict';

Vue.component('items', {
    props: {
        pageSize: {
            type: Number,
            default: 4
        },
        category: String,
        categories: Array
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
        onItem (id) {
            this.$root.$emit('item', id);
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
                class: 'item',
                view: 'publicList',
                length: pageSize,
                start: page * pageSize,
                filter: this.getFilter()
            });
            this.$emit('load', {...data, pageSize, page});
        },
        getFilter () {
            const data = [{
                attr: 'master',
                op: 'equal',
                value: null
            }, {
                items: this.getCategoryFilter()
            }];
            if (this.search) {
                data.push({items: this.getSearchFilter()});
            }
            return data;
        },
        getCategoryFilter () {
            return [this.category, ...this.categories].map(id => ({
                or: true,
                attr: 'category',
                op: 'equal',
                value: id
            }));
        },
        getSearchFilter () {
            return [{
                attr: 'name',
                op: 'contains',
                value: this.search
            }, {
                or: true,
                attr: 'brief',
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
                name: item.name,
                brief: item.brief,
                inStock: item.inStock,
                photo: this.getThumbnailUrl('photo', item.mainPhoto?._id, 'sm'),
                price: item.price,
                description: item.description
            }));
        },
    },
    template: '#items'
});