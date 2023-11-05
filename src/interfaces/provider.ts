import { Device, Notification, ProviderConfiguration } from '.';

export abstract class Provider {
  appId: string;

  constructor(providerConfiguration: ProviderConfiguration) {
    this.appId = providerConfiguration.appId;
  }

  abstract send(request: Notification, device: Device): Promise<boolean>;
}