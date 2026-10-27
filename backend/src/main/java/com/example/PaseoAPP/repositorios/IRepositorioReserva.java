package com.example.PaseoAPP.repositorios;

import com.example.PaseoAPP.enums.EstadoReserva;
import com.example.PaseoAPP.modelos.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IRepositorioReserva extends JpaRepository<Reserva, UUID> {

    List<Reserva> findByUsuarioIdOrderByFechaCreacionDesc(UUID usuarioId);

    List<Reserva> findByEspacioIdAndFechaAndEstado(UUID espacioId, String fecha, EstadoReserva estado);

    List<Reserva> findByFechaOrderByHoraInicioAsc(String fecha);
}
