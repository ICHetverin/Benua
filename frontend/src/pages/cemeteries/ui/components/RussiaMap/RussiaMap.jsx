import russiaSvg from "shared/assets/images/russia.svg";
import styles from "./RussiaMap.module.css";

export function RussiaMap() {
  return (
    <div className={styles.mapWrapper}>
      <img
        src={russiaSvg}
        alt="Карта России"
        className={styles.russiaImg}
        draggable={false}
      />
    </div>
  );
}
