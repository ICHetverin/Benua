import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersons, useCreatePerson } from 'entities/person';
import { useObjects } from 'entities/object';
import styles from 'shared/ui/form/Form.module.css';

const EMPTY = {
  name: '',
  life_years: '',
  birth_place: '',
  profession: '',
  connection_with_benua: '',
  description: [],
  interesting_facts: [],
  sources: [],
  images: [],
  connected_persons: [],
  connected_objects: [],
};

const STORAGE_KEY = 'personFormDraft';

const normalizeDraft = (draft) => {
  const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
  if (!isPlainObject(draft)) {
    return EMPTY;
  }
  const stringValue = (value) => (typeof value === 'string' ? value : '');
  const listValue = (value) => (Array.isArray(value) ? value : []);
  return {
    ...EMPTY,
    ...draft,
    name: stringValue(draft.name),
    life_years: stringValue(draft.life_years),
    birth_place: stringValue(draft.birth_place),
    profession: stringValue(draft.profession),
    connection_with_benua: stringValue(draft.connection_with_benua),
    description: listValue(draft.description),
    interesting_facts: listValue(draft.interesting_facts),
    sources: listValue(draft.sources),
    images: listValue(draft.images),
    connected_persons: listValue(draft.connected_persons),
    connected_objects: listValue(draft.connected_objects),
  };
};

const loadDraft = () => {
  if (typeof window === 'undefined') {
    return EMPTY;
  }
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return EMPTY;
    }
    return normalizeDraft(JSON.parse(saved));
  } catch (error) {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    console.error('Failed to load saved form data. Starting with empty form.', error);
    return EMPTY;
  }
};

