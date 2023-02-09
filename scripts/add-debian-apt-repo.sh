#!/bin/bash

# Make necessary config and add Qortal Softwares apt repo

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
  curl -sS https://update.qortal.online/repo/qortal.gpg | sudo apt-key add -
  sudo rm -rf /usr/share/keyrings/qortal.gpg
  sudo apt-key export 7FB37C97 | sudo gpg --dearmour -o /usr/share/keyrings/qortal.gpg
  sudo rm -rf /etc/apt/sources.list.d/qortal.list
  echo 'deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/qortal.gpg] https://update.qortal.online/repo/ ./ ' >  /etc/apt/sources.list.d/qortal.list
fi
