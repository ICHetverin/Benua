/**
 * Статическая таксономия типов зданий.
 *
 * building_type  → значение главной категории (dropdown)
 * building_subtype → значение подкатегории (аккордеон-секции)
 *
 * Поля building_type / building_subtype добавляются в BuildingDto на бэкенде.
 * До их появления все здания попадают в fallback-секцию первой подкатегории.
 */

export const BUILDING_CATEGORIES = [
  {
    value: 'administrative',
    label: 'Общественные и административные здания',
    subcategories: [
      { value: 'governmental',   label: 'Государственные учреждения' },
      { value: 'banks',          label: 'Банки и страховые общества' },
      { value: 'organizations',  label: 'Общественные организации' },
      { value: 'commercial',     label: 'Коммерческие объекты' },
      { value: 'medical',        label: 'Медицинские учреждения' },
    ],
  },
  {
    value: 'cultural',
    label: 'Культурные и исторические объекты',
    subcategories: [
      { value: 'museums',        label: 'Музеи и галереи' },
      { value: 'theaters',       label: 'Театры и концертные залы' },
      { value: 'monuments',      label: 'Памятники и мемориалы' },
    ],
  },
  {
    value: 'religious',
    label: 'Религиозные сооружения',
    subcategories: [
      { value: 'churches',       label: 'Церкви и соборы' },
      { value: 'chapels',        label: 'Часовни' },
    ],
  },
  {
    value: 'residential',
    label: 'Жилые и доходные дома',
    subcategories: [
      { value: 'mansions',       label: 'Особняки и усадьбы' },
      { value: 'apartments',     label: 'Доходные дома' },
    ],
  },
  {
    value: 'educational',
    label: 'Учебные заведения',
    subcategories: [
      { value: 'universities',   label: 'Университеты и институты' },
      { value: 'schools',        label: 'Школы и гимназии' },
    ],
  },
  {
    value: 'industrial',
    label: 'Промышленные и транспортные объекты',
    subcategories: [
      { value: 'factories',      label: 'Заводы и фабрики' },
      { value: 'railway',        label: 'Железнодорожные объекты' },
    ],
  },
  {
    value: 'dachas',
    label: 'Дачи (загородные объекты)',
    subcategories: [
      { value: 'dachas_main',    label: 'Загородные резиденции' },
    ],
  },
];

/** Возвращает объект категории по её value */
export const getCategoryByValue = (value) =>
  BUILDING_CATEGORIES.find((c) => c.value === value) ?? BUILDING_CATEGORIES[0];
