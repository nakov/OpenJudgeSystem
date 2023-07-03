FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
WORKDIR /src

COPY Servers/MicroServices/Judge ./Servers/MicroServices/Judge
COPY Services/Judge ./Services/Judge
COPY PubSub/Judge ./PubSub/Judge

COPY Directory.Build.props ./Directory.Build.props
COPY Analyzers ./Analyzers
COPY Common ./Common
COPY Data/Common ./Data/Common
COPY Servers/Common ./Servers/Common
COPY Services/Common ./Services/Common
COPY PubSub/Common ./PubSub/Common
COPY Services/Infrastructure ./Services/Infrastructure


COPY Tests/Servers/Judge ./Tests/Servers/Judge
COPY Tests/Services/Judge ./Tests/Services/Judge

COPY Tests/Common ./Tests/Common
COPY Tests/Infrastructure ./Tests/Infrastructure
COPY Tests/Services/Infrastructure ./Tests/Services/Infrastructure
COPY Tests/Servers/Common ./Tests/Servers/Common

COPY Interactive.Judge.Tests.sln ./

WORKDIR /src
RUN dotnet test Interactive.Judge.Tests.sln

WORKDIR /src/Servers/MicroServices/Judge/Interactive.Servers.Judge
RUN dotnet publish Interactive.Servers.Judge.csproj -c Release --verbosity q -o /app

FROM ghcr.io/softuni-internal/judge_linux:latest
WORKDIR /app
COPY --from=build-env /app .

ENV IS_IN_DOCKER=TRUE

CMD dotnet Interactive.Servers.Judge.dll