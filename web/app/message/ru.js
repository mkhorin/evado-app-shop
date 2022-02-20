'use strict';
/**
 * Extend default translations
 *
 * Use: Jam.t('Some text')
 * Use: <span data-t="">Some text</span>
 * Use: <div title="Some text" data-t=""></div>
 * Use: <input placeholder="Some text" type="text" data-t="">
 */
Object.assign(Jam.I18n.defaults, {

    'Test utility': 'Тестовая утилита'
});

/**
 * Define custom translation category
 *
 * Use: Jam.t('Some text', 'custom')
 * Use: <span data-t="custom">Some text</span>
 * Use: <div title="Some text" data-t="custom"></div>
 * Use: <input placeholder="Some text" type="text" data-t="custom">
 * Use: <div title="Some text" data-t-title="custom" data-t="">Text</div>
 */
Jam.I18n.custom = {

    'Some text': 'Некоторый текст'
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

    'Total price': 'Общая цена',

    'Variant items': 'Варианты товаров',
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