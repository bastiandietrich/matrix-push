import { DeliverResult, DeliverRquest, Provider, ProviderConfiguration } from "../interfaces";

const sendNotification = (notification: object, deviceToken: string, apiToken: string) => fetch("https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send", {
  method: "POST",
  body: JSON.stringify({ message: {notification: notification}, token: deviceToken }),
  headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiToken },
});; 

// structure of the configuration for this provider
export interface FirebaseConfiguration extends ProviderConfiguration {
  apiKey?: string;
}

export class FirebaseProvider extends Provider {
  private client: (notification: {body: string; data: string;}, deviceToken: string) => Promise<Response>;

  constructor(config: FirebaseConfiguration) {
    super(config);

    // check the configuration
    if (!config.apiKey) {
      console.error("Misconfigured firebase provider.");
      process.exit(1);
    }

    // create fcm client
    this.client = (notification: object, deviceToken: string) => 
      sendNotification(notification, deviceToken, config.apiKey!);
  }

  send(request: DeliverRquest): Promise<DeliverResult> {
    return Promise.reject('Not implemented!');
  }
}
