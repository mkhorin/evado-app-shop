/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = {

    build: [{
        Class: 'FileMerger',
        sources: [
            'shop/Shop.js',
            'shop/Element.js',
            'shop/Loadable.js',
            'shop'
        ],
        target: 'dist/shop.min.js'
    }],

    deploy: {
        'vendor': 'dist/shop.min.js'
    }
};