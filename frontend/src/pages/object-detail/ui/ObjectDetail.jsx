import { useParams, Link } from "react-router-dom";
import { useObjectById } from "entities/object";
import { LightboxProvider } from "shared/ui/Lightbox";
import { ObjectHero } from "./components/ObjectHero/ObjectHero";
import { InterestingFacts } from "./components/InterestingFacts/InterestingFacts";
import { TextSection } from "./components/TextSection/TextSection";
import { ImageCarousel } from "./components/ImageCarousel/ImageCarousel";
import { ConnectedPersons } from "./components/ConnectedPersons/ConnectedPersons";
import { SourcesList } from "./components/SourcesList/SourcesList";
import styles from "./ObjectDetail.module.css";

export function ObjectDetail() {
  const { id } = useParams();
  const { data: object, isLoading, isError } = useObjectById(id);

  if (isLoading) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateText}>Загрузка...</p>
      </div>
    );
  }

  if (isError || !object) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateText}>Объект не найден.</p>
        <Link to="/objects" className={styles.backLink}>
          ← Все объекты
        </Link>
      </div>
    );
  }

  return (
    <LightboxProvider>
      {/* ── 1. Hero ── */}
      <ObjectHero object={object} />

      {/* ── 2. Interesting facts ── */}
      <InterestingFacts facts={object.interesting_facts ?? []} />

      {/* ── 3. Content body ── */}
      <div className={styles.contentBody}>

        {/* История постройки */}
        <TextSection title="История постройки" content={object.history} />

        {/* Дизайн */}
        <TextSection title="Дизайн" content={object.design} />

        {/* Карусель изображений */}
        {object.images?.length > 0 && (
          <ImageCarousel images={object.images} />
        )}

        {/* Динамические блоки description[] */}
        {object.description?.map((block, i) => (
          <TextSection
            key={i}
            title={block.topic}
            content={block.content}
          />
        ))}

        {/* Связь с семьёй Бенуа */}
        <TextSection
          title="Связь с семьёй Бенуа"
          content={object.connection_with_benua}
        />

        {/* Авторы */}
        <TextSection
          title="Поиск и отбор информации"
          content={object.authors?.length > 0 ? object.authors.join(', ') : null}
        />
      </div>

      {/* ── 4. Connected persons ── */}
      <ConnectedPersons persons={object.connected_persons ?? []} />

      {/* ── 5. Sources ── */}
      <SourcesList sources={object.sources ?? []} />
    </LightboxProvider>
  );
}
