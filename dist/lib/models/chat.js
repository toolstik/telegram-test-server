"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const casual = require("casual");
class Chat {
    constructor(owner, info) {
        this.owner = owner;
        this.participants = [];
        this.history = [];
        this.info = Object.assign({ id: casual.integer(-10000000, -1000000), type: 'private' }, info);
    }
    invite(user) {
        this.participants.push(user);
    }
    leave(userId) {
        this.participants = this.participants.filter(({ info }) => info.id !== userId);
    }
    checkAccess(userId) {
        return (this.owner.info.id === userId || this.participants.some(({ info }) => info.id === userId));
    }
    notifyBots(update) {
        this.participants.filter(({ info }) => info.is_bot).forEach(bot => bot.queueUpdate(update));
    }
    postMessage(author, message) {
        message = Object.assign({ message_id: this.history.filter(u => u.message).length + 1, chat: this.info, from: author.info, date: 0 }, message);
        const update = {
            message,
        };
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
        const update = {
            callback_query,
        };
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
exports.Chat = Chat;
module.exports = Chat;
//# sourceMappingURL=chat.js.map