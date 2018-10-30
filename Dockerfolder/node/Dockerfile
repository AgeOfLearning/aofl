FROM ubuntu:16.04

RUN groupadd --gid 123 node && \
  useradd --uid 113 --gid node --create-home node


RUN \
  export DEBIAN_FRONTEND=noninteractive && \
  apt-get update -y && \
  # install group
  groupadd nobody && \
  usermod -g nobody nobody && \
  # install nvm dependencies
  apt-get install wget build-essential libssl-dev git-core -y && \
  # cleanup
  rm -rf /tmp/* && \
  apt-get clean

USER 113

ENV NVM_DIR /home/node/.nvm
ENV NODE_VERSION 8.12.0

RUN mkdir -p $NVM_DIR

RUN \
  wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash && \
  . $NVM_DIR/nvm.sh && \
  # install node
  nvm install $NODE_VERSION && \
  nvm use alias default $NODE_VERSION && \
  nvm use $NODE_VERSION


ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH