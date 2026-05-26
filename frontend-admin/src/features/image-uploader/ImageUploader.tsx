/**
 * ImageUploader — компонент загрузки и управления изображениями.
 *
 * Поведение:
 * - Drag & drop зона для загрузки новых файлов в S3 (POST /admin/images)
 * - Открепить фото = убрать из списка сущности, файл в S3 НЕ удаляется
 * - Переименовать = inline-редактирование → PATCH /admin/images/{id}
 * - Основное фото = звёздочка, сохраняется через featuredImageId / onFeaturedChange
 */

import { useState } from 'react';
import { Upload, Input, Space, Tag, Tooltip, Popconfirm, message, Spin } from 'antd';
import {
  InboxOutlined,
  StarFilled,
  DisconnectOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { imageApi } from 'entities/image/api';
import type { ImageDto } from 'entities/image/types';

const { Dragger } = Upload;

// ─── пропы ──────────────────────────────────────────────────────────────────

interface Props {
  /** Текущий список изображений (управляемый через Form.Item) */
  value?: ImageDto[];
  onChange?: (images: ImageDto[]) => void;
  /** ID основного изображения */
  featuredImageId?: string | null;
  onFeaturedChange?: (id: string | null) => void;
  /** Максимальное количество файлов (undefined = без ограничений) */
  maxCount?: number;
}

// ─── компонент одного изображения ───────────────────────────────────────────

interface ItemProps {
  image: ImageDto;
  isFeatured: boolean;
  onSetFeatured: () => void;
  onUnlink: () => void;
  onRenamed: (updated: ImageDto) => void;
}

function ImageItem({ image, isFeatured, onSetFeatured, onUnlink, onRenamed }: ItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(image.text ?? '');
  const [renaming, setRenaming] = useState(false);

  const commitRename = async () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === image.text) {
      setEditing(false);
      return;
    }
    setRenaming(true);
    try {
      const updated = await imageApi.rename(image._id, trimmed);
      onRenamed(updated);
      setEditing(false);
    } catch {
      message.error('Не удалось переименовать');
    } finally {
      setRenaming(false);
    }
  };

  const cancelRename = () => {
    setEditText(image.text ?? '');
    setEditing(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        marginTop: 8,
        borderRadius: 6,
        border: '1px solid',
        borderColor: isFeatured ? '#faad14' : '#f0f0f0',
        background: isFeatured ? '#fffbe6' : '#fff',
        transition: 'all 0.2s',
      }}
    >
      {/* Превью */}
      <img
        src={image.url_to_s3}
        alt={image.text}
        style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
      />

      {/* Название */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="small"
              value={editText}
              autoFocus
              disabled={renaming}
              onChange={(e) => setEditText(e.target.value)}
              onPressEnter={commitRename}
              style={{ flex: 1 }}
            />
            <Tooltip title="Сохранить">
              <Input.Search
                size="small"
                enterButton={renaming ? <Spin size="small" /> : <CheckOutlined />}
                onSearch={commitRename}
                style={{ width: 36 }}
              />
            </Tooltip>
            <Tooltip title="Отмена">
              <Input.Search
                size="small"
                enterButton={<CloseOutlined />}
                onSearch={cancelRename}
                style={{ width: 36 }}
              />
            </Tooltip>
          </Space.Compact>
        ) : (
          <Space size={4} wrap>
            {isFeatured && (
              <Tag color="gold" icon={<StarFilled />} style={{ margin: 0 }}>
                Основное
              </Tag>
            )}
            <span
              style={{
                maxWidth: 240,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                verticalAlign: 'middle',
                color: '#333',
                fontSize: 13,
              }}
              title={image.text}
            >
              {image.text || '(без названия)'}
            </span>
            <Tooltip title="Переименовать">
              <EditOutlined
                style={{ color: '#aaa', cursor: 'pointer', fontSize: 13 }}
                onClick={() => {
                  setEditText(image.text ?? '');
                  setEditing(true);
                }}
              />
            </Tooltip>
          </Space>
        )}
      </div>

      {/* Действия */}
      <Space size={10} style={{ flexShrink: 0 }}>
        <Tooltip title={isFeatured ? 'Снять как основное' : 'Сделать основным фото'}>
          <StarFilled
            style={{ fontSize: 18, color: isFeatured ? '#faad14' : '#d9d9d9', cursor: 'pointer' }}
            onClick={onSetFeatured}
          />
        </Tooltip>

        <Popconfirm
          title="Открепить фото?"
          description="Файл останется в хранилище S3."
          okText="Открепить"
          okButtonProps={{ danger: true }}
          cancelText="Отмена"
          onConfirm={onUnlink}
        >
          <Tooltip title="Открепить (файл остаётся в S3)">
            <DisconnectOutlined style={{ fontSize: 16, color: '#ff4d4f', cursor: 'pointer' }} />
          </Tooltip>
        </Popconfirm>
      </Space>
    </div>
  );
}

// ─── основной компонент ──────────────────────────────────────────────────────

export function ImageUploader({
  value = [],
  onChange,
  featuredImageId,
  onFeaturedChange,
  maxCount,
}: Props) {
  const atLimit = !!maxCount && value.length >= maxCount;

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

  const handleUnlink = (id: string) => {
    onChange?.(value.filter((img) => img._id !== id));
    // если открепляем основное — сбрасываем featuredImageId
    if (featuredImageId === id) onFeaturedChange?.(null);
  };

  const handleSetFeatured = (id: string) => {
    onFeaturedChange?.(featuredImageId === id ? null : id);
  };

  const handleRenamed = (updated: ImageDto) => {
    onChange?.(value.map((img) => (img._id === updated._id ? updated : img)));
  };

  return (
    <div>
      {/* Зона загрузки */}
      {!atLimit && (
        <Dragger
          customRequest={handleUpload}
          accept="image/jpeg,image/png,image/webp"
          multiple={!maxCount || maxCount > 1}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Перетащите изображения сюда или нажмите для выбора</p>
          <p className="ant-upload-hint">
            JPG, PNG, WebP · до 10 МБ на файл
            {maxCount ? ` · максимум ${maxCount} шт.` : ''}
          </p>
        </Dragger>
      )}

      {/* Список загруженных изображений */}
      {value.map((img) => (
        <ImageItem
          key={img._id}
          image={img}
          isFeatured={featuredImageId === img._id}
          onSetFeatured={() => handleSetFeatured(img._id)}
          onUnlink={() => handleUnlink(img._id)}
          onRenamed={handleRenamed}
        />
      ))}
    </div>
  );
}
