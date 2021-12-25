#!/bin/sh

# Qortal Blockchain Project - 2021

# Travis Script to install dependencies...

set -ev

# install every repository needed, install dependencies, clone git repos, do yarn linking and building, and build and run final UI

install_dependencies()
{
  echo -e '---INSTALLING DEPENDENCIES!---'
  echo -e '---INSTALLING ALL UI REPOSITORIES---'

  cd ../
  cd qortal-ui-core
  yarn install --pure-lockfile
  cd ../
  mkdir qortal-ui/qortal-ui-core
  rsync -a qortal-ui-core/ qortal-ui/qortal-ui-core --exclude .git
  cd qortal-ui/qortal-ui-core
  yarn link
  cd ../../

  cd qortal-ui-plugins
  yarn install --pure-lockfile
  cd ../
  mkdir qortal-ui/qortal-ui-plugins
  rsync -a qortal-ui-plugins/ qortal-ui/qortal-ui-plugins --exclude .git
  cd qortal-ui/qortal-ui-plugins
  yarn link
  cd ../../

  cd qortal-ui-crypto
  yarn install --pure-lockfile
  cd ../
  mkdir qortal-ui/qortal-ui-crypto
  rsync -a qortal-ui-crypto/ qortal-ui/qortal-ui-crypto --exclude .git
  cd qortal-ui/qortal-ui-crypto
  yarn link
  cd ../
 
  echo -e '---INSTALL ALL DEPENDENCIES---'
  yarn install --pure-lockfile

  echo -e '---LINKING UI FOLDERS ---'
  yarn link qortal-ui-core
  yarn link qortal-ui-crypto
  yarn link qortal-ui-plugins

  echo -e '---BUILDING UI DEPENDENCIES!---'
  yarn build

  echo -e '---UPDATE PACKAGE-JSON UI DEPENDENCIES!---'
  yarn update-package-json

  echo -e '---REMOVE MODULES AND UNUSED DEPENDENCIES!---'
  cd qortal-ui-core
  yarn install --production --ignore-scripts --prefer-offline
  cd ../
  cd qortal-ui-plugins
  rm -R node_modules
  cd ../
  cd qortal-ui-crypto
  rm -R node_modules
  cd ../
  rm -R qortal-ui-crypto
}

install_dependencies
