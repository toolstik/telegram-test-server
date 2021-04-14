"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const casual = require("casual");
class User {
    constructor(server, info = {}) {
        this.server = server;
        this.info = Object.assign({ id: casual.integer(1000000, 10000000), username: casual.username.toLowerCase(), is_bot: false, first_name: casual.first_name, last_name: casual.last_name, language_code: 'en_US' }, info);
    }
    startBot(bot, startParams) {
        const chat = this.createChat();
        chat.invite(bot);
        chat.postMessage(this, {
            text: `/start ${startParams}`,
            entities: [{ offset: 0, length: 6, type: 'bot_command' }],
        });
        return chat;
    }
    createChat(opts) {
        return this.server.createChat(this, opts);
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map