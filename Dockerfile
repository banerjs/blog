# First specify that we start with the node image
FROM node:6

# Set Maintainer
MAINTAINER Siddhartha Banerjee, banerjs@banerjs.com

# Setup environment variables as needed. Override these in the command line
ENV PORT=8000 IP_ADDR="" \
	INSTALL_DIR="/usr/src/" INSTALL_USER="banerjs" \
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
	groupadd -r ${INSTALL_USER} && useradd -r -m -c "NAME" -g ${INSTALL_USER} ${INSTALL_USER} && \
	chown -R ${INSTALL_USER}:${INSTALL_USER} ${INSTALL_DIR}

WORKDIR ${INSTALL_DIR}
# Adding in a dummy so that Openshift hopefully updates itself
USER ${INSTALL_USER}

# Run the commands needed to get node running
RUN npm config set progress false && npm install --quiet --depth 0

# Set the environment to production
ENV NODE_ENV=production

# Expose the port
EXPOSE ${PORT}

ENTRYPOINT ["/tini", "--", "npm"]
CMD ["start"]
