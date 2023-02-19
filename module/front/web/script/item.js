'use strict';

Vue.component('item', {
    props: {
        item: String,
        cart: Object
    },
    data () {
        return {
            id: null,
            name: null,
            brief: null,
            description: null,
            inStock: 0,
            price: 0,
            category: null,
            categoryTitle: null,
            options: [],
            optionValues: {},
            photos: [],
            activeVariant: null,
            quantity: 1
        };
    },
    computed: {
        inCart () {
            return this.cart.getItem(this.activeVariant?.id);
        }
    },
    watch: {
        optionValues: {
            handler: 'onChangeOptionValues',
            deep: true
        }
    },
    async created () {
        await this.load();
    },
    methods: {
        onBuy () {
            const result = this.validate();
            if (result !== true) {
                return this.showError(result);
            }
            this.cart.add(this.activeVariant.id, this.quantity);
        },
        validate () {
            if (!Number.isInteger(this.quantity) || this.quantity < 1) {
                return 'Invalid quantity';
            }
            if (this.quantity > this.inStock) {
                return 'Quantity exceeds stock';
            }
            return true;
        },
        onCart () {
            this.$root.$emit('my-cart');
        },
        onCategory (id) {
            this.$root.$emit('category', id);
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'item',
                view: 'publicView',
                id: this.item
            });
            const meta = await this.fetchMeta('class', {
                class: data._class
            });
            this.formatData(data, meta);
        },
        formatData (data, meta) {
            this.id = data._id;
            this.category = data.category?._id;
            this.categoryTitle = data.category?._title;
            this.variants = this.formatVariants(data);
            this.options = this.formatOptions(data, meta);
            this.quantity = 1;
        },
        formatVariants (data) {
            data.variants.splice(0, 0, data);
            data.variants.forEach(item => item.id = item._id);
            return data.variants;
        },
        formatPhotos (items) {
            return items.map(item => ({
                id: item._id,
                url: this.getThumbnailUrl(item._class, item._id, 'lg'),
                description: item.description
            }));
        },
        formatOptions (data, meta) {
            const attrs = meta.attrs.filter(({group}) => group === 'options');
            return attrs.map(attr => ({
                name: attr.name,
                label: attr.label || attr.name,
                values: this.formatOptionValues(attr, data)
            }));
        },
        formatOptionValues ({name}, data) {
            let values = this.variants
                .map(data => this.getDataValue(name, data))
                .filter(v => v);
            values = Jam.ArrayHelper.unique(values);
            const value = values.length === 1 ? values[0] : null;
            this.$set(this.optionValues, name, value);
            return values;
        },
        getDataValue (name, data) {
            return Object.hasOwnProperty.call(data, name) ? data[name] : null;
        },
        onChangeOptionValues () {
            this.activeVariant = this.getVariantByOptions();
            this.setVariantData(this.activeVariant || this.variants[0]);
        },
        getVariantByOptions () {
            for (const item of this.variants) {
                if (item.inStock && this.isOptionVariant(item)) {
                    return item;
                }
            }
        },
        isOptionVariant (item) {
            for (const name of Object.keys(this.optionValues)) {
                const value = this.optionValues[name];
                if (!value || item[name] !== value) {
                    return false;
                }
            }
            return true;
        },
        setVariantData (data) {
            this.name = data.name;
            this.brief = data.brief;
            this.description = data.description;
            this.inStock = data.inStock;
            this.price = data.price;
            this.photos = this.formatPhotos(data.photos);
        }
    },
    template: '#item'
});