import styles from "./PageInfo.module.css";

export function PageInfo() {
  return (
    <section className={styles.info}>

      {/* ── 1. Вводный текст на всю ширину ── */}
      <p className={styles.lead}>
        На этой странице мы исследуем последние пристанища представителей
        знаменитой династии Бенуа — архитекторов, художников, музыкантов и
        деятелей культуры, оставивших яркий след в истории России и Европы.
      </p>

      {/* ── 2. Что вы найдёте — без выделения ── */}
      <div className={styles.features}>
        <p className={styles.featuresTitle}>Что вы найдёте здесь?</p>
        <ul className={styles.featuresList}>
          <li>Описание захоронений с указанием кладбища и страны</li>
          <li>Биографические справки о каждом члене семьи</li>
          <li>Исторические фотографии и ссылки на архивные материалы</li>
        </ul>
      </div>

      {/* ── 3. Два блока в карточках ── */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>В ходе работы мы использовали:</h4>
          <ul className={styles.cardList}>
            <li>
              Родословную семьи Бенуа (Ф.Б. Бенуа Родословная Бенуа.&nbsp;
              СПб.: Реноме, 2020. 100 – 229 с.)
            </li>
            <li>Материалы, собранные из карточек сайта</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Над базами работали:</h4>
          <ul className={styles.cardList}>
            <li>Татьянов Богдан Александрович</li>
            <li>Кузнецова Дарья Николаевна</li>
            <li>Тугубова Лидия Васильевна</li>
            <li>Филиппонова Анастасия Андреевна</li>
          </ul>
        </div>
      </div>

    </section>
  );
}
