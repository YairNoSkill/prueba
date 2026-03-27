
import { obtenerUsuarios } from './storage.js';

export function getSesionActiva() {
    return JSON.parse(localStorage.getItem('sesion_activa')) || null;
}

export function login(username, password) {
    const usuarios = obtenerUsuarios();
    const usuarioValido = usuarios.find(u => u.username === username && u.password === password);

    if (usuarioValido) {
        // Guardamos la sesión
        localStorage.setItem('sesion_activa', JSON.stringify(usuarioValido));
        
        // REQUERIMIENTO PLUS: Disparar Custom Event
        const eventoLogin = new CustomEvent('authChange', { detail: { loggedIn: true, user: usuarioValido } });
        document.dispatchEvent(eventoLogin);
        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem('sesion_activa');
    document.dispatchEvent(new CustomEvent('authChange', { detail: { loggedIn: false, user: null } }));
}