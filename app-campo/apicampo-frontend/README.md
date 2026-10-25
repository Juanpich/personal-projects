# Traza Campo — Frontend

App React (Vite + TypeScript + Tailwind) para consumir la API de gestión de
animales, con soporte para el lector de caravanas Tru-Test XRS2 por
Bluetooth.

## ⚠️ Cómo funciona la conexión con el lector XRS2

El XRS2 se conecta por **Bluetooth Classic (SPP)**, que **no es compatible**
con la Web Bluetooth API de los navegadores (esa API solo soporta BLE). Por
eso esta app usa el **modo HID** del lector: en ese modo, el XRS2 se
presenta ante el celular como un teclado Bluetooth externo. Al escanear una
caravana, el lector "tipea" el número en el campo que esté enfocado en
pantalla, seguido de Enter.

Esto tiene una consecuencia importante: **el emparejamiento se hace desde
los ajustes de Bluetooth del sistema operativo, no desde esta app**. La app
no tiene (ni necesita) ningún botón de "conectar lector".

### Configurar el lector (una sola vez)

1. En el XRS2: `Settings → Bluetooth → Advanced → Connect Mode` → poné
   **HID**.
2. En el celular/PC: andá a los ajustes de Bluetooth del sistema, buscá el
   XRS2 y emparejalo como cualquier accesorio Bluetooth.
3. Abrí la app. El campo de escaneo en la pantalla principal ya queda
   enfocado automáticamente — no hace falta tocar nada más antes de
   escanear.

Con esto, tanto Android como iPhone funcionan igual: la app es 100% web
(no hace falta instalar nada nativo ni usar Capacitor).

## Setup

```bash
npm install
npm run dev
```

Por defecto apunta a `http://localhost:8000`. Para editar la URL de la API,
ver `.env`.

### Probar desde el celular

Como `localhost` en el celular apunta al celular mismo (no a tu PC), para
probar el lector necesitás:

1. Conectar el celular a la **misma red Wi-Fi** que la PC.
2. Editar `.env` y poner la IP local de tu PC en vez de `localhost`
   (instrucciones dentro del archivo).
3. Correr `npm run dev` (el server ya está configurado con `host: true`,
   así que escucha en la red local).
4. En el celular, abrir el navegador y entrar a `http://<tu-ip>:5173`.
5. Opcional: desde el navegador, "Agregar a pantalla de inicio" para que
   quede como app instalada (funciona tanto en Chrome/Android como en
   Safari/iOS).

## Estructura

```
src/
  api/         Llamadas HTTP tipadas (una por recurso: animals, categories, observations, auth)
  components/  Piezas de UI reutilizables
  context/     AuthContext (login JWT)
  hooks/       useEidScanner (captura del lector), useCategories
  pages/       LoginPage, HomePage (el flujo principal)
  types/       Tipos espejados de los DTOs del backend
```

## Autenticación

El backend usa JWT (`POST /authenticate`). El token se guarda en
`localStorage` y `api/client.ts` lo manda solo en cada request vía
interceptor de axios. Si el backend responde 401, se limpia la sesión
local y `ProtectedRoute` redirige a `/login` en la siguiente navegación.

Hoy cualquier usuario autenticado puede hacer todo (así lo dejaste en
`SecurityConfig`). Cuando definas permisos por rol en el backend, no hace
falta tocar nada de esta estructura — alcanza con ocultar/deshabilitar
botones según `role` si en algún momento querés reflejarlo en la UI (ese
dato hoy no viaja en el JWT decodificado en el frontend; si lo necesitás,
te lo agrego).

## Pendientes / ideas para después

- Iconos PNG reales para el manifest (hoy usa el favicon SVG, alcanza para
  probar pero no es ideal para el ícono de la app instalada en Android).
- Service worker para uso offline (hoy si no hay conexión a la API, la app
  no funciona — para un campo con mala señal puede valer la pena).
- Historial/búsqueda de animales sin escanear (hoy solo se busca por
  caravana exacta).
