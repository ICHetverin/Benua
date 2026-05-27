import styles from "./PageInfo.module.css";

export function PageInfo() {
  return (
    <section className={styles.info}>
      <div className={styles.layout}>
        {/* Левая колонка: описание страницы */}
        <div className={styles.descriptionCol}>
          <p className={styles.lead}>
            На этой странице мы исследуем последние пристанища представителей
            знаменитой династии Бенуа — архитекторов, художников, музыкантов и
            деятелей культуры, оставивших яркий след в истории России и Европы.
          </p>

          <div className={styles.features}>
            <h3 className={styles.featuresTitle}>Что вы найдёте здесь?</h3>
            <ul className={styles.featuresList}>
              <li>Описание захоронений с указанием кладбища и страны</li>
              <li>Биографические справки о каждом члене семьи</li>
              <li>Исторические фотографии и ссылки на архивные материалы</li>
            </ul>
          </div>
        </div>

        {/* Правая колонка: источники и авторы */}
        <div className={styles.credits}>
          <div className={styles.creditsCol}>
            <h4 className={styles.creditsTitle}>В ходе работы мы использовали:</h4>
            <ul className={styles.creditsList}>
              <li>
                Родословную семьи Бенуа (Ф.Б. Бенуа Родословная Бенуа.&nbsp;
                СПб.: Реноме, 2020. 100 – 229 с.)
              </li>
              <li>Материалы, собранные из карточек сайта</li>
            </ul>
          </div>

          <div className={styles.creditsCol}>
            <h4 className={styles.creditsTitle}>Над базами работали:</h4>
            <ul className={styles.creditsList}>
              <li>Татьянов Богдан Александрович</li>
              <li>Кузнецова Дарья Николаевна</li>
              <li>Тугубова Лидия Васильевна</li>
              <li>Филиппонова Анастасия Андреевна</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
