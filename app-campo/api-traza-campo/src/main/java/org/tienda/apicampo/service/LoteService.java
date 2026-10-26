package org.tienda.apicampo.service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.tienda.apicampo.domain.dto.CategoryDto;
import org.tienda.apicampo.domain.dto.LoteDto;
import org.tienda.apicampo.domain.entities.Category;
import org.tienda.apicampo.domain.entities.Lote;
import org.tienda.apicampo.domain.exceptions.DatabaseException;
import org.tienda.apicampo.domain.exceptions.NonExistentCategoryException;
import org.tienda.apicampo.repository.AnimalRepository;
import org.tienda.apicampo.repository.LoteRepository;

import java.util.List;

@Service
public class LoteService {
    private final LoteRepository repository;
    private final AnimalRepository animalRepository;
    public LoteService(LoteRepository loteRepository,  AnimalRepository animalRepository) {
        this.repository = loteRepository;
        this.animalRepository = animalRepository;
    }
    @Transactional(readOnly = true)
    public List<LoteDto> getAllLote() {
        //TODO contar los animales y cargar a cada dto, se puede hacer desde el repository
        return this.repository.findAll().stream().map(LoteDto::new).toList();
    }
    public LoteDto findById(Long id) {
        //TODO contar los animales y cargar al dto
        return this.repository.findById(id).map(LoteDto::new).orElseThrow(()-> new NonExistentCategoryException(id.toString()));
    }

    public LoteDto createLote(LoteDto lt) {
        Lote lote = new Lote();
        lote.setName(lt.getName());
        lote.setDescription(lt.getDescription());
        this.repository.save(lote);
        return new LoteDto(lote);
    }

    public void deleteLote(Long id) {
        if(!this.repository.existsById(id)) {
            throw new NonExistentCategoryException(id.toString());
        }
        if(this.animalRepository.existsByLote_IdLote(id)){
            throw new DatabaseException("The Lote is associated");
        }
        this.repository.deleteById(id);
    }

}
