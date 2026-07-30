package org.tienda.apicampo.domain.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
public class Observation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idObervation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Animal animal;
    @Column(nullable = true)
    private Double weight;
    @Column(nullable = true)
    private String description;
    private LocalDateTime dataTime;

    public Observation(Animal animal, Double weight, String description) {
        this.animal = animal;
        this.weight = weight;
        this.description = description;
    }

    @PrePersist
    private void onCreate() {
        this.dataTime = LocalDateTime.now();
    }

}
