import { Notification, Provider, ProviderConfiguration, Device } from '../interfaces';
import {Provider as PushClient, Notification as ApnNotification, NotificationAlertOptions} from 'apn';

// structure of the configuration for this provider
export interface AppleConfiguration extends ProviderConfiguration {
  topic?: string;
  keyPath?: string;
  keyId?: string;
  teamId?: string;
  production?: boolean;
}

export class AppleProvider extends Provider {
  private client: PushClient;
  private topic: string;

  constructor(config: AppleConfiguration) {
    super(config);

    // check the configuration
    if (!(config.keyPath && config.keyId && config.teamId && config.topic)) {
      console.error('Misconfigured apple provider.');
      process.exit(1);
    }

    // create apn client
    this.client = new PushClient({
      token: {
        key: config.keyPath,
        keyId: config.keyId,
        teamId: config.teamId,
      },
      production: config.production ?? true,
    });

    // set the topic (bundle id)
    this.topic = config.topic;
  }

  async send(request: Notification, device: Device): Promise<boolean> {
    const newNotification = new ApnNotification({topic: this.topic});
    const alert: NotificationAlertOptions = {body: 'New Message'};

    // alert 
    alert.title = request.sender_display_name;
    alert.body = (request.content?.body as string) ?? 'New Mesage';
  
    // set payload
    newNotification.alert = alert;
    newNotification.payload = {
      event_id: request.event_id,
      room_id: request.room_id,
      type: request.type,
      sender: request.sender,
      sender_display_name: request.sender_display_name,
      room_name: request.room_name,
      room_alias: request.room_alias
    };

    // send notification to device
    const result = await this.client.send(newNotification, device.pushkey);
    return result.failed.filter(elm => elm.error).length === 0;
  }
}
