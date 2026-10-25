package org.tienda.apicampo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tienda.apicampo.domain.entities.Lote;

import java.time.LocalDate;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoteDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate creationDate;
    private Integer cantAnimals;

    public LoteDto(Lote lote) {
        this.id= lote.getIdLote();
        this.name = lote.getName();
        this.description = lote.getDescription();
        this.creationDate = lote.getCreationDate();
        this.cantAnimals = null;
    }


}
