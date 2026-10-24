# Calidad en juego

Minijuegos para aprender Gestión de la Calidad y del Mantenimiento.
Proyecto para la muestra de fin de año — Instituto La Salette, 6° Computación.

Sitio estático: HTML + CSS + JavaScript, sin servidor ni dependencias.

## Estructura

```
calidad-en-juego/
├── index.html      Inicio con los tres juegos
├── juego1.html     Gestión de la Calidad ("La Cinta de Calidad")
├── juego2.html     Herramientas de Calidad (¿qué herramienta usar?)
├── juego3.html     Normas ISO y Mantenimiento (preguntas con explicación)
├── css/styles.css  Estilos
├── css/cinta.css   Estilos de La Cinta de Calidad
├── js/common.js    Motores de juego (Juego.quiz y Juego.pares)
└── js/cinta.js     Motor de La Cinta de Calidad (Juego.cinta)
```

## Probarlo en tu compu

Abrí `index.html` con el navegador (doble clic). No necesita internet.

## Publicarlo con GitHub Pages

1. Creá un repositorio en GitHub (por ejemplo `calidad-en-juego`) y subí todos estos archivos a la raíz.
2. En el repo: **Settings → Pages**.
3. En **Build and deployment**, elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guardá.
4. Esperá uno o dos minutos. La URL queda: `https://TU-USUARIO.github.io/calidad-en-juego/`
5. Cada `git push` actualiza el sitio automáticamente.

## Código QR para la muestra

Con la URL final, generá el QR en cualquier sitio gratuito de códigos QR, imprimilo y probalo con varios celulares antes de la muestra.

## Cómo agregar o editar preguntas

Las preguntas están dentro de cada archivo `juegoN.html`, en la llamada a `Juego.quiz({...})` o `Juego.pares({...})`.

- Quiz: cada pregunta tiene `texto`, `opciones`, `correcta` (posición de la opción correcta, empezando en 0) y `explicacion`.
- Pares: cada par es `["Concepto", "Definición"]`.
- La Cinta de Calidad: los textos (estaciones, rondas, dimensiones, pasos del ciclo, hitos y mensaje final) están en la llamada a `Juego.cinta({...})` de `juego1.html`.

## Plan B para la muestra

Tengan la carpeta descargada en la compu del stand y `index.html` abierto en el navegador: funciona aunque falle el Wi-Fi.
