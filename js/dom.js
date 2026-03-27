
import { obtenerTareas, actualizarEstadoTarea, obtenerUsuarios } from './storage.js';
import { getSesionActiva } from './auth.js';

export function alternarVistas(isLoggedIn) {
    document.getElementById('login-view').classList.toggle('active', !isLoggedIn);
    document.getElementById('login-view').classList.toggle('hidden', isLoggedIn);
    document.getElementById('dashboard-view').classList.toggle('active', isLoggedIn);
    document.getElementById('dashboard-view').classList.toggle('hidden', !isLoggedIn);
}

// Agregamos el parámetro "filtroUsuarioId"
export function renderizarTareas(filtroUsuarioId = 'todos') {
    const contenedor = document.getElementById('task-list');
    contenedor.innerHTML = ''; 
    
    const usuarioActivo = getSesionActiva();
    if (!usuarioActivo) return;

    let tareas = obtenerTareas();

    // LÓGICA DE ROLES Y FILTROS
    if (usuarioActivo.rol === 'Usuario_Normal') {
        tareas = tareas.filter(t => t.usuario_id === usuarioActivo.id);
    } else if (usuarioActivo.rol === 'Administrador' && filtroUsuarioId !== 'todos') {
        // El admin está usando el filtro
        tareas = tareas.filter(t => t.usuario_id === parseInt(filtroUsuarioId));
    }

    const hoy = new Date().toISOString().split('T')[0]; 

    tareas.forEach(tarea => {
        const div = document.createElement('div');
        div.className = `task-card ${tarea.estado === 'Completada' ? 'completada' : ''}`;
        
        const estaVencida = tarea.estado === 'Pendiente' && tarea.fecha_vencimiento < hoy;
        if (estaVencida) div.classList.add('vencida');

        div.innerHTML = `
            <h4>${tarea.titulo}</h4>
            <p><strong>Estado:</strong> ${tarea.estado}</p>
            <p><strong>Vence:</strong> ${tarea.fecha_vencimiento}</p>
            ${usuarioActivo.rol === 'Administrador' ? `<p><em>ID Usuario asignado: ${tarea.usuario_id}</em></p>` : ''}
            ${estaVencida ? `<p class="vencida-alerta">¡TAREA VENCIDA!</p>` : ''}
            ${tarea.estado === 'Pendiente' ? `<button class="btn-completar" data-id="${tarea.id}">Marcar Completada</button>` : ''}
        `;
        contenedor.appendChild(div);
    });

    document.querySelectorAll('.btn-completar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            actualizarEstadoTarea(id, 'Completada');
            // Recargar manteniendo el filtro actual
            renderizarTareas(document.getElementById('filter-user')?.value || 'todos'); 
        });
    });
}

export function configurarInterfazUsuario(usuario) {
    document.getElementById('user-greeting').innerText = `Hola, ${usuario.username} (${usuario.rol})`;
    
    const formContainer = document.querySelector('.form-container'); // Formulario tareas
    const selectUsuarios = document.getElementById('task-user-select');
    
   
    const userFormContainer = document.getElementById('user-form-container');
    const adminFilters = document.getElementById('admin-filters');
    const filterUserSelect = document.getElementById('filter-user');
    
    if (usuario.rol === 'Administrador') {
        formContainer.classList.remove('hidden'); 
        selectUsuarios.classList.remove('hidden'); 
        userFormContainer.classList.remove('hidden'); // Muestra crear usuario
        adminFilters.classList.remove('hidden'); // Muestra filtros
        
        const todosUsuarios = obtenerUsuarios();
        const opciones = todosUsuarios.map(u => `<option value="${u.id}">${u.username}</option>`).join('');
        
        selectUsuarios.innerHTML = opciones;
        filterUserSelect.innerHTML = `<option value="todos">Todos los usuarios</option>` + opciones;
    } else {
        formContainer.classList.add('hidden');
        userFormContainer.classList.add('hidden');
        adminFilters.classList.add('hidden');
    }
}