package com.example.PaseoAPP.configuraciones;

import com.example.PaseoAPP.enums.CategoriaEspacio;
import com.example.PaseoAPP.enums.Rol;
import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.repositorios.IRepositorioEspacio;
import com.example.PaseoAPP.repositorios.IRepositorioUsuario;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Semilla de datos iniciales para el desarrollo y evaluacion del proyecto.
 * Si la base de datos no tiene espacios o usuarios clave, los inicializa automaticamente.
 */
@Component
public class InicializadorDatos implements CommandLineRunner {

    private final IRepositorioUsuario repositorioUsuario;
    private final IRepositorioEspacio repositorioEspacio;
    private final BCryptPasswordEncoder encriptador = new BCryptPasswordEncoder();

    public InicializadorDatos(IRepositorioUsuario repositorioUsuario, IRepositorioEspacio repositorioEspacio) {
        this.repositorioUsuario = repositorioUsuario;
        this.repositorioEspacio = repositorioEspacio;
    }

    @Override
    public void run(String... args) {
        crearUsuariosIniciales();
        crearEspaciosIniciales();
    }

    private void crearUsuariosIniciales() {
        if (repositorioUsuario.findByCorreo("admin@portal.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombres("Administrador del Portal");
            admin.setCorreo("admin@portal.com");
            admin.setContraseña(encriptador.encode("admin123"));
            admin.setRol(Rol.ADMINISTRADOR);
            admin.setTorre("Torre 1");
            admin.setApartamento("101");
            admin.setFechaCreacion(LocalDateTime.now());
            repositorioUsuario.save(admin);
        }

        if (repositorioUsuario.findByCorreo("residente@portal.com").isEmpty()) {
            Usuario residente = new Usuario();
            residente.setNombres("Carlos Restrepo");
            residente.setCorreo("residente@portal.com");
            residente.setContraseña(encriptador.encode("residente123"));
            residente.setRol(Rol.USUARIO);
            residente.setTorre("Torre 2");
            residente.setApartamento("402");
            residente.setFechaCreacion(LocalDateTime.now());
            repositorioUsuario.save(residente);
        }
    }

    private void crearEspaciosIniciales() {
        if (repositorioEspacio.count() == 0) {
            guardarEspacioSiNoExiste(
                    "Piscina",
                    CategoriaEspacio.RECREACION,
                    40,
                    "Piscina climatizada semiolímpica para adultos y niños, con solárium y asoleadoras.",
                    "https://images.unsplash.com/photo-1591285713698-598d587de63e?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(8, 0),
                    LocalTime.of(20, 0),
                    "Zona Húmeda, Piso 1",
                    true
            );

            guardarEspacioSiNoExiste(
                    "Gimnasio",
                    CategoriaEspacio.DEPORTES,
                    15,
                    "Equipos modernos de cardio, mancuernas, bancos y máquinas de fuerza para tu bienestar.",
                    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(5, 0),
                    LocalTime.of(22, 0),
                    "Torre Social, Piso 2",
                    true
            );

            guardarEspacioSiNoExiste(
                    "Zona BBQ",
                    CategoriaEspacio.EVENTOS,
                    25,
                    "Parrilla a carbón, comedor exterior en madera, mesón auxiliar de preparación y lavaplatos.",
                    "https://plus.unsplash.com/premium_photo-1693221705288-7a2531eaa5e5?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(11, 0),
                    LocalTime.of(22, 0),
                    "Terraza Torre 1",
                    false
            );

            guardarEspacioSiNoExiste(
                    "Cancha múltiple",
                    CategoriaEspacio.DEPORTES,
                    20,
                    "Cancha polivalente con demarcación reglamentaria para microfútbol, baloncesto y voleibol.",
                    "https://plus.unsplash.com/premium_photo-1724155541930-7cde0213dcc9?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(7, 0),
                    LocalTime.of(21, 0),
                    "Zona Deportiva Exterior",
                    false
            );

            guardarEspacioSiNoExiste(
                    "Coworking",
                    CategoriaEspacio.BIENESTAR,
                    16,
                    "Ambiente silencioso de trabajo con wifi de alta velocidad, escritorios ergonómicos y café.",
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(6, 0),
                    LocalTime.of(22, 0),
                    "Torre Social, Piso 1",
                    true
            );

            guardarEspacioSiNoExiste(
                    "Salón social",
                    CategoriaEspacio.EVENTOS,
                    80,
                    "Salón amplio climatizado para recepciones familiares, fechas especiales y eventos comunitarios.",
                    "https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(10, 0),
                    LocalTime.of(23, 59),
                    "Edificio Central",
                    false
            );

            guardarEspacioSiNoExiste(
                    "Parque infantil",
                    CategoriaEspacio.RECREACION,
                    30,
                    "Área de recreación infantil con columpios, resbaladeras y piso de caucho amortiguador.",
                    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(8, 0),
                    LocalTime.of(19, 0),
                    "Jardines Centrales",
                    true
            );

            guardarEspacioSiNoExiste(
                    "Parque canino",
                    CategoriaEspacio.RECREACION,
                    20,
                    "Espacio cercado y seguro para mascotas con circuito de agilidad y bebederos.",
                    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop",
                    LocalTime.of(6, 0),
                    LocalTime.of(20, 0),
                    "Zona Verde Posterior",
                    true
            );
        }
    }

    private void guardarEspacioSiNoExiste(String nombre,
                                          CategoriaEspacio categoria,
                                          int aforo,
                                          String descripcion,
                                          String fotoUrl,
                                          LocalTime apertura,
                                          LocalTime cierre,
                                          String ubicacion,
                                          boolean usoCompartido) {
        if (repositorioEspacio.findByNombre(nombre).isEmpty()) {
            Espacio espacio = new Espacio();
            espacio.setNombre(nombre);
            espacio.setCategoria(categoria);
            espacio.setAforo(aforo);
            espacio.setDescripcion(descripcion);
            espacio.setFotoUrl(fotoUrl);
            espacio.setHorarioApertura(apertura);
            espacio.setHorarioCierre(cierre);
            espacio.setUbicacion(ubicacion);
            espacio.setActivo(true);
            espacio.setUsoCompartido(usoCompartido);
            repositorioEspacio.save(espacio);
        }
    }
}
