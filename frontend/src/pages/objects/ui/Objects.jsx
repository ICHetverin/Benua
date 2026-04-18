import { useState } from "react";
import { ObjectList } from "widgets/object-list";
import { getObjects } from "entities/objects";
import styles from "widgets/object-list/styles/ObjectList.module.css"

export function Objects() {
  const [category, setCategory] = useState('Общественные и административные здания');
  const [open, setOpen] = useState(false);

  const objects = getObjects();

  const categories = [
    'Общественные и административные здания',
    'Культурные и исторические объекты',
    'Религиозные сооружения',
    'Жилые и доходные дома',
    'Учебные заведения',
    'Промышленные и транспортные объекты',
    'Дачи (загородные объекты)'
  ];

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">Объекты</h1>
        <div className={styles.undertitle}>Выбрать категорию:</div>
      </div>

      <div className={styles.dropdown}>
        <div
          className={styles.dropdownHeader}
          onClick={() => setOpen(!open)}
        >
          {category}
          <span className={styles.arrow}></span>
        </div>

          <div
            className={`${styles.dropdownList} ${
              open ? styles.open : ''
            }`}
          >
            {categories.map(cat => (
              <div
                key={cat}
                className={styles.dropdownItem}
                onClick={() => {
                  setCategory(cat);
                  setOpen(false);
                }}
              >
                {cat}
              </div>
            ))}
          </div>

      </div>

      <ObjectList objects={objects} selectedCategory={category}/>

    </div>
  );
}