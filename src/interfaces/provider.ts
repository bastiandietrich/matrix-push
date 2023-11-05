import { Notification, ProviderConfiguration } from '.';

export interface ProviderResult {
  sent: boolean;
  pushkey: string[];
}

export abstract class Provider {
  appId: string;

  constructor(providerConfiguration: ProviderConfiguration) {
    this.appId = providerConfiguration.appId;
  }

  abstract send(request: Notification): Promise<ProviderResult>;
}