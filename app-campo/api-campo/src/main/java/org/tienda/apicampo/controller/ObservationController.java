package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.apicampo.domain.dto.CreationObservationDto;
import org.tienda.apicampo.domain.dto.ObservationDto;
import org.tienda.apicampo.domain.exceptions.NonExistentAnimalException;
import org.tienda.apicampo.domain.exceptions.NonExistentObservationException;
import org.tienda.apicampo.repository.ObservationRepository;
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
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.observationService.getObservationById(idObservation));
        }catch(NonExistentObservationException e){
            return  ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
        }
    }
    @GetMapping("/animal/{idAnimal}")
    public ResponseEntity<?> getObservationByAnimalId(@PathVariable("idAnimal") Long idAnimal){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.observationService.getObservationByAnimalId(idAnimal));
        }catch(Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("")
    public ResponseEntity<?> createObservation(@RequestBody CreationObservationDto observationDto){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(this.observationService.saveObservation(observationDto));
        }catch(NonExistentAnimalException e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
        }
    }
}
