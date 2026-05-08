import { messagingApi } from '@line/bot-sdk';

function client(channelAccessToken: string) {
  return new messagingApi.MessagingApiClient({ channelAccessToken });
}

export async function sendReply(
  channelAccessToken: string,
  replyToken: string,
  text: string,
): Promise<void> {
  await client(channelAccessToken).replyMessage({
    replyToken,
    messages: [{ type: 'text', text }],
  });
}

export async function sendPush(
  channelAccessToken: string,
  to: string,
  text: string,
): Promise<void> {
  await client(channelAccessToken).pushMessage({
    to,
    messages: [{ type: 'text', text }],
  });
}

export async function getProfile(channelAccessToken: string, userId: string) {
  return client(channelAccessToken).getProfile(userId);
}
