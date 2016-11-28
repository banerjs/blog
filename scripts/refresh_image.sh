#!/usr/bin/env bash
set -e

curl -SL -o oc.tar.gz https://github.com/openshift/origin/releases/download/v1.4.0-rc1/openshift-origin-client-tools-v1.4.0-rc1.b4e0954-linux-64bit.tar.gz
tar xzf oc.tar.gz
cd openshift-origin-client-tools*
oc login --token=${OPENSHIFT_API_TOKEN} --server=https://api.preview.openshift.com
oc import-image express
