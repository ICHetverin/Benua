import { ObjectCard, useObjects } from 'entities/object';
import { CatalogGrid } from 'widgets/catalog-grid';

export function Objects() {
  const { data: objects = [], isLoading, isError } = useObjects();

  return (
    <div style={{ padding: 'var(--page-padding)' }}>
      <CatalogGrid
        items={objects}
        renderCard={(obj) => <ObjectCard key={obj.id} object={obj} />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
