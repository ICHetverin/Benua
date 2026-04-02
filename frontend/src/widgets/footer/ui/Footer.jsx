import { FOOTER_SECTIONS } from "../lib/constants";
import { FooterColumn } from "./FooterColumn";
import { BigBenuaLogo } from "../icons/BigBenuaLogo";
import { ItmoLogo } from "../icons/ItmoLogo";
import { VkIcon } from "shared/assets/icons/VkIcon";
import { TelegramIcon } from "shared/assets/icons/TelegramIcon";
import { EmailIcon } from "shared/assets/icons/EmailIcon";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.leftColumn}>
            <BigBenuaLogo height={227} className={styles.BenuaLogo} />
          </div>

          <div className={styles.centerColumns}>
            {FOOTER_SECTIONS.map((section) => (
              <FooterColumn
                key={section.title}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.socialIconsContainer}>
              <a
                href="https://vk.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <VkIcon className={styles.socialLink} />
              </a>

              <a href="https://t.me" target="_blank" rel="noopener noreferrer">
                <TelegramIcon className={styles.socialLink} />
              </a>
              <a
                href="mailto:ichetverin@mail.ru"
                target="_blank"
                rel="noopener noreferrer"
              >
                <EmailIcon className={styles.socialLink} />
              </a>
            </div>
            <a href="https://itmo.ru" target="_blank" rel="noopener noreferrer">
              <ItmoLogo />
            </a>
            <p className={styles.copyright}>© 1993-2026 Университет ИТМО</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
