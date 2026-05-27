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
            onChange={(v) => setRegion(v)}
          />
        </Form.Item>

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
