FROM ubuntu:20.04

ENV TZ=Etc/UTC

# Base Setup
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
      wget curl sudo apt-transport-https ca-certificates gnupg lsb-release build-essential unzip && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    rm -rf /var/lib/apt/lists/*

# Setup for installing Node.js 12 (LTS)
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -

# Setup for installing .NET Core SDK
RUN wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    rm packages-microsoft-prod.deb

# Install supported languages and frameworks
RUN apt-get update && apt-get install -y \
    dotnet-sdk-6.0 \
    dotnet-sdk-3.1 \
    dotnet-runtime-3.1 \
    dotnet-sdk-5.0 \
    dotnet-runtime-5.0 \
    dotnet-runtime-6.0 \
    openjdk-11-jdk \
    nodejs \
    python3.6 \
    python3-pip \
    golang-go \
    libgtk-3-0 \
    libgbm1 && \
    rm -rf /var/lib/apt/lists/*

# Docker setup
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io && \
    rm -rf /var/lib/apt/lists/*

# Java setup
WORKDIR /tmp/java
COPY ./java/gradlew ./gradlew
COPY ./java/gradlew.bat ./gradlew.bat
COPY ./java/gradle ./gradle
RUN ./gradlew

COPY ./java/build.gradle ./build.gradle
RUN ./gradlew getDeps

# JS and JS SPA
COPY ./js /judge-resources/js
WORKDIR /judge-resources/js
RUN npm install

COPY ./js-run-spa-in-docker-and-execute-mocha-tests /judge-resources/js-run-spa-in-docker-and-execute-mocha-tests
WORKDIR /judge-resources/js-run-spa-in-docker-and-execute-mocha-tests
RUN npm install && \
    bash /judge-resources/js/chromium-scripts/update-and-run.sh

ENV JAVA_LIBS_DIR=/judge-resources/javaLibs/
ENV JS_NODE_MODULES_DIR=/judge-resources/js/node_modules

# Python 11 with Django support
RUN apt-get update && apt-get install -y --no-install-recommends \
    make \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    llvm \
    libncurses5-dev \
    xz-utils \
    tk-dev \
    libxml2-dev \
    libxmlsec1-dev \
    libffi-dev \
    liblzma-dev \
    mecab-ipadic-utf8 \
    git \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*
    
ENV PYENV_ROOT /root/.pyenv
ENV PATH $PYENV_ROOT/shims:$PYENV_ROOT/bin:$PATH
RUN curl https://pyenv.run | bash && \
    pyenv update && \
    pyenv install 3.11.5

# Install Python packages from requirements.txt
COPY ./python/requirements.txt /tmp/
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

# Go
ENV GO111MODULE=off

# Clean up
RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

CMD tail -f /dev/null
