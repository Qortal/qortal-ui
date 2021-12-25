#!/bin/sh

# Qortal Blockchain Project - 2021

# Script to install and setup snapstore

set -ev

setup_snap()
{

#   echo -e '---INSTALLING SNAPD---'

#   sudo apt update
#   sudo apt install snapd

  echo -e '---INSTALLING SNAPCRAFT!---'

  sudo snap install snapcraft --classic

  echo -e 'LOGIN TO SNAP'
  echo $SNAP_TOKEN | snapcraft login --with -
  


}

setup_snap
