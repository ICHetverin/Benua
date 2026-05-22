import { Link } from "react-router-dom";
import { usePersons } from "entities/person";
import { useObjects } from "entities/object";
import styles from "./PersonsObjectsSection.module.css";

export const PersonsObjectsSection = () => {
  const { data: persons = [] } = usePersons();
  const { data: objects = [] } = useObjects();

  const personsData = Array.isArray(persons) ? persons : persons.data ?? [];
  const objectsData = Array.isArray(objects) ? objects : objects.data ?? [];

  const firstPersonImage = personsData[0]?.images?.[0]?.url_to_s3;
  const firstObjectImage = objectsData[0]?.images?.[0]?.url_to_s3;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Персоны и объекты</h2>
        <div className={styles.grid}>
          <Link
            to="/persons"
            className={`${styles.card} ${styles.persons}`}
            style={firstPersonImage ? { backgroundImage: `url(${firstPersonImage})` } : undefined}
          >
            <div className={styles.overlay} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>История семьи в лицах</h3>
              <p className={styles.cardDescription}>
                Здесь вы найдёте исчерпывающее досье семьи Бенуа в биографиях
                и лицах самых известных представителей династии.
              </p>
            </div>
          </Link>

          <Link
            to="/objects"
            className={`${styles.card} ${styles.objects}`}
            style={firstObjectImage ? { backgroundImage: `url(${firstObjectImage})` } : undefined}
          >
            <div className={styles.overlay} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Здания, связанные с семьёй</h3>
              <p className={styles.cardDescription}>
                Подробнее о зданиях, связанных с семьёй Бенуа Вы можете
                прочитать в карточках объектов, нанесённых на карту.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
