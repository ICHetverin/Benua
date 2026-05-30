import { useState } from 'react';
import { Upload, Button, Space, message } from 'antd';
import { InboxOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { uploadMultipart } from 'shared/api/adminApi';

const { Dragger } = Upload;

interface Props {
  value?: string;
  onChange?: (url: string | undefined) => void;
  /** Backend endpoint, e.g. "/admin/images" or "/admin/files/audio" */
  endpoint: string;
  /** Key to extract URL from upload response, e.g. "url_to_s3" or "url" */
  responseKey: string;
  /** Accepted MIME types and/or extensions, passed to <input accept> and Upload */
  accept?: string;
  /** Short hint shown in the drop zone */
  hint?: string;
}

export function FileUploader({ value, onChange, endpoint, responseKey, accept, hint }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError, onProgress }) => {
    const fd = new FormData();
    fd.append('file', file as File);
    setUploading(true);
    onProgress?.({ percent: 20 });
    try {
      const res = await uploadMultipart<Record<string, string>>(endpoint, fd);
      onProgress?.({ percent: 100 });
      onChange?.(res[responseKey]);
      onSuccess?.(res);
    } catch {
      message.error('Ошибка загрузки файла');
      onError?.(new Error('upload failed'));
    } finally {
      setUploading(false);
    }
  };

  if (value) {
    const fileName = value.split('/').pop() ?? value;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          background: '#fafafa',
        }}
      >
        <LinkOutlined style={{ color: '#1677ff', flexShrink: 0 }} />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 13,
            color: '#1677ff',
          }}
          title={value}
        >
          {fileName}
        </a>
        <Space size={6}>
          <Button
            size="small"
            onClick={() => {
              // Replace: allow uploading a new file
              onChange?.(undefined);
            }}
          >
            Заменить
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onChange?.(undefined)}
          />
        </Space>
      </div>
    );
  }

  return (
    <Dragger
      customRequest={handleUpload}
      accept={accept}
      multiple={false}
      showUploadList={false}
      disabled={uploading}
      style={{ padding: '8px 0' }}
    >
      <p className="ant-upload-drag-icon" style={{ marginBottom: 4 }}>
        <InboxOutlined />
      </p>
      <p className="ant-upload-text" style={{ fontSize: 14 }}>
        {uploading ? 'Загрузка...' : 'Перетащите файл или нажмите для выбора'}
      </p>
      {hint && (
        <p className="ant-upload-hint" style={{ fontSize: 12 }}>
          {hint}
        </p>
      )}
    </Dragger>
  );
}
