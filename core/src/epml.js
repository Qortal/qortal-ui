import {
	ContentWindow as EpmlContentWindowPlugin,
	Epml,
	EpmlProxyPlugin,
	EpmlReadyPlugin,
	EpmlStream,
	EpmlStreamPlugin,
	RequestPlugin
} from 'epml'

Epml.registerPlugin(RequestPlugin)
Epml.registerPlugin(EpmlReadyPlugin)
Epml.registerPlugin(EpmlContentWindowPlugin)
Epml.registerPlugin(EpmlStreamPlugin)
Epml.registerPlugin(EpmlProxyPlugin)
Epml.allowProxying = true

export { Epml, EpmlStream }