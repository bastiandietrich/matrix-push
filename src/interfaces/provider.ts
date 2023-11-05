import { ProviderConfiguration } from ".";

export interface DeliverRquest {
  app_id: string;
  pushkey: string;
  data?: unknown;
}

export interface DeliverResult {
  sent: boolean;
  pushkey: string[];
}

export abstract class Provider {
  appId: string;

  constructor(providerConfiguration: ProviderConfiguration) {
    this.appId = providerConfiguration.appId;
  }

  abstract send(request: DeliverRquest): Promise<DeliverResult>
}