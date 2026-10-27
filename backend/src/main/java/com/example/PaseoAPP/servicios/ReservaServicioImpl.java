package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.enums.EstadoReserva;
import com.example.PaseoAPP.mapeadores.IMapaReserva;
import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.modelos.Reserva;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.repositorios.IRepositorioEspacio;
import com.example.PaseoAPP.repositorios.IRepositorioReserva;
import com.example.PaseoAPP.repositorios.IRepositorioUsuario;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@Service
public class ReservaServicioImpl implements IReservaServicio {

    private final IMapaReserva mapaReserva;
    private final IRepositorioReserva repositorioReserva;
    private final IRepositorioEspacio repositorioEspacio;
    private final IRepositorioUsuario repositorioUsuario;

    public ReservaServicioImpl(IMapaReserva mapaReserva,
                               IRepositorioReserva repositorioReserva,
                               IRepositorioEspacio repositorioEspacio,
                               IRepositorioUsuario repositorioUsuario) {
        this.mapaReserva = mapaReserva;
        this.repositorioReserva = repositorioReserva;
        this.repositorioEspacio = repositorioEspacio;
        this.repositorioUsuario = repositorioUsuario;
    }

    @Override
    public ReservaDTO guardarReservaEnBD(Reserva datos) {
        if (datos.getUsuario() == null || datos.getUsuario().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La reserva debe indicar el usuario");
        }
        if (datos.getEspacio() == null || datos.getEspacio().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La reserva debe indicar el espacio");
        }

        Usuario usuario = this.repositorioUsuario.findById(datos.getUsuario().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        Espacio espacio = this.repositorioEspacio.findById(datos.getEspacio().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Espacio no encontrado"));

        if (!espacio.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El espacio no esta disponible");
        }

        validarFecha(datos.getFecha());
        validarHoraInicio(datos.getHoraInicio());
        validarDuracion(datos.getDuracionHoras());
        validarNumeroPersonas(datos.getNumeroPersonas(), espacio);
        validarDentroDelHorarioDelEspacio(datos.getHoraInicio(), datos.getDuracionHoras(), espacio);
        validarChoqueDeHorario(datos, espacio);

        datos.setUsuario(usuario);
        datos.setEspacio(espacio);
        datos.setEstado(EstadoReserva.CONFIRMADA);
        datos.setFechaCreacion(java.time.LocalDateTime.now());

        Reserva reservaGuardada = this.repositorioReserva.save(datos);
        return this.mapaReserva.convertir_modelo_a_dto(reservaGuardada);
    }

    @Override
    public List<ReservaDTO> buscarReservasEnBD() {
        return this.mapaReserva.convertir_lista_de_modelo_a_lista_de_dto(
                this.repositorioReserva.findAll());
    }

    @Override
    public List<ReservaDTO> buscarReservasDeUsuarioEnBD(UUID usuarioId) {
        return this.mapaReserva.convertir_lista_de_modelo_a_lista_de_dto(
                this.repositorioReserva.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId));
    }

    @Override
    public ReservaDTO cancelarReservaEnBD(UUID id, UUID usuarioId, boolean esAdministrador) {
        Reserva reserva = this.repositorioReserva.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));

        // Solo el dueño de la reserva o un administrador pueden cancelarla
        if (!esAdministrador && !reserva.getUsuario().getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes cancelar una reserva de otro usuario");
        }

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La reserva ya esta cancelada");
        }

        reserva.setEstado(EstadoReserva.CANCELADA);
        Reserva reservaCancelada = this.repositorioReserva.save(reserva);
        return this.mapaReserva.convertir_modelo_a_dto(reservaCancelada);
    }

    // Reglas de negocio para crear una reserva
    private void validarFecha(String fecha) {
        if (fecha == null || fecha.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha es obligatoria");
        }
        try {
            LocalDate.parse(fecha);
        } catch (DateTimeParseException error) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha debe tener formato AAAA-MM-DD");
        }
    }

    private void validarHoraInicio(String horaInicio) {
        if (horaInicio == null || horaInicio.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La hora de inicio es obligatoria");
        }
        try {
            LocalTime.parse(horaInicio);
        } catch (DateTimeParseException error) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La hora debe tener formato HH:MM");
        }
    }

    private void validarDuracion(int duracionHoras) {
        if (duracionHoras < 1 || duracionHoras > 12) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La duracion debe estar entre 1 y 12 horas");
        }
    }

    private void validarNumeroPersonas(int numeroPersonas, Espacio espacio) {
        if (numeroPersonas <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El numero de personas debe ser mayor a 0");
        }
        if (numeroPersonas > espacio.getAforo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El numero de personas excede el aforo del espacio (" + espacio.getAforo() + ")");
        }
    }

    private void validarDentroDelHorarioDelEspacio(String horaInicio, int duracionHoras, Espacio espacio) {
        if (espacio.getHorarioApertura() == null || espacio.getHorarioCierre() == null) {
            return;
        }
        LocalTime inicio = LocalTime.parse(horaInicio);
        LocalTime fin = inicio.plusHours(duracionHoras);

        if (inicio.isBefore(espacio.getHorarioApertura()) || fin.isAfter(espacio.getHorarioCierre())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La reserva debe estar entre " + espacio.getHorarioApertura() + " y " + espacio.getHorarioCierre());
        }
    }

    private void validarChoqueDeHorario(Reserva datos, Espacio espacio) {
        List<Reserva> reservasDelDia = this.repositorioReserva
                .findByEspacioIdAndFechaAndEstado(espacio.getId(), datos.getFecha(), EstadoReserva.CONFIRMADA);

        LocalTime inicioNuevo = LocalTime.parse(datos.getHoraInicio());
        LocalTime finNuevo = inicioNuevo.plusHours(datos.getDuracionHoras());

        for (Reserva existente : reservasDelDia) {
            // Si el espacio es de uso compartido, varias reservas pueden coexistir
            // mientras no se superen entre ellas en mas de lo que permite el aforo
            if (espacio.isUsoCompartido()) {
                continue;
            }
            LocalTime inicioExistente = LocalTime.parse(existente.getHoraInicio());
            LocalTime finExistente = inicioExistente.plusHours(existente.getDuracionHoras());

            boolean hayChoque = inicioNuevo.isBefore(finExistente) && finNuevo.isAfter(inicioExistente);
            if (hayChoque) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "El espacio ya tiene una reserva que se cruza con ese horario");
            }
        }
    }
}
