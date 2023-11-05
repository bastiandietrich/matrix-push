export interface ProviderConfiguration {
  type: 'APN' | 'FCM';
  appId: string;
}

export interface AppConfiguration {
  server: {
    port: number;
  }
  provider: ProviderConfiguration[];
}