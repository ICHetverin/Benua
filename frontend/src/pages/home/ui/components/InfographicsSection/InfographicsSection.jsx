import { Link } from "react-router-dom";
import { useInfographics } from "entities/infographic";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import styles from "./InfographicsSection.module.css";

export const InfographicsSection = () => {
  const { data: infographics = [], isLoading } = useInfographics();
  const preview = infographics.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Инфографика</h2>
            <p className={styles.subtitle}>
              Здесь вы найдёте наглядные постеры с информацией об отдельных деятелях
              из семьи Бенуа и общую образовательную графику по истории династии.
            </p>
          </div>
          <Link to="/infographics" className={styles.seeAllLink}>
            Смотреть все инфографики <ArrowIcon width={14} height={14} />
          </Link>
        </div>

        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <div className={styles.grid}>
            {preview.map((item) => (
              <article key={item._id} className={styles.card}>
                <Link to={`/infographics/${item._id}`} className={styles.cardImageWrapper}>
                  {item.file_url ? (
                    <img
                      src={item.file_url}
                      alt={item.name}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
                </Link>
                <div className={styles.cardFooter}>
                  <p className={styles.cardTitle}>{item.name?.toUpperCase()}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
