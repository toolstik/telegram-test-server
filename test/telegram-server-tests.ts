import getPort = require('get-port');

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Telegram } from 'telegraf';

import { TelegramServer } from '../lib/server';

chai.use(chaiAsPromised);

const assert = chai.assert;

describe('Functional tests', () => {
  it('get me with invalid token', async () => {
    const port = await getPort();
    const server = new TelegramServer({ port });
    server.start();
    const client = new Telegram('fake-token', {
      apiRoot: server.getApiEndpoint(),
    });
    await assert.isRejected(client.getMe());
    server.stop();
  });

  it('get me', async () => {
    const port = await getPort();
    const server = new TelegramServer({ port });
    const bot = server.createBot();
    server.start();
    const client = new Telegram(bot.token, {
      apiRoot: server.getApiEndpoint(),
    });
    const { username } = await client.getMe();
    assert.equal(bot.info.username, username);

    server.stop();
  });

  it('get chat', async () => {
    const port = await getPort();
    const server = new TelegramServer({ port });
    const bot = server.createBot();
    const user = server.createUser();
    const chat = user.startBot(bot);
    server.start();
    const client = new Telegram(bot.token, {
      apiRoot: server.getApiEndpoint(),
    });
    const { type } = await client.getChat(chat.info.id);
    assert.equal(type, 'private');
    server.stop();
  });

  it('get updates', async () => {
    const port = await getPort();
    const server = new TelegramServer({ port });
    const bot = server.createBot();
    const user = server.createUser();
    user.startBot(bot);
    server.start();
    const client = new Telegram(bot.token, {
      apiRoot: server.getApiEndpoint(),
    });
    const updates = await client.getUpdates();
    assert.equal(updates.length, 1);
    server.stop();
  });
});
