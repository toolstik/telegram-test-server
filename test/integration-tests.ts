import { assert } from 'chai';
import { Telegraf } from 'telegraf';

import { TelegramServer } from '../lib/server';

const wait = (ms = 500) => new Promise((resolve, reject) => setTimeout(resolve, ms));

function startBot(token, apiRoot) {
  const exampleBot = new Telegraf(token, { telegram: { apiRoot } });
  exampleBot.start(async ({ reply }) => {
    await reply('Ola');
  });
  exampleBot.action('cat', async ({ answerCbQuery, reply }) => {
    await answerCbQuery('🐈');
    await reply('Meow');
  });
  exampleBot.startPolling();

  return exampleBot;
}

describe('Integration tests', () => {
  it('example bot', async () => {
    const server = new TelegramServer();
    server.start();

    const { user, bot, chat } = server.createSandbox();

    const telegraf = startBot(bot.token, server.getApiEndpoint());

    await wait();
    assert.equal(chat.history.length, 2);
    assert.equal(chat.history[1]['message'].text, 'Ola');

    chat.postCbQuery(user, chat.history[1]['message'], 'cat');
    await wait();
    assert.equal(chat.history.length, 5);
    assert(chat.history[3]['callback_query']);
    assert.equal(chat.history[3]['callback_query'].text, '🐈');
    assert.equal(chat.history[4]['message'].text, 'Meow');

    await telegraf.stop();
    server.stop();
  });
});
