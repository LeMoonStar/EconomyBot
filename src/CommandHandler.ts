import { Message } from 'discord.js';
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
      message.content.startsWith(this._prefix)
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
    this._commands.set(name, command);
  }

  private onCommand(message: Message): void {
    const splitted = message.content.split(' ');
    const command = splitted[0].substr(this._prefix.length);
    if (this._commands.has(command)) {
      this._commands.get(command).execute(message, splitted.slice(1));
    } else {
      message.channel.send(':x: This command does not exist.');
    }
  }

  public getCommands(): Map<string, Command> {
    return this._commands;
  }
}
