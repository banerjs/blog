# First specify that we start with the node image
FROM node

# Set Maintainer
MAINTAINER Siddhartha Banerjee, banerjs@banerjs.com

# Set the environment variables
EXPOSE 8000

# Copy the source code into the /usr/src section and make that the workdir
COPY . /usr/src/
WORKDIR /usr/src/

# Run the commands needed to get node running
RUN npm install && npm run deploy

# Setup environment variables as needed
ENV NODE_ENV=production

ENTRYPOINT ["npm", ""]
