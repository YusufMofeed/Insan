# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Insan.sln ./
COPY Insan.API/Insan.API.csproj Insan.API/
COPY Insan.Application/Insan.Application.csproj Insan.Application/
COPY Insan.Domain/Insan.Domain.csproj Insan.Domain/
COPY Insan.Infrastructure/Insan.Infrastructure.csproj Insan.Infrastructure/

RUN dotnet restore Insan.API/Insan.API.csproj

COPY . .

RUN dotnet publish Insan.API/Insan.API.csproj -c Release -o /app/publish --no-restore

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Insan.API.dll"]
