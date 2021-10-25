FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["OJS.Servers.Ui/OJS.Servers.Ui.csproj", "OJS.Servers.Ui/"]
RUN dotnet restore "OJS.Servers.Ui/OJS.Servers.Ui.csproj"
COPY . .
WORKDIR "/src/OJS.Servers.Ui"
RUN dotnet build "OJS.Servers.Ui.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OJS.Servers.Ui.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OJS.Servers.Ui.dll"]
