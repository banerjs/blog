# First specify that we start with the node image
FROM node:6

# Set Maintainer
MAINTAINER Siddhartha Banerjee, banerjs@banerjs.com

# Setup environment variables as needed. Override these in the command line
ENV PORT=8000 IP_ADDR=""
ENV DATABASE_URL="" \
	APPLICATION_SECRET="Do N0T t3ll any0ne" \
	AUTH0_SECRET=""	AUTH0_ID="" AUTH0_NS=""

# Set labels for OpenShift
LABEL "io.openshift.expose-services" ${PORT}:http
LABEL "io.openshift.tags"="node,nodejs,express" \
	"io.openshift.wants"="mongodb" \
	"io.k8s.description"="The NodeJS container running express for the blog"

# Set a non-root user and give them ownership of the files
COPY . /usr/src/
RUN groupadd -r banerjs && useradd -r -m -g banerjs banerjs && \
	chown -R banerjs:banerjs /usr/src
USER banerjs
WORKDIR /usr/src/

# Run the commands needed to get node running
RUN npm install

# Set the environment to production
ENV NODE_ENV=production

# Expose the port
EXPOSE ${PORT}

ENTRYPOINT ["npm"]
CMD ["start"]
