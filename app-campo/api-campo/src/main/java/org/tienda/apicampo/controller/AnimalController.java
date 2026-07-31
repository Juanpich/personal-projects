package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.apicampo.domain.dto.AnimalDto;
import org.tienda.apicampo.service.AnimalService;

@RequestMapping("/animal")
@RestController
public class AnimalController {
    private final AnimalService service;

    public AnimalController(AnimalService service) {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllAnimal() {
            return ResponseEntity.ok(this.service.getAllAnimal());
    }

    @GetMapping("/caravan/{nro}")
    public ResponseEntity<?> getAnimalByNro(@PathVariable("nro") Long nro){
        return ResponseEntity.status(HttpStatus.OK).body(this.service.getAnibalByCaravan(nro));
    }

    @PostMapping("")
    public ResponseEntity<?> createAnimal(@RequestBody AnimalDto animalDto) {
            return ResponseEntity.status(HttpStatus.CREATED).body(this.service.createAnimal(animalDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnimal(@PathVariable long id, @RequestBody AnimalDto animalDto) {
        animalDto.setIdAnimal(id);
        return ResponseEntity.ok(this.service.updateAnimal(animalDto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnimal(@PathVariable Long id) {
        this.service.deleteAnimal(id);
        return ResponseEntity.status(HttpStatus.OK).body("DELETED");
    }
}
