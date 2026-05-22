import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { ReactNode } from 'react';

dayjs.locale('ru');

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={ruRU} theme={{ token: { colorPrimary: '#1677ff' } }}>
      {children}
    </ConfigProvider>
  );
}
