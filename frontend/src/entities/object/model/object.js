export const objects = [
  {
    id: 1,
    name: 'Дворец Бенуа',
    description: 'Исторический особняк семьи Бенуа в Санкт-Петербурге, памятник архитектуры XIX века.',
    image: null,
  },
  {
    id: 2,
    name: 'Дом Бенуа на Васильевском острове',
    description: 'Доходный дом, построенный Николаем Бенуа в 1850-х годах.',
    image: null,
  },
  {
    id: 3,
    name: 'Петергофский вокзал',
    description: 'Железнодорожный вокзал в Петергофе, спроектированный Николаем Бенуа.',
    image: null,
  },
  {
    id: 4,
    name: 'Придворные конюшни в Петергофе',
    description: 'Комплекс придворных конюшен, один из ярких образцов архитектуры Николая Бенуа.',
    image: null,
  },
];

export const getObjects = () => objects;
export const getObjectById = (id) => objects.find((o) => o.id === Number(id));
