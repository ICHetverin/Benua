export const getPersonById = (id, persons = []) =>
  persons.find((p) => p.id === Number(id));
