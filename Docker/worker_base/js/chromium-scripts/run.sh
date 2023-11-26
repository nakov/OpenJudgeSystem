#! /bin/bash

BASEDIR=/judge-resources/js/node_modules/playwright/chromium-854489

$BASEDIR/latest/chrome --user-data-dir="$BASEDIR/user-data-dir" $* &> /dev/null &
