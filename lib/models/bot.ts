import casual = require('casual');
import assert = require('http-assert');
import { Update, User } from 'typegram';

import { TelegramServer } from '../server';

const wait = (ms = 100) => new Promise((resolve, reject) => setTimeout(resolve, ms));

export class Bot {
  private queue = [];
  private lastUpdateId = 0;

  botMethods: any;

  constructor(
    private server: TelegramServer,
    public token: string,
    public info: Partial<User> = {},
  ) {
    info = {
      id: casual.integer(1000000, 10000000),
      is_bot: true,
      username: `${casual.username}_bot`,
      first_name: casual.first_name,
      last_name: casual.last_name,
      language_code: 'en_US',
      ...info,
    };

    this.token = token || `${this.info.id}:${casual.uuid}`;

    const sendRawMessage = payload => this.resolveChat(payload.chat_id).postMessage(this, payload);

    this.botMethods = {
      getme: () => this.info,
      getupdates: async payload => {
        const offset = parseInt(payload.offset) || 0;
        this.queue = this.queue.filter(update => update.update_id >= offset);
        const updates = this.queue.slice(0, parseInt(payload.limit) || 100);
        if (updates.length === 0) {
          await wait(50);
        }
        return updates;
      },
      answercallbackquery: payload => {
        const chat = this.server.findChatByCbQuery(payload.callback_query_id);
        assert(chat && chat.checkAccess(this.info.id), 400, 'Bad Request: chat not found');
        chat.postCbQueryAnswer(this, payload);
        return true;
      },
      getchat: payload => this.resolveChat(payload.chat_id).info,
      leavechat: payload => {
        this.resolveChat(payload.chat_id).leave(this.info.id);
        return {};
      },
      sendmessage: sendRawMessage,
      sendphoto: sendRawMessage,
      sendaudio: sendRawMessage,
      senddocument: sendRawMessage,
      sendvideo: sendRawMessage,
      sendvoice: sendRawMessage,
      sendvideonote: sendRawMessage,
      sendmediagroup: sendRawMessage,
      sendlocation: sendRawMessage,
      sendvenue: sendRawMessage,
      sendcontact: sendRawMessage,
      sendchataction: sendRawMessage,
    };
  }

  resolveChat(chatId: number) {
    const chat = this.server.findChat(chatId);
    assert(chat && chat.checkAccess(this.info.id), 400, 'Bad Request: chat not found');
    return chat;
  }

  queueUpdate(update: Update) {
    this.lastUpdateId++;
    this.queue.push({ update_id: this.lastUpdateId, ...update });
  }

  handleBotCall(method, payload) {
    return this.botMethods[method] && this.botMethods[method](payload);
  }
}

module.exports = Bot;
