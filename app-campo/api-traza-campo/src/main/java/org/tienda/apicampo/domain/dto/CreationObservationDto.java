package org.tienda.apicampo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreationObservationDto {
    private Long idAnimal;
    private Double weight;
    private String description;
}
