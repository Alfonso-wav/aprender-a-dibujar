# Aprender a dibujar

Web app para aprender a dibujar **desde cero** en una tablet con lápiz. Centrada en dibujo (línea, forma, volumen, sombra con tramas), no en pintura.

## Qué incluye

- **Ruta de 29 lecciones en 9 módulos**, en orden:
  1. Primeros trazos — líneas rectas (método fantasma), curvas, elipses, presión
  2. Formas — ver objetos como círculos, cuadrados y triángulos
  3. Volumen — cubo, esfera, cilindro, cono, combinaciones
  4. Perspectiva — 1 punto, 2 puntos, cajas a mano alzada
  5. Observar y construir — objetos reales, dibujo de contorno, dibujo del natural
  6. Sombra con líneas — escala de valor con tramas, luz y sombra, tramas que siguen la forma
  7. Figura humana — proporciones en cabezas, gesto y línea de acción, maniquí, manos
  8. La cabeza — método Loomis, 3/4 y perfil, ojos, nariz y boca
  9. Rutina para seguir mejorando
- **Lienzo para lápiz**: presión, rechazo de palma, goma (también con el botón del lápiz), deshacer con dos dedos, temporizador.
- **Guías generadas** para cada ejercicio (puntos a unir, elipses, perspectiva, regla de proporciones, círculos para cabezas…) y **modelos para copiar o calcar**.
- **Calentamiento** de 3 rondas, **cuaderno libre** y **galería** para comparar tu progreso.
- Racha de días y minutos practicados. Todo se guarda en el propio dispositivo.
- Instalable como app y funciona sin conexión.

Sin dependencias ni compilación: HTML, CSS y JavaScript.

## Publicarla con GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En *Build and deployment*, *Source*: **Deploy from a branch**.
3. Rama **main**, carpeta **/ (root)** → **Save**.
4. En un par de minutos estará en `https://alfonso-wav.github.io/aprender-a-dibujar/`.

## Instalarla en la tablet

- **iPad (Safari):** Compartir → «Añadir a pantalla de inicio».
- **Android (Chrome):** menú ⋮ → «Instalar aplicación».

## Probarla en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Estructura

```
index.html
css/styles.css
js/app.js       vistas, rutas y el estudio de práctica
js/canvas.js    lienzo con presión y rechazo de palma
js/guides.js    guías de los ejercicios
js/models.js    dibujos vectoriales de ejemplo
js/lessons.js   el temario
js/store.js     progreso y galería (localStorage + IndexedDB)
sw.js           funcionamiento sin conexión
```

Para añadir o cambiar lecciones, edita `js/lessons.js`. Si cambias archivos, sube `VERSION` en `sw.js` para que la app instalada se actualice.
