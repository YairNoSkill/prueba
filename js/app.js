// js/app.js
import { inicializarDatos, guardarTarea, guardarUsuario } from './storage.js';
import { login, logout, getSesionActiva } from './auth.js';
import { alternarVistas, renderizarTareas, configurarInterfazUsuario } from './dom.js';

// 1. Inicializar base de datos simulada al cargar
document.addEventListener('DOMContentLoaded', () => {
    inicializarDatos();
    
    // Crear un usuario normal de prueba si no existe
    if (JSON.parse(localStorage.getItem('usuarios')).length === 1) {
        guardarUsuario({ username: 'juan', password: '123', rol: 'Usuario_Normal' });
    }

    // Comprobar si ya hay alguien logueado al refrescar la página
    const sesion = getSesionActiva();
    if (sesion) {
        document.dispatchEvent(new CustomEvent('authChange', { detail: { loggedIn: true, user: sesion } }));
    }
});

// 2. Escuchar el Custom Event de Autenticación
document.addEventListener('authChange', (e) => {
    const { loggedIn, user } = e.detail;
    alternarVistas(loggedIn);
    
    if (loggedIn) {
        configurarInterfazUsuario(user);
        renderizarTareas();
    }
});

// 3. Formularios y Botones
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    
    if (!login(user, pass)) {
        document.getElementById('login-error').innerText = 'Credenciales incorrectas.';
    } else {
        document.getElementById('login-error').innerText = '';
        e.target.reset();
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    logout();
});

document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('task-error');
    
    const titulo = document.getElementById('task-title').value;
    const fecha_vencimiento = document.getElementById('task-date').value;
    const usuario_id = parseInt(document.getElementById('task-user-select').value);
    
    const fecha_creacion = new Date().toISOString().split('T')[0];

    // REQUERIMIENTO: Validación de fechas desde el frontend
    if (fecha_vencimiento < fecha_creacion) {
        errorMsg.innerText = 'Error: La fecha de vencimiento no puede ser anterior a hoy.';
        return;
    }
    
    guardarTarea({ titulo, fecha_vencimiento, usuario_id, estado: 'Pendiente' });
    
    errorMsg.innerText = '';
    e.target.reset();
    renderizarTareas(); // Recargar visualmente
});