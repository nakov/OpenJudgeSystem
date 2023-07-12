FROM ubuntu:18.04

RUN apt-get update -y \
	&& apt-get upgrade -y \
	&& apt install -y curl gnupg wget software-properties-common sudo

# Setup for .NET Core SDK installation
RUN wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb \
	&& dpkg --purge packages-microsoft-prod \
	&& dpkg -i packages-microsoft-prod.deb \
	&& add-apt-repository universe \
	&& apt-get install -y apt-transport-https

# Install .NET Core Runtime
RUN apt-get update -y && apt-get install -y \
	dotnet-runtime-6.0

#System.Drawing.Common *preview version does not work without this in container.
#Resulting in Exception: "Unable to load shared library 'libdl'.."
#Remove after EPPlus or other packages do not rely on it
RUN apt-get update -y && apt-get install -y \
	libgdiplus libc6-dev \
	&& rm -rf /var/lib/apt/lists/*
	
# Configure US locale with UTF8 encoding
RUN apt-get clean && apt-get update && apt-get install -y locales && \
    sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

