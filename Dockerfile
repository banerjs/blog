# First specify that we start with the node image
FROM node:6

# Set Maintainer
MAINTAINER Siddhartha Banerjee, banerjs@banerjs.com

# Setup environment variables as needed. Override these in the command line
ENV PORT=8000 IP_ADDR="" \
	INSTALL_DIR="/usr/src/" \
	DATABASE_URL="" \
	APPLICATION_SECRET="Do N0T t3ll any0ne" \
	AUTH0_SECRET=""	AUTH0_ID="" AUTH0_NS="" \
	TINI_VERSION='v0.13.0'

# Set labels for OpenShift
LABEL "io.openshift.expose-services" ${PORT}:http \
	"io.openshift.tags"="node,nodejs,express" \
	"io.openshift.wants"="mongodb" \
	"io.k8s.description"="The NodeJS container running express for the blog"

# Copy the source directory and prepare to allow Openshift users access
COPY . ${INSTALL_DIR}
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini && \
	apt-get update -qq && \
	DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends\
		cmake && \
	curl -SL -o nss_wrapper.tar.gz https://ftp.samba.org/pub/cwrap/nss_wrapper-1.1.2.tar.gz && \
	mkdir nss_wrapper && \
	tar -xC nss_wrapper --strip-components=1 -f nss_wrapper.tar.gz && \
	rm nss_wrapper.tar.gz && \
	mkdir nss_wrapper/obj && \
		(cd nss_wrapper/obj && \
		cmake -DCMAKE_INSTALL_PREFIX=/usr/local -DLIB_SUFFIX=64 .. && \
		make && \
		make install) && \
	rm -rf nss_wrapper && \
	useradd -r -m -g 0 banerjs && \
	chgrp -R 0 ${INSTALL_DIR} && \
	chmod -R g+rw ${INSTALL_DIR} && \
	chmod +x ${INSTALL_DIR}scripts/entrypoint.sh
# For some reason this needs to be its own command
RUN find ${INSTALL_DIR} -type d -exec chmod g+x {} \;

WORKDIR ${INSTALL_DIR}
# Adding in a dummy so that Openshift hopefully updates itself
USER 998

# Run the commands needed to get node running
RUN npm config set progress false && npm install --quiet --depth 0

# Set the environment to production
ENV NODE_ENV=production

# Expose the port
EXPOSE ${PORT}

ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["start"]
