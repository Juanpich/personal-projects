package org.tienda.apicampo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tienda.apicampo.domain.dto.CreationObservationDto;
import org.tienda.apicampo.domain.dto.ObservationDto;
import org.tienda.apicampo.domain.entities.Animal;
import org.tienda.apicampo.domain.entities.Observation;
import org.tienda.apicampo.domain.exceptions.NonExistentAnimalException;
import org.tienda.apicampo.domain.exceptions.NonExistentObservationException;
import org.tienda.apicampo.repository.AnimalRepository;
import org.tienda.apicampo.repository.CategoryRepository;
import org.tienda.apicampo.repository.ObservationRepository;

import java.util.List;

@Service
public class ObservationService {
    private final ObservationRepository repository;
    private final AnimalRepository animalRepository;
    private final CategoryRepository categoryRepository;

    public ObservationService(ObservationRepository observationRepository,  AnimalRepository animalRepository, CategoryRepository categoryRepository) {
        this.repository = observationRepository;
        this.animalRepository = animalRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ObservationDto> getAllObservations() {
        return this.repository.findAll().stream().map(ObservationDto::new).toList();
    }
    @Transactional(readOnly = true)
    public ObservationDto getObservationById(Long id) {
        Observation ob =  this.repository.findById(id).orElseThrow( ()-> new NonExistentObservationException(id.toString()));
        return new ObservationDto(ob);
    }
    @Transactional(readOnly = true)
    public List<ObservationDto> getObservationByAnimalId(Long idAnimal){
        List<ObservationDto> list = this.repository.getAllObservationsByAnimalId(idAnimal);
        return list;
    }
    @Transactional(readOnly = false)
    public ObservationDto saveObservation(CreationObservationDto observationDto) throws NonExistentAnimalException {
        Observation observation = new Observation();
        Animal animal = this.animalRepository.findById(observationDto.getIdAnimal())
                .orElseThrow(()-> new NonExistentAnimalException(observationDto.getIdAnimal().toString()));
        observation.setAnimal(animal);
        if(observationDto.getDescription() != null) {
            observation.setDescription(observationDto.getDescription());
        }
        if(observationDto.getWeight()  != null) {
            //TODO debo cargar el ultimo peso
            observation.setWeight(observationDto.getWeight());
        }
        Observation newOb = this.repository.save(observation);
        return new ObservationDto(newOb);
    }
}
