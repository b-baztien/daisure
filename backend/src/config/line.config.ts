import { registerAs } from '@nestjs/config';

export default registerAs('line', () => ({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  redirectUri: process.env.LINE_REDIRECT_URI,
  liffId: process.env.LINE_LIFF_ID,
}));
