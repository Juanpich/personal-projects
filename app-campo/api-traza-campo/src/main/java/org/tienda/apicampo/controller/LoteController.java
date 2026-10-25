package org.tienda.apicampo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tienda.apicampo.domain.dto.CategoryDto;
import org.tienda.apicampo.domain.dto.LoteDto;
import org.tienda.apicampo.service.LoteService;
import org.tienda.apicampo.service.ObservationService;

import java.util.List;

@RequestMapping("/lote")
@RestController
public class LoteController {
    private final LoteService service;
    public LoteController(LoteService service) {
        this.service = service;
    }
    @GetMapping("")
    public ResponseEntity<?> getAllLote() {
        List<LoteDto> list = this.service.getAllLote();
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }
    @GetMapping("/{id_lote}")
    public ResponseEntity<?> getLoteById(@PathVariable("id_lote") Long id_lote) {
        return ResponseEntity.ok(this.service.findById(id_lote));
    }

    @PostMapping("")
    public ResponseEntity<?> createLote(@RequestBody LoteDto lt) {
        return  ResponseEntity.status(HttpStatus.CREATED).body(this.service.createLote(lt));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLote(@PathVariable("id") Long id) {
        this.service.deleteLote(id);
        return ResponseEntity.status(HttpStatus.OK).body("DELETED");
    }
}




