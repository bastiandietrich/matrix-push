# matrix-push

** WIP! This repository is under active development **

matrix-push is a simple Push Gateway for [Matrix](https://matrix.org).
[https://spec.matrix.org/v1.8/push-gateway-api/](https://spec.matrix.org/v1.8/push-gateway-api/) describes the implemented protocol.

The server only reacts on POST-requests to /_matrix/push/v1/notify. It's recommended to run this behind a reverse proxy.

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
