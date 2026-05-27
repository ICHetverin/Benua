import { useState } from 'react';
import { Form, Input, Button, Space, Typography, message, Spin, Switch, Divider, Table, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useCemetery, useCreateCemetery, useUpdateCemetery } from 'entities/cemetery/queries';
import { useBurials } from 'entities/burial/queries';
import { ImageUploader } from 'features/image-uploader/ImageUploader';
import type { CemeteryCreateDto, CemeteryUpdateDto } from 'entities/cemetery/types';
import type { BurialDto } from 'entities/burial/types';
import type { ImageDto } from 'entities/image/types';
import { ROUTES } from 'shared/config/routes';

interface Props {
  mode: 'create' | 'edit';
}

export function CemeteryEditPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [featuredId, setFeaturedId] = useState<string | null>(null);

  const { data: existing, isLoading } = useCemetery(id ?? '');
  const { data: allBurials } = useBurials();
  const createMutation = useCreateCemetery();
  const updateMutation = useUpdateCemetery(id ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (mode === 'edit' && isLoading) return <Spin />;

  const attachedBurials = (allBurials ?? []).filter(
    (b) => b.region === 'PETERSBURG' && b.cemetery_id === id,
  );

  const initialValues =
    mode === 'edit' && existing
      ? {
          name: existing.name,
          brief_info: existing.brief_info,
          is_published: existing.is_published ?? false,
          images: existing.images ?? [],
        }
      : {
          is_published: false,
          images: [],
        };

  const onFinish = async (values: Record<string, unknown>) => {
    const uploadedImages = (values.images as ImageDto[] | undefined) ?? [];
    const imageIds = uploadedImages.map((img) => img._id);

    try {
      if (mode === 'create') {
        const dto: CemeteryCreateDto = {
          name: values.name as string,
          brief_info: values.brief_info as string | undefined,
          image_ids: imageIds,
        };
        await createMutation.mutateAsync(dto);
        message.success('Кладбище создано');
      } else {
        const dto: CemeteryUpdateDto = {
          name: values.name as string,
          brief_info: values.brief_info as string | undefined,
          image_ids: imageIds,
          is_published: values.is_published as boolean,
        };
        await updateMutation.mutateAsync(dto);
        message.success('Кладбище обновлено');
      }
      navigate(ROUTES.CEMETERIES);
    } catch {
      message.error('Ошибка сохранения');
    }
  };

  const burialColumns = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Годы жизни', dataIndex: 'life_years', key: 'life_years', render: (v?: string) => v ?? '—' },
    {
      title: 'Опубликовано',
      dataIndex: 'is_published',
      key: 'is_published',
      render: (v?: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Да' : 'Нет'}</Tag>,
    },
    {
      title: '',
      key: 'edit',
      render: (_: unknown, record: BurialDto) => (
        <Button size="small" onClick={() => navigate(ROUTES.BURIALS_EDIT(record._id))}>
          Открыть
        </Button>
      ),
    },
  ];

  return (
    <>
      <Typography.Title level={3}>
        {mode === 'create' ? 'Новое кладбище' : 'Редактирование кладбища'}
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
      >
        <Form.Item name="name" label="Название кладбища" rules={[{ required: true, message: 'Введите название' }]}>
          <Input />
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

        {mode === 'edit' && (
          <Form.Item name="is_published" label="Опубликовано" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}

        <Space>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Сохранить
          </Button>
          <Button onClick={() => navigate(ROUTES.CEMETERIES)}>Отмена</Button>
        </Space>
      </Form>

      {mode === 'edit' && (
        <>
          <Divider>Захоронения на этом кладбище ({attachedBurials.length})</Divider>
          <Table
            rowKey="_id"
            columns={burialColumns}
            dataSource={attachedBurials}
            pagination={false}
            size="small"
          />
        </>
      )}
    </>
  );
}
