import { Epml, EpmlReadyPlugin, RequestPlugin, ContentWindow as EpmlContentWindowPlugin, EpmlStreamPlugin, EpmlProxyPlugin, EpmlStream } from 'epml'

// Epml.registerPlugin(contentWindowsPlugin)
Epml.registerPlugin(RequestPlugin)
Epml.registerPlugin(EpmlReadyPlugin)
Epml.registerPlugin(EpmlContentWindowPlugin)
Epml.registerPlugin(EpmlStreamPlugin)
Epml.registerPlugin(EpmlProxyPlugin)
Epml.allowProxying = true

export { Epml, EpmlStream }
