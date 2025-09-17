package com.backend.projectbank.repository;

import com.backend.projectbank.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RecipeRepository extends JpaRepository<Recipe, Long> {}
