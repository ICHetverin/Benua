import { ScrollingImage } from 'shared/ui/ScrollingImage'
import { RippleButton } from 'shared/ui/RippleButton';
import { ArrowIcon } from 'shared/assets/icons/ArrowIcon'
import gallery from '../image1.png'
import fullNameLogo from 'shared/assets/images/logo/full_name_logo.png'
import styles from './Home.module.css';

export function Home() {
  return (
    <>
    <ScrollingImage imageSrc={gallery} speed={140} />

    <section className={styles.generalInfo}>
        <div className={styles.generalInfoContainer}>
          <img
            className={styles.fullNameLogo}
            src={fullNameLogo}
            alt="logo"
          />
          <p className={styles.generalInfoText}>
          Наш проект — онлайн-портал о местах Санкт-Петербурга, связанных с династией Бенуа. Мы визуализируем вклад семьи через интерактивную карту зданий, персоналий и событий, сочетая научную достоверность с современными форматами: 3D-макетами, инфографикой и мультимедиа.
          </p>
        </div>
    </section>

    <section className={styles.mapInfo}>
      <div className={styles.mapInfoContainer}>
        <h2>Интерактивная карта по местам семьи бенуа в санкт-петербурге</h2>
        <div className={styles.mapInfoInnerContainer}>
          <div className={styles.mapInfoLeftColumn}>
              <RippleButton href="/map" className={styles.mapInfoButton}>
              <span className={styles.mapInfoButtonContent}>
                  Перейти
                  <ArrowIcon width={24} height={24} className={styles.arrowIcon}/>
              </span>
              </RippleButton>
          </div>
          <div className={styles.mapInfoRightColumn}>
              <p>
                  На карту нанесены здания, построенные архитекторами из семьи Бенуа,
                  а также мест жительства, работы и учебы разных представителей
                  этой обширной династии. Объекты разделены по типам и имеют разные
                  символьные обозначения. Вы легко можете найти интересующие Вас точки,
                  воспользовавшись поиском.
              </p>
          </div>
        </div>
      </div>
      <div className={styles.mapPictureContainer}>
        map picture
      </div>
    </section>
    </>
  );
}