# First specify that we need the slim node image
FROM node:slim

# Set Maintainer
MAINTAINER Siddhartha Banerjee, banerjs@banerjs.com

# Set the environment variables
EXPOSE 8000

# Copy the source code into the /usr/src section and make that the workdir
# COPY . /usr/src/
WORKDIR /usr/src/

# Run the commands needed to get node running
RUN npm install

# Future commands to keep in mind:
# npm install -g react-tools webpack grunt-cli

ENTRYPOINT ["npm", "run", "debug"]
