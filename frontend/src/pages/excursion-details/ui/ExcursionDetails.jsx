import { useParams, useNavigate } from 'react-router-dom';
import { getExcursionById } from 'entities/excursions';
import styles from '../styles/ExcursionDetails.module.css';

export function ExcursionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const excursion = getExcursionById(Number(id));
  console.log(id)

  return (
    <div className='page'>
        <div className={styles.headSection}>

            <div className={styles.title}>
                <div className={styles.backDrop}>
                    Экскурсии
                </div>
                <h2>{excursion.title.toUpperCase()}</h2>
            </div>


        </div>
    </div>
  );
}