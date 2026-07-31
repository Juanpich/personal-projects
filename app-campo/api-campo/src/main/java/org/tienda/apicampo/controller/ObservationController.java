package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.apicampo.domain.dto.CreationObservationDto;
import org.tienda.apicampo.domain.dto.ObservationDto;
import org.tienda.apicampo.service.ObservationService;

import java.util.List;

@RequestMapping("/observation")
@RestController
public class ObservationController {
    private final ObservationService observationService;
    public ObservationController(ObservationService observationService) {
        this.observationService = observationService;
    }
    @GetMapping("")
    public ResponseEntity<?> getAllObservations(){
        List<ObservationDto> list = this.observationService.getAllObservations();
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }
    @GetMapping("/{idObservation}")
    public ResponseEntity<?> getObservationById(@PathVariable("idObservation") Long idObservation){
        return ResponseEntity.status(HttpStatus.OK).body(this.observationService.getObservationById(idObservation));
    }
    @GetMapping("/animal/{idAnimal}")
    public ResponseEntity<?> getObservationByAnimalId(@PathVariable("idAnimal") Long idAnimal){
        return ResponseEntity.status(HttpStatus.OK).body(this.observationService.getObservationByAnimalId(idAnimal));
    }
    @PostMapping("")
    public ResponseEntity<?> createObservation(@RequestBody CreationObservationDto observationDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.observationService.saveObservation(observationDto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteObservation(@PathVariable("id") Long id){
        this.observationService.deleteObservation(id);
        return ResponseEntity.status(HttpStatus.OK).body("DELETED");

    }
}
