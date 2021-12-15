'use strict';

Vue.component('category', {
    props: {
        category: String,
        cart: Object
    },
    data () {
        return {
            id: null,
            name: null,
            logo: null,
            description: null,
            parent: null,
            children: [],
            descendants: []
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onCategory (id) {
            this.$root.$emit('category', id);
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'category',
                view: 'publicView',
                id: this.category
            });
            this.id = data._id;
            this.name = data.name;
            this.description = data.description;
            this.icon = this.getThumbnailUrl('clipart', data.icon);
            this.parent = data.parent;
            this.children = this.formatChildren(data.children);
            this.descendants = data.descendants;
        },
        formatChildren (items) {
            return items.map(item => ({
                id: item._id,
                icon: this.getThumbnailUrl('clipart', item.icon),
                name: item.name
            }));
        }
    },
    template: '#category'
});