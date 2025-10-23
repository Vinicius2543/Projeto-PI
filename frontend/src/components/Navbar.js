// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/navbar.module.css';
import { FaMoon, FaSun } from 'react-icons/fa'; // troquei para react-icons

// Ajuste os paths conforme sua pasta de imagens (usei src/img)
import logoLight from '../img/chef_svg.svg';      // logo padrão (light)
import logoDark from '../img/chef_svg_hc.svg';   // logo para dark mode

function Navbar() {
  const { dark, toggleTheme } = useTheme();

  return (
    <nav className={`${styles.navbar} ${dark ? styles.dark : ''}`}>
      <div className={styles.logo}>
        <Link to="/">
          <img
            src={dark ? logoDark : logoLight}
            alt="Chef Notes Logo"
            className={styles.logoImage}
          />
        </Link>
      </div>

      <ul className={styles.navLinks}>
        <li className={`${styles.navItem} ${dark ? styles.navItemDark : ''}`}>
          <Link to="/" className={`${styles.navItem} ${dark ? styles.navItemDark : ''}`}>Minhas Receitas</Link>
        </li>
        <li>
          <button onClick={toggleTheme} className={`${styles.toggleBtn} ${dark ? styles.toggleBtnDark : ''}`}>
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </li>
      </ul>
    </nav>

  );
}

export default Navbar;
