FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base

WORKDIR /app


# Node.js build
FROM node:18-alpine as node_build

WORKDIR /src

COPY Servers/UI/OJS.Servers.Ui/ClientApp/package.json /src/Servers/UI/OJS.Servers.Ui/ClientApp/package.json
COPY Servers/UI/OJS.Servers.Ui/ClientApp/yarn.lock /src/Servers/UI/OJS.Servers.Ui/ClientApp/yarn.lock
WORKDIR /src/Servers/UI/OJS.Servers.Ui/ClientApp
RUN yarn install

WORKDIR /src

COPY Servers/UI/OJS.Servers.Ui/Views /src/Servers/UI/OJS.Servers.Ui/Views
COPY Servers/UI/OJS.Servers.Ui/ClientApp /src/Servers/UI/OJS.Servers.Ui/ClientApp

RUN yarn run lint
WORKDIR /src/Servers/UI/OJS.Servers.Ui/ClientApp
RUN yarn build


# .Net build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS dotnet_build

WORKDIR /src

COPY Servers/UI/OJS.Servers.Ui/OJS.Servers.Ui.csproj /src/Servers/UI/OJS.Servers.Ui/OJS.Servers.Ui.csproj
COPY Data/OJS.Data/OJS.Data.csproj /src/Data/OJS.Data/OJS.Data.csproj
COPY Services/Common/OJS.Services.Common.Models/OJS.Services.Common.Models.csproj /src/Services/Common/OJS.Services.Common.Models/OJS.Services.Common.Models.csproj
COPY Services/UI/OJS.Services.Ui.Business/OJS.Services.Ui.Business.csproj /src/Services/UI/OJS.Services.Ui.Business/OJS.Services.Ui.Business.csproj
COPY Services/UI/OJS.Services.Ui.Data/OJS.Services.Ui.Data.csproj /src/Services/UI/OJS.Services.Ui.Data/OJS.Services.Ui.Data.csproj
COPY Services/UI/OJS.Services.Ui.Models/OJS.Services.Ui.Models.csproj /src/Services/UI/OJS.Services.Ui.Models/OJS.Services.Ui.Models.csproj
COPY Servers/UI/OJS.Servers.Ui.Infrastructure/OJS.Servers.Ui.Infrastructure.csproj /src/Servers/UI/OJS.Servers.Ui.Infrastructure/OJS.Servers.Ui.Infrastructure.csproj
COPY Servers/UI/OJS.Servers.Ui.Models/OJS.Servers.Ui.Models.csproj /src/Servers/UI/OJS.Servers.Ui.Models/OJS.Servers.Ui.Models.csproj
COPY Data/Infrastructure/OJS.Data.Infrastructure/OJS.Data.Infrastructure.csproj /src/Data/Infrastructure/OJS.Data.Infrastructure/OJS.Data.Infrastructure.csproj
COPY Data/OJS.Data.Models/OJS.Data.Models.csproj /src/Data/OJS.Data.Models/OJS.Data.Models.csproj
COPY Services/Infrastructure/OJS.Services.Infrastructure/OJS.Services.Infrastructure.csproj /src/Services/Infrastructure/OJS.Services.Infrastructure/OJS.Services.Infrastructure.csproj
COPY Services/Common/OJS.Services.Common.Data/OJS.Services.Common.Data.csproj /src/Services/Common/OJS.Services.Common.Data/OJS.Services.Common.Data.csproj
COPY Services/Common/OJS.Services.Common/OJS.Services.Common.csproj /src/Services/Common/OJS.Services.Common/OJS.Services.Common.csproj
COPY Servers/Infrastructure/OJS.Servers.Infrastructure/OJS.Servers.Infrastructure.csproj /src/Servers/Infrastructure/OJS.Servers.Infrastructure/OJS.Servers.Infrastructure.csproj
COPY Common/OJS.Common/OJS.Common.csproj /src/Common/OJS.Common/OJS.Common.csproj
COPY Data/OJS.Data.Validation/OJS.Data.Validation.csproj /src/Data/OJS.Data.Validation/OJS.Data.Validation.csproj

RUN dotnet restore Servers/UI/OJS.Servers.Ui/OJS.Servers.Ui.csproj

WORKDIR /src
COPY Servers/UI ./Servers/UI
COPY Servers/Infrastructure ./Servers/Infrastructure
COPY Services/UI ./Services/UI

COPY Common ./Common
COPY Data ./Data
COPY Services/Common ./Services/Common
COPY Services/Infrastructure ./Services/Infrastructure
COPY Directory.Build.props ./Directory.Build.props


# Dotnet Publish
FROM dotnet_build AS publish

WORKDIR /src/Servers/UI/OJS.Servers.Ui

COPY --from=node_build /src/Servers/UI/OJS.Servers.Ui/Views /src/Servers/UI/OJS.Servers.Ui/Views
COPY --from=node_build /src/Servers/UI/OJS.Servers.Ui/ClientApp/build /src/Servers/UI/OJS.Servers.Ui/ClientApp/build

WORKDIR /src/Servers/UI/OJS.Servers.Ui
RUN dotnet publish OJS.Servers.Ui.csproj -c Release -o /app/publish


# Dotnet Run
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
CMD dotnet OJS.Servers.Ui.dll
