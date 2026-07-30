package org.tienda.apicampo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.tienda.apicampo.domain.dto.ObservationDto;
import org.tienda.apicampo.domain.entities.Observation;

import java.util.List;

@Repository
public interface ObservationRepository extends JpaRepository<Observation,Long> {
    @Query("""
            SELECT new org.tienda.apicampo.domain.dto.ObservationDto(o)
            FROM Observation o
            JOIN o.animal a
            WHERE a.idAnimal = :idAnimal""")
    List<ObservationDto> getAllObservationsByAnimalId(Long idAnimal);

    boolean existsObservationByAnimal_IdAnimal(Long animalIdAnimal);
}
