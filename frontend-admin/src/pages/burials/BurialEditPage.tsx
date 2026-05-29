import { useState, useEffect, useMemo } from 'react';
import {
  Form, AutoComplete, Input, Select, Button, Space,
  Typography, message, Spin, Switch, Divider,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useBurial, useCreateBurial, useUpdateBurial, useBurials } from 'entities/burial/queries';
import { useCemeteries } from 'entities/cemetery/queries';
import { AjaxSelect } from 'features/ajax-select/AjaxSelect';
import { ImageUploader } from 'features/image-uploader/ImageUploader';
import type { BurialCreateDto, BurialUpdateDto } from 'entities/burial/types';
import type { ImageDto } from 'entities/image/types';
import { ROUTES } from 'shared/config/routes';

const REGION_OPTIONS = [
  { value: 'PETERSBURG', label: 'Петербург' },
  { value: 'RUSSIA',     label: 'Россия (кроме Петербурга)' },
  { value: 'WORLD',      label: 'Мир' },
];

const RUSSIA_REGION_OPTIONS = [
  { value: 'r-99',                             label: 'Мурманская обл.' },
  { value: 'r-215',                            label: 'Респ. Карелия' },
  { value: 'r-51',                             label: 'Ленинградская обл.' },
  { value: 'r-40',                             label: 'Новгородская обл.' },
  { value: 'r-37',                             label: 'Псковская обл.' },
  { value: 'r-106',                            label: 'Калининградская обл.' },
  { value: 'r-74',                             label: 'Тверская обл.' },
  { value: 'r-77',                             label: 'Смоленская обл.' },
  { value: 'r-100',                            label: 'Московская обл.' },
  { value: 'r-110',                            label: 'Брянская обл.' },
  { value: 'r-105',                            label: 'Калужская обл.' },
  { value: 'r-4',                              label: 'Тульская обл.' },
  { value: 'r-95',                             label: 'Орловская обл.' },
  { value: 'r-5',                              label: 'Рязанская обл.' },
  { value: 'r-0',                              label: 'Ярославская обл.' },
  { value: 'r-28',                             label: 'Владимирская обл.' },
  { value: 'r-102',                            label: 'Курская обл.' },
  { value: 'r-101',                            label: 'Липецкая обл.' },
  { value: 'r-75',                             label: 'Тамбовская обл.' },
  { value: 'r-111',                            label: 'Белгородская обл.' },
  { value: 'r-108',                            label: 'Воронежская обл.' },
  { value: 'r-70',                             label: 'ЛНР' },
  { value: 'r-69',                             label: 'ДНР' },
  { value: 'r-67',                             label: 'Запорожская обл.' },
  { value: 'r-223',                            label: 'Херсонская обл.' },
  { value: 'r-224',                            label: 'Респ. Крым' },
  { value: 'r-172',                            label: 'Краснодарский край' },
  { value: 'r-222',                            label: 'Респ. Адыгея' },
  { value: 'r-93',                             label: 'Ростовская обл.' },
  { value: 'r-109',                            label: 'Волгоградская обл.' },
  { value: 'r-65',                             label: 'Респ. Калмыкия' },
  { value: 'r-112',                            label: 'Астраханская обл.' },
  { value: 'r-76',                             label: 'Ставропольский край' },
  { value: 'r-23',                             label: 'Саратовская обл.' },
  { value: 'r-94',                             label: 'Пензенская обл.' },
  { value: 'r-211',                            label: 'Респ. Мордовия' },
  { value: 'r-98',                             label: 'Нижегородская обл.' },
  { value: 'r-1',                              label: 'Костромская обл.' },
  { value: 'r-57',                             label: 'Ивановская обл.' },
  { value: 'r-54',                             label: 'Вологодская обл.' },
  { value: 'r-113',                            label: 'Архангельская обл.' },
  { value: 'r-191',                            label: 'Ненецкий АО' },
  { value: 'r-213',                            label: 'Респ. Коми' },
  { value: 'r-64',                             label: 'Кировская обл.' },
  { value: 'r-212',                            label: 'Респ. Марий Эл' },
  { value: 'r-194',                            label: 'Чувашская Респ.' },
  { value: 'r-72',                             label: 'Ульяновская обл.' },
  { value: 'r-96',                             label: 'Оренбургская обл.' },
  { value: 'r-199',                            label: 'Респ. Татарстан' },
  { value: 'r-197',                            label: 'Удмуртская Респ.' },
  { value: 'r-220',                            label: 'Респ. Башкортостан' },
  { value: 'r-71',                             label: 'Челябинская обл.' },
  { value: 'r-147',                            label: 'Пермский край' },
  { value: 'r-78',                             label: 'Свердловская обл.' },
  { value: 'r-103',                            label: 'Курганская обл.' },
  { value: 'r-189',                            label: 'Ханты-Мансийский АО — Югра' },
  { value: 'r-178',                            label: 'Ямало-Ненецкий АО' },
  { value: 'r-73',                             label: 'Тюменская обл.' },
  { value: 'r-97',                             label: 'Омская обл.' },
  { value: 'r-7',                              label: 'Томская обл.' },
  { value: 'r-10',                             label: 'Новосибирская обл.' },
  { value: 'r-177',                            label: 'Алтайский край' },
  { value: 'r-104',                            label: 'Кемеровская обл. — Кузбасс' },
  { value: 'r-221',                            label: 'Респ. Алтай' },
  { value: 'r-196',                            label: 'Респ. Хакасия' },
  { value: 'r-198',                            label: 'Респ. Тыва' },
  { value: 'r-148',                            label: 'Красноярский край' },
  { value: 'r-50',                             label: 'Респ. Саха (Якутия)' },
  { value: 'r-107',                            label: 'Иркутская обл.' },
  { value: 'r-219',                            label: 'Респ. Бурятия' },
  { value: 'r-176',                            label: 'Забайкальский край' },
  { value: 'r-142',                            label: 'Амурская обл.' },
  { value: 'r-190',                            label: 'Еврейская АО' },
  { value: 'r-146',                            label: 'Приморский край' },
  { value: 'r-143',                            label: 'Хабаровский край' },
  { value: 'r-89',                             label: 'Сахалинская обл.' },
  { value: 'r-47',                             label: 'Магаданская обл.' },
  { value: 'r-173',                            label: 'Камчатский край' },
  { value: 'r-186',                            label: 'Чукотский АО' },
];

