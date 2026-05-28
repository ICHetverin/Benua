import { useParams, Link } from "react-router-dom";
import { useExcursionById } from "entities/excursions";
import { LightboxProvider } from "shared/ui/Lightbox";
import { ExcursionHero } from "./components/ExcursionHero/ExcursionHero";
import { ExcursionRoute } from "./components/ExcursionRoute/ExcursionRoute";
import { AudioGuide } from "./components/AudioGuide/AudioGuide";
import styles from "./ExcursionDetails.module.css";

export function ExcursionDetails() {
  const { id } = useParams();
  const { data: excursion, isLoading, isError } = useExcursionById(id);

  if (isLoading) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateText}>Загрузка...</p>
      </div>
    );
  }

  if (isError || !excursion) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.stateText}>Экскурсия не найдена.</p>
        <Link to="/excursions" className={styles.backLink}>
          ← Все экскурсии
        </Link>
      </div>
    );
  }

  const audioUrl = excursion.sources?.find((s) =>
    /\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(s.url ?? "")
  )?.url ?? null;

  return (
    <LightboxProvider>
      <ExcursionHero excursion={excursion} />

      <ExcursionRoute points={excursion.points ?? []} />

      <AudioGuide audioUrl={audioUrl} />
    </LightboxProvider>
  );
}
