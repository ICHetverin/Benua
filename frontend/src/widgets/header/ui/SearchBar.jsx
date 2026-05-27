import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./SearchBar.module.css";

export const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // При открытии — фокус на поле, при закрытии — сброс запроса
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  return (
    <div
      className={clsx(styles.bar, { [styles.open]: isOpen })}
      aria-hidden={!isOpen}
      role="search"
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по персоналиям, объектам, экскурсиям, захоронениям…"
          className={styles.input}
          tabIndex={isOpen ? 0 : -1}
          aria-label="Поисковой запрос"
        />
        <button
          type="submit"
          className={styles.searchTextButton}
          tabIndex={isOpen ? 0 : -1}
        >
          Поиск
        </button>
      </form>
    </div>
  );
};
