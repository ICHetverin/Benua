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
  Switch,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useExcursion, useCreateExcursion, useUpdateExcursion } from 'entities/excursion/queries';
import { AjaxSelect } from 'features/ajax-select/AjaxSelect';
import { FileUploader } from 'features/file-uploader/FileUploader';
import type { ExcursionCreateDto, ExcursionPoint } from 'entities/excursion/types';
import { ROUTES } from 'shared/config/routes';

interface Props {
  mode: 'create' | 'edit';
}

const PASSING_METHOD_OPTIONS = [
  { value: 'on_foot', label: 'Пешком' },
  { value: 'by_bike', label: 'На велосипеде' },
  { value: 'by_car', label: 'На машине' },
  { value: 'by_bus', label: 'На автобусе' },
  { value: 'mixed', label: 'Смешанная' },
];

/* ── Inline file upload input ── */
interface FileInputProps {
  value?: string;
  onChange?: (url: string) => void;
  endpoint: string;
  responseKey: string;
  accept: string;
  placeholder?: string;
  maxSizeMb?: number;
}

function FileInput({ value, onChange, endpoint, responseKey, accept, placeholder, maxSizeMb }: FileInputProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      message.error(`Файл слишком большой. Максимальный размер: ${maxSizeMb} МБ`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await uploadMultipart<Record<string, string>>(endpoint, fd);
      onChange?.(res[responseKey]);
    } catch (err: unknown) {
      const detail = (err as { detail?: string })?.detail;
      message.error(detail ?? 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1 }}
      />
      <Button loading={uploading} icon={<UploadOutlined />} onClick={() => inputRef.current?.click()}>
        {uploading ? '' : 'Загрузить'}
      </Button>
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleFile} />
    </Space.Compact>
  );
}

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
          passing_methods: existing.passing_methods ?? [],
          cover_photo: existing.cover_photo,
          route_photo: existing.route_photo,
          sources: existing.sources ?? [],
          points: (existing.points ?? []).map((p) => ({
            ...p,
            photo_urls: p.photo_urls ?? [],
          })),
          audio_url: existing.audio_url,
          authors: existing.authors ?? [],
          is_published: existing.is_published ?? false,
        }
      : { passing_methods: [], sources: [], points: [], authors: [], is_published: false };

  const onFinish = async (values: Record<string, unknown>) => {
    const dto: ExcursionCreateDto = {
      name: values.name as string,
      description: values.description as string | undefined,
      time: values.time as string | undefined,
      passing_methods: values.passing_methods as string[] | undefined,
      cover_photo: values.cover_photo as string | undefined,
      route_photo: values.route_photo as string | undefined,
      sources: (values.sources as { source?: string; url?: string }[] | undefined)
        ?.filter((s) => s?.source || s?.url)
        .map((s) => ({ source: s.source ?? '', url: s.url ?? '' })),
      points: (values.points as Partial<ExcursionPoint>[] | undefined)
        ?.filter((p) => p?.address)
        .map((p) => ({
          address: p.address ?? '',
          object_id: p.object_id || undefined,
          description: p.description || undefined,
          photo_urls: (p.photo_urls as string[] | undefined)?.filter(Boolean) ?? [],
          audio_url: p.audio_url || undefined,
          lat: p.lat ?? undefined,
          lng: p.lng ?? undefined,
        })),
      audio_url: values.audio_url as string | undefined,
      authors: (values.authors as string[] | undefined)?.filter(Boolean),
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
          <Form.Item name="time" label="Время прохождения" style={{ width: 200 }}>
            <Input placeholder="2,5 часа" />
          </Form.Item>
          <Form.Item name="passing_methods" label="Способ проведения" style={{ width: 380 }}>
            <Select mode="multiple" options={PASSING_METHOD_OPTIONS} placeholder="Выбрать..." />
          </Form.Item>
        </Space>

        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={5} />
        </Form.Item>

        {/* ── Аудиогид (один на всю экскурсию) ── */}
        <Divider>Аудиогид</Divider>
        <Form.Item name="audio_url" label="Аудиофайл">
          <FileUploader
            endpoint="/admin/files/audio"
            responseKey="url"
            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac"
            placeholder="URL аудио или загрузите файл"
            maxSizeMb={15}
          />
        </Form.Item>

        {/* ── Точки маршрута ── */}
        <Divider>Точки маршрута</Divider>
        <Form.List name="points">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div
                  key={key}
                  style={{ marginBottom: 16, padding: 16, background: '#fafafa', borderRadius: 6, border: '1px solid #e8e8e8' }}
                >
                  <Space align="start" style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Typography.Text strong>Точка {name + 1}</Typography.Text>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                  </Space>

                  <Form.Item name={[name, 'address']} label="Адрес" rules={[{ required: true, message: 'Укажите адрес' }]}>
                    <Input placeholder="ул. Пушкина, д. 1" />
                  </Form.Item>

                  <Form.Item name={[name, 'object_id']} label="Связанный объект">
                    <AjaxSelect endpoint="/objects" placeholder="Найти объект..." />
                  </Form.Item>

                  <Form.Item name={[name, 'description']} label="Описание точки">
                    <Input.TextArea rows={3} />
                  </Form.Item>

                  {/* ── Аудиогид точки ── */}
                  <Form.Item name={[name, 'audio_url']} label="Аудиогид точки">
                    <FileUploader
                      endpoint="/admin/files/audio"
                      responseKey="url"
                      accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac"
                      placeholder="URL аудио или загрузите файл"
                      maxSizeMb={15}
                    />
                  </Form.Item>

                  {/* ── Координаты ── */}
                  <Space align="start">
                    <Form.Item name={[name, 'lat']} label="Широта">
                      <InputNumber placeholder="59.9500" step={0.0001} style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'lng']} label="Долгота">
                      <InputNumber placeholder="30.3167" step={0.0001} style={{ width: 180 }} />
                    </Form.Item>
                  </Space>

                  {/* ── Фотографии точки ── */}
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>Фотографии</Typography.Text>
                  <Form.List name={[name, 'photo_urls']}>
                    {(photoFields, { add: addPhoto, remove: removePhoto }) => (
                      <div style={{ marginTop: 6 }}>
                        {photoFields.map(({ key: pk, name: pn }) => (
                          <Space key={pk} align="baseline" style={{ display: 'flex', marginBottom: 6 }}>
                            <Form.Item name={pn} style={{ flex: 1, marginBottom: 0, width: 560 }}>
                              <FileUploader
                                endpoint="/admin/images"
                                responseKey="url_to_s3"
                                accept={IMAGE_ACCEPT}
                                hint="JPG, PNG, WebP · до 10 МБ"
                              />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removePhoto(pn)} style={{ color: '#ff4d4f' }} />
                          </Space>
                        ))}
                        <Button size="small" icon={<PlusOutlined />} onClick={() => addPhoto('')}>
                          Добавить фото
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </div>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add({ photo_urls: [] })} size="small">
                Добавить точку
              </Button>
            </>
          )}
        </Form.List>

        {/* ── Фото обложки / маршрута ── */}
        <Divider>Обложка</Divider>
        <Form.Item name="cover_photo" label="Фото обложки">
          <FileUploader
            endpoint="/admin/images"
            responseKey="url_to_s3"
            accept={IMAGE_ACCEPT}
            hint="JPG, PNG, WebP · до 10 МБ"
          />
        </Form.Item>
        <Form.Item name="route_photo" label="Фото маршрута">
          <FileUploader
            endpoint="/admin/images"
            responseKey="url_to_s3"
            accept={IMAGE_ACCEPT}
            hint="JPG, PNG, WebP · до 10 МБ"
          />
        </Form.Item>

        {/* ── Источники ── */}
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
