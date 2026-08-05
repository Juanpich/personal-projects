package org.tienda.apicampo.service;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tienda.apicampo.domain.dto.AnimalDto;
import org.tienda.apicampo.domain.entities.Animal;
import org.tienda.apicampo.domain.entities.Category;
import org.tienda.apicampo.domain.exceptions.*;
import org.tienda.apicampo.repository.AnimalRepository;
import org.tienda.apicampo.repository.CategoryRepository;
import org.tienda.apicampo.repository.ObservationRepository;

import java.util.List;

@Service
public class AnimalService {
    private final AnimalRepository repository;
    private final CategoryRepository categoryRepository;
    private final ObservationRepository observationRepository;

    public  AnimalService(AnimalRepository repository, CategoryRepository catRepo,ObservationRepository observationRepository) {
	    this.repository = repository;
        this.categoryRepository = catRepo;
        this.observationRepository = observationRepository;
    }

    @Transactional(readOnly = true)
    public List<AnimalDto> getAllAnimal(String category) {
        if(category == null || category.isEmpty())
            return this.repository.findAll().stream().map(AnimalDto :: new).toList();
        else{
            return this.repository.findAllByCategory(category);
        }
    }

    @Transactional
    public AnimalDto createAnimal(AnimalDto animalDto) {
        //verificar datos obligatorios
        //ver si el campo caravana existe
        if(animalDto.getCaravanNumber() == null) {
            throw new RequiredFieldException("caravanNumber");
        }
        if(this.repository.getAnimalByCaravanNumber(animalDto.getCaravanNumber()) != null){
            throw new AnimalAlreadyExistsException(animalDto.getCaravanNumber());
        }
        Animal newAnimal = new Animal();


        if (animalDto.getIdCategory() != null) {
            Category category = this.categoryRepository.findById(animalDto.getIdCategory()).orElseThrow(()-> new NonExistentCategoryException(animalDto.getIdCategory().toString()));
            newAnimal.setCategory(category);
        } else {
            newAnimal.setCategory(null); // Explicitamente null
        }



        newAnimal.setCaravanNumber(animalDto.getCaravanNumber());

        if(animalDto.getLastWeight() != 0.0 ){
            newAnimal.setLastWeight(animalDto.getLastWeight());
        }

        return new AnimalDto (repository.save(newAnimal));

    }

    @Transactional
    public AnimalDto updateAnimal(AnimalDto animalDto) {
        //busco el animal en la db segun id
        Animal animalOld = this.repository.findById(animalDto.getIdAnimal()).orElseThrow(() -> new NonExistentAnimalException(animalDto.getIdAnimal().toString()));
        //verifico si el campo caravana cambio
        if (animalDto.getCaravanNumber() !=null && !animalOld.getCaravanNumber().equals(animalDto.getCaravanNumber()) ) {
            //verifico si el nuevo numero ya esta en la db
            if (this.repository.getAnimalByCaravanNumber(animalDto.getCaravanNumber()) != null) {
                throw new AnimalAlreadyExistsException(animalDto.getCaravanNumber());
            } else {
                animalOld.setCaravanNumber(animalDto.getCaravanNumber());
            }
        }
        if(animalOld.getLastWeight() != animalDto.getLastWeight() && animalDto.getLastWeight() > 0.0) {
            animalOld.setLastWeight(animalDto.getLastWeight());
        }
        //verifico la categoria
        if(animalDto.getIdCategory() != null) {
            //si cambio, verifico que exista
            if(animalOld.getCategory() == null || !animalDto.getIdCategory().equals(animalOld.getCategory().getIdCategory())){
                Category cat =  this.categoryRepository.findById(animalDto.getIdCategory()).orElseThrow(()-> new NonExistentCategoryException(animalDto.getIdCategory().toString()));
                animalOld.setCategory(cat);
            }
        }else{
            animalOld.setCategory(null);
        }

        Animal newAn = this.repository.save(animalOld);
        return new AnimalDto(newAn);
    }
    @Transactional(readOnly = true)
    public AnimalDto getAnibalByCaravan(Long nro) {
        Animal an = this.repository.getAnimalByCaravanNumber(nro);
        if(an == null){
            throw new NonExistentAnimalException( " caravan" + nro.toString());
        }
        return new AnimalDto(an);
    }
    @Transactional
    public void deleteAnimal(Long id) {
        if(!this.repository.existsById(id))
            throw new NonExistentAnimalException(id.toString());
        if(this.observationRepository.existsObservationByAnimal_IdAnimal(id)){
            throw new DatabaseException("The animal has associated observations");
        }
        this.repository.deleteById(id);
    }
}
