import { Link } from "react-router-dom";
import styles from "./InfographicsSection.module.css";

const INFOGRAPHICS = [
  {
    id: 1,
    title: "Серебрякова З. Б.",
    subtitle: "Зинаида Евгеньевна Серебрякова",
    modifier: "serebryakova",
  },
  {
    id: 2,
    title: "Гербовник семьи Бенуа",
    subtitle: "Знаковое семейство",
    modifier: "gerb",
  },
  {
    id: 3,
    title: "Театральный мир",
    subtitle: "Театральный мир",
    modifier: "theater",
  },
];

export const InfographicsSection = () => {
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
          <Link to="/catalog" className={styles.seeAllLink}>
            Смотреть все инфографики →
          </Link>
        </div>

        <div className={styles.grid}>
          {INFOGRAPHICS.map((item) => (
            <article key={item.id} className={`${styles.card} ${styles[item.modifier]}`}>
              <div className={styles.cardImageWrapper}>
                <div className={styles.cardImagePlaceholder} />
              </div>
              <div className={styles.cardFooter}>
                <p className={styles.cardTitle}>{item.title.toUpperCase()}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
