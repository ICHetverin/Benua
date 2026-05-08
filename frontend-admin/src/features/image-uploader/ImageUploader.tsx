import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { imageApi } from 'entities/image/api';
import type { ImageDto } from 'entities/image/types';

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
  }));

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const uploaded = await imageApi.upload(file as File);
      onChange?.([...value, uploaded]);
      onSuccess?.(uploaded);
    } catch (err) {
      message.error('Ошибка загрузки файла');
      onError?.(err as Error);
    }
  };

  const handleRemove = async (file: UploadFile) => {
    try {
      await imageApi.delete(file.uid);
      onChange?.(value.filter((img) => img._id !== file.uid));
    } catch {
      message.error('Ошибка удаления файла');
    }
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      customRequest={handleUpload}
      onRemove={handleRemove}
      accept="image/jpeg,image/png,image/webp"
      maxCount={maxCount}
    >
      {(!maxCount || fileList.length < maxCount) && (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Загрузить</div>
        </div>
      )}
    </Upload>
  );
}
