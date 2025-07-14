package com12.facturacion.models.table;

import com12.facturacion.infra.erros.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableService {
    private final TableRepository tableRepository;

    @Autowired
    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @Transactional
    public TableDTO crearMesa (TableDTO mesaDTO){
        if (tableRepository.existsByNumero(mesaDTO.numero())){
            throw new RuntimeException("La mesa ya existe");
        }
        if (mesaDTO.numero() == null || mesaDTO.numero().trim().isEmpty()){
            throw new IllegalArgumentException("El numero de mesa es requerido");
        }
        Table table = new Table();
        table.setNumero(mesaDTO.numero());
        table.setEstado(StatusTable.LIBRE);
        return convertToDTO(tableRepository.save(table));
    }

    @Transactional(readOnly = true)
    public List<TableDTO> obtenerTodasLasMesas(){
        return tableRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TableDTO> obtenerMesasLibres(){
        return tableRepository.findByEstado(StatusTable.LIBRE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TableDTO actualizarEstadoMesa(Long mesaId, StatusTable estadonuevo){
        Table mesa = tableRepository.findById(mesaId)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada"));

        mesa.setEstado(estadonuevo);
        return convertToDTO(tableRepository.save(mesa));
    }

    @Transactional
    public void eliminarMesa(Long mesaId) {
        Table mesa = tableRepository.findById(mesaId)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada"));

        if (mesa.getEstado() != StatusTable.LIBRE) {
            throw new IllegalStateException("No se puede eliminar una mesa ocupada");
        }

        tableRepository.delete(mesa);
    }

    private TableDTO convertToDTO(Table mesa) {
        return new TableDTO(
                mesa.getId(),
                mesa.getNumero(),
                mesa.getEstado()
        );
    }
}
