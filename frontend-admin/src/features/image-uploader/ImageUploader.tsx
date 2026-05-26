import { Upload, Modal, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { imageApi } from 'entities/image/api';
import type { ImageDto } from 'entities/image/types';

const { Dragger } = Upload;

interface Props {
  value?: ImageDto[];
  onChange?: (images: ImageDto[]) => void;
  maxCount?: number;
}

export function ImageUploader({ value = [], onChange, maxCount }: Props) {
  const fileList: UploadFile[] = value.map((img) => ({
    uid: img._id,
    name: img.text || img._id,
    status: 'done' as const,
    url: img.url_to_s3,
    thumbUrl: img.url_to_s3,
  }));

  const handleUpload: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
    onProgress,
  }) => {
    try {
      onProgress?.({ percent: 20 });
      const uploaded = await imageApi.upload(file as File);
      onProgress?.({ percent: 100 });
      onChange?.([...value, uploaded]);
      onSuccess?.(uploaded);
    } catch (err) {
      message.error('Ошибка загрузки файла');
      onError?.(err as Error);
    }
  };

  const handleRemove = (file: UploadFile): Promise<boolean> =>
    new Promise((resolve) => {
      Modal.confirm({
        title: 'Удалить фото?',
        content: 'Файл будет удалён из хранилища. Это действие необратимо.',
        okText: 'Удалить',
        okButtonProps: { danger: true },
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            await imageApi.delete(file.uid);
            onChange?.(value.filter((img) => img._id !== file.uid));
            resolve(true);
          } catch {
            message.error('Ошибка удаления файла');
            resolve(false);
          }
        },
        onCancel: () => resolve(false),
      });
    });

  const atLimit = !!maxCount && fileList.length >= maxCount;

  return (
    <Dragger
      listType="picture"
      fileList={fileList}
      customRequest={handleUpload}
      onRemove={handleRemove}
      accept="image/jpeg,image/png,image/webp"
      multiple={!maxCount || maxCount > 1}
      disabled={atLimit}
      style={atLimit ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Перетащите изображения сюда или нажмите для выбора
      </p>
      <p className="ant-upload-hint">
        JPG, PNG, WebP · не более 10 МБ на файл
        {maxCount ? ` · максимум ${maxCount} шт.` : ''}
      </p>
    </Dragger>
  );
}
