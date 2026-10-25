/**
 * Roles que pueden crear/editar/eliminar (coincide con las reglas
 * hasAuthority("ENCARGADO") de SecurityConfig en el backend).
 *
 * Esto es SOLO para UI (mostrar/ocultar/deshabilitar botones). La
 * autorización real vive en el backend — si alguien edita el JS del
 * navegador para saltarse esto, el backend igual le va a responder 403.
 *
 * Cuando agreguen un rol nuevo con permiso de escritura, alcanza con
 * sumarlo acá.
 */
export const WRITE_ROLES = ["ENCARGADO"];

export function hasWriteAccess(roles: string[]): boolean {
  return roles.some((r) => WRITE_ROLES.includes(r));
}

// Roles que existen hoy en el backend. PEON todavía no tiene permisos
// propios: como no está en WRITE_ROLES, queda de solo lectura igual que
// ESPECTADOR. Cuando definan sus permisos, se ajusta acá.
export const ROLES = [
  { value: "ESPECTADOR", label: "Espectador" },
  { value: "PEON", label: "Peón" },
  { value: "ENCARGADO", label: "Encargado" },
];

// Quién puede cambiar roles de otros usuarios (PUT /users/changeRole).
export const MANAGE_USERS_ROLES = ["ENCARGADO"];

export function canManageUsers(roles: string[]): boolean {
  return roles.some((r) => MANAGE_USERS_ROLES.includes(r));
}
