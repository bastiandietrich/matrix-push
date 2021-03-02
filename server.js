const express = require('express');
const bodyParser = require('body-parser');
const apnService = require('./services/apnService');
const yaml = require('js-yaml');
const fs = require('fs');

const config = {
  port: 5000,
  apnAppId: '', // AppId for Apple Push
  fcmAppId: '' // AppId for Firebase Cloud Messaging
};

const app = express();
app.use(bodyParser.json());

// Handle POST on /_matrix/push/v1/notify
app.post('/_matrix/push/v1/notify', async (req, res) => {
  if (typeof req.body.notification === 'undefined') {
    console.log('[ERR] Bad Request.');
    res.status(400);
  }

  try {
    const rejected = [];
    const notification = req.body.notification;

    // for every device in notification
    for (let i = 0; i < notification.devices.length; i++) {
      const device = notification.devices[i];

      if (device.app_id === config.apnAppId) {
        // Handle APN
        console.log('[INF] ' + notification.event_id + ': ' + device.app_id);
        const successful = await apnService.handleNotification(notification, device.pushkey);
        if (!successful) rejected.push(device.pushkey);
      } else if (device.app_id === config.fcmAppId) {
        // Handle FCM
        console.log('[ERR] FCM not implented yet.');
      } else {
        // ignore other app_id
        console.log('[ERR] Unknown app_id.');
      }
    }

    res.json({ rejected: rejected }); // send rejected pushkeys
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

// Try to load settings from config.yml & start server
try {
  const doc = yaml.load(fs.readFileSync('/data/config.yml', 'utf8'));
  config.apnAppId = doc.apn.appId; // Set appId for APN-Service
  apnService.startProvider(doc.apn); // Start APN-Provider
  app.listen(config.port, () => { console.log('We are live on ' + config.port); }); // Start API
} catch (e) {
  // Exit on error in config
  console.log(e);
  console.log('Error in config.yml.');
}
