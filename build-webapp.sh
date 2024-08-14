#!/bin/sh

yarn
LACONIC_HOSTED_CONFIG_FILE=config-hosted.yml yarn build
rm -rf dist/es

mv dist/production "$1"
