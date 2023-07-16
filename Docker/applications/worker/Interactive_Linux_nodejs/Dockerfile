FROM node:12-buster

# RUN apt update

WORKDIR /tools
# RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.stretch_amd64.de
# RUN dpkg -i wkhtmltox_0.12.5-1.stretch_amd64.deb

RUN apt update && apt install -y gdebi
RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb
RUN apt update && apt install -f -y ./wkhtmltox_0.12.6-1.buster_amd64.deb

RUN apt-get -y clean && \
    apt-get -y purge && \
    rm -rf /var/lib/apt/lists/* /tmp/*
