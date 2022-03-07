FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY Servers/Administration ./Servers/Administration
COPY Servers/Infrastructure ./Servers/Infrastructure
COPY Services/Administration ./Services/Administration

COPY AutoCrudAdmin ./AutoCrudAdmin

COPY Common ./Common
COPY Data ./Data
COPY Services/Common ./Services/Common
COPY Services/Infrastructure ./Services/Infrastructure
COPY Directory.Build.props ./Directory.Build.props

FROM build AS publish
RUN dotnet publish Servers/Administration/OJS.Servers.Administration/OJS.Servers.Administration.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
CMD dotnet OJS.Servers.Administration.dll
