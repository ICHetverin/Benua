import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useExcursionById } from "entities/excursions";
import { LightboxProvider } from "shared/ui/Lightbox";
import { ExcursionHero } from "./components/ExcursionHero/ExcursionHero";
import { ExcursionRouteMap } from "./components/ExcursionRouteMap/ExcursionRouteMap";
import { ExcursionRoute } from "./components/ExcursionRoute/ExcursionRoute";
import { AudioGuide } from "./components/AudioGuide/AudioGuide";
import { AudioManagerContext } from "./AudioManagerContext";
import styles from "./ExcursionDetails.module.css";

export function ExcursionDetails() {
  const { id } = useParams();
  const { data: excursion, isLoading, isError } = useExcursionById(id);
  const audioManager = useRef({ playing: null });

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

  return (
    <LightboxProvider>
      <AudioManagerContext.Provider value={audioManager}>
        <ExcursionHero excursion={excursion} />

        <ExcursionRouteMap points={excursion.points ?? []} />

        <ExcursionRoute points={excursion.points ?? []} />

        <AudioGuide audioUrl={excursion.audio_url ?? null} />
      </AudioManagerContext.Provider>
    </LightboxProvider>
  );
}
