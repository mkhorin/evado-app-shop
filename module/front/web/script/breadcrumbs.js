'use strict';

Vue.component('breadcrumbs', {
    props: {
        cart: Object
    },
    data () {
        return {

        };
    },
    methods: {
        onMyCart () {
            this.$root.$emit('my-cart');
        }
    },
    template: '#breadcrumbs'
});