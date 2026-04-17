export const getObjectById = (id, objects = []) =>
  objects.find((o) => o.id === Number(id));
