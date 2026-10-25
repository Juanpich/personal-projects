package org.tienda.apicampo.domain.entities;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Lote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long idLote;

    @Column(nullable = false)
    private String name;

    private String description;
    private LocalDate creationDate;
    // los demás datos propios del
     public Lote(String name, String description) {
         this.name = name;
         this.description = description;
     }
    @PrePersist
    protected void onCreate(){
        this.creationDate = LocalDate.now();
    }

}
