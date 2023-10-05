FROM ghcr.io/softuni-internal/linux_base:latest

ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Setup for installing Node.js 12 (LTS)
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash

# Install .NET Core SDK, JDK, NodeJs, PHP, Python
RUN apt-get update -y && apt-get install -y \
	dotnet-sdk-6.0 \
	openjdk-11-jdk \
	nodejs \
	php \
	php-cgi \
	python3.6 \
	python3-pip \
	build-essential \
	unzip \
	golang-go \
	build-essential

RUN apt-get update -y && apt-get install -y \
	dotnet-sdk-3.1 \
	dotnet-runtime-3.1 \
	dotnet-sdk-5.0 \
	dotnet-runtime-5.0 \
	dotnet-sdk-6.0 \
	dotnet-runtime-6.0

# Install docker

RUN apt-get update -y && apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

RUN echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update && apt-get install -y \
	docker-ce \
	docker-ce-cli \
	containerd.io

# Install PlayWright dependencies
RUN apt-get update && apt install -y \
	libgtk-3-0 \
	libgbm1

# Java

WORKDIR /tmp/java
COPY ./java/gradlew ./gradlew
COPY ./java/gradlew.bat ./gradlew.bat
COPY ./java/gradle ./gradle
RUN ./gradlew

COPY ./java/build.gradle ./build.gradle
RUN ./gradlew getDeps

# JS
COPY ./js /judge-resources/js
WORKDIR /judge-resources/js
RUN npm install

# JS SPA
COPY ./js-run-spa-in-docker-and-execute-mocha-tests /judge-resources/js-run-spa-in-docker-and-execute-mocha-tests
WORKDIR /judge-resources/js-run-spa-in-docker-and-execute-mocha-tests
RUN npm install

# JS SPA
WORKDIR /judge-resources/js/chromium-scripts
RUN bash ./update-and-run.sh

ENV JAVA_LIBS_DIR=/judge-resources/javaLibs/
ENV JS_NODE_MODULES_DIR=/judge-resources/js/node_modules

# Python
## TODO: move this into requirements.txt
RUN pip3 install docker

# Go
ENV GO111MODULE=off

CMD tail -f /dev/null

# Python 11 with Django support
# RUN apt update && apt install zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev pkg-config libpq-dev -y
RUN apt-get update && apt-get install -y --no-install-recommends make libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget llvm libncurses5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev mecab-ipadic-utf8 git libpq-dev
ENV PYENV_ROOT /root/.pyenv
ENV PATH $PYENV_ROOT/shims:$PYENV_ROOT/bin:$PATH

# Install pyenv
RUN set -ex \
    && curl https://pyenv.run | bash \
    && pyenv update \
    && pyenv install 3.11.5 \
    && pyenv rehash

RUN eval "$(pyenv init -)"
RUN eval "$(pyenv virtualenv-init -)"
