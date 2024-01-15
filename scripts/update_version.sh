#/bin/bash


NAME=`cat package.json | jq '.name'`
VERSION=`cat package.json | jq '.version'`
DATE=`date --rfc-3339=seconds`

echo '{"build": {}}' | jq ".build.name = $NAME" | jq ".build.version = $VERSION" | jq ".build.buildDate = \"$DATE\""
