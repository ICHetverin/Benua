import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Divider,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useExcursion, useCreateExcursion, useUpdateExcursion } from 'entities/excursion/queries';
import { RichTextEditor } from 'features/rich-text/RichTextEditor';
import { ImageUploader } from 'features/image-uploader/ImageUploader';
import { AjaxSelect } from 'features/ajax-select/AjaxSelect';
import type { ExcursionCreateDto } from 'entities/excursion/types';
import { ROUTES } from 'shared/config/routes';

interface Props {
  mode: 'create' | 'edit';
}

const DAY_OPTIONS = [
  { value: 'MONDAY', label: 'Пн' },
  { value: 'TUESDAY', label: 'Вт' },
  { value: 'WEDNESDAY', label: 'Ср' },
  { value: 'THURSDAY', label: 'Чт' },
  { value: 'FRIDAY', label: 'Пт' },
  { value: 'SATURDAY', label: 'Сб' },
  { value: 'SUNDAY', label: 'Вс' },
];

const MODE_OPTIONS = [
  { value: 'PEDESTRIAN', label: 'Пешая' },
  { value: 'BUS', label: 'Автобусная' },
  { value: 'MIXED', label: 'Смешанная' },
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
          title: existing.title,
          mode: existing.mode,
          duration_minutes: existing.duration_minutes,
          price: existing.price,
          description: existing.description,
          schedule: existing.schedule,
          waypoints: existing.waypoints,
          _images: existing.images ?? [],
          _cover: existing.cover_image ? [existing.cover_image] : [],
          buildings: existing.buildings?.map((b) => b._id),
          guide_id: existing.guide?._id,
        }
      : { mode: 'PEDESTRIAN' };

  const onFinish = async (values: Record<string, unknown>) => {
    const _images = (values._images as { _id: string }[] | undefined) ?? [];
    const _cover = (values._cover as { _id: string }[] | undefined) ?? [];
    const dto: ExcursionCreateDto = {
      title: values.title as string,
      description: values.description as string | undefined,
      duration_minutes: values.duration_minutes as number | undefined,
      mode: values.mode as ExcursionCreateDto['mode'],
      price: values.price as string | undefined,
      schedule: values.schedule as ExcursionCreateDto['schedule'],
      waypoints: values.waypoints as ExcursionCreateDto['waypoints'],
      buildings: values.buildings as string[] | undefined,
      guide_id: values.guide_id as string | undefined,
      image_ids: _images.map((img) => img._id),
      cover_image_id: _cover[0]?._id,
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
        <Form.Item name="title" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="mode" label="Режим" rules={[{ required: true }]}>
          <Select options={MODE_OPTIONS} />
        </Form.Item>
        <Space>
          <Form.Item name="duration_minutes" label="Длительность (мин)">
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="price" label="Стоимость">
            <Input style={{ width: 200 }} placeholder="бесплатно / от 500 ₽" />
          </Form.Item>
        </Space>
        <Form.Item name="description" label="Описание">
          <RichTextEditor />
        </Form.Item>

        <Divider>Расписание</Divider>
        <Form.List name="schedule">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline">
                  <Form.Item name={[name, 'day_of_week']} rules={[{ required: true }]}>
                    <Select options={DAY_OPTIONS} style={{ width: 100 }} placeholder="День" />
                  </Form.Item>
                  <Form.Item name={[name, 'time']} rules={[{ required: true }]}>
                    <Input placeholder="14:00" style={{ width: 100 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add()} size="small">
                Добавить сеанс
              </Button>
            </>
          )}
        </Form.List>

        <Divider>Маршрут (waypoints)</Divider>
        <Form.List name="waypoints">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline">
                  <Form.Item name={[name, 'order']} rules={[{ required: true }]}>
                    <InputNumber placeholder="№" style={{ width: 60 }} />
                  </Form.Item>
                  <Form.Item name={[name, 'lat']} rules={[{ required: true }]}>
                    <InputNumber placeholder="Широта" style={{ width: 130 }} step={0.0001} />
                  </Form.Item>
                  <Form.Item name={[name, 'lng']} rules={[{ required: true }]}>
                    <InputNumber placeholder="Долгота" style={{ width: 130 }} step={0.0001} />
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

        <Divider />
        <Form.Item name="buildings" label="Здания маршрута">
          <AjaxSelect endpoint="/objects" mode="multiple" placeholder="Найти здание..." />
        </Form.Item>
        <Form.Item name="guide_id" label="Гид">
          <AjaxSelect endpoint="/persons" placeholder="Найти персону..." />
        </Form.Item>
        <Form.Item name="_cover" label="Обложка">
          <ImageUploader maxCount={1} />
        </Form.Item>
        <Form.Item name="_images" label="Фотографии">
          <ImageUploader />
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
