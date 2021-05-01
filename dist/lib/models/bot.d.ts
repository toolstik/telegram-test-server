import { Update, User } from 'typegram';
import { TelegramServer } from '../server';
export declare class Bot {
    private server;
    token: string;
    private queue;
    private lastUpdateId;
    botMethods: any;
    readonly info: User;
    constructor(server: TelegramServer, token: string, info?: Partial<User>);
    resolveChat(chatId: number): import("./chat").Chat;
    queueUpdate(update: Update): void;
    handleBotCall(method: string, payload: any): any;
}