interface Props {
  mode: 'create' | 'edit';
}

export function BurialEditPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const [region, setRegion] = useState<string>('RUSSIA');
  const [cityInput, setCityInput] = useState('');

  const { data: existing, isLoading } = useBurial(id ?? '');
  const { data: allBurials } = useBurials();
  const { data: cemeteries } = useCemeteries();
  const createMutation = useCreateBurial();
  const updateMutation = useUpdateBurial(id ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (mode === 'edit' && existing) {
      const r = existing.region ?? 'RUSSIA';
      setRegion(r);
      setCityInput(existing.city ?? '');
    }
  }, [mode, existing?._id]);

  const cityOptions = useMemo(() => {
    const cities = [...new Set(
      (allBurials ?? [])
        .filter((b) => (b.region ?? 'RUSSIA') === region)
        .map((b) => b.city)
        .filter(Boolean) as string[],
    )];
    const q = cityInput.trim().toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(q)).map((c) => ({ value: c }));
  }, [allBurials, cityInput, region]);

  const cemeteryOptions = useMemo(() => {
    const city = cityInput.trim();
    const names = [...new Set(
      (allBurials ?? [])
        .filter((b) => b.city === city && b.cemetery_name)
        .map((b) => b.cemetery_name as string),
    )];
    return names.map((n) => ({ value: n }));
  }, [allBurials, cityInput]);

  const pbCemeteryOptions = useMemo(
    () => (cemeteries ?? []).map((c) => ({ value: c._id, label: c.name })),
    [cemeteries],
  );

  if (mode === 'edit' && isLoading) return <Spin />;

  const initialValues =
    mode === 'edit' && existing
      ? {
          region: existing.region ?? 'RUSSIA',
          russia_region: existing.russia_region,
          cemetery_id: existing.cemetery_id,
          city: existing.city,
          cemetery_name: existing.cemetery_name,
          name: existing.name,
          life_years: existing.life_years,
          brief_info: existing.brief_info,
          connected_person_id: existing.connected_person_id ?? undefined,
          is_published: existing.is_published ?? false,
          images: existing.images ?? [],
        }
      : {
          region: 'RUSSIA',
          is_published: false,
          images: [],
          connected_person_id: undefined,
        };

  const onFinish = async (values: Record<string, unknown>) => {
    const uploadedImages = (values.images as ImageDto[] | undefined) ?? [];
    const imageIds = uploadedImages.map((img) => img._id);
    const connectedPersonId = values.connected_person_id as string | undefined;
    const r = values.region as string;

    try {
      if (mode === 'create') {
        const dto: BurialCreateDto = {
          region: r,
          russia_region: r === 'RUSSIA' ? (values.russia_region as string | undefined) : undefined,
          cemetery_id: r === 'PETERSBURG' ? (values.cemetery_id as string | undefined) : undefined,
          city: r !== 'PETERSBURG' ? (values.city as string | undefined) : undefined,
          cemetery_name: r !== 'PETERSBURG' ? (values.cemetery_name as string | undefined) : undefined,
          name: values.name as string,
          life_years: values.life_years as string | undefined,
          brief_info: values.brief_info as string | undefined,
          connected_person_id: connectedPersonId,
          image_ids: imageIds,
        };
        await createMutation.mutateAsync(dto);
        message.success('Захоронение создано');
      } else {
        const dto: BurialUpdateDto = {
          region: r,
          russia_region: r === 'RUSSIA' ? (values.russia_region as string | undefined) : undefined,
          cemetery_id: r === 'PETERSBURG' ? (values.cemetery_id as string | undefined) ?? '' : '',
          city: r !== 'PETERSBURG' ? (values.city as string | undefined) : undefined,
          cemetery_name: r !== 'PETERSBURG' ? ((values.cemetery_name as string | undefined) ?? '') : '',
          name: values.name as string,
          life_years: values.life_years as string | undefined,
          brief_info: values.brief_info as string | undefined,
          connected_person_id: connectedPersonId ?? '',
          image_ids: imageIds,
          is_published: values.is_published as boolean,
        };
        await updateMutation.mutateAsync(dto);
        message.success('Захоронение обновлено');
      }
      navigate(ROUTES.BURIALS);
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  return (
    <>
      <Typography.Title level={3}>
        {mode === 'create' ? 'Новое захоронение' : 'Редактирование захоронения'}
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
      >
        <Form.Item name="region" label="Регион" rules={[{ required: true }]}>
          <Select
            options={REGION_OPTIONS}
            onChange={(v) => { setRegion(v); if (v !== 'RUSSIA') form.setFieldValue('russia_region', undefined); }}
          />
        </Form.Item>

        {region === 'RUSSIA' && (
          <Form.Item name="russia_region" label="Субъект РФ (для отображения на карте)">
            <Select
              options={RUSSIA_REGION_OPTIONS}
              placeholder="Выберите регион..."
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            />
          </Form.Item>
        )}

        {region === 'PETERSBURG' ? (
          <Form.Item
            name="cemetery_id"
            label="Кладбище"
            rules={[{ required: true, message: 'Выберите кладбище' }]}
          >
            <Select
              options={pbCemeteryOptions}
              placeholder="Выберите кладбище Петербурга..."
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            />
          </Form.Item>
        ) : (
          <>
            <Form.Item name="city" label="Город" rules={[{ required: true, message: 'Введите город' }]}>
              <AutoComplete
                options={cityOptions}
                onSearch={setCityInput}
                onChange={(v) => setCityInput(v ?? '')}
                placeholder="Москва"
                allowClear
                filterOption={false}
              />
            </Form.Item>
            <Form.Item name="cemetery_name" label="Название кладбища (пусто — «Неизвестное место захоронения»)">
              <AutoComplete
                options={cemeteryOptions}
                placeholder="Введенское кладбище"
                allowClear
                filterOption={(input, option) =>
                  (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </>
        )}

        <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="life_years" label="Годы жизни (напр. «1826–1894»)">
          <Input placeholder="1826–1894" />
        </Form.Item>
        <Form.Item name="brief_info" label="Краткая информация">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Divider>Фотографии</Divider>
        <Form.Item name="images">
          <ImageUploader
            featuredImageId={featuredId}
            onFeaturedChange={setFeaturedId}
          />
        </Form.Item>

        <Divider />
        <Form.Item name="connected_person_id" label="Связанная персона (необязательно)">
          <AjaxSelect endpoint="/persons" placeholder="Найти персону..." />
        </Form.Item>

        {mode === 'edit' && (
          <Form.Item name="is_published" label="Опубликовано" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}

        <Space>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Сохранить
          </Button>
          <Button onClick={() => navigate(ROUTES.BURIALS)}>Отмена</Button>
        </Space>
      </Form>
    </>
  );
}
