package com.backend.projectbank.controller;

import com.backend.projectbank.entity.Recipe;
import com.backend.projectbank.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/receitas")
public class RecipeController {

    @Autowired
    private RecipeService service;

    @GetMapping
    public List<Recipe> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/search/{item}")
    public List<Recipe> searchByKeyWord(@PathVariable String item) {
        return service.findByKeyWord(item);
    }

    @PostMapping("/save")
    public ResponseEntity<String> salvarReceita(
            @RequestPart("recipe") Recipe recipe,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        if (image != null && !image.isEmpty()) {
            try {
                saveRecipeImage(recipe, image);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erro ao salvar a imagem.");
            }
        }

        service.save(recipe);
        return ResponseEntity.ok("Receita salva com sucesso!");
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Recipe> updateRecipe(
            @PathVariable Long id,
            @RequestPart("recipe") Recipe recipe,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        if (image != null && !image.isEmpty()) {
            saveRecipeImage(recipe, image);
        }

        Recipe updatedRecipe = service.updateRecipe(recipe);
        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private static void saveRecipeImage(Recipe receita, MultipartFile image) throws IOException {
        String uploadDir = "uploads/imagens";
        String nomeImagem = image.getOriginalFilename();

        Path imagePath = Paths.get(uploadDir, nomeImagem);
        Files.createDirectories(imagePath.getParent());

        Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        receita.setImagemUrl("/imagens/" + nomeImagem);
    }

}
