import styles from './GeneralInfo.module.css';
import fullNameLogo from 'shared/assets/images/logo/full_name_logo.png'

export const GeneralInfo = () => {
    return (
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
    )
}