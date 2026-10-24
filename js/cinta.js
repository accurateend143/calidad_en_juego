/* Minijuego 1 "La Cinta de Calidad": Juego.cinta */
(function () {
  "use strict";

  /* Posiciones sobre el escenario, en % del ancho */
  var X_INICIO = 3;
  var X_LLEGADA = 85;
  var ESTACIONES_X = [18, 38, 58];
  var ZONA = [67, 79];
  var SEPARACION = 10;

  /* Rondas de la cinta: velocidad en % por segundo, intervalos en segundos */
  var RONDAS_CINTA = [
    { paquetes: 14, velIni: 7, velFin: 15, intIni: 2.0, intFin: 1.0, umbralCosto: 6, umbralSat: 70 },
    { paquetes: 16, velIni: 9, velFin: 9, intIni: 1.7, intFin: 1.7, umbralCosto: 14, umbralSat: 70 },
    { paquetes: 40, velIni: 8, velFin: 8, intIni: 1.9, intFin: 1.9, umbralCosto: 12, umbralSat: 85 }
  ];
  /* Probabilidad de que nazca un defecto en cada estación: se sortea en qué estación va cada valor.
     Una falla mucho, otra un poco y la tercera nunca. */
  var FALLAS = [0.36, 0.2, 0];

  var INICIO_RONDA = [
    "Los paquetes con marca roja están dañados. Sacalos en la zona del inspector.",
    "El número rojo de cada estación cuenta los defectos que nacen ahí.",
    "Cinta en pausa: dale equipo a las tres estaciones y mejorá las que tienen problemas: cada una muestra cuántas mejoras le faltan. Arranca sola cuando esté todo."
  ];

  var BOCAS = {
    feliz: "M40 70 Q50 79 60 70",
    normal: "M41 72 L59 72",
    triste: "M40 76 Q50 67 60 76"
  };

  var ICONOS = {
    lupa: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    equipo: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M15.5 14.6A5 5 0 0 1 21 19"/>',
    libro: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
    lista: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    charla: '<path d="M4 5h16v11H10l-5 4v-4H4z"/>',
    reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    escudo: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    corazon: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
    tacho: '<path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',
    sonido: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>',
    silencio: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'
  };

  function mezclar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  function icono(nombre) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("class", "cinta-icono");
    s.innerHTML = ICONOS[nombre] || "";
    return s;
  }

  function boton(texto, alTocar) {
    var b = el("button", "btn", texto);
    b.type = "button";
    b.addEventListener("click", alTocar);
    return b;
  }

  function ficha(id, nombre, nombreIcono) {
    var b = el("button", "cinta-ficha");
    b.type = "button";
    b.dataset.drag = "ficha";
    b.dataset.ficha = id;
    if (nombreIcono) b.appendChild(icono(nombreIcono));
    b.appendChild(el("span", "", nombre));
    return b;
  }

  function contar(lista) {
    return lista.filter(Boolean).length;
  }

  function sumar(lista) {
    return lista.reduce(function (a, b) { return a + b; }, 0);
  }

  function enumerar(nombres) {
    if (nombres.length < 2) return nombres.join("");
    return nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1];
  }

  function porcentaje(n) {
    return n.toLocaleString("es-AR") + " %";
  }

  /* Reinicia una animación CSS aunque ya se haya usado */
  function destello(elem, clase) {
    elem.classList.remove(clase);
    void elem.offsetWidth;
    elem.classList.add(clase);
    setTimeout(function () { elem.classList.remove(clase); }, 600);
  }

  function dibujarEstrellas(n) {
    var d = el("div", "cinta-estrellas");
    d.setAttribute("role", "img");
    d.setAttribute("aria-label", n + " de 3 estrellas");
    for (var i = 0; i < 3; i++) d.appendChild(el("span", i < n ? "llena" : "", "★"));
    return d;
  }

  function crearSeleccion() {
    var actual = null;
    return {
      get: function () { return actual; },
      set: function (f) {
        if (actual) actual.classList.remove("elegida");
        actual = f;
        if (f) f.classList.add("elegida");
      }
    };
  }

  /* Sonidos cortos generados en el momento, sin archivos */
  function crearSonido() {
    var ctx = null;
    var activo = true;
    function tono(frecuencia, duracion, demora) {
      if (!activo) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        var t = ctx.currentTime + (demora || 0);
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.frequency.value = frecuencia;
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + duracion);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + duracion);
      } catch (e) { /* el navegador no permite sonido: se juega igual */ }
    }
    return {
      bien: function () { tono(660, 0.12); tono(880, 0.16, 0.09); },
      mal: function () { tono(196, 0.3); },
      activo: function () { return activo; },
      alternar: function () { activo = !activo; return activo; }
    };
  }

  /* Arrastrar y soltar con mouse o dedo. Un toque sin arrastrar llega a alTocar. */
  function activarArrastre(contenedor, op) {
    var actual = null;
    var ultimoArrastre = 0;
    var ultimoToque = null;

    function destinoEn(x, y) {
      var pila = document.elementsFromPoint(x, y);
      for (var i = 0; i < pila.length; i++) {
        var d = pila[i].closest("[data-drop]");
        if (d && contenedor.contains(d)) return d;
      }
      return null;
    }

    function marcar(destino) {
      if (actual.sobre === destino) return;
      if (actual.sobre) actual.sobre.classList.remove("sobre");
      actual.sobre = destino;
      if (destino) destino.classList.add("sobre");
    }

    function mover(ev) {
      if (!actual || ev.pointerId !== actual.id) return;
      if (!actual.fantasma) {
        if (Math.abs(ev.clientX - actual.x0) + Math.abs(ev.clientY - actual.y0) < 8) return;
        var r = actual.fuente.getBoundingClientRect();
        actual.fantasma = actual.fuente.cloneNode(true);
        actual.fantasma.classList.add("cinta-fantasma");
        actual.fantasma.style.width = r.width + "px";
        actual.fantasma.style.height = r.height + "px";
        document.body.appendChild(actual.fantasma);
        actual.fuente.classList.add("levantado");
        op.alLevantar(actual.fuente);
      }
      actual.fantasma.style.left = ev.clientX - actual.fantasma.offsetWidth / 2 + "px";
      actual.fantasma.style.top = ev.clientY - actual.fantasma.offsetHeight / 2 + "px";
      marcar(destinoEn(ev.clientX, ev.clientY));
      ev.preventDefault();
    }

    function soltar(ev) {
      if (!actual || ev.pointerId !== actual.id) return;
      var a = actual;
      actual = null;
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
      if (!a.fantasma) {
        ultimoToque = { fuente: a.fuente, t: Date.now() };
        op.alTocar(a.fuente, a.fuente.closest("[data-drop]"));
        return;
      }
      ultimoArrastre = Date.now();
      a.fantasma.remove();
      a.fuente.classList.remove("levantado");
      if (a.sobre) a.sobre.classList.remove("sobre");
      op.alSoltar(a.fuente, ev.type === "pointerup" ? destinoEn(ev.clientX, ev.clientY) : null);
    }

    contenedor.addEventListener("pointerdown", function (ev) {
      if (actual || ev.button > 0) return;
      var fuente = ev.target.closest("[data-drag]");
      if (!fuente || !contenedor.contains(fuente) || !op.puedeArrastrar(fuente)) return;
      actual = { fuente: fuente, id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, fantasma: null, sobre: null };
      window.addEventListener("pointermove", mover, { passive: false });
      window.addEventListener("pointerup", soltar);
      window.addEventListener("pointercancel", soltar);
    });

    /* Clics que no pasaron por pointerdown/up: destinos, teclado o fichas que no se pueden arrastrar */
    contenedor.addEventListener("click", function (ev) {
      var fuente = ev.target.closest("[data-drag]");
      if (ev.target.closest(".btn")) return; /* los botones tienen su propia acción */
      if (Date.now() - ultimoArrastre < 400) return;
      if (ultimoToque && ultimoToque.fuente === fuente && Date.now() - ultimoToque.t < 1000) {
        ultimoToque = null;
        return;
      }
      op.alTocar(fuente, ev.target.closest("[data-drop]"));
    });
  }

  function cinta(cfg) {
    var raiz = document.getElementById(cfg.contenedor);
    var sonido = crearSonido();
    var estrellas = [];
    var fallas = FALLAS;

    portada();

    function portada() {
      raiz.innerHTML = "";
      var c = el("div", "cinta-portada");
      c.appendChild(el("p", "cinta-intro", cfg.intro));
      c.appendChild(el("p", "cinta-aviso", cfg.aviso));
      c.appendChild(boton("Empezar", empezar));
      raiz.appendChild(c);
    }

    function empezar() {
      estrellas = [];
      fallas = mezclar(FALLAS);
      jugarRonda(0);
    }

    function jugarRonda(n) {
      var info = cfg.rondas[n];
      var ui = armarPantalla(info.titulo);
      var arrancar = n < RONDAS_CINTA.length ? rondaCinta(n, ui, terminar) : rondaCiclo(ui, terminar);
      tarjeta(ui, [el("h2", "", info.titulo), el("p", "", info.consigna)], "Empezar ronda", arrancar);

      function terminar(est, resumen) {
        estrellas[n] = est;
        sonido.bien();
        var ultima = n === cfg.rondas.length - 1;
        var ap = el("p", "cinta-aprendizaje");
        ap.appendChild(el("strong", "", "Lo que descubriste: "));
        ap.appendChild(document.createTextNode(info.aprendizaje));
        tarjeta(ui, [el("h2", "", info.titulo), dibujarEstrellas(est), el("p", "cinta-resumen", resumen), ap],
          ultima ? "Ver el cierre" : "Siguiente ronda",
          function () { if (ultima) cierre(); else jugarRonda(n + 1); });
      }
    }

    function armarPantalla(titulo) {
      raiz.innerHTML = "";
      var ui = {};
      ui.raiz = el("div", "cinta");

      var hud = el("div", "cinta-hud");
      hud.appendChild(el("strong", "cinta-titulo", titulo));
      ui.datos = el("div", "cinta-datos");
      hud.appendChild(ui.datos);
      var bs = el("button", "cinta-sonido");
      bs.type = "button";
      function pintarSonido(activo) {
        bs.innerHTML = "";
        bs.appendChild(icono(activo ? "sonido" : "silencio"));
        bs.setAttribute("aria-label", activo ? "Silenciar" : "Activar sonido");
      }
      pintarSonido(sonido.activo());
      bs.addEventListener("click", function () { pintarSonido(sonido.alternar()); });
      hud.appendChild(bs);
      ui.raiz.appendChild(hud);

      ui.escenario = el("div", "cinta-escenario");
      ui.raiz.appendChild(ui.escenario);
      ui.mensaje = el("p", "cinta-mensaje");
      ui.mensaje.setAttribute("aria-live", "polite");
      ui.raiz.appendChild(ui.mensaje);
      ui.bandeja = el("div", "cinta-bandeja");
      ui.bandeja.dataset.drop = "bandeja";
      ui.raiz.appendChild(ui.bandeja);
      ui.tarjeta = el("div", "cinta-tarjeta");
      ui.tarjeta.hidden = true;
      ui.raiz.appendChild(ui.tarjeta);
      raiz.appendChild(ui.raiz);

      ui.decir = function (texto, tipo) {
        ui.mensaje.textContent = texto;
        ui.mensaje.className = "cinta-mensaje" + (tipo ? " " + tipo : "");
      };
      ui.hud = function (pares) {
        ui.datos.innerHTML = "";
        pares.forEach(function (p) {
          var s = el("span", "", p[0] + " ");
          s.appendChild(el("b", "", String(p[1])));
          ui.datos.appendChild(s);
        });
      };
      ui.rechazar = function (elem, texto) {
        elem.classList.remove("sacudir");
        void elem.offsetWidth;
        elem.classList.add("sacudir");
        sonido.mal();
        ui.decir(texto, "mal");
      };
      return ui;
    }

    function tarjeta(ui, nodos, textoBoton, accion) {
      ui.tarjeta.innerHTML = "";
      var c = el("div", "cinta-tarjeta-caja");
      nodos.forEach(function (nodo) { c.appendChild(nodo); });
      var b = boton(textoBoton, function () {
        ui.tarjeta.hidden = true;
        accion();
      });
      c.appendChild(b);
      ui.tarjeta.appendChild(c);
      ui.tarjeta.hidden = false;
      b.focus({ preventScroll: true });
    }

    /* ---------- Rondas 1 a 3: la cinta transportadora ---------- */
    function rondaCinta(n, ui, terminar) {
      var P = RONDAS_CINTA[n];
      var nombres = cfg.estaciones;
      var dims = cfg.dimensiones;
      var sel = crearSeleccion();
      var st = {
        activo: false, reloj: 0, ultimo: 0, proximo: 0.4,
        paquetes: [], generados: 0, terminados: 0, extra: 0,
        costo: 0, sat: 60, descartados: 0, escapados: 0, corregidos: 0,
        defectosEn: [0, 0, 0], lupas: [false, false, false],
        equipo: [false, false, false], mejoraUsada: [], mejorasEn: [[], [], []], mejoras: 0,
        globo: -1, proximoGlobo: 4, respondida: [], pedidos: 0,
        pendientes: mezclar(dims.map(function (d, i) { return i; })),
        pausa: null, pausaHecha: false,
        avisos: {}
      };

      var esc = ui.escenario;
      esc.appendChild(el("div", "cinta-banda"));

      var estaciones = nombres.map(function (nombre, i) {
        var e = el("div", "cinta-estacion");
        e.style.left = ESTACIONES_X[i] + "%";
        e.dataset.drop = "estacion";
        e.dataset.idx = i;
        e.appendChild(el("span", "cinta-estacion-nombre", nombre));
        var conteo = el("span", "cinta-conteo", "0");
        conteo.title = "Defectos que nacieron en esta estación";
        conteo.hidden = n === 0;
        e.appendChild(conteo);
        var faltan = el("span", "cinta-faltan");
        faltan.hidden = true;
        e.appendChild(faltan);
        var fichas = el("div", "cinta-estacion-fichas");
        e.appendChild(fichas);
        esc.appendChild(e);
        return { el: e, conteo: conteo, faltan: faltan, fichas: fichas };
      });

      var zona = el("div", "cinta-zona");
      zona.style.left = ZONA[0] + "%";
      zona.style.width = ZONA[1] - ZONA[0] + "%";
      zona.appendChild(el("span", "", "Inspector"));
      esc.appendChild(zona);

      var tacho = el("div", "cinta-tacho");
      tacho.dataset.drop = "tacho";
      tacho.style.left = (ZONA[0] + ZONA[1]) / 2 + "%";
      tacho.appendChild(icono("tacho"));
      tacho.appendChild(el("span", "", "Tacho"));
      esc.appendChild(tacho);

      var casa = el("div", "cinta-casa");
      casa.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' +
        '<path d="M8 46 L50 8 L92 46 V94 H8 Z"/><circle class="cara" cx="50" cy="64" r="20"/>' +
        '<circle class="ojo" cx="43" cy="60" r="2.5"/><circle class="ojo" cx="57" cy="60" r="2.5"/>' +
        '<path class="boca"/></svg>';
      casa.appendChild(el("span", "cinta-casa-nombre", "Cliente"));
      var boca = casa.querySelector(".boca");
      esc.appendChild(casa);

      var globo = el("div", "cinta-globo");
      globo.dataset.drop = "globo";
      globo.hidden = true;
      esc.appendChild(globo);

      var timerCara = null;
      function pintarCara(forzada) {
        var estado = forzada || (st.sat >= 70 ? "feliz" : st.sat >= 45 ? "normal" : "triste");
        boca.setAttribute("d", BOCAS[estado]);
        casa.classList.toggle("triste", estado === "triste");
      }
      function caraTriste() {
        pintarCara("triste");
        clearTimeout(timerCara);
        timerCara = setTimeout(function () { pintarCara(); }, 900);
      }

      function actualizarHud() {
        var datos = [["Costo", st.costo], ["Satisfacción", st.sat]];
        if (n < 2) {
          datos.unshift(["Paquetes", st.terminados + "/" + P.paquetes]);
        } else {
          datos.push(["Equipo", contar(st.equipo) + "/" + nombres.length],
            ["Mejoras", st.mejoras + "/" + cfg.mejoras.length],
            ["Pedidos", st.pedidos + "/" + dims.length]);
        }
        ui.hud(datos);
      }

      function grupo(titulo) {
        var g = el("div", "cinta-grupo");
        g.appendChild(el("span", "cinta-grupo-titulo", titulo));
        return g;
      }

      function armarBandeja() {
        var b = ui.bandeja;
        b.innerHTML = "";
        if (n === 0) {
          b.appendChild(el("p", "cinta-bandeja-nota", "En esta ronda solo hay un inspector, al final de la cinta."));
        } else if (n === 1) {
          var libres = 2 - contar(st.lupas);
          for (var i = 0; i < libres; i++) {
            var lupa = ficha("lupa", "Lupa", "lupa");
            lupa.classList.toggle("bloqueada", lupasBloqueadas());
            b.appendChild(lupa);
          }
          if (lupasBloqueadas()) b.appendChild(el("p", "cinta-bandeja-nota", "Las lupas se habilitan cuando la cinta frene."));
          else if (!libres) b.appendChild(el("p", "cinta-bandeja-nota", "Podés mover las lupas de una estación a otra."));
        } else {
          var g1 = grupo("Para las estaciones");
          var sinEquipo = nombres.length - contar(st.equipo);
          if (sinEquipo) {
            var fe = ficha("equipo", "Equipo", "equipo");
            fe.appendChild(el("span", "cinta-cuenta", "×" + sinEquipo));
            g1.appendChild(fe);
          }
          cfg.mejoras.forEach(function (m, k) {
            if (!st.mejoraUsada[k]) g1.appendChild(ficha("mejora-" + k, m.nombre, m.icono));
          });
          var g2 = grupo("Para el cliente");
          dims.forEach(function (d, k) {
            if (!st.respondida[k]) g2.appendChild(ficha("resp-" + k, d.respuesta, d.icono));
          });
          if (g1.children.length > 1) b.appendChild(g1);
          if (g2.children.length > 1) b.appendChild(g2);
        }
        if (st.pausa) {
          var seguir = boton(st.pausa, reanudar);
          seguir.classList.add("cinta-seguir");
          b.appendChild(seguir);
        }
        esc.classList.toggle("en-pausa", !!st.pausa);
      }

      /* En la ronda 2 primero se observan los datos: las lupas esperan a la pausa */
      function lupasBloqueadas() {
        return n === 1 && !st.pausaHecha;
      }

      /* Pausas para pensar con calma dónde poner las fichas (rondas 2 y 3) */
      function pausar(texto, textoBoton) {
        st.pausa = textoBoton;
        st.pausaHecha = true;
        sel.set(null);
        armarBandeja();
        ui.decir(texto, "");
      }

      function reanudar() {
        if (!st.pausa) return;
        st.pausa = null;
        refrescar();
        ui.decir("¡La cinta sigue!", "");
      }

      function pintarEstaciones() {
        estaciones.forEach(function (e, i) {
          e.fichas.innerHTML = "";
          if (st.lupas[i]) {
            var l = el("button", "cinta-ficha mini");
            l.type = "button";
            l.dataset.drag = "ficha";
            l.dataset.ficha = "lupa";
            l.dataset.desde = i;
            l.setAttribute("aria-label", "Lupa en " + nombres[i]);
            l.appendChild(icono("lupa"));
            e.fichas.appendChild(l);
          }
          if (st.equipo[i]) e.fichas.appendChild(icono("equipo"));
          st.mejorasEn[i].forEach(function (k) { e.fichas.appendChild(icono(cfg.mejoras[k].icono)); });
          e.el.classList.toggle("con-equipo", st.equipo[i]);
          /* Ronda 3: cuántas mejoras le faltan a cada estación que falla */
          if (n === 2 && necesarias(i)) {
            var resta = necesarias(i) - st.mejorasEn[i].length;
            e.faltan.hidden = false;
            e.faltan.textContent = resta ? (resta === 1 ? "falta 1 mejora" : "faltan " + resta + " mejoras") : "✓ sin defectos";
            e.faltan.classList.toggle("lista", !resta);
          }
        });
      }

      function refrescar() {
        sel.set(null);
        pintarEstaciones();
        armarBandeja();
        actualizarHud();
      }

      function avisar(clave, texto, tipo) {
        if (st.avisos[clave]) return false;
        st.avisos[clave] = true;
        ui.decir(texto, tipo);
        return true;
      }

      /* Paquetes */
      function crearPaquete() {
        var p = { x: X_INICIO, defecto: false, agarrado: false, el: el("div", "cinta-paquete") };
        p.el.dataset.drag = "paquete";
        p.el.style.left = p.x + "%";
        esc.appendChild(p.el);
        st.paquetes.push(p);
        st.generados++;
        if (objetivosCumplidos()) st.extra++;
      }

      function buscar(elem) {
        for (var i = 0; i < st.paquetes.length; i++) if (st.paquetes[i].el === elem) return st.paquetes[i];
        return null;
      }

      function quitar(p) {
        st.paquetes.splice(st.paquetes.indexOf(p), 1);
        p.el.remove();
        st.terminados++;
      }

      function enZona(p) {
        return p.x >= ZONA[0] - 1 && p.x <= ZONA[1] + 1;
      }

      function hayLugar() {
        return st.paquetes.every(function (p) { return p.agarrado || p.x > X_INICIO + SEPARACION; });
      }

      /* Mejoras que necesita cada estación para dejar de fallar: la que más falla necesita todas menos una */
      function necesarias(i) {
        if (!fallas[i]) return 0;
        return fallas[i] === Math.max.apply(null, fallas) ? cfg.mejoras.length - 1 : 1;
      }

      function probDefecto(i) {
        if (n < 2 || !fallas[i]) return fallas[i];
        return fallas[i] * (1 - st.mejorasEn[i].length / necesarias(i));
      }

      function pasarEstacion(p, i) {
        if (p.defecto || Math.random() >= probDefecto(i)) return;
        st.defectosEn[i]++;
        estaciones[i].conteo.textContent = st.defectosEn[i];
        if (st.lupas[i]) {
          st.costo += 1;
          st.corregidos++;
          destello(estaciones[i].el, "corrige");
          destello(p.el, "corregido");
          sonido.bien();
          if (!avisar("lupa", "¡La lupa corrigió el defecto donde nace! Retrabajo barato: costo +1.", "bien")) {
            ui.decir("Corregido en " + nombres[i] + ": costo +1.", "bien");
          }
          actualizarHud();
        } else {
          p.defecto = true;
          p.el.classList.add("defecto");
          destello(estaciones[i].el, "falla");
        }
      }

      function llegar(p) {
        quitar(p);
        if (p.defecto) {
          st.escapados++;
          st.sat = Math.max(0, st.sat - 12);
          caraTriste();
          sonido.mal();
          ui.decir("Un paquete dañado llegó al cliente.", "mal");
        } else {
          st.sat = Math.min(100, st.sat + 3);
          pintarCara();
        }
        actualizarHud();
      }

      function tirar(p) {
        quitar(p);
        st.costo += 3;
        st.descartados++;
        destello(tacho, "recibe");
        if (p.defecto) {
          sonido.bien();
          if (!avisar("tirar", "Defecto descartado, pero se perdió todo el trabajo hecho: costo +3.", "")) {
            ui.decir("Descartado: costo +3.", "");
          }
        } else {
          st.sat = Math.max(0, st.sat - 3);
          sonido.mal();
          pintarCara();
          ui.decir("¡Ese paquete estaba bien! Se perdió igual: costo +3.", "mal");
        }
        actualizarHud();
      }

      /* Ronda 3: objetivos */
      function objetivosCumplidos() {
        return n === 2 && contar(st.equipo) === nombres.length &&
          st.mejoras === cfg.mejoras.length && st.pedidos === dims.length;
      }

      function puedeGenerar() {
        if (objetivosCumplidos()) return st.extra < 3;
        return st.generados < P.paquetes;
      }

      function mostrarGlobo() {
        st.globo = st.pendientes.shift();
        globo.textContent = "«" + dims[st.globo].pedido + "»";
        globo.hidden = false;
        destello(globo, "aparece");
        avisar("globo", "El cliente pide algo: arrastrá la respuesta adecuada hasta su globo.", "");
      }

      function moverLupa(tipo, i, desde) {
        if (tipo === "bandeja") {
          if (desde >= 0) { st.lupas[desde] = false; refrescar(); }
          return;
        }
        if (tipo !== "estacion") return;
        if (st.lupas[i]) {
          if (desde !== i) ui.rechazar(estaciones[i].el, "Esa estación ya tiene una lupa.");
          return;
        }
        if (desde >= 0) st.lupas[desde] = false;
        st.lupas[i] = true;
        refrescar();
        ui.decir("Lupa en " + nombres[i] + ": los defectos que nazcan ahí se corrigen en el momento.", "");
      }

      function darEquipo(i) {
        if (st.equipo[i]) return ui.rechazar(estaciones[i].el, "Esa estación ya tiene equipo.");
        st.equipo[i] = true;
        sonido.bien();
        refrescar();
        var faltan = nombres.length - contar(st.equipo);
        if (!faltan) ui.decir("Las tres estaciones tienen equipo: ya se puede mejorar.", "bien");
        else ui.decir("Equipo en " + nombres[i] + ". " + (faltan === 1 ? "Falta 1." : "Faltan " + faltan + "."), "bien");
      }

      function aplicarMejora(k, i) {
        var sinEquipo = nombres.filter(function (nombre, j) { return !st.equipo[j]; });
        if (sinEquipo.length) {
          return ui.rechazar(estaciones[i].el, "Falta equipo en " + enumerar(sinEquipo) + ": la calidad es tarea de todos.");
        }
        if (!fallas[i]) {
          return ui.rechazar(estaciones[i].el, "En " + nombres[i] + " no nacen defectos. Mejorá las estaciones con números rojos.");
        }
        if (st.mejorasEn[i].length >= necesarias(i)) {
          return ui.rechazar(estaciones[i].el, nombres[i] + " ya no tiene defectos: usá esa mejora en otra estación.");
        }
        st.mejoraUsada[k] = true;
        st.mejorasEn[i].push(k);
        st.mejoras++;
        sonido.bien();
        refrescar();
        var lista = st.mejorasEn[i].length >= necesarias(i);
        var texto = lista ? "¡Ya no nacen defectos en " + nombres[i] + "!" :
          cfg.mejoras[k].nombre + ": nacen menos defectos en " + nombres[i] + ". Todavía le falta una mejora.";
        if (st.mejoras < cfg.mejoras.length) {
          ui.decir(texto, "bien");
          return;
        }
        var estabaEnPausa = !!st.pausa;
        reanudar();
        ui.decir(texto + (estabaEnPausa ? " Arranca la cinta: atendé lo que pide el cliente." : ""), "bien");
      }

      function responder(k) {
        if (st.globo < 0) return ui.decir("Esperá a que el cliente pida algo.", "");
        if (k !== st.globo) return ui.rechazar(globo, "Eso no responde a lo que pide el cliente.");
        st.respondida[k] = true;
        st.pedidos++;
        st.sat = Math.min(100, st.sat + 8);
        st.globo = -1;
        st.proximoGlobo = st.reloj + 2.5;
        globo.hidden = true;
        sonido.bien();
        pintarCara();
        refrescar();
        ui.decir("Dimensión de la calidad: " + dims[k].dimension + ".", "bien");
      }

      function usar(f, d) {
        if (f.dataset.drag === "paquete") {
          var p = buscar(f);
          if (!p) return;
          if (d && d.dataset.drop === "tacho") tirar(p);
          else p.agarrado = false;
          return;
        }
        if (!st.activo || !d) return;
        var id = f.dataset.ficha;
        var tipo = d.dataset.drop;
        var i = Number(d.dataset.idx);
        if (id === "lupa") return moverLupa(tipo, i, f.dataset.desde === undefined ? -1 : Number(f.dataset.desde));
        if (tipo === "bandeja") return;
        if (id === "equipo") {
          if (tipo === "estacion") darEquipo(i);
          else ui.rechazar(d, "El equipo va en una estación.");
        } else if (id.indexOf("mejora-") === 0) {
          if (tipo === "estacion") aplicarMejora(Number(id.slice(7)), i);
          else ui.rechazar(d, "Las mejoras van en una estación.");
        } else if (id.indexOf("resp-") === 0) {
          if (tipo === "globo") responder(Number(id.slice(5)));
          else ui.rechazar(d, "Esa respuesta va en el globo del cliente.");
        }
      }

      activarArrastre(ui.raiz, {
        puedeArrastrar: function (f) {
          if (!st.activo) return false;
          if (f.dataset.drag === "paquete") return f.classList.contains("en-zona");
          return !lupasBloqueadas();
        },
        alLevantar: function (f) {
          var p = buscar(f);
          if (p) p.agarrado = true;
          sel.set(null);
        },
        alSoltar: usar,
        alTocar: function (f, d) {
          if (!st.activo) return;
          var s = sel.get();
          if (f && f.dataset.drag === "paquete") {
            var p = buscar(f);
            if (p && enZona(p)) tirar(p);
            else ui.decir("Los paquetes solo se pueden sacar en la zona del inspector.", "");
            return;
          }
          if (f && lupasBloqueadas()) {
            ui.decir("Esperá: primero mirá dónde nacen los defectos. La cinta va a frenar para que pongas las lupas.", "");
            return;
          }
          if (f && f === s) { sel.set(null); return; }
          if (f && (!s || !d || d.dataset.drop === "bandeja")) { sel.set(f); return; }
          if (s && d) { sel.set(null); usar(s, d); return; }
          if (d && d.dataset.drop !== "bandeja" && n > 0) ui.decir("Primero elegí una ficha de abajo.", "");
        }
      });

      function cuadro(t) {
        if (!st.activo) return;
        var dt = st.ultimo ? Math.min(0.1, (t - st.ultimo) / 1000) : 0;
        st.ultimo = t;
        if (st.pausa) { requestAnimationFrame(cuadro); return; }
        st.reloj += dt;
        var avance = Math.min(1, st.generados / P.paquetes);
        var vel = P.velIni + (P.velFin - P.velIni) * avance;

        if (puedeGenerar() && st.reloj >= st.proximo && hayLugar()) {
          crearPaquete();
          st.proximo = st.reloj + P.intIni + (P.intFin - P.intIni) * avance;
          if (n === 0 && st.generados === Math.ceil(P.paquetes / 2)) ui.decir("¡La cinta acelera!", "");
        }
        /* La pausa llega cuando los números rojos ya muestran las estaciones que fallan */
        var vistas = fallas.every(function (f, i) { return !f || st.defectosEn[i] > 0; });
        if (n === 1 && !st.pausaHecha && (vistas && sumar(st.defectosEn) >= 3 || st.generados >= 10)) {
          pausar("Pausa: mirá los números rojos. Poné las lupas donde nacen los defectos y tocá Seguir.", "Seguir");
        }

        st.paquetes.slice().forEach(function (p) {
          if (p.agarrado) return;
          var antes = p.x;
          p.x += vel * dt;
          ESTACIONES_X.forEach(function (cx, i) {
            if (antes < cx && p.x >= cx) pasarEstacion(p, i);
          });
          if (p.x >= X_LLEGADA) { llegar(p); return; }
          p.el.style.left = p.x + "%";
          p.el.classList.toggle("en-zona", enZona(p));
        });

        if (n === 2 && st.globo < 0 && st.pendientes.length && st.reloj >= st.proximoGlobo) mostrarGlobo();

        if (!puedeGenerar() && !st.paquetes.length) { finalizar(); return; }
        requestAnimationFrame(cuadro);
      }

      function finalizar() {
        st.activo = false;
        var est = 1 + (st.sat >= P.umbralSat ? 1 : 0) + (st.costo <= P.umbralCosto ? 1 : 0);
        var resumen = "Costo " + st.costo + " · Satisfacción " + st.sat + " · ";
        if (n === 0) resumen += "Descartados: " + st.descartados + " · Llegaron dañados: " + st.escapados;
        else if (n === 1) resumen += "Corregidos con las lupas: " + st.corregidos + " · Descartados: " + st.descartados + " · Llegaron dañados: " + st.escapados;
        else resumen += "Pedidos respondidos: " + st.pedidos + " de " + dims.length + " · Llegaron dañados: " + st.escapados;
        terminar(est, resumen);
      }

      refrescar();
      pintarCara();

      return function () {
        st.activo = true;
        if (n === 2) pausar(INICIO_RONDA[n], "Arrancar la cinta");
        else ui.decir(INICIO_RONDA[n], "");
        requestAnimationFrame(cuadro);
      };
    }

    /* ---------- Ronda 4: el ciclo de mejora continua ---------- */
    function rondaCiclo(ui, terminar) {
      var pd = cfg.pdca;
      var vuelta = 0;
      var siguiente = 0;
      var errores = 0;
      var activo = false;
      var indicador = pd.indicadorInicial;

      ui.escenario.classList.add("es-ciclo");
      var caja = el("div", "cinta-ciclo");
      var problema = el("p", "cinta-problema");
      caja.appendChild(problema);
      var pregunta = el("p", "cinta-pregunta");
      caja.appendChild(pregunta);
      var rueda = el("div", "cinta-rueda");
      var cuadrantes = pd.fases.map(function (fase, q) {
        var c = el("div", "cinta-cuadrante q" + q);
        c.dataset.drop = "cuadrante";
        c.dataset.idx = q;
        c.appendChild(el("span", "cinta-cuadrante-num", String(q + 1)));
        c.appendChild(el("strong", "", fase));
        var paso = el("span", "cinta-cuadrante-paso");
        c.appendChild(paso);
        return { el: c, paso: paso };
      });
      /* En sentido horario: arriba izq., arriba der., abajo der., abajo izq. */
      [0, 1, 3, 2].forEach(function (q) { rueda.appendChild(cuadrantes[q].el); });
      var centro = el("div", "cinta-centro");
      centro.appendChild(el("span", "", "Entregas exitosas"));
      var valor = el("strong", "", porcentaje(indicador));
      centro.appendChild(valor);
      rueda.appendChild(centro);
      caja.appendChild(rueda);
      ui.escenario.appendChild(caja);

      function actualizarHud() {
        ui.hud([["Vuelta", Math.min(vuelta + 1, pd.problemas.length) + "/" + pd.problemas.length], ["Errores", errores]]);
      }

      /* Resalta la fase que toca ahora y pregunta qué acción le corresponde */
      function marcarActual() {
        cuadrantes.forEach(function (c, q) { c.el.classList.toggle("actual", q === siguiente); });
        if (siguiente < pd.fases.length) {
          pregunta.textContent = "Paso " + (siguiente + 1) + " de " + pd.fases.length + " · " + pd.fases[siguiente] +
            " (" + pd.significados[siguiente] + "): ¿qué acción corresponde?";
        }
      }

      function nuevaVuelta() {
        var acciones = pd.problemas[vuelta].acciones;
        siguiente = 0;
        problema.textContent = "Problema: " + pd.problemas[vuelta].titulo;
        cuadrantes.forEach(function (c) {
          c.el.classList.remove("hecho");
          c.paso.textContent = "";
        });
        ui.bandeja.innerHTML = "";
        var g = el("div", "cinta-grupo");
        g.appendChild(el("span", "cinta-grupo-titulo", "Acciones para resolver el problema (tocá una o arrastrala a su fase)"));
        mezclar(acciones.map(function (a, i) { return i; })).forEach(function (i) {
          g.appendChild(ficha("paso-" + i, acciones[i]));
        });
        ui.bandeja.appendChild(g);
        marcarActual();
        actualizarHud();
      }

      /* La acción k de cada problema corresponde a la fase k */
      function usar(f, d) {
        if (!activo || !d || d.dataset.drop !== "cuadrante") return;
        var acciones = pd.problemas[vuelta].acciones;
        var k = Number(f.dataset.ficha.slice(5));
        var q = Number(d.dataset.idx);
        if (q !== siguiente) {
          errores++;
          actualizarHud();
          ui.rechazar(d, "El ciclo va en orden: ahora toca " + pd.fases[siguiente] + ".");
          return;
        }
        if (k !== q) {
          errores++;
          actualizarHud();
          ui.rechazar(d, "«" + acciones[k] + "» no es " + pd.fases[q] + ": es " + pd.fases[k] + " (" + pd.significados[k] + ").");
          return;
        }
        cuadrantes[q].paso.textContent = "✓";
        cuadrantes[q].el.classList.add("hecho");
        f.remove();
        sonido.bien();
        siguiente++;
        marcarActual();
        if (siguiente < pd.fases.length) ui.decir("✓ " + pd.fases[q] + ": " + acciones[k] + ".", "bien");
        else vueltaCompleta();
      }

      function vueltaCompleta() {
        activo = false;
        indicador += pd.mejoraPorVuelta;
        valor.textContent = porcentaje(indicador);
        destello(centro, "sube");
        pregunta.textContent = "¡Vuelta completa! El problema quedó resuelto.";
        vuelta++;
        if (vuelta < pd.problemas.length) {
          ui.decir("Entregas exitosas: " + porcentaje(indicador) + ". Pero apareció un problema nuevo…", "bien");
          setTimeout(function () { nuevaVuelta(); activo = true; }, 2200);
          return;
        }
        ui.decir("La meta se mueve: mejorar nunca termina.", "bien");
        setTimeout(function () {
          var est = errores <= 1 ? 3 : errores <= 4 ? 2 : 1;
          terminar(est, "Vueltas completas: " + vuelta + " · Entregas exitosas: " + porcentaje(indicador) + " · Errores: " + errores);
        }, 1800);
      }

      activarArrastre(ui.raiz, {
        puedeArrastrar: function () { return activo; },
        alLevantar: function () {},
        alSoltar: usar,
        alTocar: function (f) {
          /* Tocar una acción la prueba en la fase que toca ahora */
          if (activo && f && siguiente < cuadrantes.length) usar(f, cuadrantes[siguiente].el);
        }
      });

      nuevaVuelta();

      return function () {
        activo = true;
        ui.decir("Empezá por Planificar: tocá la acción que corresponde.", "");
      };
    }

    /* ---------- Cierre: línea de tiempo ---------- */
    function cierre() {
      raiz.innerHTML = "";
      var c = el("div", "cinta-final");
      c.appendChild(el("h2", "", "Así evolucionó la calidad"));
      var ol = el("ol", "cinta-linea");
      cfg.hitos.forEach(function (h, i) {
        var li = el("li");
        li.style.animationDelay = i * 0.6 + "s";
        li.appendChild(el("strong", "", h.titulo));
        li.appendChild(el("p", "", h.frase));
        if (estrellas[i]) li.appendChild(dibujarEstrellas(estrellas[i]));
        ol.appendChild(li);
      });
      c.appendChild(ol);
      var m = el("p", "cinta-mensaje-final", cfg.mensajeFinal);
      m.style.animationDelay = cfg.hitos.length * 0.6 + "s";
      c.appendChild(m);
      var acciones = el("div", "cinta-acciones");
      acciones.appendChild(boton("Jugar de nuevo", empezar));
      var volver = el("a", "cinta-link", "Volver al inicio");
      volver.href = "index.html";
      acciones.appendChild(volver);
      c.appendChild(acciones);
      raiz.appendChild(c);
    }
  }

  window.Juego = window.Juego || {};
  window.Juego.cinta = cinta;
})();
