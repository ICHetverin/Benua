import { Select } from 'antd';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from 'shared/api/adminApi';

interface Option {
  value: string;
  label: string;
}

interface Props {
  endpoint: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  mode?: 'multiple';
  placeholder?: string;
  labelField?: string;
}

export function AjaxSelect({
  endpoint,
  value,
  onChange,
  mode,
  placeholder = 'Поиск...',
  labelField = 'name',
}: Props) {
  const [search, setSearch] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: [endpoint, 'search', search],
    queryFn: () => adminApi.get<Record<string, string>[]>(endpoint, { params: { search, size: 20 } }),
    select: (res): Option[] => res.map((item) => ({ value: item._id, label: item[labelField] })),
  });

  return (
    <Select
      mode={mode}
      value={value}
      onChange={onChange as (v: string | string[]) => void}
      options={data}
      loading={isFetching}
      showSearch
      filterOption={false}
      onSearch={setSearch}
      placeholder={placeholder}
      allowClear
      style={{ width: '100%' }}
    />
  );
}
