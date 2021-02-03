import { Message, MessageEmbed } from 'discord.js';
import Command from '../Command';
import CommandHandler from '../CommandHandler';

export default class HelpCommand extends Command {
  private _handler: CommandHandler;
  private _precomputedEmbed: MessageEmbed;
  private _precomputedCommandEmbeds: Map<string, MessageEmbed>;

  constructor(handler: CommandHandler) {
    super();
    this._handler = handler;
    this.regenerateEmbed();
    this._precomputedCommandEmbeds = new Map<string, MessageEmbed>();
  }

  getArgumentPattern(): {
    optional: boolean;
    name: string;
    description: string;
    type?: string;
  }[] {
    return [
      {
        name: 'command',
        description: 'a command to get more information about',
        optional: true,
      },
    ];
  }

  execute(message: Message, args: string[]): void {
    if (args.length == 0) {
      message.channel.send(this._precomputedEmbed);
      return;
    }
    args.forEach((command) => {
      if (this._precomputedCommandEmbeds.has(command))
        message.channel.send(this._precomputedCommandEmbeds.get(command));
      else
        message.channel.send(
          new MessageEmbed()
            .setTitle('Help - unknown command')
            .setDescription('the command "' + command + '" does not exist.')
            .setColor('#FF0000')
        );
    });
  }

  getDescription(): string {
    return 'lists all commands';
  }

  regenerateEmbed(): void {
    console.warn('regenerating help embeds');

    const commands: Map<string, Command> = this._handler.getCommands();
    let command_names: Map<Command, string[]> = new Map<Command, string[]>();

    commands.forEach((command, name) => {
      if (command_names.has(command)) {
        command_names.get(command).push(name);
      } else {
        command_names.set(command, [name]);
      }
    });

    // general help embed
    this._precomputedEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Help')
      .setDescription('all commands of the EconomyBot');

    command_names.forEach((name, command) => {
      if (command.getArgumentPattern().length != 0)
        this._precomputedEmbed.addField(
          name.join(' | '),
          'usage: ' +
            name +
            (() => {
              let tmp: string = ' ';
              command.getArgumentPattern().forEach((arg) => {
                tmp += arg.name + (arg.optional ? '*' : '') + ' ';
              });
              return tmp;
            })() +
            '\n' +
            command.getDescription()
        );
      else
        this._precomputedEmbed.addField(
          name.join(' | '),
          command.getDescription()
        );
    });

    command_names.forEach((names, command) => {
      let embed: MessageEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Help - ' + names[0])
        .setDescription(
          'usage: ' +
            names[0] +
            (() => {
              let tmp: string = ' ';
              command.getArgumentPattern().forEach((arg) => {
                tmp += arg.name + (arg.optional ? '*' : '') + ' ';
              });
              return tmp;
            })() +
            '\n' +
            command.getDescription()
        );

      command.getArgumentPattern().forEach((arg) => {
        embed.addField(
          arg.name + (arg.optional ? ' (optional)' : ''),
          arg.description + (arg.type ? '\ntype ' + arg.type : '')
        );
      });

      names.forEach((name) => {
        this._precomputedCommandEmbeds.set(name, embed);
      });
    });
  }
}
