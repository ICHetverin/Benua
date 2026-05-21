import { ExcursionList } from 'widgets/excursion-list';
import { useExcursions } from 'entities/excursions';

export function Excursions() {
  const { data: excursions = [], isLoading } = useExcursions();

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">Экскурсии</h1>
      </div>
      {isLoading ? (
        <p style={{ padding: 'var(--page-padding)', fontFamily: 'var(--font-lora)' }}>Загрузка...</p>
      ) : (
        <ExcursionList excursions={excursions} />
      )}
    </div>
  );
}
