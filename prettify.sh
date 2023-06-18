#!/bin/sh

# run prettier for each javascript files

SCRIPT_DIR=$(dirname $0)

find ${SCRIPT_DIR} -name '*.mjs' | while read i; do (prettier ${i} --write &); done
