import { Upload, Space, Tooltip, Popconfirm, message, Tag } from 'antd';
import { InboxOutlined, FilePdfOutlined, PictureOutlined, DisconnectOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { infographicFileApi } from 'entities/infographic/infographicFileApi';
import type { InfographicFileDto } from 'entities/infographic/types';

const { Dragger } = Upload;

interface Props {
  value?: InfographicFileDto[];
  onChange?: (files: InfographicFileDto[]) => void;
}

function FileItem({
  file,
  onRemove,
}: {
  file: InfographicFileDto;
  onRemove: () => void;
}) {
  const fileName = file.key?.split('/').pop() ?? file.url.split('/').pop() ?? 'файл';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        marginTop: 8,
        borderRadius: 6,
        border: '1px solid #f0f0f0',
        background: '#fff',
      }}
    >
      {file.type === 'PDF' ? (
        <FilePdfOutlined style={{ fontSize: 40, color: '#ff4d4f', flexShrink: 0 }} />
      ) : (
        <img
          src={file.url}
          alt={fileName}
          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <Space size={6} wrap>
          <Tag color={file.type === 'PDF' ? 'red' : 'blue'} style={{ margin: 0 }}>
            {file.type === 'PDF' ? 'PDF' : 'Фото'}
          </Tag>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              maxWidth: 280,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              verticalAlign: 'middle',
              fontSize: 13,
              color: '#1677ff',
            }}
            title={file.url}
          >
            {fileName}
          </a>
        </Space>
      </div>

      <Popconfirm
        title="Открепить файл?"
        description="Файл останется в хранилище S3."
        okText="Открепить"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
        onConfirm={onRemove}
      >
        <Tooltip title="Открепить (файл остаётся в S3)">
          <DisconnectOutlined style={{ fontSize: 16, color: '#ff4d4f', cursor: 'pointer', flexShrink: 0 }} />
        </Tooltip>
      </Popconfirm>
    </div>
  );
}

export function InfographicFilesUploader({ value = [], onChange }: Props) {
  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError, onProgress }) => {
    try {
      onProgress?.({ percent: 20 });
      const uploaded = await infographicFileApi.upload(file as File);
      onProgress?.({ percent: 100 });
      onChange?.([...value, uploaded]);
      onSuccess?.(uploaded);
    } catch {
      message.error('Ошибка загрузки файла');
      onError?.(new Error('upload failed'));
    }
  };

  const handleRemove = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange?.(next);
  };

  return (
    <div>
      <Dragger
        customRequest={handleUpload}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        multiple
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Перетащите файлы сюда или нажмите для выбора</p>
        <p className="ant-upload-hint">
          <PictureOutlined /> JPG, PNG, WebP &nbsp;|&nbsp; <FilePdfOutlined /> PDF · до 20 МБ на файл
        </p>
      </Dragger>

      {value.map((file, idx) => (
        <FileItem key={file.key ?? idx} file={file} onRemove={() => handleRemove(idx)} />
      ))}
    </div>
  );
}
