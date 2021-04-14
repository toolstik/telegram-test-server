import Koa = require('koa');
// import koaBody = require('koa-body')
import koaRouter = require('koa-router');
import assert = require('http-assert');
import koaBody = require('koa-body');
import Application = require('koa');

import { Server } from 'http';
import { Chat as TelegramChat } from 'typegram';

import { Bot } from './models/bot';
import { Chat } from './models/chat';
import { User } from './models/user';
import { Store } from './store';

export type TelegramServerOptions = {
  port: number;
  host: string;
};

export class TelegramServer {
  private readonly store: Store;
  private server: Server;

  constructor(private options: TelegramServerOptions) {
    this.options = { port: 4000, ...options };
    this.store = new Store();
  }

  createUser(info?) {
    const user = new User(this, info);
    return this.store.saveUser(user);
  }

  createBot(info?) {
    const bot = new Bot(this, info);
    return this.store.saveBot(bot);
  }

  createChat(owner: User, info: Partial<TelegramChat>) {
    const chat = new Chat(owner, info);
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

  findChat(chatId: number) {
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
    router.all('/bot:token/:method', async ctx => {
      try {
        const { token, method } = ctx.params;
        const bot = this.store.findBotByToken(token);
        assert(bot, 401, 'Unauthorized');
        const result = await Promise.resolve(
          bot.handleBotCall(method.toLowerCase(), {
            ...ctx.request.query,
            ...ctx.request.body,
          }),
        );
        assert(result, 404, 'Not Found: method not found');
        ctx.body = {
          ok: true,
          result,
        };
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
          ok: false,
          error_code: ctx.status,
          description: err.message,
        };
      }
    });
    const app = new Application();
    app.use(koaBody({ multipart: true }));
    app.use(router.routes());
    this.server = app.listen(this.options.port, this.options.host);
  }

  stop() {
    this.server && this.server.close();
  }
}
