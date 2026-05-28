import { useParams, Link } from 'react-router-dom';
import { usePersonById } from 'entities/person';
import { LightboxProvider } from 'shared/ui/Lightbox';
import { PersonHero } from './components/PersonHero/PersonHero';
import { InterestingFacts } from './components/InterestingFacts/InterestingFacts';
import { TextSection } from './components/TextSection/TextSection';
import { ImageCarousel } from './components/ImageCarousel/ImageCarousel';
import { KeyWorks } from './components/KeyWorks/KeyWorks';
import { SourcesList } from './components/SourcesList/SourcesList';
import styles from './PersonDetail.module.css';

export function PersonDetail() {
  const { id } = useParams();
  const { data: person, isLoading, isError } = usePersonById(id);

  if (isLoading) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateText}>Загрузка...</p>
      </div>
    );
  }

  if (isError || !person) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateText}>Персона не найдена.</p>
        <Link to="/persons" className={styles.backLink}>← Все персоналии</Link>
      </div>
    );
  }

  const biographyBlock = person.description?.find(
    (d) => d.topic?.toLowerCase().includes('биограф')
  );
  const worksBlock = person.description?.find(
    (d) => d.topic?.toLowerCase().includes('произведен')
  );
  const otherBlocks = (person.description ?? []).filter(
    (d) => d !== biographyBlock && d !== worksBlock
  );

  const carouselImages = person.images?.slice(1) ?? [];

  return (
    <LightboxProvider>
      <PersonHero person={person} />

      <InterestingFacts facts={person.interesting_facts ?? []} />

      <div className={styles.contentBody}>
        {biographyBlock && (
          <TextSection title={biographyBlock.topic} content={biographyBlock.content} />
        )}

        {otherBlocks.map((block, i) => (
          <TextSection key={i} title={block.topic} content={block.content} />
        ))}

        {worksBlock && (
          <TextSection title={worksBlock.topic} content={worksBlock.content} />
        )}

        {carouselImages.length > 0 && <ImageCarousel images={carouselImages} />}
      </div>

      <KeyWorks objects={person.connected_objects ?? []} />

      <SourcesList sources={person.sources ?? []} />
    </LightboxProvider>
  );
}
