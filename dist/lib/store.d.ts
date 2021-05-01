import { Bot } from './models/bot';
import { Chat } from './models/chat';
import { User } from './models/user';
export declare class Store {
    private users;
    private bots;
    private channels;
    private chats;
    saveUser(user: User): User;
    saveBot(bot: Bot): Bot;
    saveChat(chat: Chat): Chat;
    findBotByToken(token: string): Bot;
    findChat(chatId: number): Chat;
    findChatByCbQuery(cbQueryId: string): Chat;
}
