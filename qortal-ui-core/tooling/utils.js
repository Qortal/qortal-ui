const path = require('path')

// So that the directory rollup is running in doesn't matter as the paths aren't relative
const makeSourceAbsolute = (dir, tree) => {
    for (const component of Object.values(tree)) {
        // console.log(component)
        component.source = path.join(dir, component.file)
        if (component.children) {
            makeSourceAbsolute(dir, component.children)
            // for (const child of Object.values(component.children)) {
            //     console.log(child)
            //     addPathToSource(child)
            // }
        }
    }
    return tree
}

module.exports = {
    makeSourceAbsolute
}
