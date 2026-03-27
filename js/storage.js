// js/storage.js

// 1. Inicializar datos si el LocalStorage está vacío
export function inicializarDatos() {
    if (!localStorage.getItem('usuarios')) {
        // Creamos un usuario Administrador por defecto para poder hacer login la primera vez
        const usuariosIniciales = [
            { id: 1, username: 'admin', password: '123', rol: 'Administrador' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }

    if (!localStorage.getItem('tareas')) {
        localStorage.setItem('tareas', JSON.stringify([]));
    }
}

// 2. Funciones para Usuarios
export function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

export function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    // Simulamos el identity(1,1) de SQL Server
    usuario.id = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1; 
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return usuario;
}

// 3. Funciones para Tareas
export function obtenerTareas() {
    return JSON.parse(localStorage.getItem('tareas')) || [];
}

export function guardarTarea(tarea) {
    const tareas = obtenerTareas();
    // Simulamos el identity(1,1)
    tarea.id = tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1;
    // Simulamos el default GETDATE()
    tarea.fecha_creacion = new Date().toISOString().split('T')[0]; 
    tareas.push(tarea);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    return tarea;
}

export function actualizarEstadoTarea(idTarea, nuevoEstado) {
    const tareas = obtenerTareas();
    const index = tareas.findIndex(t => t.id === idTarea);
    if (index !== -1) {
        tareas[index].estado = nuevoEstado;
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }
}