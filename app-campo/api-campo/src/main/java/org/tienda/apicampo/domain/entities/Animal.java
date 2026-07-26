package org.tienda.apicampo.domain.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAnimal;
    @Column(nullable = false)
    private Long caravanNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = true)
    private Category category;

    private LocalDate creationDate;

    private double lastWeight;

    public Animal(Long idAnimal, Long caravan_number, LocalDate creation_date, double last_weight, Category idCategory) {
        this.idAnimal = idAnimal;
        this.caravanNumber = caravan_number;
        this.creationDate = creation_date;
        this.lastWeight = last_weight;
        this.category =  idCategory;
    }

    @PrePersist
    protected void onCreate(){
        this.creationDate = LocalDate.now();
    }
}
