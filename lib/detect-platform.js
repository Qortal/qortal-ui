const os = require('os')

const isMac = os.platform() === "darwin"
const isWindows = os.platform() === "win32"
const isLinux = os.platform() === "linux"

module.exports = { isMac, isWindows, isLinux }