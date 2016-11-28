#!/usr/bin/env sh

# Fetch the user id from docker run so that we can substitute it in
export USER_ID=$(id -u)

if [ x"$USER_ID" != x"0" ]; then
	NSS_WRAPPER_PASSWD=/tmp/passwd.nss_wrapper
	NSS_WRAPPER_GROUP=/etc/group

	cat /etc/passwd | sed -e 's/^banerjs:/builder:/' > $NSS_WRAPPER_PASSWD
	echo "banerjs:x:$USER_ID:0:Name,,,:/home/banerjs:/bin/bash" >> $NSS_WRAPPER_PASSWD

	export NSS_WRAPPER_PASSWD
	export NSS_WRAPPER_GROUP

	LD_PRELOAD="/usr/local/lib64/libnss_wrapper.so"
	export LD_PRELOAD
fi

exec /tini -- npm "$@"
