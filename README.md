# Mi App PWA

App web sencilla (notas rápidas) lista para desplegar en GitHub Pages como PWA.

## Estructura

- `index.html` – Página principal
- `styles.css` – Estilos
- `app.js` – Lógica de notas y registro del Service Worker
- `manifest.json` – Manifest de la PWA
- `sw.js` – Service Worker (cache offline)
- `icons/` – Iconos de la app

## Cómo usarla con GitHub

1. Crea un repositorio en GitHub y sube todos estos archivos.
2. En GitHub ve a **Settings → Pages**.
3. En “Source” elige la rama (por ejemplo `main`) y la carpeta `/root`.
4. Guarda. GitHub generará una URL del tipo:
   - `https://tu-usuario.github.io/tu-repositorio/`

Abre esa URL desde el móvil o el navegador:

- Te debería dejar **instalar** la app (añadir a la pantalla de inicio).
- Si cargas una vez, luego podrás usarla **offline**.
