const babel = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const replace = require('@rollup/plugin-replace')
const globals = require("rollup-plugin-node-globals");
const commonjs = require("@rollup/plugin-commonjs");
const progress = require("rollup-plugin-progress");
const { terser } = require("rollup-plugin-terser");
const path = require("path");
const alias = require("@rollup/plugin-alias");

const aliases = {
    // 'qortal-ui-crypto': 'node_modules/qortal-ui-crypto/api.js'
};

const generateRollupConfig = (inputFile, outputFile) => {
    return {
        inputOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'THIS_IS_UNDEFINED') return;
                if (warning.code !== 'CIRCULAR_DEPENDENCY') throw new Error(warning.message);
                warn(warning);
            },
            input: inputFile,
            plugins: [
                alias({
                    // entries: {}
                    entries: Object.keys(aliases).map((find) => {
                        return {
                            find,
                            replacement: aliases[find],
                        };
                    }),
                }),
                nodeResolve({
                    preferBuiltins: false,
                    mainFields: ['module', 'browser']
                }),
                replace({
                    preventAssignment: true,
                    "process.env.NODE_ENV": JSON.stringify("production"),
                }),
                commonjs(),
                globals(),
                progress(),
                babel.babel({
                    babelHelpers: 'bundled',
                    exclude: "node_modules/**",
                }),
                terser({
                    compress: true,
                    output: {
                        comments: false,
                    },
                })
            ],
        },
        outputOptions: {
            file: outputFile,
            format: "umd",
        },
    };
};

const generateForPlugins = () => {
    const configs = [
        {
            in: "plugins/core/main.src.js",
            out: "plugins/core/main.js",
        },
        {
            in: "plugins/core/trade-portal/trade-portal.src.js",
            out: "plugins/core/trade-portal/trade-portal.js",
        },
        {
            in: "plugins/core/send-coin/send-coin.src.js",
            out: "plugins/core/send-coin/send-coin.js",
        },
        {
            in: "plugins/core/wallet/wallet-app.src.js",
            out: "plugins/core/wallet/wallet-app.js",
        },
        {
            in: "plugins/core/reward-share/reward-share.src.js",
            out: "plugins/core/reward-share/reward-share.js",
        },
        {
            in: "plugins/core/node-management/node-management.src.js",
            out: "plugins/core/node-management/node-management.js",
        },
        {
            in: "plugins/core/group-management/group-management.src.js",
            out: "plugins/core/group-management/group-management.js",
        },
        // {
        //     in: 'plugins/core/group-management/group-transaction/group-transaction.src.js',
        //     out: 'plugins/core/group-management/group-transaction/group-transaction.js'
        // },
        {
            in: "plugins/core/name-registration/name-registration.src.js",
            out: "plugins/core/name-registration/name-registration.js",
        },
        {
            in: "plugins/core/qdn/websites.src.js",
            out: "plugins/core/qdn/websites.js",
        },
        {
            in: "plugins/core/qdn/publish/publish.src.js",
            out: "plugins/core/qdn/publish/publish.js",
        },
        {
            in: "plugins/core/qdn/browser/browser.src.js",
            out: "plugins/core/qdn/browser/browser.js",
        },
        {
            in: "plugins/core/qdn/data-management/data-management.src.js",
            out: "plugins/core/qdn/data-management/data-management.js",
        },
        {
            in: "plugins/core/messaging/messaging.src.js",
            out: "plugins/core/messaging/messaging.js",
        },
        {
            in: "plugins/core/messaging/chain-messaging/chain-messaging.src.js",
            out: "plugins/core/messaging/chain-messaging/chain-messaging.js",
        },
        {
            in: "plugins/core/messaging/q-chat/q-chat.src.js",
            out: "plugins/core/messaging/q-chat/q-chat.js",
        },
        {
            in: "plugins/core/minting/minting-info.src.js",
            out: "plugins/core/minting/minting-info.js",
        },
        {
            in: "plugins/core/puzzles/puzzles.src.js",
            out: "plugins/core/puzzles/puzzles.js",
        },
    ].map((file) => {
        return generateRollupConfig(
            path.join(__dirname, file.in),
            path.join(__dirname, file.out)
        );
    });

    return configs;
};
module.exports = generateForPlugins;
