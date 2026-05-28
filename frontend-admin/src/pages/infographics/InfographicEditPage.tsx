import { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Typography, message, Spin, Switch, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useInfographic, useCreateInfographic, useUpdateInfographic } from 'entities/infographic/queries';
import { AjaxSelect } from 'features/ajax-select/AjaxSelect';
import { ImageUploader } from 'features/image-uploader/ImageUploader';
import type { InfographicCreateDto, InfographicUpdateDto } from 'entities/infographic/types';
import type { ImageDto } from 'entities/image/types';
import { ROUTES } from 'shared/config/routes';

interface Props {
  mode: 'create' | 'edit';
}

export function InfographicEditPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [workFile, setWorkFile] = useState<ImageDto | null>(null);

  const { data: existing, isLoading } = useInfographic(id ?? '');
  const createMutation = useCreateInfographic();
  const updateMutation = useUpdateInfographic(id ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (mode === 'edit' && existing?.file_url) {
      setWorkFile({ _id: '', text: existing.name, url_to_s3: existing.file_url } as ImageDto);
    }
  }, [mode, existing?._id]);

  if (mode === 'edit' && isLoading) return <Spin />;

  const initialValues =
    mode === 'edit' && existing
      ? {
          name: existing.name,
          description: existing.description,
          authors: existing.authors ?? [],
          connected_persons: existing.connected_persons?.map((p) => p._id) ?? [],
          connected_objects: existing.connected_objects?.map((o) => o._id) ?? [],
          sources: existing.sources?.map((s) => ({ text: s.text, url: s.url })) ?? [],
          is_published: existing.is_published ?? false,
        }
      : {
          is_published: false,
          authors: [],
          sources: [],
        };

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      const fileUrl = workFile?.url_to_s3 ?? undefined;

      if (mode === 'create') {
        const dto: InfographicCreateDto = {
          name: values.name as string,
          description: values.description as string | undefined,
          authors: (values.authors as string[] | undefined)?.filter(Boolean),
          connected_persons: values.connected_persons as string[] | undefined,
          connected_objects: values.connected_objects as string[] | undefined,
          sources: (values.sources as { text?: string; url?: string }[] | undefined)
            ?.filter((s) => s?.text || s?.url)
            .map((s) => ({ text: s.text ?? '', url: s.url ?? '' })),
          file_url: fileUrl,
          is_published: values.is_published as boolean,
        };
        await createMutation.mutateAsync(dto);
        message.success('Инфографика создана');
      } else {
        const dto: InfographicUpdateDto = {
          name: values.name as string,
          description: values.description as string | undefined,
          authors: (values.authors as string[] | undefined)?.filter(Boolean),
          connected_persons: values.connected_persons as string[] | undefined,
          connected_objects: values.connected_objects as string[] | undefined,
          sources: (values.sources as { text?: string; url?: string }[] | undefined)
            ?.filter((s) => s?.text || s?.url)
            .map((s) => ({ text: s.text ?? '', url: s.url ?? '' })),
          file_url: fileUrl,
          is_published: values.is_published as boolean,
        };
        await updateMutation.mutateAsync(dto);
        message.success('Инфографика обновлена');
      }
      navigate(ROUTES.INFOGRAPHICS);
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  return (
    <>
      <Typography.Title level={3}>
        {mode === 'create' ? 'Новая инфографика' : 'Редактирование инфографики'}
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

        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* ── Авторы ── */}
        <Divider>Авторы</Divider>
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

        {/* ── Файл работы ── */}
        <Divider>Файл инфографики</Divider>
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Загрузите изображение работы (JPG, PNG, WebP). Один файл.
        </Typography.Text>
        <ImageUploader
          value={workFile ? [workFile] : []}
          onChange={(imgs) => setWorkFile(imgs[0] ?? null)}
          maxCount={1}
        />

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
          <Button onClick={() => navigate(ROUTES.INFOGRAPHICS)}>Отмена</Button>
        </Space>
      </Form>
    </>
  );
}
