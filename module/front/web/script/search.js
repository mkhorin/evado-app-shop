'use strict';

Vue.component('search', {
    data () {
        return {
            text: ''
        };
    },
    watch: {
        text (value) {
            if (!value) {
                this.onSubmit();
            }
        }
    },
    methods: {
        onSubmit () {
            this.$emit('search', this.text);
        }
    },
    template: '#search'
});