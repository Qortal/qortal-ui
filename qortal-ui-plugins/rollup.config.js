import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import commonjs from '@rollup/plugin-commonjs'

import sass from 'rollup-plugin-sass'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import { terser } from 'rollup-plugin-terser'

const sassOptions = {
    output: 'build/styles.bundle.css',
    processor: css => postcss([autoprefixer])
        .process(css)
        .then(result => result.css)
}

const babelOptions = {
    babelHelpers: 'bundled',
    exclude: ['node_modules/babel-runtime/**', /[\/\\]core-js/, 'node_modules/@babel/runtime-corejs3/**', 'node_modules/@webcomponentsjs/**'],
    ignore: [/[\/\\]core-js/, 'node_modules/@babel/runtime-corejs3/**', 'node_modules/@webcomponentsjs/**'],
    runtimeHelpers: true,
    presets: [
        [
            '@babel/preset-env',
            {
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
