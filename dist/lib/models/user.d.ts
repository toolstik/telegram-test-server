import { Chat as TelegramChat, User as TelegramUser } from 'typegram';
import { TelegramServer } from '../server';
import { Bot } from './bot';
export declare class User {
    private server;
    info: TelegramUser;
    constructor(server: TelegramServer, info?: Partial<TelegramUser>);
    startBot(bot: Bot, startParams?: any): import("./chat").Chat;
    createChat(opts?: Partial<TelegramChat>): import("./chat").Chat;
}
