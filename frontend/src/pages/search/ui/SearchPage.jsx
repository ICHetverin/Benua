import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PersonCard, usePersons } from "entities/person";
import { ObjectCard, useObjects } from "entities/object";
import { ExcursionCard } from "entities/excursions";
import { useExcursions } from "entities/excursions/model/excursion";
import { CatalogGrid } from "widgets/catalog-grid";
import { getBurials } from "shared/api/benuaApi";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import styles from "./SearchPage.module.css";

function burialLocation(b) {
  if (b.region === "PETERSBURG") return b.cemetery_name ? `Санкт-Петербург, ${b.cemetery_name}` : "Санкт-Петербург";
  const city = b.city ?? "";
  return b.cemetery_name ? `${city}, ${b.cemetery_name}` : city;
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") ?? "").trim();

  const { data: persons = [], isLoading: personsLoading, isError: personsError } = usePersons(query);
  const { data: objects = [], isLoading: objectsLoading, isError: objectsError } = useObjects(query);
  const { data: excursions = [], isLoading: excursionsLoading, isError: excursionsError } = useExcursions(query);

  const { data: allBurials = [] } = useQuery({
    queryKey: ["burials"],
    queryFn: getBurials,
    staleTime: 5 * 60 * 1000,
  });

  const burials = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allBurials.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.cemetery_name?.toLowerCase().includes(q)
    );
  }, [query, allBurials]);

  const isLoading = query && (personsLoading || objectsLoading || excursionsLoading);
  const isError = personsError || objectsError || excursionsError;
  const totalResults = persons.length + objects.length + excursions.length + burials.length;

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
      {isError && <p className={styles.statusError}>Не удалось загрузить часть результатов.</p>}

      {!isLoading && !isError && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Персоналии</h2>
            <CatalogGrid
              items={persons}
              renderCard={(person) => <PersonCard key={person._id} person={person} />}
              emptyText="По этому запросу персоналии не найдены"
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Объекты</h2>
            <CatalogGrid
              items={objects}
              renderCard={(object) => <ObjectCard key={object._id} object={object} />}
              emptyText="По этому запросу объекты не найдены"
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Экскурсии</h2>
            <CatalogGrid
              items={excursions}
              renderCard={(excursion) => <ExcursionCard key={excursion._id} excursion={excursion} />}
              emptyText="По этому запросу экскурсии не найдены"
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Захоронения</h2>
            {burials.length === 0 ? (
              <p className={styles.status}>По этому запросу захоронения не найдены</p>
            ) : (
              <>
                <ul className={styles.burialList}>
                  {burials.map((burial) => (
                    <li key={burial._id} className={styles.burialItem}>
                      <span className={styles.burialName}>{burial.name}</span>
                      {burial.life_years && (
                        <span className={styles.burialDates}>{burial.life_years}</span>
                      )}
                      <span className={styles.burialLocation}>{burialLocation(burial)}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/cemeteries" className={styles.cemeteriesLink}>
                  Перейти к разделу «Кладбища» <ArrowIcon width={14} height={14} />
                </Link>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
