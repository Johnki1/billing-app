package com12.facturacion.models.table;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
    List<Table> findByEstado(StatusTable estado);
    boolean existsByNumero(String numero);

}
