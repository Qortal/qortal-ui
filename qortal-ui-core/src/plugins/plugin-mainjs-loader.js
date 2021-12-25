'use strict'
import { Epml, EpmlStream } from '../epml.js'

window.Epml = Epml
window.EpmlStream = EpmlStream

const pluginScript = document.createElement('script')
pluginScript.async = false
pluginScript.type = 'module'
const hash = window.location.hash
pluginScript.src = '/plugin/' + hash.slice(1)
document.body.appendChild(pluginScript)
