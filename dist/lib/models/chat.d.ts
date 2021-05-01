import { CallbackQuery, Chat as TelegramChat, Message, Update } from 'typegram';
import { Bot } from './bot';
import { User } from './user';
export declare class Chat {
    private owner;
    participants: (User | Bot)[];
    history: Update[];
    info: TelegramChat;
    constructor(owner: User, info: Partial<TelegramChat>);
    invite(user: User | Bot): void;
    leave(userId: number): void;
    checkAccess(userId: number): boolean;
    notifyBots(update: Update): void;
    postMessage(author: User | Bot, message: Message): Update.MessageUpdate;
    postCbQuery(user: User, message: Message, data: string): Update.CallbackQueryUpdate;
    postCbQueryAnswer(user: User | Bot, cbQuery: CallbackQuery): Update.CallbackQueryUpdate;
}
