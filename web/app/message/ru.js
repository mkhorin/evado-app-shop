'use strict';

// evado/web/jam/utility/I18n.js

// extend default translation category
// use: <span data-t="">Some text</span>
// use: <div title="Some text"></div>
// use: <input placeholder="Some text" type="text" />

Object.assign(Jam.I18n.defaults, {

    'Test utility': 'Тестовая утилита'
});

// define custom translation category
// use: <span data-t="custom">Any text</span>
// use: <div data-t="custom" title="Any text"></div>
// use: <input data-t="custom" placeholder="Any text" type="text"/>
// use: <div data-t-title="customTitle" title="Any title" data-t="custom">Any text</div>

Jam.I18n.custom = {

    'Any text': 'Любой текст'
};

Jam.I18n.customTitle = {

    'Any title': 'Любой заголовок'
};

// METADATA

Jam.I18n.meta = {

    'Active': 'Активно',
    'Agreed': 'Согласован',
    'All items': 'Все товары',
    'All orders': 'Все заказы',

    'Brief': 'Краткое описание',

    'Cancelled': 'Отменен',
    'Categories': 'Категории',
    'Category': 'Категория',
    'Children': 'Дети',
    'Class': 'Класс',
    'Clipart': 'Клипарт',
    'Cliparts': 'Клипарты',
    'Coat': 'Пальто',
    'Coats': 'Пальто',
    'Created at': 'Создано',
    'Customer': 'Клиент',

    'Description': 'Описание',

    'Edit': 'Редактировать',

    'File': 'Файл',

    'Hairdryer': 'Фен',
    'Hairdryers': 'Фены',
    'Hierarchy': 'Иерархия',

    'Icon': 'Иконка',
    'Images': 'Изображения',
    'In stock': 'В запасе',
    'Item': 'Товар',
    'Items': 'Товары',

    'Kettle': 'Чайник',
    'Kettles': 'Чайники',

    'Main photo': 'Главное фото',
    'Master item': 'Базовый товар',
    'Motorcycle': 'Мотоцикл',
    'Motorcycles': 'Мотоциклы',

    'Name': 'Название',

    'Options': 'Опции',
    'Order': 'Заказ',
    'Order item': 'Заказанный товар',
    'Order number': 'Порядковый номер',
    'Orders': 'Заказы',

    'Paid': 'Оплачен',
    'Parent': 'Родитель',
    'Pending approval': 'Ожидающие подтверждения',
    'Photo': 'Фотография',
    'Photos': 'Фотографии',
    'Price': 'Цена',

    'Truck': 'Грузовик',
    'Trucks': 'Грузовики',

    'Quantity': 'Количество',

    'Shipped': 'Отправлен',
    'Shirt': 'Рубашка',
    'Shirts': 'Рубашки',
    'Size': 'Размер',
    'Slave items': 'Зависимые товары',

    'Total price': 'Общая цена',

    'Vehicle': 'Транспорт',
    'Vehicles': 'Транспорт'
};

Jam.I18n['meta.class.item.itemCoat'] = {

    'Cashmere': 'Кашемир',

    'Fabric': 'Материал',
    'Fleece': 'Флис',

    'Tweed': 'Твид',

    'Wool': 'Шерсть'
};

Jam.I18n['meta.class.item.itemKettle'] = {

    'Power': 'Мощность',

    'Volume': 'Объем'
};

Jam.I18n['meta.class.item.itemShirt'] = {

    'Blue': 'Синий',

    'Color': 'Цвет',

    'Green': 'Зеленый',

    'Orange': 'Оранжевый',

    'Red': 'Красный',

    'Yellow': 'Желтый'
};

Jam.I18n['meta.class.item.itemVehicle'] = {

    'Engine': 'Двигатель',
    'Engine displacement (cubic centimetres)': 'Объем двигателя (куб. сантиметры)',

    'Payload': 'Полезная нагрузка',

    'Top speed': 'Максимальная скорость'
};