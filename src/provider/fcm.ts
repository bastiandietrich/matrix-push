import { Messaging, NotificationMessagePayload, getMessaging } from 'firebase-admin/messaging';
import { Notification, Provider, ProviderConfiguration, Device } from '../interfaces';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

// structure of the configuration for this provider
export interface FirebaseConfiguration extends ProviderConfiguration {}

export class FirebaseProvider extends Provider {
  private client: Messaging;

  constructor(config: FirebaseConfiguration) {
    super(config);

    // check the configuration
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.error('Misconfigured firebase provider.');
      process.exit(1);
    }

    // create fcm client
    const app = initializeApp({
      credential: applicationDefault()
    });

    this.client = getMessaging(app);
  }

  async send(request: Notification, device: Device): Promise<boolean> {
    const newNotification: NotificationMessagePayload = {};

    newNotification.title = request.sender_display_name;
    newNotification.body = (request.content?.body as string) ?? 'New Mesage';
    
    const result = await this.client.send({
      token: device.pushkey,
      notification: newNotification,
    });

    return result.length !== 0;
  }
}
