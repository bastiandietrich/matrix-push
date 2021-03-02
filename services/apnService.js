const apn = require('apn');

const apnService = {
  apnProvider: null,
  topic: '',

  // create new provider
  startProvider: (config) => {
    this.topic = config.appBundle; // save app bundle as topic
    this.apnProvider = new apn.Provider({
      token: { // only use token auth
        key: '/data/' + config.key,
        keyId: config.keyId,
        teamId: config.teamId
      },
      production: config.production // sandbox or production?
    });
  },

  // hanle one notification
  handleNotification: async (notification, token) => {
    // see https://github.com/node-apn/node-apn/blob/master/doc/notification.markdown
    const note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = notification.counts.unread || 0;
    note.topic = this.topic;
    note.sound = 'chime.aiff';
    note.title = notification.room_name || '';
    note.alert = '\u2709 Du hast eine Nachricht von ' + notification.sender_display_name + ' erhalten.';
    note.pushType = 'alert';
    note.payload = {
      event_id: notification.event_id || '',
      room_id: notification.room_id || '',
      type: notification.type || '',
      sender: notification.sender || '',
      sender_display_name: notification.sender_display_name || '',
      room_name: notification.room_name || '',
      room_alias: notification.room_alias || ''
    };

    const result = await this.apnProvider.send(note, token); // send notification

    if (result.failed.length === 0 && result.sent.length === 1) {
      return true;
    }
    return false;
  }
};

module.exports = apnService;
