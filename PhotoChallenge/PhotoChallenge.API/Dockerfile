## See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
#
## This stage is used when running from VS in fast mode (Default for Debug configuration)
#FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
#WORKDIR /app
#EXPOSE 8080
#EXPOSE 8081
#
#
## This stage is used to build the service project
#FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
#ARG BUILD_CONFIGURATION=Release
#WORKDIR /src
#COPY ["PhotoChallenge.API/PhotoChallenge.API.csproj", "PhotoChallenge.API/"]
#COPY ["PhotoChallenge.Core/PhotoChallenge.Core.csproj", "PhotoChallenge.Core/"]
#COPY ["PhotoChallenge.Data/PhotoChallenge.Data.csproj", "PhotoChallenge.Data/"]
#COPY ["PhotoChallenge.Service/PhotoChallenge.Service.csproj", "PhotoChallenge.Service/"]
#RUN dotnet restore "./PhotoChallenge.API/PhotoChallenge.API.csproj"
#COPY . .
#WORKDIR "/src/PhotoChallenge.API"
#RUN dotnet build "./PhotoChallenge.API.csproj" -c $BUILD_CONFIGURATION -o /app/build
#
## This stage is used to publish the service project to be copied to the final stage
#FROM build AS publish
#ARG BUILD_CONFIGURATION=Release
#RUN dotnet publish "./PhotoChallenge.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
#
## This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "PhotoChallenge.API.dll"]

# Stage 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["PhotoChallenge.API/PhotoChallenge.API.csproj", "PhotoChallenge.API/"]
COPY ["PhotoChallenge.Core/PhotoChallenge.Core.csproj", "PhotoChallenge.Core/"]
COPY ["PhotoChallenge.Data/PhotoChallenge.Data.csproj", "PhotoChallenge.Data/"]
COPY ["PhotoChallenge.Service/PhotoChallenge.Service.csproj", "PhotoChallenge.Service/"]
RUN dotnet restore "PhotoChallenge.API/PhotoChallenge.API.csproj"

# Copy the full source and build
COPY . .
WORKDIR "/src/PhotoChallenge.API"
RUN dotnet publish -c Release -o /app/publish

# Stage 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "PhotoChallenge.API.dll"]
