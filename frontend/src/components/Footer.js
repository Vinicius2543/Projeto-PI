import React from 'react';
import styles from '../styles/footer.module.css';
import { useTheme } from '../context/ThemeContext'; 

function Footer() {
  const { dark } = useTheme();

  return (
    <footer className={`${styles.footer} ${dark ? styles.dark : ""}`}>
      <p>© 2025 Chef Notes. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Footer;
