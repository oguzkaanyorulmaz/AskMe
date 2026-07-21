# 1. Derleme Aşaması
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Proje dosyalarını kopyalayıp bağımlılıkları yükle (Restore)
COPY ["AskMe.API/AskMe.API.csproj", "AskMe.API/"]
COPY ["AskMe.Application/AskMe.Application.csproj", "AskMe.Application/"]
COPY ["AskMe.Domain/AskMe.Domain.csproj", "AskMe.Domain/"]
COPY ["AskMe.Infrastructure/AskMe.Infrastructure.csproj", "AskMe.Infrastructure/"]
RUN dotnet restore "AskMe.API/AskMe.API.csproj"

# Kalan tüm dosyaları kopyala ve projeyi derle
COPY . .
WORKDIR "/src/AskMe.API"
RUN dotnet build "AskMe.API.csproj" -c Release -o /app/build

# 2. Yayınlama Aşaması
FROM build AS publish
RUN dotnet publish "AskMe.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 3. Çalışma Aşaması (Hafif Runtime İmajı)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "AskMe.API.dll"]