export function PersonForm() {
  const [form, setForm] = useState(loadDraft);
  const formRef = useRef(form);
  const [step, setStep] = useState('form');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { data: allPersons = [] } = usePersons();
  const { data: allObjects = [] } = useObjects();
  const mutation = useCreatePerson();

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handle = window.setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, 500);
    return () => window.clearTimeout(handle);
  }, [form]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleBeforeUnload = () => {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formRef.current));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const addDesc = () => set('description', [...form.description, { topic: '', content: '' }]);
  const setDesc = (i, key, val) => {
    const next = [...form.description];
    next[i] = { ...next[i], [key]: val };
    set('description', next);
  };

  const addFact = () => set('interesting_facts', [...form.interesting_facts, '']);
  const setFact = (i, val) => {
    const next = [...form.interesting_facts];
    next[i] = val;
    set('interesting_facts', next);
  };

  const addSrc = () => set('sources', [...form.sources, { text: '', url: '' }]);
  const setSrc = (i, key, val) => {
    const next = [...form.sources];
    next[i] = { ...next[i], [key]: val };
    set('sources', next);
  };

  const addImg = () => set('images', [...form.images, { text: '', url_to_s3: '' }]);
  const setImg = (i, key, val) => {
    const next = [...form.images];
    next[i] = { ...next[i], [key]: val };
    set('images', next);
  };

  const togglePerson = (id) => {
    const next = form.connected_persons.includes(id)
      ? form.connected_persons.filter(x => x !== id)
      : [...form.connected_persons, id];
    set('connected_persons', next);
  };

  const toggleObject = (id) => {
    const next = form.connected_objects.includes(id)
      ? form.connected_objects.filter(x => x !== id)
      : [...form.connected_objects, id];
    set('connected_objects', next);
  };

  const handlePreview = () => {
    if (!form.name.trim()) {
      setError('Поле "Имя" обязательно для заполнения');
      return;
    }
    setError(null);
    setStep('preview');
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        description: form.description.filter(d => d.topic.trim() || d.content.trim()),
        interesting_facts: form.interesting_facts.filter(f => f.trim()),
        sources: form.sources.filter(s => s.text.trim() && s.url.trim()),
        images: form.images.filter(img => img.url_to_s3.trim()),
      };
      const result = await mutation.mutateAsync(payload);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
      navigate(`/persons/${result._id}`);
    } catch (e) {
      console.error('PersonForm submit error:', e);
      setError(e?.message || 'Ошибка при сохранении данных');
      setStep('form');
    }
  };

  if (step === 'preview') {
    return (
      <PersonPreview
        form={form}
        allPersons={allPersons}
        allObjects={allObjects}
        onConfirm={handleSubmit}
        onEdit={() => setStep('form')}
        isPending={mutation.isPending}
        error={error}
      />
    );
  }

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>← Назад</button>
      <h1 className={styles.title}>Новая персона</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Имя *</label>
          <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Годы жизни</label>
            <input className={styles.input} placeholder="1856–1928" value={form.life_years} onChange={e => set('life_years', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Место рождения</label>
            <input className={styles.input} value={form.birth_place} onChange={e => set('birth_place', e.target.value)} />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Профессия</label>
          <input className={styles.input} value={form.profession} onChange={e => set('profession', e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Связь с Бенуа</label>
          <textarea className={styles.textarea} rows={3} value={form.connection_with_benua} onChange={e => set('connection_with_benua', e.target.value)} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <button type="button" className={styles.addBtn} onClick={addDesc}>+ Добавить</button>
          </div>
          {form.description.map((d, i) => (
            <div key={i} className={styles.listItem}>
              <input className={styles.input} placeholder="Тема" value={d.topic} onChange={e => setDesc(i, 'topic', e.target.value)} />
              <textarea className={styles.textarea} rows={3} placeholder="Содержание" value={d.content} onChange={e => setDesc(i, 'content', e.target.value)} />
              <button type="button" className={styles.removeBtn} onClick={() => set('description', form.description.filter((_, j) => j !== i))}>Удалить</button>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Интересные факты</h2>
            <button type="button" className={styles.addBtn} onClick={addFact}>+ Добавить</button>
          </div>
          {form.interesting_facts.map((fact, i) => (
            <div key={i} className={styles.listItem}>
              <textarea className={styles.textarea} rows={2} value={fact} onChange={e => setFact(i, e.target.value)} />
              <button type="button" className={styles.removeBtn} onClick={() => set('interesting_facts', form.interesting_facts.filter((_, j) => j !== i))}>Удалить</button>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Источники</h2>
            <button type="button" className={styles.addBtn} onClick={addSrc}>+ Добавить</button>
          </div>
          {form.sources.map((src, i) => (
            <div key={i} className={styles.listItem}>
              <input className={styles.input} placeholder="Описание источника" value={src.text} onChange={e => setSrc(i, 'text', e.target.value)} />
              <input className={styles.input} placeholder="URL" value={src.url} onChange={e => setSrc(i, 'url', e.target.value)} />
              <button type="button" className={styles.removeBtn} onClick={() => set('sources', form.sources.filter((_, j) => j !== i))}>Удалить</button>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Изображения</h2>
            <button type="button" className={styles.addBtn} onClick={addImg}>+ Добавить</button>
          </div>
          {form.images.map((img, i) => (
            <div key={i} className={styles.listItem}>
              <input className={styles.input} placeholder="Описание изображения" value={img.text} onChange={e => setImg(i, 'text', e.target.value)} />
              <input className={styles.input} placeholder="URL (https:// или s3://...)" value={img.url_to_s3} onChange={e => setImg(i, 'url_to_s3', e.target.value)} />
              <button type="button" className={styles.removeBtn} onClick={() => set('images', form.images.filter((_, j) => j !== i))}>Удалить</button>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Связанные персоны</h2>
          {allPersons.length === 0
            ? <p className={styles.hint}>Нет доступных персон</p>
            : <div className={styles.chips}>
                {allPersons.map(p => (
                  <button key={p._id} type="button"
                    className={`${styles.chip} ${form.connected_persons.includes(p._id) ? styles.chipActive : ''}`}
                    onClick={() => togglePerson(p._id)}>
                    {p.name}
                  </button>
                ))}
              </div>
          }
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Связанные объекты</h2>
          {allObjects.length === 0
            ? <p className={styles.hint}>Нет доступных объектов</p>
            : <div className={styles.chips}>
                {allObjects.map(obj => (
                  <button key={obj._id} type="button"
                    className={`${styles.chip} ${form.connected_objects.includes(obj._id) ? styles.chipActive : ''}`}
                    onClick={() => toggleObject(obj._id)}>
                    {obj.name}
                  </button>
                ))}
              </div>
          }
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.previewBtn} onClick={handlePreview}>
            Предпросмотр →
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonPreview({ form, allPersons, allObjects, onConfirm, onEdit, isPending, error }) {
  const connectedPersonNames = form.connected_persons
    .map(id => allPersons.find(p => p._id === id)?.name).filter(Boolean);
  const connectedObjectNames = form.connected_objects
    .map(id => allObjects.find(o => o._id === id)?.name).filter(Boolean);

  const cleanDescription = form.description.filter(d => d.topic.trim() || d.content.trim());
  const cleanFacts = form.interesting_facts.filter(f => f.trim());
  const cleanSources = form.sources.filter(s => s.text.trim() && s.url.trim());

  return (
    <div className={styles.page}>
      <div className={styles.previewActions}>
        <button type="button" className={styles.editBtn} onClick={onEdit}>← Редактировать</button>
        <button type="button" className={styles.submitBtn} onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Сохранение...' : 'Данные корректны'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <h1 className={styles.previewName}>{form.name || '—'}</h1>
      {form.life_years && <p className={styles.previewMeta}>{form.life_years}</p>}
      {form.profession && <p className={styles.previewMeta}>{form.profession}</p>}
      {form.birth_place && <p className={styles.previewMeta}>Место рождения: {form.birth_place}</p>}
      {form.connection_with_benua && <p className={styles.previewText}>{form.connection_with_benua}</p>}

      {cleanDescription.length > 0 && (
        <div className={styles.previewSection}>
          {cleanDescription.map((d, i) => (
            <div key={i} className={styles.previewTopic}>
              <h2 className={styles.previewTopicTitle}>{d.topic}</h2>
              <p className={styles.previewTopicContent}>{d.content}</p>
            </div>
          ))}
        </div>
      )}

      {cleanFacts.length > 0 && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Интересные факты</h3>
          <ul className={styles.previewFactsList}>
            {cleanFacts.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      {cleanSources.length > 0 && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Источники</h3>
          <ul className={styles.previewSourcesList}>
            {cleanSources.map((s, i) => (
              <li key={i}>
                <a href={s.url} className={styles.previewSourceLink} target="_blank" rel="noopener noreferrer">{s.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {connectedPersonNames.length > 0 && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Связанные персоны</h3>
          <div className={styles.previewChips}>
            {connectedPersonNames.map((name, i) => <span key={i} className={styles.previewChip}>{name}</span>)}
          </div>
        </div>
      )}

      {connectedObjectNames.length > 0 && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Связанные объекты</h3>
          <div className={styles.previewChips}>
            {connectedObjectNames.map((name, i) => <span key={i} className={styles.previewChip}>{name}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
