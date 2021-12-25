const rollup = require('rollup')

async function writeBundle(bundle, outputOptions) {

    await bundle.generate(outputOptions)

    await bundle.write(outputOptions)
}

async function buildInline(conf) {

    const bundle = await rollup.rollup(conf.inputOptions).catch(err => {
        throw err
    })

    await writeBundle(bundle, conf.outputOptions)
    console.log('BUILD CORE ==> Bundling Done 🎉');
}

async function build(options, outputs, outputOptions, inputOptions, inlineConfigs) {

    const bundle = await rollup.rollup(inputOptions).catch(err => {
        throw err
    })

    for (const option of outputs) {
        await writeBundle(bundle, {
            ...outputOptions,
            ...option
        })
    }

    for (const conf of inlineConfigs) {
        await buildInline(conf)
    }
}

module.exports = build
