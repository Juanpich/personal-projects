package org.tienda.apicampo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.tienda.apicampo.domain.dto.AnimalDto;
import org.tienda.apicampo.domain.entities.Animal;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    Animal getAnimalByCaravanNumber(Long caravanNumber);
    boolean existsByCategory_IdCategory(Long id);

    @Query("""
        SELECT new org.tienda.apicampo.domain.dto.AnimalDto(a)
        FROM Animal a JOIN a.category c
        WHERE c.name like :category 
        """)
    List<AnimalDto> findAllByCategory(String category);
}
