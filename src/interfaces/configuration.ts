import { AppleConfiguration, FirebaseConfiguration } from '../provider';

export interface ProviderConfiguration {
  appId: string;
}

export interface AppConfiguration {
  server: {
    port: number;
  }
  apn: AppleConfiguration[];
  fcm: FirebaseConfiguration[];
}