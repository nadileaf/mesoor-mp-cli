import { WX_SUBSCRIBE_MESSAGE_TEMPLATES } from '@/config';
import { message } from '@/utils/common';

export default function useSubscribeMessage() {
  /** 订阅消息 */
  function requestSubscribeMessage() {
    if (import.meta.env.DEV) return;
    uni.requestSubscribeMessage({
      tmplIds: [WX_SUBSCRIBE_MESSAGE_TEMPLATES.unreadMessage],
      success(res: any) {
        if (res?.[WX_SUBSCRIBE_MESSAGE_TEMPLATES.unreadMessage] === 'reject') message.error('请在右上角设置中打开接收未读消息提醒');
        else console.log('用户订阅成功', res);
      },
      fail(err) {
        console.error(err.errCode, err.errMsg);
        err.errCode === 20004 && message.error('请在右上角设置中打开接收通知');
      }
    });
  }

  return {
    requestSubscribeMessage
  };
}
