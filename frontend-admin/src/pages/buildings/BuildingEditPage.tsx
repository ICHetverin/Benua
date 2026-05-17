import { Form, Input, Button, Space, Typography, message, Spin, Switch, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useBuilding, useCreateBuilding, useUpdateBuilding } from 'entities/building/queries';
import { ImageUploader } from 'features/image-uploader/ImageUploader';
import { AjaxSelect } from 'features/ajax-select/AjaxSelect';
import { RichTextEditor } from 'features/rich-text/RichTextEditor';
import type { BuildingCreateDto, BuildingUpdateDto } from 'entities/building/types';
import { ROUTES } from 'shared/config/routes';

interface Props {
  mode: 'create' | 'edit';
}

export function BuildingEditPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: existing, isLoading } = useBuilding(id ?? '');
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding(id ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending;

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
          is_published: existing.is_published ?? false,
          _images: existing.images ?? [],
          connected_persons: existing.connected_persons?.map((p) => p._id) ?? [],
          connected_objects: existing.connected_objects?.map((o) => o._id) ?? [],
        }
      : { is_published: false, description: [], interesting_facts: [] };

  const onFinish = async (values: Record<string, unknown>) => {
    const uploadedImages = (values._images as { _id: string; text: string; url_to_s3: string }[]) ?? [];
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
          is_published: values.is_published as boolean,
          connected_persons: values.connected_persons as string[] | undefined,
          connected_objects: values.connected_objects as string[] | undefined,
          images: uploadedImages.map((img) => ({ text: img.text, url_to_s3: img.url_to_s3 })),
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
          is_published: values.is_published as boolean,
          connected_persons: values.connected_persons as string[] | undefined,
          connected_objects: values.connected_objects as string[] | undefined,
          image_ids: uploadedImages.map((img) => img._id),
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

        <Divider />
        <Form.Item name="is_published" label="Опубликовано" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="_images" label="Фотографии">
          <ImageUploader />
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
