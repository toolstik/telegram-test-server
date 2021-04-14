import { Update, User } from 'typegram';
import { TelegramServer } from '../server';
export declare class Bot {
    private server;
    token: string;
    info: Partial<User>;
    private queue;
    private lastUpdateId;
    botMethods: any;
    constructor(server: TelegramServer, token: string, info?: Partial<User>);
    resolveChat(chatId: number): import("./chat").Chat;
    queueUpdate(update: Update): void;
    handleBotCall(method: any, payload: any): any;
}
