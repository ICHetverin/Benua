import { Link } from "react-router-dom";
import { useExcursions } from "entities/excursions";
import { HomeExcursionCard } from "./HomeExcursionCard";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import styles from "./ExcursionsSection.module.css";

export const ExcursionsSection = () => {
  const { data: excursions = [], isLoading } = useExcursions();
  const preview = excursions.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Экскурсии</h2>
            <p className={styles.subtitle}>
              Музейно-туристская база из четырёх команд предлагает 8 экскурсий с гидом.
            </p>
          </div>
          <Link to="/excursions" className={styles.seeAllLink}>
            Смотреть все экскурсии <ArrowIcon width={14} height={14} />
          </Link>
        </div>

        {isLoading ? (
          <p className={styles.loading}>Загрузка...</p>
        ) : (
          <div className={styles.list}>
            {preview.map((excursion) => (
              <HomeExcursionCard key={excursion._id} excursion={excursion} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
