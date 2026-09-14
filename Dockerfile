FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["OnePieceTierList.API/OnePieceTierList.API.csproj", "OnePieceTierList.API/"]

RUN dotnet restore "OnePieceTierList.API/OnePieceTierList.API.csproj"

COPY . .

WORKDIR "/src/OnePieceTierList.API"

RUN dotnet publish "OnePieceTierList.API.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "OnePieceTierList.API.dll"]