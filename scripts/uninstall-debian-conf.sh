#!/bin/bash

# Remove all conf made by the the software

# Remove apt repository source list when user uninstalls app
if grep ^ /etc/apt/sources.list /etc/apt/sources.list.d/* | grep qortal.list; then
	sudo apt-key del 5025E50F;
	sudo rm /etc/apt/sources.list.d/qortal.list;
fi

# Get the root user
if [ $SUDO_USER ];
	then getSudoUser=$SUDO_USER;
	else getSudoUser=`whoami`;
fi

getDesktopEntry=/home/$getSudoUser/.config/autostart/qortal.desktop;

# Remove desktop entry if exists
if [ -f $getDesktopEntry ]; then
    sudo rm $getDesktopEntry;
fi

# App directory which contains all the config, setting files
appDirectory=/home/$getSudoUser/.config/qortal-ui/;

if [ -d $appDirectory ]; then
    sudo rm -rf $appDirectory;
fi

# Delete the link to the binary
rm -f '/usr/bin/${executable}'

# Delete run-ui
rm -f '/opt/${productFilename}/run-ui'
