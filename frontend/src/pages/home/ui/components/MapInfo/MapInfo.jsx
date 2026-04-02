import styles from "./MapInfo.module.css";
import { RippleButton } from "shared/ui/RippleButton";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import mapPreview from "shared/assets/images/map/map_preview.jpg";

const MAP_CONTENT = {
  title: "Интерактивная карта по местам семьи бенуа в санкт-петербурге",
  description:
    "На карту нанесены здания, построенные архитекторами из семьи Бенуа, а также мест жительства, работы и учебы разных представителей этой обширной династии. Объекты разделены по типам и имеют разные символьные обозначения. Вы легко можете найти интересующие Вас точки, воспользовавшись поиском.",
};

export const MapInfo = () => {
  return (
    <section className={styles.mapInfo}>
      <div className={styles.mapInfoContainer}>
        <h2>{MAP_CONTENT.title}</h2>
        <div className={styles.mapInfoInnerContainer}>
          <div className={styles.mapInfoLeftColumn}>
            <RippleButton
              href="/map"
              className={styles.mapInfoButton}
              spanClassName={styles.customRipple}
            >
              <span className={styles.mapInfoButtonContent}>
                Перейти
                <ArrowIcon
                  width={24}
                  height={24}
                  className={styles.arrowIcon}
                />
              </span>
            </RippleButton>
          </div>
          <div className={styles.mapInfoRightColumn}>
            <p>{MAP_CONTENT.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.mapPictureContainer}>
        <img src={mapPreview} className={styles.mapPreview} alt="mapPreview" />
      </div>
    </section>
  );
};
