import { Provider, RouteResult } from "./interfaces";
import { AppleConfiguration, AppleProvider, FirebaseConfiguration, FirebaseProvider } from "./provider";
import { getConfiguration } from "./utils";

const config = await getConfiguration();
const providers = new Map<string, Provider>;

// create providers from config
for (const provider of config.provider) {
  // apn provider
  if (provider.type === 'APN') {
    providers.set(provider.appId, new AppleProvider(provider as AppleConfiguration));
  }

  // google/firebase provider
  if (provider.type === 'FCM') {
    providers.set(provider.appId, new FirebaseProvider(provider as FirebaseConfiguration));
  }
}

// process a request
const pushRoute = async (body: any): Promise<RouteResult> => {
  return {status: 200, result: {a: 'a'}};
};

// start the server
console.log('Start push gateway on port ' + config.server.port + '...');
Bun.serve({
  port: config.server.port,
  async fetch (req) {
    const url = new URL(req.url);

    if (url.pathname === "/_matrix/push/v1/notify" && req.method === "POST") { 
      try {
        const requestBody = await req.json(); // get json body from the request
        const {status, result} = await pushRoute(requestBody);

        return new Response(JSON.stringify(result), {
          status: status,
          headers: {
            "Content-Type": "application/json",
          }
        })
      } catch (error) {
        // there was an error
        process.env.NODE_ENV !== "production" && console.warn(error); // don't log error in production
        return new Response("500 Internal Server Error.", {status: 500}); // return 500
      }
    }

    // unknown path or method
    return new Response("400 Bad Request.", {status: 400});
  },
});