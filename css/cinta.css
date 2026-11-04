/* Minijuego 1: La Cinta de Calidad */
:root {
  --acento: #12a594;
  --acento-dark: #0b7d70;
  --acento-bg: #e0f5f2;
  --gris: #8a96a3;
  --paq: 28px;
  --u: 1px; /* unidad vertical del escenario: crece en pantallas grandes */
}

@media (min-width: 700px) {
  :root { --paq: 34px; }
}

@media (min-width: 900px) {
  :root { --paq: 42px; --u: 1.3px; }
}

/* Página del juego: banda de color arriba y el panel encima */
.pagina-juego {
  background-color: #e9eff8;
  background-image: radial-gradient(#d2dced 1.2px, transparent 1.2px);
  background-size: 22px 22px;
}

.banda {
  padding: 18px 16px 88px;
  color: #fff;
  background-color: var(--primary-dark);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg fill='none' stroke='%23fff' stroke-opacity='.09' stroke-width='2'%3E%3Crect x='8' y='10' width='20' height='20' rx='2'/%3E%3Cpath d='M8 17h9'/%3E%3Crect x='44' y='42' width='16' height='16' rx='2'/%3E%3C/g%3E%3C/svg%3E");
}

.banda-contenido { max-width: 1068px; margin: 0 auto; }
.banda .volver { margin-bottom: 6px; color: #cfe0ff; }
.banda h1 { margin: 0 0 4px; font-size: clamp(1.6rem, 4.5vw, 2.4rem); }
.banda p { margin: 0; color: #cfe0ff; }

.contenedor-juego { max-width: 1100px; margin-top: -68px; padding-top: 0; padding-bottom: 0; }

.panel-juego {
  padding: clamp(14px, 3vw, 28px);
  border: 0;
  box-shadow: 0 12px 32px rgba(23, 87, 189, 0.14);
}

/* Portada */
.cinta-portada { text-align: center; padding: 8px 0; }
.cinta-intro { font-size: 1.05rem; margin: 0 0 12px; }
.cinta-aviso {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--bg);
  color: var(--muted);
  font-size: 0.85rem;
}

/* Pantalla de juego */
.cinta {
  position: relative;
  -webkit-user-select: none;
  user-select: none;
}

.cinta-hud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  margin-bottom: 10px;
}

.cinta-titulo { width: 100%; font-size: 1rem; }

.cinta-datos {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  flex: 1;
  font-size: 0.85rem;
  color: var(--muted);
}

.cinta-datos span { white-space: nowrap; }
.cinta-datos b { color: var(--text); }

.cinta-sonido {
  display: inline-flex;
  margin-left: auto;
  padding: 6px;
  border: 2px solid var(--border);
  border-radius: 10px;
  background: #fff;
  color: var(--text);
  cursor: pointer;
}

.cinta-sonido .cinta-icono { width: 20px; height: 20px; }

.cinta-icono {
  width: 18px;
  height: 18px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cinta-escenario {
  position: relative;
  height: calc(260 * var(--u));
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.cinta-banda {
  position: absolute;
  left: 0;
  top: calc(112 * var(--u));
  width: 86%;
  height: calc(16 * var(--u));
  background: var(--border);
  border-top: 2px solid var(--gris);
  border-bottom: 2px solid var(--gris);
  z-index: 2;
  pointer-events: none;
}

/* Estaciones */
.cinta-estacion {
  position: absolute;
  top: calc(52 * var(--u));
  width: 17%;
  height: calc(132 * var(--u));
  margin-left: -8.5%;
  padding: 4px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border: 2px solid var(--border);
  border-radius: 10px;
  z-index: 1;
  transition: border-color 0.2s;
}

/* En pantallas angostas el nombre puede asomar un poco fuera de la caja: es mejor que cortarlo */
.cinta-estacion-nombre {
  font-size: clamp(0.58rem, 2.3vw, 0.95rem);
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
}

.cinta-conteo {
  margin-top: 2px;
  min-width: 20px;
  padding: 0 6px;
  border-radius: 99px;
  background: var(--bad-bg);
  color: var(--bad);
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
}

.cinta-estacion-fichas {
  position: absolute;
  left: 2px;
  right: 2px;
  bottom: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  color: var(--primary);
}

.cinta-estacion-fichas .cinta-icono { width: 15px; height: 15px; }
.cinta-estacion.con-equipo { border-color: var(--acento); }
.cinta-estacion.sobre { border-color: var(--primary); border-style: dashed; }
.cinta-estacion.falla { animation: cinta-falla 0.6s; }
.cinta-estacion.corrige { animation: cinta-corrige 0.6s; }

/* Inspector, tacho y cliente */
.cinta-zona {
  position: absolute;
  top: calc(90 * var(--u));
  height: calc(60 * var(--u));
  border: 2px dashed var(--gris);
  border-radius: 8px;
  z-index: 2;
  pointer-events: none;
}

.cinta-zona span {
  position: absolute;
  left: 50%;
  top: -18px;
  transform: translateX(-50%);
  font-size: 0.68rem;
  color: var(--muted);
  white-space: nowrap;
}

.cinta-tacho {
  position: absolute;
  top: calc(184 * var(--u));
  width: calc(60 * var(--u));
  height: calc(68 * var(--u));
  margin-left: calc(-30 * var(--u));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 10px;
  color: var(--gris);
  font-size: 0.7rem;
}

.cinta-tacho .cinta-icono { width: calc(30 * var(--u)); height: calc(30 * var(--u)); }
.cinta-tacho.sobre { border-color: var(--primary); color: var(--primary); }
.cinta-tacho.recibe { animation: cinta-pop 0.4s; }

.cinta-casa {
  position: absolute;
  left: 86%;
  top: calc(70 * var(--u));
  width: 14%;
  height: calc(96 * var(--u));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cinta-casa svg {
  width: 100%;
  flex: 1;
  min-height: 0;
  fill: #fff;
  stroke: var(--primary);
  stroke-width: 4;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.cinta-casa .cara { fill: none; stroke: var(--text); stroke-width: 3; }
.cinta-casa .ojo { fill: var(--text); stroke: none; }
.cinta-casa .boca { fill: none; stroke: var(--text); stroke-width: 3.5; }
.cinta-casa.triste .cara,
.cinta-casa.triste .boca { stroke: var(--bad); }
.cinta-casa.triste .ojo { fill: var(--bad); }
.cinta-casa-nombre { font-size: 0.68rem; color: var(--muted); }

.cinta-globo {
  position: absolute;
  top: 6px;
  right: 6px;
  max-width: 64%;
  padding: 6px 10px;
  background: #fff;
  border: 2px solid var(--primary);
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.25;
  z-index: 4;
}

.cinta-globo::after {
  content: "";
  position: absolute;
  right: 7%;
  bottom: -8px;
  width: 12px;
  height: 12px;
  background: inherit;
  border-right: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  transform: rotate(45deg);
}

.cinta-globo[hidden] { display: none; }
.cinta-globo.sobre { background: #eef4ff; }
.cinta-globo.aparece { animation: cinta-pop 0.4s; }

/* Paquetes */
.cinta-paquete {
  position: absolute;
  top: calc(120 * var(--u) - var(--paq) / 2);
  width: var(--paq);
  height: var(--paq);
  margin-left: calc(var(--paq) / -2);
  background: #fff;
  border: 2px solid var(--gris);
  border-radius: 4px;
  z-index: 3;
  touch-action: none;
}

.cinta-paquete::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 45%;
  height: 28%;
  border-radius: 2px;
  background: var(--primary);
}

.cinta-paquete.defecto::before { background: var(--bad); }

.cinta-paquete.defecto::after {
  content: "";
  position: absolute;
  right: -2px;
  top: -2px;
  border-style: solid;
  border-width: 0 12px 12px 0;
  border-color: transparent var(--bad) transparent transparent;
}

.cinta-paquete.en-zona { border-color: var(--text); cursor: grab; }
.cinta-paquete.corregido { animation: cinta-corrige 0.6s; }

.levantado { opacity: 0.3; }

.cinta-fantasma {
  position: fixed !important;
  margin: 0 !important;
  z-index: 1000;
  opacity: 0.9;
  pointer-events: none;
}

/* Bandeja de fichas */
.cinta-bandeja {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-height: 58px;
  margin-top: 4px;
  padding: 8px;
  border: 1px dashed var(--border);
  border-radius: 12px;
}

.cinta-bandeja.sobre { border-color: var(--primary); }
.cinta-bandeja button.cinta-seguir { width: 100%; margin-top: 4px; }

.cinta-escenario.en-pausa::after {
  content: "En pausa";
  position: absolute;
  left: 8px;
  top: 8px;
  padding: 2px 10px;
  border-radius: 99px;
  background: var(--text);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 5;
}
.cinta-bandeja-nota { margin: 0; color: var(--muted); font-size: 0.88rem; }

.cinta-grupo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.cinta-grupo-titulo { width: 100%; font-size: 0.75rem; color: var(--muted); }

.cinta-ficha {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 6px 12px;
  font: inherit;
  font-size: 0.85rem;
  color: var(--text);
  background: #fff;
  border: 2px solid var(--border);
  border-radius: 99px;
  cursor: grab;
  touch-action: none;
}

.cinta-ficha .cinta-icono { color: var(--primary); }
.cinta-ficha.elegida { border-color: var(--primary); background: #eef4ff; }
.cinta-ficha.bloqueada { opacity: 0.45; cursor: not-allowed; }
.cinta-cuenta { font-weight: 700; color: var(--muted); }

.cinta-ficha.mini {
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: none;
}

.cinta-ficha.mini.elegida { outline: 2px solid var(--primary); }

/* Mensajes y tarjetas */
.cinta-mensaje { min-height: 2.8em; margin: 8px 0 0; font-size: 0.92rem; line-height: 1.4; }
.cinta-mensaje.bien { color: var(--acento-dark); }
.cinta-mensaje.mal { color: var(--bad); }

.cinta-tarjeta {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow: auto;
  background: rgba(244, 247, 251, 0.94);
  border-radius: 12px;
}

.cinta-tarjeta[hidden] { display: none; }

.cinta-tarjeta-caja {
  max-width: 440px;
  padding: 18px;
  text-align: center;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.cinta-tarjeta-caja h2 { margin: 0 0 8px; font-size: 1.2rem; }
.cinta-tarjeta-caja p { margin: 8px 0 0; }
.cinta-resumen { color: var(--muted); font-size: 0.9rem; }

.cinta-aprendizaje,
.cinta-mensaje-final {
  padding: 10px 12px;
  text-align: left;
  background: var(--acento-bg);
  border-left: 4px solid var(--acento);
  border-radius: 8px;
}

.cinta-estrellas { font-size: 1.8rem; line-height: 1.2; letter-spacing: 4px; color: var(--border); }
.cinta-estrellas .llena { color: var(--acento); }

/* Ronda 4: ciclo PHVA */
.cinta-ciclo {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
}

.cinta-escenario.es-ciclo { height: calc(320 * var(--u)); }
.cinta-problema { margin: 0; font-weight: 700; text-align: center; }
.cinta-pregunta { margin: 0; font-size: 0.88rem; color: var(--primary-dark); text-align: center; }

.cinta-rueda {
  position: relative;
  width: calc(236 * var(--u));
  height: calc(236 * var(--u));
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  border-radius: 50%;
  overflow: hidden;
}

.cinta-cuadrante {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: var(--border);
  font-size: 0.74rem;
  line-height: 1.2;
  text-align: center;
  transition: background 0.2s;
}

/* Cada cuadrante deja lugar libre hacia el centro de la rueda */
.cinta-cuadrante.q0 { padding: 14px 12px 24px 8px; }
.cinta-cuadrante.q1 { padding: 14px 8px 24px 12px; }
.cinta-cuadrante.q2 { padding: 24px 8px 14px 12px; }
.cinta-cuadrante.q3 { padding: 24px 12px 14px 8px; }
.cinta-cuadrante.actual,
.cinta-cuadrante.sobre { background: #dbe7fd; color: var(--primary-dark); }
.cinta-cuadrante.hecho { background: var(--acento-bg); color: var(--acento-dark); }
.cinta-cuadrante-paso { font-size: 0.8rem; font-weight: 700; }
.cinta-cuadrante-num { font-size: 0.68rem; color: var(--muted); }

.cinta-centro {
  position: absolute;
  left: 32%;
  top: 32%;
  width: 36%;
  height: 36%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 2px solid var(--border);
  border-radius: 50%;
  color: var(--muted);
  font-size: 0.58rem;
  line-height: 1.1;
  text-align: center;
  pointer-events: none;
}

.cinta-centro strong { font-size: 1.05rem; color: var(--primary-dark); }
.cinta-centro.sube { animation: cinta-pop 0.6s; }

/* Cierre */
.cinta-final h2 { margin: 0 0 8px; font-size: 1.2rem; }
.cinta-linea { list-style: none; margin: 16px 0; padding: 0; }

.cinta-linea li {
  position: relative;
  padding: 0 0 18px 32px;
  opacity: 0;
  animation: cinta-aparecer 0.5s ease forwards;
}

.cinta-linea li::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
}

.cinta-linea li:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 9px;
  top: 22px;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.cinta-linea strong { display: block; }
.cinta-linea p { margin: 0; color: var(--muted); font-size: 0.92rem; }
.cinta-linea .cinta-estrellas { font-size: 1rem; letter-spacing: 2px; }

.cinta-mensaje-final {
  margin: 0;
  font-weight: 600;
  opacity: 0;
  animation: cinta-aparecer 0.5s ease forwards;
}

.cinta-acciones { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.cinta-link { margin-top: 16px; color: var(--primary); font-weight: 600; text-decoration: none; }

/* Animaciones */
.sacudir { animation: cinta-sacudir 0.3s; }

@keyframes cinta-sacudir {
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes cinta-falla {
  30% { border-color: var(--bad); background: var(--bad-bg); }
}

@keyframes cinta-corrige {
  30% { border-color: var(--acento); background: var(--acento-bg); }
}

@keyframes cinta-pop {
  50% { transform: scale(1.12); }
}

@keyframes cinta-aparecer {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cinta-linea li,
  .cinta-mensaje-final { animation: none; opacity: 1; }
  .sacudir,
  .cinta-tacho.recibe,
  .cinta-centro.sube,
  .cinta-globo.aparece { animation: none; }
}

@media (min-width: 900px) {
  .cinta-estacion-fichas .cinta-icono { width: 20px; height: 20px; }
  .cinta-globo { font-size: 0.92rem; }
  .cinta-cuadrante { font-size: 0.9rem; }
}

/* Ronda 3: mejoras que le faltan a cada estación */
.cinta-faltan {
  position: absolute;
  top: calc(80 * var(--u));
  left: 2px;
  right: 2px;
  padding: 0 4px;
  border-radius: 99px;
  background: #eef4ff;
  color: var(--primary-dark);
  font-size: clamp(0.55rem, 2vw, 0.75rem);
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
}

.cinta-faltan[hidden] { display: none; }
.cinta-faltan.lista { background: var(--acento-bg); color: var(--acento-dark); }
