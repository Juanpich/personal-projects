package org.tienda.apicampo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.tienda.apicampo.domain.entities.Lote;

@Repository
public interface LoteRepository extends JpaRepository<Lote, Long> {
}
