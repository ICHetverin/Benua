import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Divider,
  Switch,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useExcursion, useCreateExcursion, useUpdateExcursion } from 'entities/excursion/queries';
import type { ExcursionCreateDto } from 'entities/excursion/types';
import { ROUTES } from 'shared/config/routes';

interface Props {
  mode: 'create' | 'edit';
}

const PASSING_METHOD_OPTIONS = [
  { value: 'on_foot', label: 'Пешая' },
  { value: 'by_bus', label: 'Автобусная' },
  { value: 'mixed', label: 'Смешанная' },
];

export function ExcursionEditPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: existing, isLoading } = useExcursion(id ?? '');
  const createMutation = useCreateExcursion();
  const updateMutation = useUpdateExcursion(id ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (mode === 'edit' && isLoading) return <Spin />;

  const initialValues =
    mode === 'edit' && existing
      ? {
          name: existing.name,
          description: existing.description,
          time: existing.time,
          guide: existing.guide,
          passing_methods: existing.passing_methods ?? [],
          key_points: existing.key_points ?? [],
          text_content: existing.text_content ?? [],
          cover_photo: existing.cover_photo,
          route_photo: existing.route_photo,
          sources: existing.sources ?? [],
          is_published: existing.is_published ?? false,
        }
      : { passing_methods: [], key_points: [], text_content: [], sources: [], is_published: false };

  const onFinish = async (values: Record<string, unknown>) => {
    const dto: ExcursionCreateDto = {
      name: values.name as string,
      description: values.description as string | undefined,
      time: values.time as string | undefined,
      guide: values.guide as string | undefined,
      passing_methods: values.passing_methods as string[] | undefined,
      key_points: (values.key_points as string[] | undefined)?.filter(Boolean),
      text_content: (values.text_content as { topic?: string; content?: string }[] | undefined)
        ?.filter((s) => s?.topic || s?.content)
        .map((s) => ({ topic: s.topic ?? '', content: s.content ?? '' })),
      cover_photo: values.cover_photo as string | undefined,
      route_photo: values.route_photo as string | undefined,
      sources: (values.sources as { source?: string; url?: string }[] | undefined)
        ?.filter((s) => s?.source || s?.url)
        .map((s) => ({ source: s.source ?? '', url: s.url ?? '' })),
      is_published: values.is_published as boolean,
    };
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(dto);
        message.success('Экскурсия создана');
      } else {
        await updateMutation.mutateAsync(dto);
        message.success('Экскурсия обновлена');
      }
      navigate(ROUTES.EXCURSIONS);
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  return (
    <>
      <Typography.Title level={3}>
        {mode === 'create' ? 'Новая экскурсия' : 'Редактирование экскурсии'}
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
      >
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Space style={{ width: '100%' }} align="start">
          <Form.Item name="time" label="Продолжительность" style={{ width: 200 }}>
            <Input placeholder="2,5 часа" />
          </Form.Item>
          <Form.Item name="passing_methods" label="Способ проведения" style={{ width: 280 }}>
            <Select mode="multiple" options={PASSING_METHOD_OPTIONS} placeholder="Выбрать..." />
          </Form.Item>
        </Space>

        <Form.Item name="guide" label="Гид">
          <Input placeholder="Имя гида" />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={5} />
        </Form.Item>

        <Divider>Ключевые точки</Divider>
        <Form.List name="key_points">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 4 }}>
                  <Form.Item name={name} style={{ flex: 1, marginBottom: 0, width: 580 }}>
                    <Input placeholder="Точка маршрута" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить точку
              </Button>
            </>
          )}
        </Form.List>

        <Divider>Текстовый контент</Divider>
        <Form.List name="text_content">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key} style={{ marginBottom: 12, padding: '12px 16px', background: '#fafafa', borderRadius: 6 }}>
                  <Space align="start" style={{ width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <Form.Item name={[name, 'topic']} style={{ marginBottom: 8 }}>
                        <Input placeholder="Заголовок раздела" />
                      </Form.Item>
                      <Form.Item name={[name, 'content']} style={{ marginBottom: 0 }}>
                        <Input.TextArea rows={3} placeholder="Текст раздела" />
                      </Form.Item>
                    </div>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: 8 }} />
                  </Space>
                </div>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить раздел
              </Button>
            </>
          )}
        </Form.List>

        <Divider>Фото</Divider>
        <Space style={{ width: '100%' }} align="start">
          <Form.Item name="cover_photo" label="Фото обложки" style={{ width: 360 }}>
            <Input placeholder="benua_garden.jpg" />
          </Form.Item>
          <Form.Item name="route_photo" label="Фото маршрута" style={{ width: 360 }}>
            <Input placeholder="route_map.jpg" />
          </Form.Item>
        </Space>

        <Divider>Источники</Divider>
        <Form.List name="sources">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item name={[name, 'source']} style={{ marginBottom: 0, width: 340 }}>
                    <Input placeholder="Название источника" />
                  </Form.Item>
                  <Form.Item name={[name, 'url']} style={{ marginBottom: 0, width: 240 }}>
                    <Input placeholder="https://..." />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить источник
              </Button>
            </>
          )}
        </Form.List>

        <Divider />
        <Form.Item name="is_published" label="Опубликовано" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Сохранить
          </Button>
          <Button onClick={() => navigate(ROUTES.EXCURSIONS)}>Отмена</Button>
        </Space>
      </Form>
    </>
  );
}
