import { useSearchParams } from "react-router-dom";
import { PersonCard, usePersons } from "entities/person";
import { ObjectCard, useObjects } from "entities/object";
import { CatalogGrid } from "widgets/catalog-grid";
import styles from "./SearchPage.module.css";

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

  const isLoading = query && (personsLoading || objectsLoading);
  const isError = personsError || objectsError;
  const totalResults = persons.length + objects.length;

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
        По запросу "{query}" найдено {totalResults} результатов
      </p>

      {isLoading && <p className={styles.status}>Загрузка...</p>}
      {isError && <p className={styles.statusError}>Не удалось загрузить результаты поиска.</p>}

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
        </>
      )}
    </div>
  );
}
