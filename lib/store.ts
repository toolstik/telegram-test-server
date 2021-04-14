import { Bot } from './models/bot';
import { Chat } from './models/chat';
import { User } from './models/user';

export class Store {
  private users = [];
  private bots: Bot[] = [];
  private channels = [];
  private chats: Chat[] = [];

  // constructor() {}

  saveUser(user: User) {
    this.users.push(user);
    return user;
  }

  saveBot(bot: Bot) {
    this.bots.push(bot);
    return bot;
  }

  saveChat(chat: Chat) {
    this.chats.push(chat);
    return chat;
  }

  findBotByToken(token: string) {
    return this.bots.find(bot => bot.token === token);
  }

  findChat(chatId: number) {
    return this.chats.find(chat => chat.info.id === chatId);
  }

  findChatByCbQuery(cbQueryId: string) {
    return this.chats.find(chat =>
      chat.history.some(
        update => 'callback_query' in update && update.callback_query.id === cbQueryId,
      ),
    );
  }
}
