import styles from "./RussiaMap.module.css";

export function RussiaMap() {
  return (
    <div className={styles.mapWrapper}>
      <img
        src={`${process.env.PUBLIC_URL}/russia.svg`}
        alt="Карта России"
        className={styles.russiaImg}
        draggable={false}
      />
    </div>
  );
}
