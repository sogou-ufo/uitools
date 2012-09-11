#!/usr/bin/env bash

_php=$(which php)
_ui=$(pwd)/bin/ui.php

if [ -x  $_php ]
then
	if [ -w /etc/bashrc ]
	then
		echo alias ui=\'php $_ui\' >> /etc/bashrc 
		echo "install finished"
	else
		echo "error: root must"
	fi
else
	echo "error: php not found" 
fi
