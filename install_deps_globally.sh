#!/usr/bin/env bash
# This script parses dependencies from a package.json and installs those deps
# in the global npm repo. The reason for doing this is so that I can actively
# develop using docker and windows.
#
# npm and the Windows filesystem seem to be fundamentally incompatible. I would
# prefer to use the filesystem of the docker VM to run my apps, but would prefer
# to also remain in the windows ecosystem without switching out my OS.
set -e

usage ()
{
	echo "Usage: install_deps_globally.sh <package.json>"
	exit 1
}

if [[ $# -ne 1 ]]; then
	usage
fi

FILE=$1
TEMP_FILE='/tmp/deps.list'

# Create a list of all the dependencies that need to be installed
cat $FILE | \
awk '/dependencies/ { show=1 } show; /\}/ { show=0 }' | \
tail -n +2 | \
head -n -1 \
> $TEMP_FILE

# Iterate through the dependencies
PACKAGES=""
while read line ; do
	line=${line//,}
	name=$( echo $line | cut -d\: -f1 | tr -d '[[:space:]]' | sed -e 's/^"//' -e 's/"$//' )
	semver=$( echo $line | cut -d\: -f2 | tr -d '[[:space:]]' | sed -e 's/^"//' -e 's/"$//' )

	echo "Including $name@$semver to the global packages"
	PACKAGES="$PACKAGES $name@$semver"
done < ${TEMP_FILE}

# Install the dependencies globally
npm install -g $PACKAGES

# Make sure that require can find these dependencies
export NODE_PATH="/usr/local/lib/node_modules"

exit $?

# If node changes the console colour, run echo -e '\e[0m'
