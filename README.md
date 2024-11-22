# Deprecation Notice

This repository has been **archived** and is no longer maintained.  

The project was initially created as an experiment to explore how a Matrix Push Gateway works. However, as I no longer require this functionality, I have decided to discontinue its development.  

Feel free to explore the code, but please note that it may not reflect the best practices or standards.  

# matrix-push

**Not yet ready for production use since only APN is implemented.**

matrix-push is a simple Push Gateway for [Matrix](https://matrix.org).
[https://matrix.org/docs/spec/push_gateway/r0.1.0](https://matrix.org/docs/spec/push_gateway/r0.1.0) describes the implemented protocol.

The server only reacts on POST-requests to /_matrix/push/v1/notify. It's recommended to run this behind a reverse proxy.

### Installation with Docker
```
docker run -d --name matrix-push \
    -v /opt/matrix-push:/data \
    -p 5000:5000 \
    --restart unless-stopped \
    registry.gudd-it.de/bastian/matrix-push:latest
```

### Configuration
You'll need to create a config.yml and upload the key files in the directory mounted on /data:
```
# config.yml
apn: 
  appId: 'com.example.app.ios'
  appBundle: 'com.example.app'
  key: 'APNsAuthKey_XXXXXXXXXX.p8'
  keyId: 'key-id'
  teamId: 'developer-team-id'
  production: false
```
