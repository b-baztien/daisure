import { registerAs } from '@nestjs/config';

export default registerAs('line', () => ({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  liffId: process.env.LINE_LIFF_ID,
}));
