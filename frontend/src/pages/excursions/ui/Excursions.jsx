import { useState } from 'react';
import { ExcursionList } from 'widgets/excursion-list'
import { getExcursions } from 'entities/excursions';

export function Excursions() {
  const [excursions] = useState(getExcursions());

  return (
    <div className='page'>
      <div className='header'>
        <h1 className='title'>Экскурсии</h1>
      </div>

      <ExcursionList excursions={excursions} />
    </div>
  );
}