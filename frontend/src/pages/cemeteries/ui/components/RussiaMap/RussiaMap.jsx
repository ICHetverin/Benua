import { ReactComponent as RussiaSvg } from "shared/assets/images/russia.svg";
import styles from "./RussiaMap.module.css";

export function RussiaMap() {
  return (
    <div className={styles.mapWrapper}>
      <RussiaSvg className={styles.russiaImg} />
    </div>
  );
}
