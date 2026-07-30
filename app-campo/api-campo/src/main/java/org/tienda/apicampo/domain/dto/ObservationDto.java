package org.tienda.apicampo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tienda.apicampo.domain.entities.Observation;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ObservationDto {
    private Long idObservation;
    private AnimalDto animal;
    private Double weight;
    private String description;
    private LocalDateTime dataTime;

    public ObservationDto(Observation  observation) {
        this.idObservation = observation.getIdObervation();
        this.animal = new AnimalDto(observation.getAnimal());
        this.weight = observation.getWeight();
        this.description = observation.getDescription();
        this.dataTime = observation.getDataTime();
    }
}
