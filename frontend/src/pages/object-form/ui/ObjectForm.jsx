import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersons } from 'entities/person';
import { useObjects, useCreateObject } from 'entities/object';
import styles from 'shared/ui/form/Form.module.css';

const EMPTY = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  architect: '',
  years_built: '',
  history: '',
  design: '',
  connection_with_benua: '',
  description: [],
  interesting_facts: [],
  sources: [],
  images: [],
  connected_persons: [],
  connected_objects: [],
};

export function ObjectForm() {
  const [form, setForm] = useState(EMPTY);
  const [step, setStep] = useState('form');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { data: allPersons = [] } = usePersons();
  const { data: allObjects = [] } = useObjects();
  const mutation = useCreateObject();

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
    if (!id) return;
    const next = form.connected_persons.includes(id)
      ? form.connected_persons.filter(x => x !== id)
      : [...form.connected_persons, id];
    set('connected_persons', next);
  };

  const toggleObject = (id) => {
    if (!id) return;
    const next = form.connected_objects.includes(id)
      ? form.connected_objects.filter(x => x !== id)
      : [...form.connected_objects, id];
    set('connected_objects', next);
  };

  const handlePreview = () => {
    if (!form.name.trim()) {
      setError('Поле "Название" обязательно для заполнения');
      return;
    }
    if (!form.address.trim()) {
      setError('Поле "Адрес" обязательно для заполнения');
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
        connected_persons: form.connected_persons.filter(Boolean),
        connected_objects: form.connected_objects.filter(Boolean),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        description: form.description.filter(d => d.topic.trim() || d.content.trim()),
        interesting_facts: form.interesting_facts.filter(f => f.trim()),
        sources: form.sources.filter(s => s.text.trim() && s.url.trim()),
        images: form.images.filter(img => img.url_to_s3.trim()),
      };
      const result = await mutation.mutateAsync(payload);
      navigate(result?._id ? `/objects/${result._id}` : '/objects');
    } catch (e) {
      console.error('ObjectForm submit error:', e);
      setError(e?.message || 'Ошибка при сохранении данных');
      setStep('form');
    }
  };

  if (step === 'preview') {
    return (
      <ObjectPreview
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
      <h1 className={styles.title}>Новый объект</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Название *</label>
          <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Адрес *</label>
          <input className={styles.input} value={form.address} onChange={e => set('address', e.target.value)} />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Широта (latitude)</label>
            <input className={styles.input} type="number" step="0.0001" placeholder="59.9386" value={form.latitude} onChange={e => set('latitude', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Долгота (longitude)</label>
            <input className={styles.input} type="number" step="0.0001" placeholder="30.3141" value={form.longitude} onChange={e => set('longitude', e.target.value)} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Архитектор</label>
            <input className={styles.input} value={form.architect} onChange={e => set('architect', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Годы постройки</label>
            <input className={styles.input} placeholder="1889–1900" value={form.years_built} onChange={e => set('years_built', e.target.value)} />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>История создания</label>
          <textarea className={styles.textarea} rows={4} value={form.history} onChange={e => set('history', e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Дизайн</label>
          <textarea className={styles.textarea} rows={4} value={form.design} onChange={e => set('design', e.target.value)} />
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

function ObjectPreview({ form, allPersons, allObjects, onConfirm, onEdit, isPending, error }) {
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

      <div className={styles.previewSection}>
        {form.address && <p className={styles.previewInfoRow}><span className={styles.previewInfoLabel}>Адрес:</span> {form.address}</p>}
        {form.architect && <p className={styles.previewInfoRow}><span className={styles.previewInfoLabel}>Архитектор:</span> {form.architect}</p>}
        {form.years_built && <p className={styles.previewInfoRow}><span className={styles.previewInfoLabel}>Годы постройки:</span> {form.years_built}</p>}
        {(form.latitude || form.longitude) && (
          <p className={styles.previewInfoRow}><span className={styles.previewInfoLabel}>Координаты:</span> {form.latitude}, {form.longitude}</p>
        )}
      </div>

      {form.history && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>История создания</h3>
          <p className={styles.previewText}>{form.history}</p>
        </div>
      )}

      {form.design && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Дизайн</h3>
          <p className={styles.previewText}>{form.design}</p>
        </div>
      )}

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
