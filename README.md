# Qortal Project UI

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/Qortal/qortal-ui?label=latest%20version)
[![GitHub Releases](https://img.shields.io/github/downloads/Qortal/qortal-ui/latest/total)](https://github.com/Qortal/qortal-ui/releases/latest)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue)](https://opensource.org/licenses/GPL-3.0)
[![Qortal Discord Invite](https://img.shields.io/discord/745037351163527189?color=%237289DA&label=Chat&logo=discord&logoColor=white)](https://discord.com/invite/54UyhB7)

Decentralizing The World

Building and Running Qortal UI Server from source:
----------------------------------------------------
Follow the steps below to download, install, build and run Qortal UI locally on Linux.


Installation
------------
Packages required:
 - Node.js
 - npm

Easiest way to install the lastest required packages on Linux is via nvm. 

``` sudo apt update && sudo apt install curl -y ``` <br/>
``` sudo rm -rf ~/.nvm ``` (Only for update node version)<br/>
``` curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash ``` <br/>
``` source ~/.profile ``` (For Debian based distro) <br/>
``` source ~/.bashrc ``` (For Fedora / CentOS) <br/>
``` nvm ls-remote ``` (Fetch list of available versions) <br/>
``` nvm install v18.17.1 ```  (LTS: Hydrogen supported by Electron V27) <br/>
``` npm --location=global install npm@10.5.0 ``` <br/>

Adding via binary package mirror will only work if you have set the package path. You can do a node or java build via ports instead by downloading ports with portsnap fetch method.

Verify your installation with ``` node --version ``` <br/>
 - If you have an older installation of npm, please do not forget to update that with ``` npm update -g ```

Clone the main UI repo
 - ``` git clone https://github.com/Qortal/qortal-ui.git ```

Installation
------------------------
In `qortal-ui` directory, run:
```
npm install
```

Build UI server and files
-------------------------
```
npm run build
```

Start UI Server ( preferred way )
---------------
```
npm run server &
```
The "&" at the end puts the UI server in the background.

Run UI using electron
---------------------
```
npm run start-electron
```

Build script (unix-like systems only)
-------------------------------------
To automate the above process, run ./build.sh, optionally specifying the following options:

`-s`: run UI server after completing the build<br />
`-e`: run electron server after completing the build<br />
`-w`: use 'npm run watch' instead of 'npm run build', to enable hot swapping<br />
`-h`: show help<br />

Example command to build and run the UI server:
```
./build.sh -s
```
