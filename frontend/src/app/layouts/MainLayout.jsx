import { Outlet } from "react-router-dom";
import { Header } from "widgets/header";
import { Footer } from "widgets/footer";
import { ScrollToTop } from "shared/lib/scroll";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <ScrollToTop />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
