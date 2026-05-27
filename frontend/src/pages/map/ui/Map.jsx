import { YandexMap } from 'widgets/yandex-map';
import styles from './Map.module.css';

export const Map = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Интерактивная карта</h1>
        <p className={styles.subtitle}>
          Здания и места, связанные с семьёй Бенуа в&nbsp;Санкт-Петербурге
        </p>
      </div>
      <YandexMap />
    </div>
  );
};
