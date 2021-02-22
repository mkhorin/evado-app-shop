/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.Category = class Category extends Shop.Loadable {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'category',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        this.descendants = data.descendants;
        data.subcategories = this.renderChildren(data.children);
        data.parent = this.renderParent(data);
        data.items = this.getTemplate('items');
        return this.resolveTemplate('category', data);
    }

    renderParent (data) {
        if (data.parent) {
            return this.resolveTemplate('parent', data);
        }
    }

    renderChildren (items) {
        if (Array.isArray(items) && items.length) {
            const subcategories = items.map(this.renderSubcategory, this).join('');
            return this.resolveTemplate('subcategories', {subcategories});
        }
    }

    renderSubcategory (data) {
        data.photo = data.photo?._id;
        return this.resolveTemplate('subcategory', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        super.onAfterDone();
        this.search = this.getHandler('Search');
        this.list = this.getHandler('CategoryItemList');
        this.list.bindSearch(this.search);
        this.list.category = this;
        this.list.load();
    }
};