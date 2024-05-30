const path = require('path')

const makeSourceAbsolute = (dir, tree) => {
	for (const component of Object.values(tree)) {
		component.source = path.join(dir, component.file)
		if (component.children) {
			makeSourceAbsolute(dir, component.children)
		}
	}

	return tree
}

module.exports = {
	makeSourceAbsolute
}