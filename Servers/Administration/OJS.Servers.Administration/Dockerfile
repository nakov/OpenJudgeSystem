FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Servers/Administration/OJS.Servers.Administration/OJS.Servers.Administration.csproj", "OJS.Servers.Administration/"]
RUN dotnet restore "Servers/Administration/OJS.Servers.Administration/OJS.Servers.Administration.csproj"
COPY . .
WORKDIR "/src/OJS.Servers.Administration"
RUN dotnet build "OJS.Servers.Administration.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OJS.Servers.Administration.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OJS.Servers.Administration.dll"]
