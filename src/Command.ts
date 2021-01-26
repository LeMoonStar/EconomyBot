import { Message } from 'discord.js';

export default abstract class Command {
  abstract getArgumentPattern(): {
    optional: boolean;
    name: string;
    description: string;
    type?: string;
  }[];

  abstract execute(message: Message, args: string[]): void;

  abstract getDescription(): string;
}
