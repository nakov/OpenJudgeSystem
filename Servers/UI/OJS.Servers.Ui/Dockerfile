FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get update -y && apt-get install -y nodejs
RUN npm install --global yarn

WORKDIR /src
COPY Servers/UI/OJS.Servers.Ui/ClientApp/package.json ./Servers/UI/OJS.Servers.Ui/ClientApp/package.json
COPY Servers/UI/OJS.Servers.Ui/ClientApp/yarn.lock ./Servers/UI/OJS.Servers.Ui/ClientApp/yarn.lock

WORKDIR /src/Servers/UI/OJS.Servers.Ui/ClientApp
RUN yarn install

WORKDIR /src
COPY Servers/UI ./Servers/UI
COPY Servers/Infrastructure ./Servers/Infrastructure
COPY Services/UI ./Services/UI

COPY Common ./Common
COPY Data ./Data
COPY Services/Common ./Services/Common
COPY Services/Infrastructure ./Services/Infrastructure
COPY Directory.Build.props ./Directory.Build.props

FROM build AS publish
WORKDIR /src/Servers/UI/OJS.Servers.Ui/ClientApp

# Increase to 6 GB
ENV NODE_OPTIONS "--max-old-space-size=8124"

RUN yarn build

WORKDIR /src/Servers/UI/OJS.Servers.Ui
RUN dotnet publish OJS.Servers.Ui.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
CMD dotnet OJS.Servers.Ui.dll
