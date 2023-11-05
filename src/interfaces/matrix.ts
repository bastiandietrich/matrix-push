// https://spec.matrix.org/v1.8/push-gateway-api/

export interface Notification {
  content?: EventContent;
  counts?: Counts;
  devices: Device[];
  event_id?: string;
  prio?: 'high' | 'low';
  room_alias?: string;
  room_id?: string;
  room_name?: string;
  sender?: string;
  sender_display_name?: string;
  type?: string;
  user_is_target?: boolean;
}

export interface EventContent {
  body: unknown;
  msgtype: string;
}

export interface Counts {
  missed_calls: number;
  unread: number;
}

export interface Device {
  app_id: string;
  data?: unknown;
  pushkey: string;
  pushkey_ts?: string;
  tweaks?: unknown;
}

