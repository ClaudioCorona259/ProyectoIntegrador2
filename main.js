// Simulación de datos (reemplazable por fetch a tu API real)
const servicios = [
    { id: 1, nombre: "Corte de cabello", duracion: 30 },
    { id: 2, nombre: "Coloración", duracion: 60 }
];

const empleados = [
    { id: 1, nombre: "Lucas" },
    { id: 2, nombre: "Sofía" }
];

// Cargar selects
window.onload = () => {
    const servicioSelect = document.getElementById("servicio");
    const empleadoSelect = document.getElementById("empleado");

    servicios.forEach(s => {
        let opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.nombre;
        servicioSelect.appendChild(opt);
    });

    empleados.forEach(e => {
        let opt = document.createElement("option");
        opt.value = e.id;
        opt.textContent = e.nombre;
        empleadoSelect.appendChild(opt);
    });

    document.getElementById("fecha").addEventListener("change", cargarHorarios);
    document.getElementById("empleado").addEventListener("change", cargarHorarios);
};

function cargarHorarios() {
    const fecha = document.getElementById("fecha").value;
    const empleadoId = document.getElementById("empleado").value;

    if (fecha && empleadoId) {
        const horarioSelect = document.getElementById("horario");
        horarioSelect.innerHTML = "<option value=''>Seleccionar horario</option>";

        // Simulación de horarios disponibles
        const horariosDisponibles = [
            "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00"
        ];

        horariosDisponibles.forEach(hora => {
            let opt = document.createElement("option");
            opt.value = hora;
            opt.textContent = hora;
            horarioSelect.appendChild(opt);
        });
    }
}

// Enviar turno (simulado)
document.getElementById("form-turno").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("mensaje").textContent = "¡Turno reservado con éxito!";
    // Aquí iría el fetch POST a tu API para guardar el turno
});
