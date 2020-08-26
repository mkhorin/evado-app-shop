'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {type: 'all'}
    }, {
        roles: ['guest', 'user'],
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: ['clipart', 'photo']
        }
    }, {
        roles: ['guest', 'user'],
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'view',
            class: 'category',
            view: ['publicList', 'publicView']
        }
    }, {
        roles: ['guest', 'user'],
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'view',
            class: 'item',
            view: ['publicList', 'publicView']
        }
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'view',
            class: 'order',
            view: ['listByCustomer', 'viewByCustomer']
        }
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'view',
            class: 'orderItem',
            view: 'viewByCustomer'
        }
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'create',
        targets: {
            type: 'view',
            class: 'order',
            view: 'createFromCart'
        }
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'delete',
        targets: {
            type: 'view',
            class: 'order',
            view: 'deleteByCustomer'
        }
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
        },
        'moduleApiBaseUpload': {
            label: 'Upload files',
            description: 'Uploading files via basic metadata API module'
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
                'moduleApiBaseUpload'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        },
        'user': {
            label: 'User',
            description: 'Default role for authenticated users'
        }
    },

    rules: {
    },

    assignments: {
        'Adam': 'administrator'
    }
};