import { Select } from 'antd';
import { useState, useRef, useCallback } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
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

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
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

  const { data: searchResults, isFetching } = useQuery({
    queryKey: [endpoint, 'search', search],
    queryFn: () => adminApi.get<Record<string, string>[]>(endpoint, { params: { search, size: 20 } }),
    select: (res): Option[] => res.map((item) => ({ value: item._id, label: item[labelField] })),
  });

  // Pre-load labels for already-selected IDs so editing shows names, not raw IDs
  const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
  const preloadQueries = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: [endpoint, 'item', id],
      queryFn: () => adminApi.get<Record<string, string>>(`${endpoint}/${id}`),
      select: (res: Record<string, string>): Option => ({ value: res._id, label: res[labelField] }),
      staleTime: Infinity,
    })),
  });

  const preloadedOptions: Option[] = preloadQueries
    .map((q) => q.data)
    .filter((d): d is Option => d != null);

  // Merge: preloaded first, then search results (deduplicate by value)
  const searchOptions = searchResults ?? [];
  const merged = [
    ...preloadedOptions,
    ...searchOptions.filter((o) => !preloadedOptions.some((p) => p.value === o.value)),
  ];

  const debouncedSetSearch = useRef(debounce((v: string) => setSearch(v), 300)).current;
  const handleSearch = useCallback((v: string) => debouncedSetSearch(v), [debouncedSetSearch]);

  return (
    <Select
      mode={mode}
      value={value}
      onChange={onChange as (v: string | string[]) => void}
      options={merged}
      loading={isFetching}
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      placeholder={placeholder}
      allowClear
      style={{ width: '100%' }}
    />
  );
}
