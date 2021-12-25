// From original frag-ui build

import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import commonjs from '@rollup/plugin-commonjs'

import sass from 'rollup-plugin-sass'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

// import minifyHTML from 'rollup-plugin-minify-html-literals'
import { terser } from 'rollup-plugin-terser'

const sassOptions = {
    output: 'build/styles.bundle.css',
    processor: css => postcss([autoprefixer])
        .process(css)
        .then(result => result.css)
}

const babelOptions = {
    babelHelpers: 'bundled',
    // exclude: 'node_modules/**',
    exclude: ['node_modules/babel-runtime/**', /[\/\\]core-js/, 'node_modules/@babel/runtime-corejs3/**', 'node_modules/@webcomponentsjs/**'],
    // exclude: 'node_modules/core-js/**',
    ignore: [/[\/\\]core-js/, 'node_modules/@babel/runtime-corejs3/**', 'node_modules/@webcomponentsjs/**'],
    runtimeHelpers: true,
    presets: [
        [
            '@babel/preset-env',
            {
                // 'targets': 'Chrome 60, Firefox 66',
                // debug: true,
                // modules: 'false',
                // targets: {
                //     browsers: 'Edge 16, Firefox 60, Chrome 61, Safari 11, Android 67, ChromeAndroid 73, FirefoxAndroid 66'
                // },
                // useBuiltIns: 'usage',
                useBuiltIns: 'entry',
                corejs: '3'
            }
        ]
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
            '@babel/transform-runtime', {
                corejs: 3
            }
        ]
    ]
}

const plugins = [
    nodeResolve({
        module: true
    }),
    commonjs({}),
    globals(),
    builtins(),
    sass(sassOptions)
]

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        // minifyHTML(),
        terser()
    )
}

export default [
    {
        context: 'window',
        input: 'src/main.js',
        output: [
            {
                dir: 'build/es6',
                format: 'es'
            }
        ],
        plugins: plugins.concat([
            babel.babel(babelOptions)
        ])
    },
    {
        context: 'self',
        input: 'src/worker.js',
        output: [
            {
                dir: 'build/es6',
                format: 'iife'
            }
        ],
        plugins: plugins.concat([
            babel.babel(babelOptions)
        ])
    },
    {
        context: 'window',
        input: 'src/plugins/plugin-mainjs-loader.js',
        output: [
            {
                dir: 'build/es6',
                format: 'iife'
            }
        ],
        plugins: plugins.concat([
            babel.babel(babelOptions)
        ])
    },
    {
        context: 'window',
        input: 'src/main.js',
        output: [
            {
                dir: 'build/es5',
                format: 'system'
            }
        ],
        plugins: plugins.concat([babel({
            ...babelOptions//,
            // presets: [
            //     [
            //         '@babel/preset-env',
            //         {
            //             useBuiltIns: 'usage',
            //             targets: 'IE 10',
            //             corejs: '3'
            //         }
            //     ]
            // ]
        })])
    },
    {
        context: 'window',
        input: 'plugins/core/wallet/wallet-app.js',
        output: [
            {
                dir: 'plugins/core/wallet/build',
                format: 'iife'
            }
        ],
        plugins: plugins.concat([
            babel.babel(babelOptions)
        ])
    },
    {
        context: 'window',
        input: 'plugins/core/main.src.js',
        output: [
            {
                file: 'plugins/core/main.js',
                format: 'iife'
            }
        ],
        plugins: plugins.concat([
            babel.babel(babelOptions)
        ])
    },
    {
        context: 'window',
        input: 'plugins/core/send-coin/send-coin.src.js',
        output: [
            {
                file: 'plugins/core/send-coin/send-coin.js',
                format: 'iife'
            }
        ],
        plugins: plugins.concat([
            babel.babel(babelOptions)
        ])
    },
    {
        context: 'window',
        input: 'plugins/chat/chat-app.src.js',
        output: [
            {
                file: 'plugins/chat/chat-app.js',
                format: 'iife'
            }
        ],
        plugins: plugins.concat([
            babel.babel(babelOptions)
        ])
    }
]
