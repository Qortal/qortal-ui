# Qortal UI

[![License](https://img.shields.io/badge/license-GPL--3.0-blue)](https://opensource.org/licenses/GPL-3.0)

Decentralizing The World

Building and Running Qortal UI Server from source:
----------------------------------------------------
Follow the steps below to download, install, build and run Qortal UI locally on Linux.


Installation
------------
Packages required:
 - Node.js
 - npm
 - yarn

Easiest way to install the lastest required packages on Linux is via nvm. 

``` sudo apt update && sudo apt install curl -y ``` <br/>
``` curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash ``` <br/>
``` source ~/.profile ``` (For Debian based distro) <br/>
``` source ~/.bashrc ``` (For Fedora / CentOS) <br/>
``` nvm ls-remote ``` (Fetch list of available versions) <br/>
``` nvm install v14.17.0 ```  (Latest LTS: Fermium as of writing) <br/>
``` npm -g install yarn ``` <br/> 

On BSD do a ``` pkg_add node followed by npm install -g yarn ```

Adding via binary package mirror will only work if you have set the package path. You can do a node or java build via ports instead by downloading ports with portsnap fetch method.

Verify your installtion with node --version <br/>
- ``` If you have an older installation of npm, please do not forget to update that with npm update -g. ```

Clone the main UI repo
 - ``` git clone https://github.com/Qortal/UI.git ```

Installation and linking
------------------------
In `qortal-ui-core/`, `qortal-ui-plugins/`, `qortal-ui-crypto/`  directories, run: 
```
yarn install
yarn link
```

Finally, in the `qortal-ui` directory, run:
```
yarn link qortal-ui-core
yarn link qortal-ui-plugins
yarn link qortal-ui-crypto
```



Build UI server and files
-------------------------
In `qortal-ui` directory, run:
```
yarn run build
```

Start UI Server ( preferred way )
---------------
```
yarn run server &
```
The "&" at the end puts the UI server in the background.

Run UI using electron
---------------------
```
yarn run start-electron
```

Build script (unix-like systems only)
-------------------------------------
To automate the above process, run ./build.sh, optionally specifying the following options:

`-s`: run UI server after completing the build<br />
`-e`: run electron server after completing the build<br />
`-f`: force relink and reinstall dependencies<br />
`-h`: show help<br />

Example command to build and run the UI server:
```
./build.sh -s
```
