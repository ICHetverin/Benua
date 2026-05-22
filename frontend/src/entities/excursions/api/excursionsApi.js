const BASE = '/api/excursions';

const MOCK_EXCURSIONS = [
  {
    _id: 'mock-1',
    name: 'Современное звучание фамилии Бенуа в городе',
    description: 'Прогулка по ключевым местам Санкт-Петербурга, связанным с династией Бенуа. Вы узнаете о вкладе этой семьи в архитектуру и искусство города.',
    time: '2 часа 30 мин',
    passing_methods: ['on_foot'],
    buildings: [],
    images: [],
    sources: [],
  },
  {
    _id: 'mock-2',
    name: 'Прогулка по центру с Леонтием Бенуа',
    description: 'Маршрут по зданиям, построенным по проектам Леонтия Бенуа — одного из крупнейших петербургских архитекторов рубежа XIX–XX веков.',
    time: '3 часа',
    passing_methods: ['on_foot'],
    buildings: [],
    images: [],
    sources: [],
  },
  {
    _id: 'mock-3',
    name: 'По следам Бенуа',
    description: 'Велосипедная экскурсия по расширенному маршруту с посещением малоизвестных объектов, связанных с семьёй Бенуа.',
    time: '3 часа 30 мин',
    passing_methods: ['by_bike'],
    buildings: [],
    images: [],
    sources: [],
  },
];

export const fetchExcursions = () =>
  fetch(BASE)
    .then((r) => {
      if (!r.ok) throw new Error('Failed to fetch excursions');
      return r.json();
    })
    .catch(() => MOCK_EXCURSIONS);

export const fetchExcursionById = (id) => {
  if (id.startsWith('mock-')) {
    const found = MOCK_EXCURSIONS.find((e) => e._id === id);
    return Promise.resolve(found ?? null);
  }
  return fetch(`${BASE}/${id}`)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch excursion: ${id}`);
      return r.json();
    })
    .catch(() => null);
};
