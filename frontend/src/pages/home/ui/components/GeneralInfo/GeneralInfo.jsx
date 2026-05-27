import { Link } from "react-router-dom";
import styles from "./GeneralInfo.module.css";
import { ReactComponent as BenuaRedLogo } from "shared/assets/icons/benua_red.svg";

export const GeneralInfo = () => {
  return (
    <section className={styles.generalInfo}>
      <div className={styles.generalInfoContainer}>
        <BenuaRedLogo className={styles.fullNameLogo} />
        <p className={styles.generalInfoText}>
          Наш проект — онлайн-портал о местах Санкт-Петербурга, связанных с
          династией Бенуа. Мы визуализируем вклад семьи через интерактивную
          карту зданий, персоналий и событий, сочетая научную достоверность с
          современными форматами: 3D-макетами, инфографикой и мультимедиа.
        </p>
        <Link to="/about" className={styles.aboutLink}>
          Подробнее о проекте →
        </Link>
      </div>
    </section>
  );
};
