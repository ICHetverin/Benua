import { ExcursionList } from "widgets/excursion-list";
import { useExcursions } from "entities/excursions";

export function Excursions() {
  const { data: excursions = [], isLoading } = useExcursions();

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">Экскурсии</h1>
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <ExcursionList excursions={excursions} />
      )}
    </div>
  );
}
