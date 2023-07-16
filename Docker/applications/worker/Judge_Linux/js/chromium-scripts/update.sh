#! /bin/bash

cd $(dirname $0)

FULL_PATH_TO_SCRIPT="$(realpath "$0")"
echo $FULL_PATH_TO_SCRIPT

JS_RESOURCES_ROOT_DIR="${FULL_PATH_TO_SCRIPT%/chromium-scripts/*}"

CHROMIUM_SCRIPTS_DIR=$JS_RESOURCES_ROOT_DIR/node_modules/playwright/chromium-854489
echo $CHROMIUM_SCRIPTS_DIR

LASTCHANGE_URL="https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2FLAST_CHANGE?alt=media"

REVISION=$(curl -s -S $LASTCHANGE_URL)

echo "latest revision is $REVISION"

if [ -d $REVISION ] ; then
  echo "already have latest version"
  exit
fi

ZIP_URL="https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F$REVISION%2Fchrome-linux.zip?alt=media"

ZIP_FILE="${REVISION}-chrome-linux.zip"

echo "fetching $ZIP_URL"

rm -rf $REVISION
rm -rf $CHROMIUM_SCRIPTS_DIR
mkdir $CHROMIUM_SCRIPTS_DIR
pushd $CHROMIUM_SCRIPTS_DIR
curl -# $ZIP_URL > $ZIP_FILE
echo "unzipping.."
unzip $ZIP_FILE
popd
rm -f ./latest
ln -s $CHROMIUM_SCRIPTS_DIR/chrome-linux/ ./latest

