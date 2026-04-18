export const objects = [
  {
    id: 1,
    title: 'Здание государственного дворянского земельного банка',
    address: 'Адмиралтейская наб., 12-14',
    authors: 'Бенуа Л.Н., Кракау А.И., Иванов А.И.',
    category: 'Общественные и административные здания',
    subcategory: 'банки',
    image: null
  },
  {
    id: 2,
    title: 'Русский для внешней торговли банк',
    address: 'Большая Морская ул., 18',
    authors: 'Бенуа Л.Н., Лидваль Ф.И., Рулен Л.В.',
    category: 'Общественные и административные здания',
    subcategory: 'страховые',
    image: null
  },
  {
    id: 3,
    title: 'Здание первого российского страхового общества',
    address: 'Большая Морская ул., 40',
    authors: 'Бенуа Л.Н., Бенуа Ю.Ю.',
    category: 'Общественные и административные здания',
    subcategory: 'банки',
    image: null
  }
];

export const getObjects = () => objects;

export const getObjectById = (id) =>
  objects.find(object => object.id === id);

export const getObjectsByCategory = (category) =>
  objects.filter(object => object.category === category);