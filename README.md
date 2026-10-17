# Guardianes del Mundo Digital

Prototipo jugable del **Nivel 1: Bosque de las Señales**, para Naveguemos Seguros / ChildFund (identidad visual pendiente de aprobación).

## Desarrollo local

```bash
npm install
npm run dev
```

## Compilación

```bash
npm run build
```

## Publicación en GitHub Pages

1. Crea un repositorio llamado `guardianes-mundo-digital`.
2. Sube estos archivos a la rama `main`.
3. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions**.
4. El workflow incluido construye y publica el sitio.

Si el repositorio tiene otro nombre, cambia la ruta `base` de `vite.config.js`.

## Estado

Implementado: menú, exploración horizontal, tres retos con retroalimentación, controles táctiles/teclado, guardado local e insignia textual. Los niveles 2 y 3, arte final y recursos institucionales están pendientes.
