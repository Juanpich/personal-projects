package org.tienda.apicampo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.tienda.apicampo.domain.entities.Animal;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    Animal getAnimalByCaravanNumber(Long caravanNumber);

}
