import { useState } from "react";
import { useObjects } from "entities/object";
import { BUILDING_CATEGORIES } from "../model/categories";
import { CategoryDropdown } from "./components/CategoryDropdown/CategoryDropdown";
import { BuildingAccordion } from "./components/BuildingAccordion/BuildingAccordion";
import styles from "./Objects.module.css";

/**
 * Распределяет здания по подкатегориям.
 *
 * Логика:
 * 1. Если у здания есть building_subtype — кладём в соответствующую секцию.
 * 2. Если ни одно здание не имеет building_subtype (данные ещё без типизации) —
 *    все здания попадают в первую подкатегорию выбранной категории (fallback).
 * 3. Фильтрация по building_type: здания без типа считаются «ещё не категоризированными»
 *    и тоже попадают в fallback первой подкатегории.
 */
const groupBuildings = (allBuildings, category) => {
  const { subcategories } = category;

  const anyHasType = allBuildings.some((b) => b.building_type);

  // Если типизации ещё нет — всё в первую секцию
  if (!anyHasType) {
    return subcategories.map((sub, idx) => ({
      ...sub,
      buildings: idx === 0 ? allBuildings : [],
    }));
  }

  // Фильтруем по главной категории
  const filtered = allBuildings.filter(
    (b) => b.building_type === category.value || !b.building_type
  );

  const anyHasSubtype = filtered.some((b) => b.building_subtype);

  return subcategories.map((sub, idx) => ({
    ...sub,
    buildings: anyHasSubtype
      ? filtered.filter((b) => b.building_subtype === sub.value)
      : idx === 0
        ? filtered
        : [],
  }));
};

export function Objects() {
  const { data, isLoading, isError } = useObjects();

  const allBuildings = Array.isArray(data) ? data : data?.data ?? [];

  const [selectedCategory, setSelectedCategory] = useState(
    BUILDING_CATEGORIES[0].value
  );

  // Множество открытых подкатегорий: по умолчанию — вторая (индекс 1)
  const [openSections, setOpenSections] = useState(
    () => new Set([BUILDING_CATEGORIES[0].subcategories[1]?.value])
  );

  const category = BUILDING_CATEGORIES.find(
    (c) => c.value === selectedCategory
  ) ?? BUILDING_CATEGORIES[0];

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const newCat = BUILDING_CATEGORIES.find((c) => c.value === value);
    // При смене категории раскрываем вторую секцию (или первую, если нет второй)
    const defaultOpen = newCat?.subcategories[1]?.value
      ?? newCat?.subcategories[0]?.value;
    setOpenSections(defaultOpen ? new Set([defaultOpen]) : new Set());
  };

  const toggleSection = (value) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const grouped = isLoading || isError
    ? category.subcategories.map((sub) => ({ ...sub, buildings: [] }))
    : groupBuildings(allBuildings, category);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Объекты</h1>

      <CategoryDropdown
        categories={BUILDING_CATEGORIES}
        selectedValue={selectedCategory}
        onChange={handleCategoryChange}
      />

      {isLoading && (
        <p className={styles.status}>Загрузка...</p>
      )}
      {isError && (
        <p className={styles.statusError}>Ошибка загрузки объектов.</p>
      )}

      <div className={styles.accordions}>
        {grouped.map((sub) => (
          <BuildingAccordion
            key={sub.value}
            label={sub.label}
            buildings={sub.buildings}
            isOpen={openSections.has(sub.value)}
            onToggle={() => toggleSection(sub.value)}
          />
        ))}
      </div>
    </div>
  );
}
