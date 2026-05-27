import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PersonCard, usePersons } from "entities/person";
import { ObjectCard, useObjects } from "entities/object";
import { ExcursionCard } from "entities/excursions";
import { useExcursions } from "entities/excursions/model/excursion";
import { CatalogGrid } from "widgets/catalog-grid";
import { cemeteriesData } from "pages/cemeteries/model/cemeteriesData";
import { petersburgCemeteriesData } from "pages/cemeteries/model/petersburgCemeteriesData";
import { worldCemeteriesData } from "pages/cemeteries/model/worldCemeteriesData";
import styles from "./SearchPage.module.css";

/* ── Flat index of all burial persons ────────────────────── */
const ALL_BURIALS = (() => {
  const items = [];

  petersburgCemeteriesData.forEach((cem) => {
    cem.persons.forEach((p) => {
      items.push({
        ...p,
        location: cem.name ? `Санкт-Петербург, ${cem.name}` : "Санкт-Петербург",
      });
    });
  });

  cemeteriesData.forEach((city) => {
    city.cemeteries.forEach((cem) => {
      cem.persons.forEach((p) => {
        items.push({
          ...p,
          location: cem.name ? `${city.city}, ${cem.name}` : city.city,
        });
      });
    });
  });

  worldCemeteriesData.forEach((country) => {
    country.cemeteries.forEach((cem) => {
      cem.persons.forEach((p) => {
        items.push({
          ...p,
          location: cem.name ? `${country.city}, ${cem.name}` : country.city,
        });
      });
    });
  });

  return items;
})();

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") ?? "").trim();

  const {
    data: persons = [],
    isLoading: personsLoading,
    isError: personsError,
  } = usePersons(query);

  const {
    data: objects = [],
    isLoading: objectsLoading,
    isError: objectsError,
  } = useObjects(query);

  const {
    data: excursions = [],
    isLoading: excursionsLoading,
    isError: excursionsError,
  } = useExcursions(query);

  const burials = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return ALL_BURIALS.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q)
    );
  }, [query]);

  const isLoading = query && (personsLoading || objectsLoading || excursionsLoading);
  const isError = personsError || objectsError || excursionsError;
  const totalResults =
    persons.length + objects.length + excursions.length + burials.length;

  if (!query) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Поиск</h1>
        <p className={styles.hint}>Введите запрос в строке поиска в шапке сайта.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Результаты поиска</h1>
      <p className={styles.summary}>
        По запросу «{query}» найдено {totalResults}{" "}
        {totalResults === 1 ? "результат" : totalResults >= 2 && totalResults <= 4 ? "результата" : "результатов"}
      </p>

      {isLoading && <p className={styles.status}>Загрузка…</p>}
      {isError && (
        <p className={styles.statusError}>Не удалось загрузить часть результатов.</p>
      )}

      {!isLoading && !isError && (
        <>
          {/* ── Персоналии ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Персоналии</h2>
            <CatalogGrid
              items={persons}
              renderCard={(person) => (
                <PersonCard key={person._id} person={person} />
              )}
              emptyText="По этому запросу персоналии не найдены"
            />
          </section>

          {/* ── Объекты ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Объекты</h2>
            <CatalogGrid
              items={objects}
              renderCard={(object) => (
                <ObjectCard key={object._id} object={object} />
              )}
              emptyText="По этому запросу объекты не найдены"
            />
          </section>

          {/* ── Экскурсии ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Экскурсии</h2>
            <CatalogGrid
              items={excursions}
              renderCard={(excursion) => (
                <ExcursionCard key={excursion._id} excursion={excursion} />
              )}
              emptyText="По этому запросу экскурсии не найдены"
            />
          </section>

          {/* ── Захоронения ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Захоронения</h2>
            {burials.length === 0 ? (
              <p className={styles.status}>По этому запросу захоронения не найдены</p>
            ) : (
              <>
                <ul className={styles.burialList}>
                  {burials.map((burial, idx) => (
                    <li key={idx} className={styles.burialItem}>
                      <span className={styles.burialName}>{burial.name}</span>
                      {burial.dates && (
                        <span className={styles.burialDates}>{burial.dates}</span>
                      )}
                      {burial.location && (
                        <span className={styles.burialLocation}>{burial.location}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <Link to="/cemeteries" className={styles.cemeteriesLink}>
                  Перейти к разделу «Кладбища» →
                </Link>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
