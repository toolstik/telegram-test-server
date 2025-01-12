"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramServer = void 0;
// import koaBody = require('koa-body')
const koaRouter = require("koa-router");
const assert = require("http-assert");
const koaBody = require("koa-body");
const Application = require("koa");
const bot_1 = require("./models/bot");
const chat_1 = require("./models/chat");
const user_1 = require("./models/user");
const store_1 = require("./store");
class TelegramServer {
    constructor(options) {
        this.options = options;
        this.options = Object.assign({ port: 4000, host: '0.0.0.0' }, options);
        this.store = new store_1.Store();
    }
    createUser(info) {
        const user = new user_1.User(this, info);
        return this.store.saveUser(user);
    }
    createBot(info) {
        const bot = new bot_1.Bot(this, info);
        return this.store.saveBot(bot);
    }
    createChat(owner, info) {
        const chat = new chat_1.Chat(owner, info);
        return this.store.saveChat(chat);
    }
    createSandbox(startParams) {
        const user = this.createUser();
        const bot = this.createBot();
        return {
            user,
            bot,
            chat: user.startBot(bot, startParams),
        };
    }
    findChat(chatId) {
        return this.store.findChat(chatId);
    }
    findChatByCbQuery(cbQueryId) {
        return this.store.findChatByCbQuery(cbQueryId);
    }
    getApiEndpoint() {
        return `http://${this.options.host || '0.0.0.0'}:${this.options.port}`;
    }
    start() {
        const router = koaRouter();
        router.all('/bot:token/:method', (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, method } = ctx.params;
                const bot = this.store.findBotByToken(token);
                assert(bot, 401, 'Unauthorized');
                const botMethodName = method.toLowerCase();
                assert(botMethodName in bot.botMethods, 404, `Not Found: method '${method}' not found`);
                const result = yield Promise.resolve(bot.handleBotCall(botMethodName, Object.assign(Object.assign({}, ctx.request.query), ctx.request.body)));
                ctx.body = {
                    ok: true,
                    result,
                };
            }
            catch (err) {
                ctx.status = err.status || 500;
                ctx.body = {
                    ok: false,
                    error_code: ctx.status,
                    description: err.message,
                };
            }
        }));
        const app = new Application();
        app.use(koaBody({ multipart: true }));
        app.use(router.routes());
        this.server = app.listen(this.options.port, this.options.host);
        return this.server;
    }
    stop() {
        this.server && this.server.close();
    }
}
exports.TelegramServer = TelegramServer;
//# sourceMappingURL=server.js.map