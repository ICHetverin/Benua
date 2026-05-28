import { useInfographics, InfographicCard } from 'entities/infographic';
import styles from './Infographics.module.css';

export function Infographics() {
  const { data: infographics = [], isLoading } = useInfographics();

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">Инфографика</h1>
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <div className={styles.grid}>
          {infographics.map((item) => (
            <InfographicCard key={item._id} infographic={item} />
          ))}
        </div>
      )}
    </div>
  );
}
