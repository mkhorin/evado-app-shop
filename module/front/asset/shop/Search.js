/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.Search = class Search extends Shop.Element {

    init () {
        this.$search = this.find('[type="search"]');
        this.on('submit', this.onSubmit.bind(this));
        this.on('search:clear', this.onClear.bind(this));
    }

    setValue (value) {
        this.$search.val(value);
    }

    onClear () {
        this.$search.val('');
        this.triggerChange();
    }

    onSubmit (event) {
        event.preventDefault();
        this.triggerChange();
    }

    triggerChange () {
        this.$container.trigger('search:change', {search: this.$search.val()});
    }
};

Shop.MainSearch = class MainSearch extends Shop.Element {

    init () {
        this.$search = this.find('[type="search"]');
        this.on('submit', this.onSubmit.bind(this));
    }

    onSubmit (event) {
        event.preventDefault();
        this.shop.showPage('search', {
            search: this.$search.val()
        });
    }
};