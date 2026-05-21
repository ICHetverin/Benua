const BASE = '/api/excursions';

const MOCK_EXCURSIONS = [
  {
    _id: 'mock-1',
    title: 'Современное звучание фамилии Бенуа в городе',
    description: 'Прогулка по ключевым местам Санкт-Петербурга, связанным с династией Бенуа. Вы узнаете о вкладе этой семьи в архитектуру и искусство города.',
    durationMinutes: 150,
    mode: 'PEDESTRIAN',
    price: '800',
    buildings: [],
    images: [],
    sources: [],
  },
  {
    _id: 'mock-2',
    title: 'Прогулка по центру с Леонтием Бенуа',
    description: 'Маршрут по зданиям, построенным по проектам Леонтия Бенуа — одного из крупнейших петербургских архитекторов рубежа XIX–XX веков.',
    durationMinutes: 180,
    mode: 'PEDESTRIAN',
    price: '1000',
    buildings: [],
    images: [],
    sources: [],
  },
  {
    _id: 'mock-3',
    title: 'По следам Бенуа',
    description: 'Велосипедная экскурсия по расширенному маршруту с посещением малоизвестных объектов, связанных с семьёй Бенуа.',
    durationMinutes: 210,
    mode: 'MIXED',
    price: '1200',
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
