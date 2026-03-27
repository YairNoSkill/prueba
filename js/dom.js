// js/dom.js
import { obtenerTareas, actualizarEstadoTarea, obtenerUsuarios } from './storage.js';
import { getSesionActiva } from './auth.js';

// Muestra/Oculta vistas
export function alternarVistas(isLoggedIn) {
    document.getElementById('login-view').classList.toggle('active', !isLoggedIn);
    document.getElementById('login-view').classList.toggle('hidden', isLoggedIn);
    document.getElementById('dashboard-view').classList.toggle('active', isLoggedIn);
    document.getElementById('dashboard-view').classList.toggle('hidden', !isLoggedIn);
}

// Renderiza las tareas según el rol
export function renderizarTareas() {
    const contenedor = document.getElementById('task-list');
    contenedor.innerHTML = ''; // Limpiar previo
    
    const usuarioActivo = getSesionActiva();
    if (!usuarioActivo) return;

    let tareas = obtenerTareas();

    // LÓGICA DE ROLES
    if (usuarioActivo.rol === 'Usuario_Normal') {
        tareas = tareas.filter(t => t.usuario_id === usuarioActivo.id);
    }

    const hoy = new Date().toISOString().split('T')[0]; // Fecha actual YYYY-MM-DD

    tareas.forEach(tarea => {
        const div = document.createElement('div');
        div.className = `task-card ${tarea.estado === 'Completada' ? 'completada' : ''}`;
        
        // REQUERIMIENTO: Alerta visual de vencimiento
        const estaVencida = tarea.estado === 'Pendiente' && tarea.fecha_vencimiento < hoy;
        if (estaVencida) div.classList.add('vencida');

        div.innerHTML = `
            <h4>${tarea.titulo}</h4>
            <p><strong>Estado:</strong> ${tarea.estado}</p>
            <p><strong>Vence:</strong> ${tarea.fecha_vencimiento}</p>
            ${usuarioActivo.rol === 'Administrador' ? `<p><em>ID Usuario: ${tarea.usuario_id}</em></p>` : ''}
            ${estaVencida ? `<p class="vencida-alerta">¡TAREA VENCIDA!</p>` : ''}
            ${tarea.estado === 'Pendiente' ? `<button class="btn-completar" data-id="${tarea.id}">Marcar Completada</button>` : ''}
        `;

        contenedor.appendChild(div);
    });

    // Agregar eventos a los botones recién creados
    document.querySelectorAll('.btn-completar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            actualizarEstadoTarea(id, 'Completada');
            renderizarTareas(); // Recargar lista
        });
    });
}

// Configura la interfaz inicial según el rol del usuario que entró
export function configurarInterfazUsuario(usuario) {
    document.getElementById('user-greeting').innerText = `Hola, ${usuario.username} (${usuario.rol})`;
    const selectUsuarios = document.getElementById('task-user-select');
    
    // Si es admin, puede asignar tareas a otros. Si no, se oculta el select.
    if (usuario.rol === 'Administrador') {
        selectUsuarios.classList.remove('hidden');
        const todosUsuarios = obtenerUsuarios();
        selectUsuarios.innerHTML = todosUsuarios.map(u => `<option value="${u.id}">${u.username}</option>`).join('');
    } else {
        selectUsuarios.classList.add('hidden');
        selectUsuarios.innerHTML = `<option value="${usuario.id}">${usuario.username}</option>`;
    }
}