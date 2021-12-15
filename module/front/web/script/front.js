'use strict';

const front = new Vue({
    el: '#front',
    props: {
        csrf: String,
        authUrl: String,
        dataUrl: String,
        fileUrl: String,
        metaUrl: String,
        thumbnailUrl: String,
        userId: String
    },
    propsData: {
        ...document.querySelector('#front').dataset
    },
    data () {
        this.cart = new Cart;
        return {
            activePage: 'categories',
            activeCategory: null,
            activeItem: null,
            activeOrder: null,
            cart: this.cart
        };
    },
    computed: {
        activePageProps () {
            return {
                ...this.defaultPageProps,
                ...this.pagePros
            };
        },
        defaultPageProps () {
            return {
                cart: this.cart
            };
        },
        pagePros () {
            switch (this.activePage) {
                case 'category':
                    return {
                        key: this.activeCategory,
                        category: this.activeCategory
                    };
                case 'item':
                    return {
                        key: this.activeItem,
                        item: this.activeItem
                    };
                case 'order':
                    return {
                        key: this.activeOrder,
                        order: this.activeOrder
                    };
            }
        }
    },
    created () {
        this.$on('my-cart', this.onMyCart);
        this.$on('categories', this.onCategories);
        this.$on('category', this.onCategory);
        this.$on('item', this.onItem);
        this.$on('order', this.onOrder);
        this.$on('orders', this.onOrders);
    },
    methods: {
        onMyCart () {
            this.activePage = 'my-cart';
        },
        onCategories () {
            this.activePage = 'categories';
        },
        onCategory (id) {
            this.activePage = 'category';
            this.activeCategory = id;
        },
        onItem (id) {
            this.activePage = 'item';
            this.activeItem = id;
        },
        onOrder (id) {
            if (this.requireAuth()) {
                this.activePage = 'order';
                this.activeOrder = id;
            }
        },
        onOrders () {
            if (this.requireAuth()) {
                this.activePage = 'orders';
            }
        }
    }
});