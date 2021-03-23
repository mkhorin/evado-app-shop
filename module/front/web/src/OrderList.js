/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.OrderList = class OrderList extends Shop.Loadable {

    init () {
        super.init();
        this.pagination = new Shop.Pagination(this);
        this.pagination.pageSize = 5;
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.on('click', '[data-action="detail"]', this.onDetail.bind(this));
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'order',
            view: 'listByCustomer',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize(),
            filter: this.getFilter()
        };
    }

    getFilter () {
    }

    onChangePagination (event, {page}) {
        this.load();
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        const template = items ? 'list' : 'empty';
        return this.resolveTemplate(template, {items});
    }

    renderItem (data) {
        data.date = Jam.FormatHelper.asDatetime(data._createdAt);
        data.agreed = Jam.FormatHelper.asBoolean(data.agreed);
        data.paid = Jam.FormatHelper.asBoolean(data.paid);
        data.shipped = Jam.FormatHelper.asBoolean(data.shipped);
        data.cancelled = Jam.FormatHelper.asBoolean(data.cancelled);
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

    onDetail (event) {
        event.preventDefault();
        const order = $(event.currentTarget).closest('.order-item').data('id');
        this.shop.trigger('action:viewOrder', {order});

    }
};