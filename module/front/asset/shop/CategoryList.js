/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.CategoryList = class CategoryList extends Shop.Loadable {

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'category',
            view: 'publicList',
            start: 0,
            length: 0
        };
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t('No categories')});
    }

    renderItem (data) {
        return this.resolveTemplate('category', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        Jam.t(this.$container);
        $(window).scrollTop(0);
    }
};

Shop.MainCategoryList = class MainCategoryList extends Shop.CategoryList {

    init () {
        super.init();
        this.load();
    }
};