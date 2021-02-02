import { Message, MessageEmbed, User } from 'discord.js';
import Command from '../Command';
import { parseMentionOrID } from '../common';
import { Balance } from '../Database';
import DiscordBot from '../DiscordBot';

export default class BalanceCommand extends Command {
  constructor() {
    super();
  }

  getArgumentPattern(): {
    optional: boolean;
    name: string;
    description: string;
    type?: string;
  }[] {
    return [
      {
        optional: true,
        name: 'user',
        description:
          'The user ID (or mention) of a user whose balance you want to see',
        type: 'user',
      },
    ];
  }

  execute(message: Message, args: string[]): void {
    let user: User;
    if (args.length == 0) {
      user = message.author;
    } else {
      user = parseMentionOrID(args[0]);
      if (!user) {
        message.channel.send(':x: unknown user');
        return;
      }
    }

    const balance: Balance = DiscordBot._database.getBal(
      user.id,
      message.guild.id
    ) ?? { userID: user.id, serverID: message.guild.id, cash: 0, bank: 0 };

    message.channel.send(
      new MessageEmbed()
        .setTitle('Balance of user ' + user.username)
        .setColor('#0099ff')
        .setThumbnail(user.displayAvatarURL())
        .addField('cash', balance.cash, true)
        .addField('bank', balance.bank, true)
        .addField('sum', balance.cash + balance.bank, true)
        .setTimestamp(new Date())
    );
  }

  getDescription(): string {
    return 'Shows how much money a user has';
  }
}
