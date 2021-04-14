import { Chat as TelegramChat, Message, Update } from 'typegram';
import { Bot } from './bot';
import { User } from './user';
export declare class Chat {
    private owner;
    participants: any[];
    history: any[];
    info: TelegramChat;
    constructor(owner: User, info: Partial<TelegramChat>);
    invite(user: User | Bot): void;
    leave(userId: number): void;
    checkAccess(userId: number): boolean;
    notifyBots(update: Update): void;
    postMessage(author: User | Bot, message: Partial<Message> & {
        text: string;
    }): Partial<Message> & {
        text: string;
    };
    postCbQuery(user: any, message: any, data: any): {
        id: number;
        from: any;
        message: any;
        data: any;
    };
    postCbQueryAnswer(user: any, cbQuery: any): any;
}
