import { Header } from 'widgets/header';

export const Home = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Главная страница</h1>
        <p>Здесь будет контент главной страницы</p>
      </main>
    </>
  );
};