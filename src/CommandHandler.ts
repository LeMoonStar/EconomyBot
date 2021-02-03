import { Message, MessageEmbed } from 'discord.js';
import DiscordBot from './DiscordBot';
import Command from './Command';
import { exit } from 'process';

export default class CommandHandler {
  private _commands: Map<string, Command>;
  private _prefix: string;

  constructor(prefix: string) {
    this._prefix = prefix;
    this._commands = new Map<string, Command>();
    DiscordBot._client.on('message', this.onMessage.bind(this));
  }

  private onMessage(message: Message): void {
    if (
      /*message.mentions.has(DiscordBot._client.user, {
        ignoreDirect: false,
        ignoreEveryone: true,
        ignoreRoles: true,
      }) ||*/
      message.content.toLowerCase().startsWith(this._prefix.toLowerCase())
    ) {
      this.onCommand(message);
    }
  }

  public registerCommand(name: string, command: Command): void {
    if (this._commands.has(name)) {
      console.warn(
        'registering a command with the name "' +
          name +
          '", which is already registered. (OVERWRITING COMMAND)'
      );
    }
    this._commands.set(name.toLowerCase(), command);
  }

  private onCommand(message: Message): void {
    const splitted = message.content.split(' ');
    const command = splitted[0].substr(this._prefix.length).toLowerCase();
    if (this._commands.has(command)) {
      try {
        this._commands.get(command).execute(message, splitted.slice(1));
      } catch (e) {
        console.error(e);
        message.channel.send(
          new MessageEmbed()
            .setTitle(':x: ERROR')
            .setDescription(
              'seems like there was an error, please report this at our [discord server](https://discord.gg/amDBUEnjFj)'
            )
            .setColor('#FF0000')
            .addField('description', (e as Error).message)
        );
      }
    } else {
      message.channel.send(':x: This command does not exist.');
    }
  }

  public getCommands(): Map<string, Command> {
    return this._commands;
  }
}
