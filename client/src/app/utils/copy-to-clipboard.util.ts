import { mobileUserAgent } from '@utils/mobile-user-agent.util';

export const copyToClipboard = (text: string): void => {
  const _window = window as typeof window & { clipboardData: { setData: (type: string, value: string) => void } };

  if (mobileUserAgent()) {
    if (_window.clipboardData && _window.clipboardData.setData) _window.clipboardData.setData('Text', text);
    else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      const textarea = document.createElement('textarea');
      textarea.textContent = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
      } catch {
        navigator.clipboard.writeText(text);
      } finally {
        document.body.removeChild(textarea);
      }
    } else navigator.clipboard.writeText(text);
  } else navigator.clipboard.writeText(text);
};
