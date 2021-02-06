'use strict';

Shop.Item = class Item extends Shop.Loadable {

    init () {
        super.init();
        this.on('click', '[data-action="buy"]', this.onBuy.bind(this));
        this.on('change', '.option-control', this.onChangeOption.bind(this));
    }

    getUrl () {
        return super.getUrl('read');
    }

    getCartItem () {
        return this.shop.cart.getItem(this.data._id);
    }

    toggleActive (state) {
        this.$container.toggleClass('active', state);
    }

    toggleInCart (state) {
        this.$container.toggleClass('in-cart', state);
    }

    getPostData () {
        return {
            class: 'item',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        this.masterData = data;
        this.data = data;
        this.slaves = !data.slaves || !data.slaves.length ? null : data.slaves;
        data.category = this.renderCategory(data);
        return this.resolveTemplate('item', data);
    }

    renderCategory ({category}) {
        if (category) {
            return this.resolveTemplate('category', category);
        }
    }

    renderPhotos (photos) {
        photos = Array.isArray(photos) ? photos : [];
        const hideControls = photos.length < 2 ? 'hide-controls' : '';
        photos = photos.map(this.renderPhoto, this).join('');
        return photos ? this.resolveTemplate('photos', {photos, hideControls}) : '';
    }

    renderPhoto (data, index) {
        if (typeof data !== 'object') {
            data = {_id: data};
        }
        data.active = index ? '' : 'active';
        return this.resolveTemplate('photo', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        super.onAfterDone();
        this.resolveOptions();
        this.toggleActive(!this.slaves);
        this.setItemData();
    }

    resolveOptions ()  {
        this.shop.meta.getClass(this.masterData._class).done(this.renderOptions.bind(this));
    }

    renderOptions (data) {
        const attrs = data.attrs.filter(({group}) => group === 'options');
        const result = attrs.map(this.renderOption, this).join('');
        this.find('.options-container').html(result);
        Jam.t(this.$container);
    }

    renderOption (attr) {
        const name = attr.name;
        const label = attr.label || name;
        const value = this.masterData[name];
        if (!this.slaves) {
            return this.resolveTemplate('optionStatic', {label, value});
        }
        let values = this.slaves.map(data => data[name]).filter(value => value);
        values = Jam.ArrayHelper.unique(values);
        values = values.map(value => `<option value="${value}">${value}</option>`).join('');
        return this.resolveTemplate('optionSelect', {label, name, values});
    }

    onChangeOption () {
        const data = this.getSlaveData();
        this.data = data || this.masterData;
        this.toggleActive(!!data);
        this.setItemData();
    }

    getSlaveData () {
        const optionData = {};
        for (const option of this.find('.option-control')) {
            optionData[option.name] = option.value;
        }
        for (const slave of this.slaves) {
            if (this.isSlaveOptions(slave, optionData)) {
                return slave;
            }
        }
    }

    isSlaveOptions (slave, data) {
        for (const key of Object.keys(data)) {
            if (String(slave[key]) !== data[key]) {
                return false;
            }
        }
        return true;
    }

    setItemData () {
        this.find('[data-el="name"]').html(this.data.name);
        this.find('[data-el="brief"]').html(this.data.brief);
        this.find('[data-el="description"]').html(this.data.description);
        this.find('[data-el="price"]').html(this.data.price);
        this.find('[data-el="inStock"]').html(this.data.inStock);
        this.setItemPhotos();
        this.toggleInCart(!!this.getCartItem());
        this.clearErrors();
    }

    setItemPhotos () {
        let photos = this.data.photos;
        photos = photos?.length ? photos : this.masterData.photos;
        if (this._lastPhotos !== photos) {
            this.find('[data-el="photos"]').html(this.renderPhotos(photos));
            this._lastPhotos = photos;
        }
    }

    onBuy (event) {
        this.validate();
        if (!this.hasError()) {
            this.shop.cart.add(this.data._id, this.getQty());
            this.toggleInCart(true);
        }
    }

    getQty () {
        return Number(this.getFormControl('qty').val());
    }

    getFormControl (name) {
        return this.find(`[name="${name}"]`);
    }

    getFormGroup (name) {
        return this.getFormControl(name).closest('.form-group');
    }

    validate () {
        this.clearErrors();
        this.validateQuantity();
    }

    validateQuantity () {
        const qty = this.getQty();
        if (!Number.isInteger(qty) || qty < 1) {
            this.addError('qty', 'Invalid quantity');
        } else if (qty > this.data.inStock) {
            this.addError('qty', 'This value exceeds stock');
        }
    }

    clearErrors () {
        this.find('.has-error').removeClass('has-error');
    }

    hasError () {
        return this.find('.has-error').length > 0;
    }

    addError (name, message) {        
        this.getFormGroup(name).addClass('has-error').find('.error-block').html(Jam.t(message));
    }
};

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