package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.tienda.apicampo.domain.dto.AnimalDto;
import org.tienda.apicampo.domain.exceptions.AnimalAlreadyExistsException;
import org.tienda.apicampo.domain.exceptions.DatabaseException;
import org.tienda.apicampo.domain.exceptions.NonExistentAnimalException;
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
        try{
            return ResponseEntity.ok(this.service.getAllAnimal());
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/caravan/{nro}")
    public ResponseEntity<?> getAnimalByNro(@PathVariable("nro") Long nro){
        AnimalDto animal = this.service.getAnibalByCaravan(nro);
        if(animal == null){
             return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(animal);
    }

    @PostMapping("")
    public ResponseEntity<?> createAnimal(@RequestBody AnimalDto animalDto) {
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(this.service.createAnimal(animalDto));
        }catch(AnimalAlreadyExistsException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch ( Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnimal(@PathVariable long id, @RequestBody AnimalDto animalDto) {
        animalDto.setIdAnimal(id);
        try{
            return ResponseEntity.ok(this.service.updateAnimal(animalDto));
        }catch(AnimalAlreadyExistsException | NonExistentAnimalException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnimal(@PathVariable long id) {
        try{
            this.service.deleteAnimal(id);
            return ResponseEntity.status(HttpStatus.OK).body("DELETED");
        }catch(DatabaseException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch(NonExistentAnimalException e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
        }
    }
}
