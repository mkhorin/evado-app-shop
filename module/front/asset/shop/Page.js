/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Shop.Page = class Page extends Shop.Element {

    init () {
        this.name = this.getData('page');
        this.shop.on('show:page', this.onPage.bind(this));
    }

    onPage (event, data) {
        if (this.name === data.name) {
            this.activate(data);
        }
    }

    activate () {
        this.shop.togglePage(this.name);
    }

    showPage () {
        this.shop.showPage(this.name, ...arguments);
    }
};

Shop.MainPage = class MainPage extends Shop.Page {
};

Shop.SearchPage = class SearchPage extends Shop.Page {

    init () {
        super.init();
        this.search = this.getHandler('Search');
        this.list = this.getHandler('SearchItemList');
        this.list.bindSearch(this.search);
    }

    activate (data) {
        super.activate(data);
        this.search.setValue(data.search);
        this.search.triggerChange();
    }
};

Shop.CategoryPage = class CategoryPage extends Shop.Page {

    init () {
        super.init();
        this.category = this.getHandler('Category');
        this.shop.on('action:category', this.onCategory.bind(this));
    }

    onCategory (event, {category}) {
        this.showPage();
        this.category.setInstance(category);
    }
};

Shop.ItemPage = class ItemPage extends Shop.Page {

    init () {
        super.init();
        this.item = this.getHandler('Item');
        this.shop.on('action:item', this.onItem.bind(this));
    }

    activate (data) {
        super.activate(data);
        this.item.setInstance(data.item);
    }

    onItem (event, data) {
        this.showPage(data);
    }
};

Shop.CartPage = class CartPage extends Shop.Page {

    init () {
        super.init();
        this.cart = this.shop.cart;
        this.list = this.getHandler('CartItemList');
        this.shop.on('action:cart', this.onCart.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }

    onCart () {
        this.showPage();
    }
};

Shop.OrdersPage = class OrdersPage extends Shop.Page {

    init () {
        super.init();
        this.list = this.getHandler('OrderList');
        this.shop.on('action:orders', this.onOrders.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }

    onOrders () {
        this.showPage();
    }
};

Shop.OrderPage = class OrderPage extends Shop.Page {

    init () {
        super.init();
        this.order = this.getHandler('Order');
        this.shop.on('action:viewOrder', this.onOrder.bind(this));
    }

    activate (data) {
        super.activate();
        this.order.setInstance(data.order);
    }

    onOrder (event, data) {
        this.showPage(data);
    }
};