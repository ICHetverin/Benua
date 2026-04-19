import { useState } from 'react';
import { PersonCard, getPersons } from 'entities/person';
import { ObjectCard, getObjects } from 'entities/object';
import styles from '../styles/Catalog.module.css';

const TABS = [
  { id: 'persons', label: 'Персоналии' },
  { id: 'objects', label: 'Объекты' },
];

export function Catalog() {
  const [activeTab, setActiveTab] = useState('persons');

  const persons = getPersons();
  const objects = getObjects();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Каталог</h1>

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

      <div className={styles.grid}>
        {activeTab === 'persons' &&
          persons.map((person) => <PersonCard key={person.id} person={person} />)}
        {activeTab === 'objects' &&
          objects.map((object) => <ObjectCard key={object.id} object={object} />)}
      </div>
    </div>
  );
}
