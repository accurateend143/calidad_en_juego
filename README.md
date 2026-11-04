# Calidad en juego

Minijuegos para aprender Gestión de la Calidad y del Mantenimiento.
Proyecto para la muestra de fin de año — Instituto La Salette, 6° Computación.

Sitio estático: HTML + CSS + JavaScript, sin servidor ni dependencias.

## Estructura

```
calidad-en-juego/
├── index.html      Inicio con los tres juegos
├── juego1.html     Gestión de la Calidad ("La Cinta de Calidad")
├── juego2.html     Herramientas de Calidad ("Mesa de Datos")
├── juego3.html     Normas ISO y Mantenimiento (preguntas con explicación)
├── css/styles.css  Estilos generales (incluye la banda y el panel de los juegos grandes)
├── css/cinta.css   Estilos de La Cinta de Calidad
├── css/mesa.css    Estilos de Mesa de Datos
├── js/common.js    Motores de juego (Juego.quiz y Juego.pares)
├── js/cinta.js     Motor de La Cinta de Calidad (Juego.cinta)
└── js/mesa.js      Motor de Mesa de Datos (Juego.mesa)
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
- Mesa de Datos: todos los datos fijos están en la llamada a `Juego.mesa({...})` de `juego2.html` y salen de la segunda entrega corregida. Las estaciones siguen el orden de la entrega (flujo → causa y efecto → Pareto → control y muestreo), una sección por estación:
  - `flujo` (Figura 1): los `pasos`, cada uno con `id`, `texto`, `forma` (`ovalo`, `rect` o `rombo`), `col` y `fila` en la grilla; los que tienen `fijo: true` ya vienen puestos y el resto se completa en el orden de la lista. Las `conexiones` dicen de qué paso a qué paso va cada flecha, por qué lado sale y entra (`abajo`, `arriba`, `derecha`, `izquierda`), su `etiqueta` (Sí/No) y si es parte del `bucle` de reintento.
  - `causas` (Figura 2): las `ramas` de la espina, una `pista` por rama y las `tarjetas` (`texto` y `rama` correcta).
  - `conteo` (Cuadro 2): motivos con su `cantidad` del mes y cuántos tickets se clasifican a mano (`aMano`). El punto correcto del Pareto es el acumulado más cercano al 80 %.
  - `control` (apartado 3.5): límites (`lic`, `centro`, `lsc`), `meta`, los `puntos` semanales y las `senales` (semana, regla y causa especial). Al final se arma el histograma con los mismos puntos.
  - `muestreo` (apartado 3.5-IV): tamaño del lote, unidades con defecto y límites aceptables de costo y riesgo.

## Plan B para la muestra

Tengan la carpeta descargada en la compu del stand y `index.html` abierto en el navegador: funciona aunque falle el Wi-Fi.
