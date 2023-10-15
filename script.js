document.addEventListener('DOMContentLoaded', function () {
    cargarActividades();
});

function agregarActividad() {
    var hora = document.getElementById('hora').value;
    var actividad = document.getElementById('actividad').value;
    var descripcion = document.getElementById('descripcion').value;

    if (hora && actividad && descripcion) {
        var fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${hora}</td>
            <td>${actividad}</td>
            <td>${descripcion}</td>
            <td><input type="checkbox" onchange="marcarRealizada(this)"></td>
            <td><button onclick="eliminarActividad(this)">Eliminar</button></td>
        `;

        document.getElementById('cuerpo-tabla').appendChild(fila);

        // Guardar la actividad en localStorage
        guardarActividadEnLocalStorage(hora, actividad, descripcion);

        // Limpiar campos del formulario
        document.getElementById('hora').value = '';
        document.getElementById('actividad').value = '';
        document.getElementById('descripcion').value = '';
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

function marcarRealizada(checkbox) {
    var fila = checkbox.parentNode.parentNode;

    if (checkbox.checked) {
        fila.classList.add('realizada');
    } else {
        fila.classList.remove('realizada');
    }

    // Actualizar el estado de realizada en localStorage
    actualizarEstadoEnLocalStorage(fila);
}

function eliminarActividad(btn) {
    var fila = btn.parentNode.parentNode;
    fila.parentNode.removeChild(fila);

    // Eliminar la actividad de localStorage
    eliminarActividadDeLocalStorage(fila);
}

function cargarActividades() {
    var actividadesGuardadas = obtenerActividadesDeLocalStorage();

    actividadesGuardadas.forEach(function (actividad) {
        agregarFilaDesdeLocalStorage(actividad);
    });
}

function guardarActividadEnLocalStorage(hora, actividad, descripcion) {
    var actividadesGuardadas = obtenerActividadesDeLocalStorage();

    actividadesGuardadas.push({
        hora: hora,
        actividad: actividad,
        descripcion: descripcion,
        realizada: false
    });

    localStorage.setItem('actividades', JSON.stringify(actividadesGuardadas));
}

function obtenerActividadesDeLocalStorage() {
    var actividadesGuardadas = localStorage.getItem('actividades');

    return actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];
}

function agregarFilaDesdeLocalStorage(actividad) {
    var fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${actividad.hora}</td>
        <td>${actividad.actividad}</td>
        <td>${actividad.descripcion}</td>
        <td><input type="checkbox" ${actividad.realizada ? 'checked' : ''} onchange="marcarRealizada(this)"></td>
        <td><button onclick="eliminarActividad(this)">Eliminar</button></td>
    `;

    if (actividad.realizada) {
        fila.classList.add('realizada');
    }

    document.getElementById('cuerpo-tabla').appendChild(fila);
}

function actualizarEstadoEnLocalStorage(fila) {
    var hora = fila.cells[0].textContent;
    var actividadesGuardadas = obtenerActividadesDeLocalStorage();

    var actividad = actividadesGuardadas.find(function (act) {
        return act.hora === hora;
    });

    if (actividad) {
        actividad.realizada = fila.classList.contains('realizada');
        localStorage.setItem('actividades', JSON.stringify(actividadesGuardadas));
    }
}

function eliminarActividadDeLocalStorage(fila) {
    var hora = fila.cells[0].textContent;
    var actividadesGuardadas = obtenerActividadesDeLocalStorage();

    var indice = actividadesGuardadas.findIndex(function (act) {
        return act.hora === hora;
    });

    if (indice !== -1) {
        actividadesGuardadas.splice(indice, 1);
        localStorage.setItem('actividades', JSON.stringify(actividadesGuardadas));
    }
}
