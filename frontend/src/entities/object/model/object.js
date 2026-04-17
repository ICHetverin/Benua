export const objects = [
  {
    id: 1,
    name: 'Дворец Бенуа',
    description: 'Исторический особняк семьи Бенуа в Санкт-Петербурге, памятник архитектуры XIX века.',
    image: null,
    relatedPersonIds: [1],
  },
  {
    id: 2,
    name: 'Дом Бенуа на Васильевском острове',
    description: 'Доходный дом, построенный Николаем Бенуа в 1850-х годах.',
    image: null,
    relatedPersonIds: [2],
  },
  {
    id: 3,
    name: 'Петергофский вокзал',
    description: 'Железнодорожный вокзал в Петергофе, спроектированный Николаем Бенуа.',
    image: null,
    relatedPersonIds: [1],
  },
  {
    id: 4,
    name: 'Придворные конюшни в Петергофе',
    description: 'Комплекс придворных конюшен, один из ярких образцов архитектуры Николая Бенуа.',
    image: null,
    relatedPersonIds: [1],
  },
];

export const getObjects = () => objects;
export const getObjectById = (id) => objects.find((o) => o.id === Number(id));
