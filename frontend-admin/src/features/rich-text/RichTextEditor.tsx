import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button, Space } from 'antd';
import { BoldOutlined, ItalicOutlined } from '@ant-design/icons';

interface Props {
  value?: string;
  onChange?: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: value ?? '',
    onUpdate: ({ editor: e }) => onChange?.(e.getHTML()),
  });

  if (!editor) return null;

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
      <Space style={{ padding: '4px 8px', borderBottom: '1px solid #d9d9d9' }}>
        <Button
          size="small"
          type={editor.isActive('bold') ? 'primary' : 'default'}
          icon={<BoldOutlined />}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        />
        <Button
          size="small"
          type={editor.isActive('italic') ? 'primary' : 'default'}
          icon={<ItalicOutlined />}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        />
        <Button
          size="small"
          type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        >
          H2
        </Button>
        <Button
          size="small"
          type={editor.isActive('bulletList') ? 'primary' : 'default'}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        >
          UL
        </Button>
      </Space>
      <EditorContent editor={editor} style={{ padding: '8px 12px', minHeight: 120 }} />
    </div>
  );
}
