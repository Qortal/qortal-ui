const path = require('path')

const { makeSourceAbsolute } = require('../tooling/utils.js')
const srcDir = '../src'

const options = {
    inputFile: path.join(__dirname, '../src/main.js'),
    outputDir: path.join(__dirname, '../build'),
    sassOutputDir: path.join(__dirname, '../build/styles.bundle.css'),
    imgDir: path.join(__dirname, '../img')
}

const aliases = {
    'qortal-ui-crypto': 'node_modules/qortal-ui-crypto/api.js'
}

const apiComponents = {
    // All the do stuff imports...such as login(...) and logout()
    api: {
        file: 'api/api.js',
        className: 'api'
    }
}


const functionalComponents = {
    'loading-ripple': {
        file: 'functional-components/loading-ripple.js',
        className: 'LoadingRipple'
    },
    'confirm-transaction-dialog': {
        file: 'functional-components/confirm-transaction-dialog',
        className: 'ConfirmTransactionDialog'
    }
}

// Inlines all dependencies... transpiles to es5
const inlineComponents = [
    {
        className: 'worker',
        input: path.join(__dirname, srcDir, 'worker.js'),
        output: 'worker.js'
    },
    {
        className: 'PluginMainJSLoader',
        input: path.join(__dirname, srcDir, '/plugins/plugin-mainjs-loader.js'),
        output: 'plugins/plugin-mainjs-loader.js'
    }
]

const elementComponents = {
    'main-app': {
        file: 'components/main-app.js',
        className: 'MainApp',
        children: {
            'app-styles': {
                file: 'styles/app-styles.js',
                className: 'AppStyles',
                children: {
                    'app-theme': {
                        className: 'AppTheme',
                        file: 'styles/app-theme.js'
                    }
                }
            },
            'app-view': {
                file: 'components/app-view.js',
                className: 'AppView',
                children: {
                    'show-plugin': {
                        file: 'components/show-plugin.js',
                        className: 'ShowPlugin'
                    },
                    'sidenav-menu': {
                        file: 'components/sidenav-menu.js',
                        className: 'SidenavMenu'
                    },
                    'wallet-profile': {
                        file: 'components/wallet-profile.js',
                        className: 'WalletProfile'
                    },
                    'app-info': {
                        file: 'components/app-info.js',
                        className: 'AppInfo'
                    }
                }
            },
            'login-view': {
                file: 'components/login-view/login-view.js',
                className: 'LoginView',
                children: {
                    'create-account-section': {
                        file: 'components/login-view/create-account-section.js',
                        className: 'CreateAccountSection'
                    },
                    'login-section': {
                        file: 'components/login-view/login-section.js',
                        className: 'LoginSection'
                    }
                }
            },
            'settings-view': {
                file: 'components/settings-view/user-settings.js',
                className: 'UserSettings',
                children: {
                    'account-view': {
                        file: 'components/settings-view/account-view.js',
                        className: 'AccountView'
                    },
                    'security-view': {
                        file: 'components/settings-view/security-view.js',
                        className: 'SecurityView'
                    },
                    'notifications-view': {
                        file: 'components/settings-view/notifications-view.js',
                        className: 'NotificationsView'
                    }
                }
            }
        }
    }
}

makeSourceAbsolute(path.join(__dirname, srcDir), elementComponents)
makeSourceAbsolute(path.join(__dirname, srcDir), functionalComponents)

module.exports = {
    options,
    elementComponents,
    functionalComponents,
    inlineComponents,
    apiComponents,
    aliases
}
