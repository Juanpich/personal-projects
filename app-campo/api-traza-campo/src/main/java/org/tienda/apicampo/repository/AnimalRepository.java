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
    FROM Animal a
    JOIN a.category c JOIN a.lote l
    WHERE (:category IS NULL OR c.name LIKE :category)
      AND (:lote IS NULL OR l.name = :lote)
    """)
    List<AnimalDto> findAllByCategoryAndLote(
            String category,
            String lote
    );

    boolean existsByLote_IdLote(Long id);
}
