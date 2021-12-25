#!/bin/bash

# Make necessary config and add LOTW Softwares apt repo

# SCript to run UI without sandbox
echo \'/opt/${productFilename}/qortal-ui\' --no-sandbox > '/opt/${productFilename}/run-ui'
chmod +x '/opt/${productFilename}/run-ui'

# Link to run-ui
ln -sf '/opt/${productFilename}/run-ui' '/usr/bin/${executable}'

# SUID chrome-sandbox for Electron 5+
sudo chown root '/opt/${productFilename}/chrome-sandbox' || true
sudo chmod 4755 '/opt/${productFilename}/chrome-sandbox' || true

update-mime-database /usr/share/mime || true
update-desktop-database /usr/share/applications || true

# Install curl if not installed on the system
if ! which curl; then sudo apt-get --yes install curl; fi

# Install apt repository source list if it does not exist
if ! grep ^ /etc/apt/sources.list /etc/apt/sources.list.d/* | grep qortal.list; then
    curl -sS https://lotw.qortal.org/lotw_pub.gpg | sudo apt-key add -
    echo "deb [arch=amd64] https://lotw.qortal.org/debian stable main" \
	 | sudo tee /etc/apt/sources.list.d/qortal.list
fi
