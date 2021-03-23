/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.ItemList = class ItemList extends Shop.Loadable {

    init () {
        super.init();
        this.pagination = new Shop.Pagination(this);
        this.pagination.pageSize = 4;
        this.on('change:pagination', this.onChangePagination.bind(this));
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'item',
            view: 'publicList',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize(),
            filter: this.getFilter()
        };
    }

    getFilter () {
        if (!this.search) {
            return null;
        }
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
    }

    bindSearch (handler) {
        handler.on('search:change', this.onSearch.bind(this));
    }

    onSearch (event, {search}) {
        this.search = $.trim(search);
        this.pagination.page = 0;
        this.load();
    }

    onChangePagination (event, {page}) {
        this.load();
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t('No items found')});
    }

    renderItem (data) {
        data.photo = data.mainPhoto?._id;
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        Jam.t(this.$container);
    }
};

Shop.CategoryItemList = class SearchItemList extends Shop.ItemList {

    getFilter () {
        const result = [{
            attr: 'master',
            op: 'equal',
            value: null
        }];
        let items = this.getCategoryFilter();
        if (items) {
            result.push({items})
        }
        items = super.getFilter();
        if (items) {
            result.push({items})
        }
        return result;
    }

    getCategoryFilter () {
        return this.category.descendants.concat(this.category.id).map(value => ({
            or: true,
            attr: 'category',
            op: 'equal',
            value
        }));
    }
};

Shop.SearchItemList = class SearchItemList extends Shop.ItemList {
};