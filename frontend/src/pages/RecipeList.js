import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/recipeList.module.css';
import { getAllRecipes, searchRecipes } from '../services/recipeFindItensService';
import { FaSearch } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function RecipeList() {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const { dark } = useTheme(); // pegar tema atual

  useEffect(() => {
    async function fetchData() {
      const data = await getAllRecipes();
      setRecipes(data);
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (search.trim() === '') {
      const all = await getAllRecipes();
      setRecipes(all);
    } else {
      const filtered = await searchRecipes(search);
      setRecipes(filtered);
    }
  };

  return (
    <div className={`${styles.recipeContainer} ${dark ? styles.recipeContainerDark : ""}`}>
      <div className={`${styles.header} ${dark ? styles.headerDark : ""}`}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Pesquise o nome da receita"
            className={`${styles.searchBar} ${dark ? styles.searchBarDark : ""}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className={`${styles.searchButton} ${dark ? styles.searchButtonDark : ""}`}
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
        </div>

        <button
          className={`${styles.newRecipeButton} ${dark ? styles.newRecipeButtonDark : ""}`}
          onClick={() => navigate('/nova-receita')}
        >
          + Nova Receita
        </button>
      </div>

      <div className={styles.recipeGrid}>
        {recipes.length === 0 ? (
          <p>Nenhuma receita encontrada.</p>
        ) : (
          <>
            {recipes.map((recipe, index) => (
              <div
                className={`${styles.recipeCard} ${dark ? styles.recipeCardDark : ""}`}
                key={index}
                onClick={() => navigate(`/editar-receita/${recipe.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={`http://localhost:8080${recipe.imagemUrl}`} alt="Receita" />
                <div className={styles.recipeInfo}>
                  <span
                    className={
                      recipe.tipo === "Próprio"
                        ? styles.tagOwn
                        : styles.tagTraditional
                    }
                  >
                    {recipe.tipo}
                  </span>
                  <h3>{recipe.nome}</h3>
                  <p>{recipe.categoria}</p>
                </div>
              </div>
            ))}

            {Array.from({ length: (3 - (recipes.length % 3)) % 3 }).map((_, i) => (
              <div key={`placeholder-${i}`} className={styles.placeholderCard}></div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeList;
