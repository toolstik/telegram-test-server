import casual = require('casual');
import { CallbackQuery, Chat as TelegramChat, Message, Update } from 'typegram';

import { Bot } from './bot';
import { User } from './user';

export class Chat {
  participants: (User | Bot)[] = [];
  history: Update[] = [];

  info: TelegramChat;

  constructor(private owner: User, info: Partial<TelegramChat>) {
    this.info = {
      id: casual.integer(-10000000, -1000000),
      type: 'private',
      ...info,
    } as TelegramChat;
  }

  invite(user: User | Bot) {
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
    this.participants
      .filter(({ info }) => info.is_bot)
      .forEach((bot: Bot) => bot.queueUpdate(update));
  }

  postMessage(author: User | Bot, message: Message) {
    const msg: Message = {
      message_id: this.history.filter(u => 'message' in u && u.message).length + 1,
      chat: this.info,
      from: author.info,
      date: 0,
      ...message,
    };

    const update = {
      message: msg,
    } as Update.MessageUpdate;

    this.history.push(update);
    if (!author.info.is_bot) {
      this.notifyBots(update);
    }

    return update;
  }

  postCbQuery(user: User, message: Message, data: string) {
    const callback_query = {
      id: String(casual.integer(1000000)),
      from: user.info,
      message: message,
      chat_instance: undefined,
      data,
    } as CallbackQuery;

    const update = {
      callback_query,
    } as Update.CallbackQueryUpdate;

    this.history.push(update);
    this.notifyBots(update);
    return update;
  }

  postCbQueryAnswer(user: User | Bot, cbQuery: CallbackQuery) {
    const update = { callback_query: cbQuery } as Update.CallbackQueryUpdate;
    this.history.push(update);
    return update;
  }
}
