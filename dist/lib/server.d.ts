/// <reference types="node" />
import { Server } from 'http';
import { Chat as TelegramChat } from 'typegram';
import { Bot } from './models/bot';
import { Chat } from './models/chat';
import { User } from './models/user';
export declare type TelegramServerOptions = {
    port?: number;
    host?: string;
};
export declare class TelegramServer {
    private options?;
    private readonly store;
    private server;
    constructor(options?: TelegramServerOptions);
    createUser(info?: any): User;
    createBot(info?: any): Bot;
    createChat(owner: User, info: Partial<TelegramChat>): Chat;
    createSandbox(startParams?: any): {
        user: User;
        bot: Bot;
        chat: Chat;
    };
    findChat(chatId: number): Chat;
    findChatByCbQuery(cbQueryId: string): Chat;
    getApiEndpoint(): string;
    start(): Server;
    stop(): void;
}
