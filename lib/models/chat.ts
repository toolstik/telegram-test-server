import casual = require('casual');
import { Chat as TelegramChat, Message, Update, User as TelegramUser } from 'typegram';

import { Bot } from './bot';
import { User } from './user';

export class Chat {
  participants = [];
  history = [];

  info: TelegramChat;

  constructor(private owner: User, info: Partial<TelegramChat>) {
    this.info = {
      id: casual.integer(-10000000, -1000000),
      type: 'private',
      ...info,
    } as TelegramChat;
  }

  invite(user: User) {
    this.participants.push(user);
  }

  leave(userId: number) {
    this.participants = this.participants.filter(({ info }) => info.id !== userId);
  }

  checkAccess(userId: number) {
    return (
      this.owner.info.id === userId || this.participants.some(({ info }) => info.id === userId)
    );
  }

  notifyBots(update: Update) {
    this.participants.filter(({ info }) => info.is_bot).forEach(bot => bot.queueUpdate(update));
  }

  postMessage(author: User | Bot, message: Partial<Message> & { text: string }) {
    message = {
      message_id: this.history.filter(u => u.message).length + 1,
      chat: this.info,
      from: author.info as TelegramUser,
      date: 0,
      ...message,
    };
    const update = {
      message,
    } as Update;

    this.history.push(update);
    if (!author.info.is_bot) {
      this.notifyBots(update);
    }

    return message;
  }

  postCbQuery(user, message, data) {
    const callback_query = {
      id: casual.integer(1000000),
      from: user.info,
      message: message,
      data,
    };

    const update = ({
      callback_query,
    } as any) as Update;

    this.history.push(update);
    this.notifyBots(update);
    return callback_query;
  }

  postCbQueryAnswer(user, cbQuery) {
    const update = { callback_query_answer: cbQuery };
    this.history.push(update);
    return cbQuery;
  }
}

module.exports = Chat;
