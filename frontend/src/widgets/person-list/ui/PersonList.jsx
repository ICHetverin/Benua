import { PersonCard } from 'entities/persons';
import styles from '../styles/PersonList.module.css';

export function PersonList({ persons }) {
  return (
    <div className={styles.grid}>
      {persons.map(person => (
        <PersonCard
          key={person.id}
          person={person}
        />
      ))}
    </div>
  );
}