import * as Discord from 'discord.js';
import CommandHandler from './CommandHandler';
export default class DiscordBot {
  static _client: Discord.Client;
  static _commandHandler: CommandHandler;

  constructor() {
    DiscordBot._client = new Discord.Client();
    DiscordBot._commandHandler = new CommandHandler('ec!');
    DiscordBot._client.login(process.env.TOKEN).catch(console.error);
    DiscordBot._client.on('ready', this.onReady.bind(this));
  }

  private onReady(): void {}
}
