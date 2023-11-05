import { DeliverResult, DeliverRquest, Provider, ProviderConfiguration } from "../interfaces";
import {Provider as PushClient} from 'apn';

// structure of the configuration for this provider
export interface AppleConfiguration extends ProviderConfiguration {
  keyPath?: string;
  keyId?: string;
  teamId?: string;
  production?: boolean;
}

export class AppleProvider extends Provider {
  private client: PushClient;

  constructor(config: AppleConfiguration) {
    super(config);

    // check the configuration
    if (!(config.keyPath && config.keyId && config.teamId)) {
      console.error("Misconfigured apple provider.");
      process.exit(1);
    }

    // create apn client
    this.client = new PushClient({
      token: {
        key: config.keyPath,
        keyId: config.keyId,
        teamId: config.teamId,
      },
      production: config.production ?? true
    });
  }

  send(request: DeliverRquest): Promise<DeliverResult> {
    return Promise.reject('Not implemented!');
  }
}
