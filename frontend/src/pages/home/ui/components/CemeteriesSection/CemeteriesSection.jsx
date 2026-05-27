import { RippleButton } from "shared/ui/RippleButton";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import styles from "./CemeteriesSection.module.css";

export const CemeteriesSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>Кладбища</h2>
        <div className={styles.innerContainer}>
          <div className={styles.leftColumn}>
            <RippleButton
              href="/cemeteries"
              className={styles.navButton}
              spanClassName={styles.customRipple}
            >
              <span className={styles.navButtonContent}>
                Перейти
                <ArrowIcon width={24} height={24} className={styles.arrowIcon} />
              </span>
            </RippleButton>
          </div>
          <div className={styles.rightColumn}>
            <p className={styles.description}>
              Перечень мест захоронения членов семьи Бенуа на кладбищах
              Санкт-Петербурга, так и в других местах в России и за рубежом.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
