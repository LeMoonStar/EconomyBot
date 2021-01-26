import DiscordBot from './DiscordBot';
import Command from './Command';
import HelpCommand from './HelpCommand';

new DiscordBot();

const helpCommand: HelpCommand = new HelpCommand(DiscordBot._commandHandler);

DiscordBot._commandHandler.registerCommand('help', helpCommand);
DiscordBot._commandHandler.registerCommand('?', helpCommand);
DiscordBot._commandHandler.registerCommand('h', helpCommand);

helpCommand.regenerateEmbed();
