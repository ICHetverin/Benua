import { ReactComponent as WorldSvg } from "shared/assets/images/world_map.svg";
import styles from "./WorldMap.module.css";

export function WorldMap() {
  return (
    <div className={styles.mapWrapper}>
      <WorldSvg className={styles.worldImg} />
    </div>
  );
}
