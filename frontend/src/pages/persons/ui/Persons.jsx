import { useState } from "react";
import { PersonList } from "widgets/person-list";
import { getPersons } from "entities/persons";

export function Persons() {
  const [persons] = useState(getPersons());

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">Персоналии</h1>
      </div>

      <PersonList persons={persons} />
    </div>
  );
};
