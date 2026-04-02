export const excursions = [
    {
      id: 1,
      title: 'Современное звучание фамилии Бенуа в городе',
      label: [ '2 ч 30 минут', 'Пешком' ],
    },
    {
      id: 2,
      title: 'ПРОГУЛКА ПО ЦЕНТРУ С ЛЕОНТИЕМ БЕНУА',
      label: [ '3 часа', 'Пешком', 'На велосипеде'],
    },
    {
      id: 3,
      title: 'По следам Бенуа',
      label: [ '3 ч 30 минут', 'Пешком' ],
    },
    {
      id: 4,
      title: 'По следам Бенуа',
      label: [ '2 ч 10 минут', 'Пешком', 'На велосипеде'],
    },
    {
      id: 5,
      title: 'По следам Бенуа',
      label: [ '2.5 часа', 'Пешком' ],
    },
    {
      id: 6,
      title: 'По следам Бенуа',
      label: [ '2.5 часа', 'Пешком', 'На велосипеде'],
    },
    {
      id: 7,
      title: 'Test',
      label: [ 'test', 'test' ]
    }
  ];

  export const getExcursions = () => excursions;

  export const getExcursionById = (id) => excursions.find(exc => exc.id === id);