'use strict';

module.exports = {

    title: 'Shop',

    components: {
        'db': {
            settings: {
                'database': process.env.MONGO_NAME || 'evado-shop',
            }
        },
        'cookie': {
            secret: 'shop.evado'
        },
        'session': {
            secret: 'shop.evado'
        },
        'i18n': {
            // language: 'ru'
        },
        'router': {
            // defaultModule: 'front'
        },
        'fileStorage': {
            thumbnail: {
                sizes: {
                    'large': {
                        composite: [{
                            input: 'asset/watermark/fileLarge.png',
                            gravity: 'center'
                        }]
                    }
                }
            }
        }
    },
    metaModels: {
        'base': {
            Class: require('evado-meta-base/base/BaseMeta'),
            DataHistoryModel: {
                Class: require('evado-module-office/model/DataHistory')
            },
            UserModel: {
                Class: require('evado-module-office/model/User')
            }
        },
        'navigation': {
            Class: require('evado-meta-navigation/base/NavMeta')
        }
    },
    modules: {
        'api': {
            config: {
                modules: {
                    'document': {
                        Class: require('evado-api-base/Module')
                    },
                    'navigation': {
                        Class: require('evado-api-navigation/Module')
                    }
                }
            }
        },
        'studio': {
            Class: require('evado-module-studio/Module')
        },
        'office': {
            Class: require('evado-module-office/Module')
        },
        'account': {
            Class: require('evado-module-account/Module')
        },
        'admin': {
            Class: require('evado-module-admin/Module')
        },
        'front': {
            Class: require('../module/front/Module')
        }
    },
    users: require('./default-users'),
    security: require('./default-security'),
    tasks: require('./default-tasks'),
    utilities: require('./default-utilities'),
    params: {
        'enablePasswordReset': false,
        'enableSignUp': true,
        'enableSignUpVerification': false
    },
    widgets: {
        'commonMenu': {
        }
    }
};