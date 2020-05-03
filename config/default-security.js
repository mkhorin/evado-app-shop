'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        type: 'allow',
        roles: ['administrator'],
        actions: ['all'],
        targets: [{type: 'all'}]
    }, {
        type: 'allow',
        roles: ['guest', 'user'],
        actions: ['read'],
        targets: [{
            type: 'class',
            class: ['clipart', 'photo']
        }]
    }, {
        type: 'allow',
        roles: ['guest', 'user'],
        actions: ['read'],
        targets: [{
            type: 'view',
            class: 'category',
            view: ['publicList', 'publicView']
        }]
    }, {
        type: 'allow',
        roles: ['guest', 'user'],
        actions: ['read'],
        targets: [{
            type: 'view',
            class: 'item',
            view: ['publicList', 'publicView']
        }]
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['read'],
        targets: [{
            type: 'view',
            class: 'order',
            view: ['listByCustomer', 'viewByCustomer']
        }]
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['read'],
        targets: [{
            type: 'view',
            class: 'orderItem',
            view: 'viewByCustomer'
        }]
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['create'],
        targets: [{
            type: 'view',
            class: 'order',
            view: 'createFromCart'
        }]
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['delete'],
        targets: [{
            type: 'view',
            class: 'order',
            view: 'deleteByCustomer'
        }]
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Admin module',
            description: 'Access to Admin module'
        },
        'moduleOffice': {
            label: 'Office module',
            description: 'Access to Office module'
        },
        'moduleStudio': {
            label: 'Studio module',
            description: 'Access to Studio module'
        }
    },

    roles: {
        'administrator': {
            label: 'Administrator',
            description: 'Full access to all',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio',
                'upload'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        },
        'user': {
            label: 'User',
            description: 'Default role for new user'
        }
    },

    assignments: {
        'Adam': ['administrator']
    },

    rules: {
    }
};