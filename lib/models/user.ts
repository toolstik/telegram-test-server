import casual = require('casual');
import { Chat as TelegramChat, Message, User as TelegramUser } from 'typegram';

import { TelegramServer } from '../server';
import { Bot } from './bot';

export class User {
  info: TelegramUser;

  constructor(private server: TelegramServer, info: Partial<TelegramUser> = {}) {
    this.info = {
      id: casual.integer(1000000, 10000000),
      username: casual.username.toLowerCase(),
      is_bot: false,
      first_name: casual.first_name,
      last_name: casual.last_name,
      language_code: 'en_US',
      ...info,
    };
  }

  startBot(bot: Bot, startParams?) {
    const chat = this.createChat();
    chat.invite(bot);
    chat.postMessage(this, {
      text: `/start ${startParams}`,
      entities: [{ offset: 0, length: 6, type: 'bot_command' }],
    } as Message);
    return chat;
  }

  createChat(opts?: Partial<TelegramChat>) {
    return this.server.createChat(this, opts);
  }
}
