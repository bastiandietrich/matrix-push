import { Notification, Provider, RouteResult } from './interfaces';
import { AppleProvider, FirebaseProvider } from './provider';
import { getConfiguration } from './utils';

const config = await getConfiguration();      // configuration yaml
const providers = new Map<string, Provider>;  // map of provider instances

// create apn providers from config
for (const provider of config.apn ?? []) {
  console.log('Configure apple provider for app id ' + provider.appId + '.');
  providers.set(provider.appId, new AppleProvider(provider));
}

// create fcm providers from config
for (const provider of config.fcm ?? []) {
  console.log('Configure firebase provider for app id ' + provider.appId + '.');
  providers.set(provider.appId, new FirebaseProvider(provider));
}

// process a request
const pushRoute = async (body: any): Promise<RouteResult> => {
  const rejectedPushKeys: string[] = [];

  const notification = body.notification as Notification;
  for await (const device of notification.devices) {
    const result = await providers.get(device.app_id)?.send(notification);
  }

  return {
    status: 200,
    body: {
      rejected: rejectedPushKeys,
    }
  };
};

// start the server
console.log('Start push gateway on port ' + config.server.port + '...');
Bun.serve({
  port: config.server.port,
  async fetch (req) {
    const url = new URL(req.url);

    if (url.pathname === '/_matrix/push/v1/notify' && req.method === 'POST') { 
      try {
        const requestBody = await req.json(); // get json body from the request
        const {status, body} = await pushRoute(requestBody);

        return new Response(JSON.stringify(body), {
          status: status,
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (error) {
        // there was an error
        process.env.NODE_ENV !== 'production' && console.warn(error); // don't log error in production
        return new Response('500 Internal Server Error.', {status: 500}); // return 500
      }
    }

    // unknown path or method
    return new Response('400 Bad Request.', {status: 400});
  },
});