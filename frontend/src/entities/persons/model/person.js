export const persons = [
  {
    id: 1,
    name: 'Леонтий Бенуа',
    description: 'Известный архитектор, представитель династии Бенуа',
    image: null
  },
  {
    id: 2,
    name: 'Александр Бенуа',
    description: 'Художник, историк искусства, основатель "Мира искусства"',
    image: null
  },
  {
    id: 3,
    name: 'Николай Бенуа',
    description: 'Архитектор, академик архитектуры',
    image: null
  },
  {
    id: 4,
    name: 'TEST',
    description: 'test1, test2, test3, test4',
    image: null
  }
];

export const getPersons = () => persons;

export const getPersonById = (id) =>
  persons.find(person => person.id === id);