import { Typography, Input, Space } from 'antd';
import { YANDEX_MAPS_API_KEY } from 'shared/config/env';

interface LatLng {
  lat: number;
  lng: number;
}

interface Props {
  value?: LatLng;
  onChange?: (coords: LatLng) => void;
}

declare global {
  interface Window {
    ymaps?: {
      ready: (cb: () => void) => void;
      Map: new (
        el: string | HTMLElement,
        state: { center: number[]; zoom: number },
      ) => { events: { add: (ev: string, cb: (e: { get: (k: string) => number[] }) => void) => void }; setCenter: (c: number[]) => void };
      Placemark: new (coords: number[], props: object, opts: object) => unknown;
    };
  }
}

export function YandexMapPicker({ value, onChange }: Props) {
  if (!YANDEX_MAPS_API_KEY) {
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Text type="warning">
          YANDEX_MAPS_API_KEY не задан — введите координаты вручную
        </Typography.Text>
        <Space>
          <Input
            placeholder="Широта"
            type="number"
            value={value?.lat ?? ''}
            onChange={(e) => onChange?.({ lat: Number(e.target.value), lng: value?.lng ?? 0 })}
            style={{ width: 160 }}
          />
          <Input
            placeholder="Долгота"
            type="number"
            value={value?.lng ?? ''}
            onChange={(e) => onChange?.({ lat: value?.lat ?? 0, lng: Number(e.target.value) })}
            style={{ width: 160 }}
          />
        </Space>
      </Space>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Text type="secondary">Карта (ключ задан, компонент подключается через ymaps)</Typography.Text>
      <Space>
        <Input
          placeholder="Широта"
          type="number"
          value={value?.lat ?? ''}
          onChange={(e) => onChange?.({ lat: Number(e.target.value), lng: value?.lng ?? 0 })}
          style={{ width: 160 }}
        />
        <Input
          placeholder="Долгота"
          type="number"
          value={value?.lng ?? ''}
          onChange={(e) => onChange?.({ lat: value?.lat ?? 0, lng: Number(e.target.value) })}
          style={{ width: 160 }}
        />
      </Space>
    </Space>
  );
}
