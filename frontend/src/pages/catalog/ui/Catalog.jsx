import { useState } from 'react';
import { PersonCard, usePersons } from 'entities/person';
import { ObjectCard, useObjects } from 'entities/object';
import { CatalogGrid } from 'widgets/catalog-grid';
import styles from '../styles/Catalog.module.css';

const TABS = [
  { id: 'persons', label: 'Персоналии' },
  { id: 'objects', label: 'Объекты' },
];

export function Catalog() {
  const [activeTab, setActiveTab] = useState('persons');

  const { data: persons = [], isLoading: personsLoading, isError: personsError } = usePersons();
  const { data: objects = [], isLoading: objectsLoading, isError: objectsError } = useObjects();

  const isLoading = activeTab === 'persons' ? personsLoading : objectsLoading;
  const isError = activeTab === 'persons' ? personsError : objectsError;
  const items = activeTab === 'persons' ? persons : objects;
  const renderCard = activeTab === 'persons'
    ? (person) => <PersonCard key={person._id} person={person} />
    : (obj) => <ObjectCard key={obj._id} object={obj} />;

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <CatalogGrid items={items} renderCard={renderCard} isLoading={isLoading} isError={isError} />
    </div>
  );
}
