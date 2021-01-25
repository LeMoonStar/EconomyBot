import * as Discord from 'discord.js';

export default class DiscordBot {
  static _client: Discord.Client;
  constructor() {
    DiscordBot._client = new Discord.Client();
    DiscordBot._client.login(process.env.TOKEN).catch(console.error);
    DiscordBot._client.on('ready', this.onReady.bind(this));
  }

  private onReady(): void {
  }
}
