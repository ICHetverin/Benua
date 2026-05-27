import { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Typography, message, Spin, Switch, Divider, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useBuilding, useCreateBuilding, useUpdateBuilding } from 'entities/building/queries';
import { AjaxSelect } from 'features/ajax-select/AjaxSelect';
import { RichTextEditor } from 'features/rich-text/RichTextEditor';
import { ImageUploader } from 'features/image-uploader/ImageUploader';
import type { BuildingCreateDto, BuildingUpdateDto } from 'entities/building/types';
import type { ImageDto } from 'entities/image/types';
import { ROUTES } from 'shared/config/routes';

const BUILDING_CATEGORIES = [
  {
    value: 'administrative',
    label: 'Общественные и административные здания',
    subcategories: [
      { value: 'governmental', label: 'Государственные учреждения' },
      { value: 'banks', label: 'Банки и страховые общества' },
      { value: 'organizations', label: 'Общественные организации' },
      { value: 'commercial', label: 'Коммерческие объекты' },
      { value: 'medical', label: 'Медицинские учреждения' },
    ],
  },
  {
    value: 'cultural',
    label: 'Культурные и исторические объекты',
    subcategories: [
      { value: 'museums', label: 'Музеи и галереи' },
      { value: 'theaters', label: 'Театры и концертные залы' },
      { value: 'monuments', label: 'Памятники и мемориалы' },
    ],
  },
  {
    value: 'religious',
    label: 'Религиозные сооружения',
    subcategories: [
      { value: 'churches', label: 'Церкви и соборы' },
      { value: 'chapels', label: 'Часовни' },
    ],
  },
  {
    value: 'residential',
    label: 'Жилые и доходные дома',
    subcategories: [
      { value: 'mansions', label: 'Особняки и усадьбы' },
      { value: 'apartments', label: 'Доходные дома' },
    ],
  },
  {
    value: 'educational',
    label: 'Учебные заведения',
    subcategories: [
      { value: 'universities', label: 'Университеты и институты' },
      { value: 'schools', label: 'Школы и гимназии' },
    ],
  },
  {
    value: 'industrial',
    label: 'Промышленные и транспортные объекты',
    subcategories: [
      { value: 'factories', label: 'Заводы и фабрики' },
      { value: 'railway', label: 'Железнодорожные объекты' },
      { value: 'infrastructure', label: 'Инфраструктура' },
      { value: 'transport', label: 'Транспорт' },
    ],
  },
  {
    value: 'dachas',
    label: 'Дачи (загородные объекты)',
    subcategories: [
      { value: 'dachas_main', label: 'Загородные резиденции' },
    ],
  },
];

interface Props {
  mode: 'create' | 'edit';
}

