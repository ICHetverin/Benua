import { Switch, Tooltip } from 'antd';

interface Props {
  value: boolean;
  loading?: boolean;
  onChange: (value: boolean) => void;
}

export function PublishToggle({ value, loading, onChange }: Props) {
  return (
    <Tooltip title={value ? 'Опубликовано' : 'Черновик'}>
      <Switch
        checked={value}
        loading={loading}
        onChange={onChange}
        checkedChildren="Опубл."
        unCheckedChildren="Черн."
      />
    </Tooltip>
  );
}
