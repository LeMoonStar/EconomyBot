import { User } from 'discord.js';
import DiscordBot from './DiscordBot';

export function parseMentionOrID(str: string): User {
  if (!str) return undefined;
  str = str.replace(/[^0-9]/g, '');
  return DiscordBot._client.users.cache.get(str);
}
