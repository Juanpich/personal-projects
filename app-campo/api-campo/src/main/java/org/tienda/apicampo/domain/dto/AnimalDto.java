package org.tienda.apicampo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tienda.apicampo.domain.entities.Animal;
import org.tienda.apicampo.domain.entities.Category;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AnimalDto {
    private Long idAnimal;
    private Long caravanNumber;
    private LocalDate creationDate;
    private double lastWeight;
    private Long idCategory;

    public AnimalDto(Animal animal){
        this.idAnimal = animal.getIdAnimal();
        this.caravanNumber = animal.getCaravanNumber();
        this.creationDate = animal.getCreationDate();
        this.lastWeight = animal.getLastWeight();
        this.idCategory = (animal.getCategory() != null)
                ? animal.getCategory().getIdCategory()
                : null;
    }
}