export function BuildingEditPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const selectedType = Form.useWatch('building_type', form) as string | undefined;
  const [featuredId, setFeaturedId] = useState<string | null>(null);

  const { data: existing, isLoading } = useBuilding(id ?? '');
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding(id ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (mode === 'edit' && existing) {
      setFeaturedId(existing.featured_image_id ?? null);
    }
  }, [mode, existing?._id]);

  if (mode === 'edit' && isLoading) return <Spin />;

  const initialValues =
    mode === 'edit' && existing
      ? {
          name: existing.name,
          address: existing.address,
          architect: existing.architect,
          years_built: existing.years_built,
          history: existing.history,
          design: existing.design,
          connection_with_benua: existing.connection_with_benua,
          description: existing.description ?? [],
          interesting_facts: existing.interesting_facts ?? [],
          building_type: existing.building_type,
          building_subtype: existing.building_subtype,
          is_published: existing.is_published ?? false,
          connected_persons: existing.connected_persons?.map((p) => p._id) ?? [],
          connected_objects: existing.connected_objects?.map((o) => o._id) ?? [],
          images: existing.images ?? [],
          featured_image_id: existing.featured_image_id ?? null,
          sources: existing.sources?.map((s) => ({ text: s.text, url: s.url })) ?? [],
          authors: existing.authors ?? [],
        }
      : {
          is_published: false,
          description: [],
          interesting_facts: [],
          images: [],
          featured_image_id: null,
          sources: [],
          authors: [],
        };

  const onFinish = async (values: Record<string, unknown>) => {
    const uploadedImages = (values.images as ImageDto[] | undefined) ?? [];
    const imageIds = uploadedImages.map((img) => img._id);
    const featuredImageId = featuredId;

    try {
      if (mode === 'create') {
        const dto: BuildingCreateDto = {
          name: values.name as string,
          address: values.address as string | undefined,
          architect: values.architect as string | undefined,
          years_built: values.years_built as string | undefined,
          history: values.history as string | undefined,
          design: values.design as string | undefined,
          connection_with_benua: values.connection_with_benua as string | undefined,
          description: values.description as BuildingCreateDto['description'],
          interesting_facts: values.interesting_facts as string[] | undefined,
          building_type: values.building_type as string | undefined,
          building_subtype: values.building_subtype as string | undefined,
          is_published: values.is_published as boolean,
          connected_persons: values.connected_persons as string[] | undefined,
          connected_objects: values.connected_objects as string[] | undefined,
          image_ids: imageIds,
          featured_image_id: featuredImageId ?? undefined,
          sources: (values.sources as { text?: string; url?: string }[] | undefined)
            ?.filter((s) => s?.text || s?.url)
            .map((s) => ({ text: s.text ?? '', url: s.url ?? '' })),
          authors: (values.authors as string[] | undefined)?.filter(Boolean),
        };
        await createMutation.mutateAsync(dto);
        message.success('Объект создан');
      } else {
        const dto: BuildingUpdateDto = {
          name: values.name as string,
          address: values.address as string | undefined,
          architect: values.architect as string | undefined,
          years_built: values.years_built as string | undefined,
          history: values.history as string | undefined,
          design: values.design as string | undefined,
          connection_with_benua: values.connection_with_benua as string | undefined,
          description: values.description as BuildingUpdateDto['description'],
          interesting_facts: values.interesting_facts as string[] | undefined,
          building_type: values.building_type as string | undefined,
          building_subtype: values.building_subtype as string | undefined,
          is_published: values.is_published as boolean,
          connected_persons: values.connected_persons as string[] | undefined,
          connected_objects: values.connected_objects as string[] | undefined,
          image_ids: imageIds,
          featured_image_id: featuredImageId ?? undefined,
          sources: (values.sources as { text?: string; url?: string }[] | undefined)
            ?.filter((s) => s?.text || s?.url)
            .map((s) => ({ text: s.text ?? '', url: s.url ?? '' })),
          authors: (values.authors as string[] | undefined)?.filter(Boolean),
        };
        await updateMutation.mutateAsync(dto);
        message.success('Объект обновлён');
      }
      navigate(ROUTES.BUILDINGS);
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  return (
    <>
      <Typography.Title level={3}>
        {mode === 'create' ? 'Новый объект' : 'Редактирование объекта'}
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
      >
        <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Адрес">
          <Input />
        </Form.Item>
        <Form.Item name="architect" label="Архитектор">
          <Input />
        </Form.Item>
        <Form.Item name="years_built" label="Годы постройки">
          <Input placeholder="1840–1854" />
        </Form.Item>
        <Form.Item name="history" label="История">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="design" label="Описание архитектуры">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="connection_with_benua" label="Связь с Бенуа">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Divider>Разделы описания</Divider>
        <Form.List name="description">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="start" style={{ display: 'flex', marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <Form.Item name={[name, 'topic']} label="Тема раздела" rules={[{ required: true }]}>
                      <Input placeholder="Архитектура" style={{ width: 280 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'content']} label="Содержание">
                      <RichTextEditor />
                    </Form.Item>
                  </div>
                  <MinusCircleOutlined
                    style={{ marginTop: 38, color: '#ff4d4f' }}
                    onClick={() => remove(name)}
                  />
                </Space>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить раздел
              </Button>
            </>
          )}
        </Form.List>

        <Divider>Интересные факты</Divider>
        <Form.List name="interesting_facts">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item name={name} style={{ flex: 1, marginBottom: 0 }}>
                    <Input placeholder="Интересный факт..." style={{ width: 540 }} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ color: '#ff4d4f' }} onClick={() => remove(name)} />
                </Space>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить факт
              </Button>
            </>
          )}
        </Form.List>

        <Divider>Категория здания</Divider>
        <Form.Item name="building_type" label="Тип здания">
          <Select
            allowClear
            placeholder="Выберите тип..."
            options={BUILDING_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            onChange={() => form.setFieldValue('building_subtype', undefined)}
          />
        </Form.Item>
        <Form.Item name="building_subtype" label="Подтип здания">
          <Select
            allowClear
            placeholder="Выберите подтип..."
            disabled={!selectedType}
            options={
              (BUILDING_CATEGORIES.find((c) => c.value === selectedType)?.subcategories ?? []).map(
                (s) => ({ value: s.value, label: s.label })
              )
            }
          />
        </Form.Item>

        {/* ── Фотографии ── */}
        <Divider>Фотографии</Divider>
        <Form.Item name="images">
          <ImageUploader
            featuredImageId={featuredId}
            onFeaturedChange={setFeaturedId}
          />
        </Form.Item>

        {/* ── Источники ── */}
        <Divider>Источники</Divider>
        <Form.List name="sources">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item name={[name, 'text']} style={{ marginBottom: 0, width: 340 }}>
                    <Input placeholder="Название источника" />
                  </Form.Item>
                  <Form.Item name={[name, 'url']} style={{ marginBottom: 0, width: 280 }}>
                    <Input placeholder="https://..." />
                  </Form.Item>
                  <MinusCircleOutlined style={{ color: '#ff4d4f' }} onClick={() => remove(name)} />
                </Space>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить источник
              </Button>
            </>
          )}
        </Form.List>

        {/* ── Авторы ── */}
        <Divider>Авторы (поиск и отбор информации)</Divider>
        <Form.List name="authors">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item name={name} style={{ flex: 1, marginBottom: 0 }}>
                    <Input placeholder="Фамилия Имя..." style={{ width: 400 }} />
                  </Form.Item>
                  <MinusCircleOutlined style={{ color: '#ff4d4f' }} onClick={() => remove(name)} />
                </Space>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить автора
              </Button>
            </>
          )}
        </Form.List>

        <Divider />
        <Form.Item name="is_published" label="Опубликовано" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="connected_persons" label="Связанные персоны">
          <AjaxSelect endpoint="/persons" mode="multiple" placeholder="Найти персону..." />
        </Form.Item>
        <Form.Item name="connected_objects" label="Связанные объекты">
          <AjaxSelect endpoint="/objects" mode="multiple" placeholder="Найти объект..." />
        </Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Сохранить
          </Button>
          <Button onClick={() => navigate(ROUTES.BUILDINGS)}>Отмена</Button>
        </Space>
      </Form>
    </>
  );
}
