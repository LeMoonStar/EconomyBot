import DiscordBot from './DiscordBot';
import HelpCommand from './commands/HelpCommand';
import BalanceCommand from './commands/BalanceCommand';

new DiscordBot();

const helpCommand: HelpCommand = new HelpCommand(DiscordBot._commandHandler);

DiscordBot._commandHandler.registerCommand('help', helpCommand);
DiscordBot._commandHandler.registerCommand('?', helpCommand);
DiscordBot._commandHandler.registerCommand('h', helpCommand);

const balanceCommand: BalanceCommand = new BalanceCommand();
DiscordBot._commandHandler.registerCommand('bal', balanceCommand);
DiscordBot._commandHandler.registerCommand('b', balanceCommand);
DiscordBot._commandHandler.registerCommand('balance', balanceCommand);

helpCommand.regenerateEmbed();
