/* Minijuego 2 "Mesa de Datos": Juego.mesa */
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";

  var ICONOS = {
    barras: '<path d="M3 20h18"/><path d="M6 20V9M11 20V4M16 20v-8M20 20v-4"/>',
    espina: '<path d="M2 12h15"/><path d="M17 8l5 4-5 4z"/><path d="M5 6l3 6M11 6l3 6M5 18l3-6M11 18l3-6"/>',
    flechas: '<rect x="7" y="2" width="10" height="5" rx="2.5"/><path d="M12 7v3"/><path d="M12 10l5 4-5 4-5-4z"/><path d="M12 18v4"/>',
    control: '<path d="M3 5h18M3 19h18" stroke-dasharray="2 2"/><path d="M3 13l4-3 3 3 4-5 3 7 4-3"/>',
    sonido: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>',
    silencio: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'
  };

  /* Pistas cuando una tarjeta del flujo no coincide con el símbolo */
  var PISTA_FORMA = {
    ovalo: "es el inicio o el fin del proceso: va en un óvalo.",
    rect: "es una tarea que alguien hace: va en un rectángulo.",
    rombo: "es una pregunta: va en un rombo, que tiene dos salidas (Sí y No)."
  };

  /* Números al azar con semilla: el lote del muestreo es siempre el mismo */
  function azarFijo(semilla) {
    return function () {
      semilla = semilla + 0x6D2B79F5 | 0;
      var t = Math.imul(semilla ^ semilla >>> 15, 1 | semilla);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function mezclar(lista, azar) {
    azar = azar || Math.random;
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(azar() * (i + 1));
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

  function svg(tag, attrs) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function icono(nombre) {
    var s = svg("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", "class": "mesa-icono" });
    s.innerHTML = ICONOS[nombre] || "";
    return s;
  }

  function boton(texto, alTocar) {
    var b = el("button", "btn", texto);
    b.type = "button";
    b.addEventListener("click", alTocar);
    return b;
  }

  function sumar(lista) {
    return lista.reduce(function (a, b) { return a + b; }, 0);
  }

  function enumerar(nombres) {
    if (nombres.length < 2) return nombres.join("");
    return nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1];
  }

  function porcentaje(n, decimales) {
    return n.toLocaleString("es-AR", { maximumFractionDigits: decimales || 0 }) + " %";
  }

  function destello(elem, clase) {
    elem.classList.remove(clase);
    void elem.offsetWidth;
    elem.classList.add(clase);
    setTimeout(function () { elem.classList.remove(clase); }, 600);
  }

  /* Posición de un elemento relativa a otro */
  function caja(elem, base) {
    var r = elem.getBoundingClientRect();
    var b = base.getBoundingClientRect();
    var c = { l: r.left - b.left, t: r.top - b.top, w: r.width, h: r.height };
    c.r = c.l + c.w; c.b = c.t + c.h; c.cx = c.l + c.w / 2; c.cy = c.t + c.h / 2;
    return c;
  }

  /* Redibuja algo cuando cambia el tamaño de la ventana, mientras el elemento siga en pantalla */
  function alRedimensionar(elem, fn) {
    function f() {
      if (!elem.isConnected) { window.removeEventListener("resize", f); return; }
      fn();
    }
    window.addEventListener("resize", f);
  }

  /* Marcas de conteo agrupadas de a cinco (lista de verificación) */
  function marcasConteo(n) {
    var grupos = Math.ceil(n / 5);
    var s = svg("svg", { viewBox: "0 0 " + Math.max(1, grupos * 15) + " 18", "aria-hidden": "true" });
    s.style.width = grupos * 15 + "px";
    for (var g = 0; g < grupos; g++) {
      var c = Math.min(5, n - g * 5);
      for (var j = 0; j < Math.min(c, 4); j++) {
        var x = g * 15 + 2 + j * 3;
        s.appendChild(svg("line", { x1: x, y1: 2, x2: x, y2: 16 }));
      }
      if (c === 5) s.appendChild(svg("line", { x1: g * 15, y1: 14, x2: g * 15 + 13, y2: 4 }));
    }
    return s;
  }

  function crearSonido() {
    var ctx = null;
    var activo = true;
    function tono(frecuencia, duracion, demora, volumen) {
      if (!activo) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        var t = ctx.currentTime + (demora || 0);
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.frequency.value = frecuencia;
        g.gain.setValueAtTime(volumen || 0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + duracion);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + duracion);
      } catch (e) { /* el navegador no permite sonido: se juega igual */ }
    }
    return {
      tic: function () { tono(1040, 0.05, 0, 0.05); },
      bien: function () { tono(660, 0.12); tono(880, 0.16, 0.09); },
      mal: function () { tono(196, 0.3); },
      alarma: function () { tono(520, 0.12); tono(390, 0.2, 0.12); },
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
        if (d && contenedor.contains(d) && d !== actual.fuente) return d;
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
        actual.fantasma.classList.add("mesa-fantasma");
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
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
      if (!a.fantasma) {
        actual = null;
        ultimoToque = { fuente: a.fuente, t: Date.now() };
        op.alTocar(a.fuente, a.fuente.closest("[data-drop]"));
        return;
      }
      var destino = ev.type === "pointerup" ? destinoEn(ev.clientX, ev.clientY) : null;
      actual = null;
      ultimoArrastre = Date.now();
      a.fantasma.remove();
      a.fuente.classList.remove("levantado");
      if (a.sobre) a.sobre.classList.remove("sobre");
      op.alSoltar(a.fuente, destino);
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

    /* Clics que no pasaron por pointerdown/up: destinos o teclado */
    contenedor.addEventListener("click", function (ev) {
      if (ev.target.closest(".btn")) return; /* los botones tienen su propia acción */
      var fuente = ev.target.closest("[data-drag]");
      /* Ignora solo el clic que el navegador genera al soltar un arrastre: se puede tocar rápido después */
      if (Date.now() - ultimoArrastre < 200) return;
      if (ultimoToque && ultimoToque.fuente === fuente && Date.now() - ultimoToque.t < 1000) {
        ultimoToque = null;
        return;
      }
      op.alTocar(fuente, ev.target.closest("[data-drop]"));
    });
  }

  function mesa(cfg) {
    var raiz = document.getElementById(cfg.contenedor);
    var sonido = crearSonido();
    var errores = 0;

    /* Estaciones en orden; "etapa" es el casillero de la barra de progreso */
    var ESTACIONES = [
      { clave: "conteo", etapa: 0, jugar: jugarConteo },
      { clave: "causas", etapa: 1, jugar: jugarCausas },
      { clave: "flujo", etapa: 2, jugar: jugarFlujo },
      { clave: "control", etapa: 3, jugar: jugarControl },
      { clave: "muestreo", etapa: 3, jugar: jugarMuestreo }
    ];

    portada();

    function portada() {
      raiz.innerHTML = "";
      var c = el("div", "mesa-portada");
      c.appendChild(el("p", "mesa-intro", cfg.intro));
      var lista = el("ol", "mesa-portada-etapas");
      cfg.etapas.forEach(function (e, k) {
        var li = el("li");
        li.appendChild(icono(e.icono));
        li.appendChild(el("span", "", k + 1 + ". " + e.corto));
        lista.appendChild(li);
      });
      c.appendChild(lista);
      c.appendChild(el("p", "mesa-aviso", cfg.aviso));
      c.appendChild(boton("Empezar", empezar));
      raiz.appendChild(c);
    }

    function empezar() {
      errores = 0;
      estacion(0);
    }

    function estacion(i) {
      var e = ESTACIONES[i];
      var info = cfg[e.clave];
      var ui = armarPantalla(e.etapa, info.titulo);
      var arrancar = e.jugar(ui, info, terminar);
      tarjeta(ui, [el("h2", "", info.titulo), el("p", "mesa-herramientas", info.herramientas), el("p", "", info.consigna)],
        "Empezar", arrancar);

      function terminar(resumen) {
        sonido.bien();
        var ultima = i === ESTACIONES.length - 1;
        var ap = el("p", "mesa-aprendizaje");
        ap.appendChild(el("strong", "", "Lo que descubriste: "));
        ap.appendChild(document.createTextNode(info.aprendizaje));
        tarjeta(ui, [el("h2", "", "✓ " + info.titulo), el("p", "mesa-resumen", resumen), ap],
          ultima ? "Ver el resumen" : "Siguiente estación",
          function () { if (ultima) cierre(); else estacion(i + 1); });
      }
    }

    function armarPantalla(etapa, titulo) {
      raiz.innerHTML = "";
      var ui = { actualizar: function () {} };
      ui.raiz = el("div", "mesa");

      var prog = el("ol", "mesa-progreso");
      prog.setAttribute("aria-label", "Estación " + (etapa + 1) + " de " + cfg.etapas.length);
      cfg.etapas.forEach(function (e, k) {
        var li = el("li", k < etapa ? "hecha" : k === etapa ? "actual" : "");
        li.appendChild(icono(e.icono));
        li.appendChild(el("span", "", e.corto));
        prog.appendChild(li);
      });
      ui.raiz.appendChild(prog);

      var hud = el("div", "mesa-hud");
      hud.appendChild(el("strong", "mesa-titulo", titulo));
      ui.datos = el("div", "mesa-datos");
      hud.appendChild(ui.datos);
      var bs = el("button", "mesa-sonido");
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

      ui.escenario = el("div", "mesa-escenario");
      ui.raiz.appendChild(ui.escenario);
      ui.mensaje = el("p", "mesa-mensaje");
      ui.mensaje.setAttribute("aria-live", "polite");
      ui.raiz.appendChild(ui.mensaje);
      ui.bandeja = el("div", "mesa-bandeja");
      ui.raiz.appendChild(ui.bandeja);
      ui.tarjeta = el("div", "mesa-tarjeta");
      ui.tarjeta.hidden = true;
      ui.raiz.appendChild(ui.tarjeta);
      raiz.appendChild(ui.raiz);

      ui.decir = function (texto, tipo) {
        ui.mensaje.textContent = texto;
        ui.mensaje.className = "mesa-mensaje" + (tipo ? " " + tipo : "");
      };
      ui.hud = function (pares) {
        ui.datos.innerHTML = "";
        pares.concat([["Errores", errores]]).forEach(function (p) {
          var s = el("span", "", p[0] + " ");
          s.appendChild(el("b", "", String(p[1])));
          ui.datos.appendChild(s);
        });
      };
      /* Todo error suma al nivel de analista y siempre deja una pista */
      ui.rechazar = function (elem, texto) {
        errores++;
        elem.classList.remove("sacudir");
        void elem.offsetWidth;
        elem.classList.add("sacudir");
        sonido.mal();
        ui.decir(texto, "mal");
        ui.actualizar();
      };
      ui.terminarCon = function (texto, accion) {
        ui.bandeja.innerHTML = "";
        var b = boton(texto, accion);
        b.classList.add("mesa-seguir");
        ui.bandeja.appendChild(b);
      };
      return ui;
    }

    function tarjeta(ui, nodos, textoBoton, accion) {
      ui.tarjeta.innerHTML = "";
      var c = el("div", "mesa-tarjeta-caja");
      nodos.forEach(function (nodo) { c.appendChild(nodo); });
      var b = boton(textoBoton, function () {
        ui.tarjeta.hidden = true;
        accion();
      });
      c.appendChild(b);
      ui.tarjeta.appendChild(c);
      ui.tarjeta.hidden = false;
      if (ui.raiz.getBoundingClientRect().top < 0) ui.raiz.scrollIntoView({ block: "start" });
      b.focus({ preventScroll: true });
    }

    /* ---------- Estación 1: lista de verificación, histograma y Pareto ---------- */
    function jugarConteo(ui, info, terminar) {
      var motivos = info.motivos;
      var cantidades = motivos.map(function (m) { return m.cantidad; });
      var total = sumar(cantidades);
      var escala = Math.max.apply(null, cantidades) + 1;
      var tickets = [];
      motivos.forEach(function (m, i) { for (var k = 0; k < m.cantidad; k++) tickets.push(i); });
      tickets = mezclar(tickets);
      var cuenta = motivos.map(function () { return 0; });
      var orden = motivos.map(function (m, i) { return i; });
      var acum = [];
      var objetivo = 0;
      var hechos = 0;
      var fase = "espera";
      var sel = null;

      var esc = ui.escenario;
      var pila = el("div", "mesa-pila");
      var ticket = el("div", "mesa-ticket");
      ticket.dataset.drag = "ticket";
      var cuentaPila = el("span", "mesa-pila-cuenta");
      pila.appendChild(ticket);
      pila.appendChild(cuentaPila);
      esc.appendChild(pila);

      var grafico = el("div", "mesa-grafico");
      var cols = motivos.map(function (m, i) {
        var c = el("button", "mesa-col");
        c.type = "button";
        c.dataset.drop = "col";
        c.dataset.idx = i;
        c.setAttribute("aria-label", m.nombre);
        var marcas = el("span", "mesa-marcas");
        var area = el("span", "mesa-col-area");
        var barra = el("span", "mesa-barra");
        var num = el("span", "mesa-barra-num", "0");
        barra.appendChild(num);
        area.appendChild(barra);
        c.appendChild(marcas);
        c.appendChild(area);
        c.appendChild(el("span", "mesa-col-nombre", m.corto));
        grafico.appendChild(c);
        return { el: c, marcas: marcas, area: area, barra: barra, num: num };
      });
      var capa = svg("svg", { "class": "mesa-pareto", "aria-hidden": "true" });
      grafico.appendChild(capa);
      esc.appendChild(grafico);

      function actualizarHud() {
        ui.hud([["Tickets", hechos + "/" + total]]);
      }
      ui.actualizar = actualizarHud;

      function mostrarTicket() {
        ticket.innerHTML = "";
        ticket.appendChild(el("span", "mesa-ticket-num", "Ticket " + (hechos + 1) + " · visita fallida"));
        ticket.appendChild(el("strong", "", motivos[tickets[hechos]].nombre));
        cuentaPila.textContent = total - hechos + " en la pila";
        destello(ticket, "llega");
      }

      function anotar(i) {
        cuenta[i]++;
        hechos++;
        var c = cols[i];
        c.marcas.innerHTML = "";
        c.marcas.appendChild(marcasConteo(cuenta[i]));
        c.barra.style.height = cuenta[i] / escala * 100 + "%";
        c.num.textContent = cuenta[i];
        actualizarHud();
      }

      function colocar(i) {
        if (fase !== "contar") return;
        var m = tickets[hechos];
        if (m !== i) {
          destello(ticket, "rebota");
          ui.rechazar(cols[i].el, "Este ticket dice «" + motivos[m].nombre + "»: va en el casillero «" + motivos[m].corto + "».");
          return;
        }
        anotar(i);
        sonido.tic();
        ui.decir("Una marca más en «" + motivos[i].corto + "»: la barra crece.", "");
        if (hechos === total) { conteoListo(); return; }
        mostrarTicket();
        if (hechos === info.aMano) ofrecerAuto();
      }

      function ofrecerAuto() {
        ui.decir("¡Bien! Ya viste cómo se cuenta. Podés seguir a mano o cargar el resto de una vez.", "bien");
        ui.bandeja.innerHTML = "";
        var b = boton("Cargar los " + (total - hechos) + " tickets restantes", cargarResto);
        b.classList.add("mesa-seguir");
        ui.bandeja.appendChild(b);
      }

      function cargarResto() {
        fase = "auto";
        ui.bandeja.innerHTML = "";
        var t = setInterval(function () {
          anotar(tickets[hechos]);
          sonido.tic();
          if (hechos < total) { mostrarTicket(); return; }
          clearInterval(t);
          conteoListo();
        }, 70);
      }

      function conteoListo() {
        fase = "listo";
        ticket.hidden = true;
        cuentaPila.textContent = "Pila vacía: " + total + " tickets contados";
        ui.decir("Las marcas son la lista de verificación y las barras forman el histograma. ¿Cuál es el problema grande? Ordená para verlo.", "");
        ui.terminarCon("Ordenar", empezarOrden);
      }

      function ordenado() {
        return orden.every(function (m, k) { return k === 0 || cuenta[orden[k - 1]] >= cuenta[m]; });
      }

      function empezarOrden() {
        ui.bandeja.innerHTML = "";
        if (ordenado()) { mostrarPareto(); return; }
        fase = "ordenar";
        cols.forEach(function (c) {
          c.el.dataset.drag = "col";
          c.el.classList.add("movible");
        });
        ui.decir("Arrastrá una barra sobre otra (o tocá dos barras) para cambiarlas de lugar. Dejalas de mayor a menor.", "");
      }

      function elegir(f) {
        if (sel) sel.classList.remove("elegida");
        sel = f;
        if (f) f.classList.add("elegida");
      }

      function intercambiar(a, b) {
        var ia = orden.indexOf(Number(a.dataset.idx));
        var ib = orden.indexOf(Number(b.dataset.idx));
        var t = orden[ia]; orden[ia] = orden[ib]; orden[ib] = t;
        orden.forEach(function (m) { grafico.appendChild(cols[m].el); });
        grafico.appendChild(capa);
        sonido.tic();
        if (ordenado()) mostrarPareto();
      }

      function mostrarPareto() {
        fase = "pareto";
        cols.forEach(function (c) {
          delete c.el.dataset.drag;
          c.el.classList.remove("movible", "elegida");
        });
        var suma = 0;
        acum = orden.map(function (m) { suma += cuenta[m]; return suma / total * 100; });
        for (objetivo = 0; acum[objetivo] < 80; objetivo++);
        dibujarPareto();
        alRedimensionar(grafico, dibujarPareto);
        sonido.bien();
        ui.decir("¡Ordenadas! La línea suma el porcentaje acumulado de izquierda a derecha (Pareto). Tocá el punto donde llega al 80 %.", "bien");
      }

      function dibujarPareto() {
        var g = grafico.getBoundingClientRect();
        capa.setAttribute("viewBox", "0 0 " + g.width + " " + g.height);
        capa.innerHTML = "";
        grafico.querySelectorAll(".mesa-punto").forEach(function (p) { p.remove(); });
        var a0 = caja(cols[orden[0]].area, grafico);
        var aN = caja(cols[orden[orden.length - 1]].area, grafico);
        function y(p) { return a0.t + a0.h * (1 - p / 100); }
        capa.appendChild(svg("line", { "class": "mesa-linea-80", x1: a0.l, x2: aN.r, y1: y(80), y2: y(80) }));
        var t80 = svg("text", { x: aN.r, y: y(80) - 4, "text-anchor": "end" });
        t80.textContent = "80 %";
        capa.appendChild(t80);
        var pts = orden.map(function (m, k) {
          return [caja(cols[m].area, grafico).cx, y(acum[k])];
        });
        capa.appendChild(svg("polyline", { "class": "mesa-linea-acum", points: pts.map(function (p) { return p.join(","); }).join(" ") }));
        pts.forEach(function (p, k) {
          var b = el("button", "mesa-punto");
          b.type = "button";
          b.dataset.drop = "punto";
          b.dataset.k = k;
          b.style.left = p[0] + "px";
          b.style.top = p[1] + "px";
          b.setAttribute("aria-label", "Acumulado " + porcentaje(acum[k]));
          b.appendChild(el("span", "", porcentaje(acum[k])));
          if (fase === "fin") b.classList.add(k <= objetivo ? "vital" : "trivial");
          grafico.appendChild(b);
        });
      }

      function tocarPunto(k, punto) {
        if (fase !== "pareto") return;
        if (k < objetivo) {
          ui.rechazar(punto, "Hasta acá se explica el " + porcentaje(acum[k]) + " de las fallas: todavía no llega al 80 %.");
          return;
        }
        if (k > objetivo) {
          ui.rechazar(punto, "Acá ya se pasó del 80 %: buscá el primer punto que lo alcanza.");
          return;
        }
        fase = "fin";
        orden.forEach(function (m, j) {
          cols[m].el.classList.add(j <= objetivo ? "vital" : "trivial");
          if (motivos[m].alerta) cols[m].el.classList.add("alerta");
        });
        dibujarPareto();
        sonido.bien();
        var vitales = orden.slice(0, objetivo + 1).map(function (m) { return motivos[m].corto; });
        ui.decir("Los pocos vitales: " + enumerar(vitales) + " explican el " + porcentaje(acum[objetivo]) + " de las entregas fallidas.", "bien");
        ui.bandeja.innerHTML = "";
        ui.bandeja.appendChild(el("p", "mesa-nota", info.nota));
        var b = boton("Terminar estación", function () {
          terminar("Tickets contados: " + total + " · Pocos vitales: " + enumerar(vitales) + " (" + porcentaje(acum[objetivo]) + ")");
        });
        b.classList.add("mesa-seguir");
        ui.bandeja.appendChild(b);
      }

      activarArrastre(ui.raiz, {
        puedeArrastrar: function (f) {
          return (fase === "contar" && f === ticket) || (fase === "ordenar" && f.dataset.drag === "col");
        },
        alLevantar: function () { elegir(null); },
        alSoltar: function (f, d) {
          if (!d || d.dataset.drop !== "col") return;
          if (f === ticket) colocar(Number(d.dataset.idx));
          else if (fase === "ordenar" && d !== f) intercambiar(f, d);
        },
        alTocar: function (f, d) {
          if (fase === "contar") {
            if (d && d.dataset.drop === "col") colocar(Number(d.dataset.idx));
            else if (f) ui.decir("Arrastrá el ticket hasta su casillero, o tocá el casillero.", "");
          } else if (fase === "ordenar" && f) {
            if (!sel) elegir(f);
            else if (sel === f) elegir(null);
            else { var s = sel; elegir(null); intercambiar(s, f); }
          } else if (fase === "pareto" && d && d.dataset.drop === "punto") {
            tocarPunto(Number(d.dataset.k), d);
          }
        }
      });

      mostrarTicket();
      actualizarHud();

      return function () {
        fase = "contar";
        ui.decir("Arrastrá cada ticket a su casillero (o tocá el casillero).", "");
      };
    }

    /* ---------- Estación 2: diagrama de causa y efecto ---------- */
    function jugarCausas(ui, info, terminar) {
      var tarjetas = mezclar(info.tarjetas);
      var actual = 0;
      var activo = false;
      var mitad = Math.ceil(info.ramas.length / 2);

      var espina = el("div", "mesa-espina");
      espina.style.setProperty("--cols", mitad);
      var ramas = info.ramas.map(function (nombre, r) {
        var arriba = r < mitad;
        var b = el("button", "mesa-rama " + (arriba ? "arriba" : "abajo"));
        b.type = "button";
        b.dataset.drop = "rama";
        b.dataset.idx = r;
        b.style.gridColumn = r % mitad + 1;
        b.style.gridRow = arriba ? 1 : 3;
        b.appendChild(el("strong", "", nombre));
        var lista = el("span", "mesa-rama-causas");
        b.appendChild(lista);
        espina.appendChild(b);
        return { el: b, lista: lista, n: 0 };
      });
      var eje = el("div", "mesa-eje");
      eje.style.gridColumn = "1 / " + (mitad + 1);
      espina.appendChild(eje);
      var cabeza = el("div", "mesa-cabeza", info.efecto);
      cabeza.style.gridColumn = mitad + 1;
      espina.appendChild(cabeza);
      ui.escenario.appendChild(espina);

      var tarjetaCausa = el("div", "mesa-causa");
      tarjetaCausa.dataset.drag = "causa";

      function actualizarHud() {
        ui.hud([["Causas", actual + "/" + tarjetas.length]]);
      }
      ui.actualizar = actualizarHud;

      function mostrar() {
        ui.bandeja.innerHTML = "";
        tarjetaCausa.textContent = tarjetas[actual].texto;
        ui.bandeja.appendChild(el("span", "mesa-grupo-titulo", "Causa " + (actual + 1) + " de " + tarjetas.length + ": arrastrala a su espina o tocá la espina"));
        ui.bandeja.appendChild(tarjetaCausa);
        destello(tarjetaCausa, "llega");
      }

      function colocar(r) {
        if (!activo) return;
        var t = tarjetas[actual];
        if (t.rama !== info.ramas[r]) {
          destello(tarjetaCausa, "rebota");
          ui.rechazar(ramas[r].el, "No va en " + info.ramas[r] + ". Pista: " + t.pista);
          return;
        }
        ramas[r].lista.appendChild(el("span", "mesa-chip", t.texto));
        ramas[r].n++;
        destello(ramas[r].el, "recibe");
        sonido.bien();
        actual++;
        actualizarHud();
        if (actual < tarjetas.length) {
          ui.decir("✓ " + t.rama + ".", "bien");
          mostrar();
          return;
        }
        activo = false;
        var usadas = ramas.filter(function (x) { return x.n; }).length;
        ui.decir("Todas las causas están en su rama. El problema tiene causas en " + usadas + " ramas distintas: no hay un único culpable.", "bien");
        ui.terminarCon("Terminar estación", function () {
          terminar("Causas clasificadas: " + tarjetas.length + " · Ramas con causas: " + usadas + " de " + ramas.length);
        });
      }

      activarArrastre(ui.raiz, {
        puedeArrastrar: function () { return activo; },
        alLevantar: function () {},
        alSoltar: function (f, d) {
          if (d && d.dataset.drop === "rama") colocar(Number(d.dataset.idx));
        },
        alTocar: function (f, d) {
          if (!activo) return;
          if (d && d.dataset.drop === "rama") colocar(Number(d.dataset.idx));
          else if (f) ui.decir("Arrastrá la tarjeta hasta su espina, o tocá la espina.", "");
        }
      });

      mostrar();
      actualizarHud();

      return function () {
        activo = true;
        ui.decir("¿En qué espina va esta causa?", "");
      };
    }

    /* ---------- Estación 3: diagrama de flujo ---------- */
    function jugarFlujo(ui, info, terminar) {
      var pasos = info.pasos;
      var iDec = -1, iNo = -1, iSi = -1;
      pasos.forEach(function (p, k) {
        if (p.forma === "rombo") iDec = k;
        if (p.rama === "No") iNo = k;
        if (p.rama === "Sí") iSi = k;
      });
      var principal = pasos.map(function (p, k) { return k; }).filter(function (k) { return k !== iNo; });
      var llenos = [];
      var siguiente = 0;
      var activo = false;

      var flujo = el("div", "mesa-flujo");
      var capa = svg("svg", { "class": "mesa-flechas", "aria-hidden": "true" });
      flujo.appendChild(capa);
      var filaDec = 1;
      var slots = [];
      principal.forEach(function (k, fila) {
        slots[k] = crearSlot(k, 1, fila + 1);
        if (k === iDec) filaDec = fila + 1;
      });
      if (iNo >= 0) slots[iNo] = crearSlot(iNo, 2, filaDec);
      var cartel = el("p", "mesa-cartel", info.cartel);
      cartel.style.gridColumn = 2;
      cartel.style.gridRow = filaDec + 1;
      cartel.hidden = true;
      flujo.appendChild(cartel);
      ui.escenario.appendChild(flujo);

      function crearSlot(k, col, fila) {
        var b = el("button", "mesa-slot forma-" + pasos[k].forma);
        b.type = "button";
        b.dataset.drop = "slot";
        b.dataset.idx = k;
        b.style.gridColumn = col;
        b.style.gridRow = fila;
        if (pasos[k].forma === "rombo") {
          var s = svg("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true" });
          s.appendChild(svg("polygon", { points: "50,2 98,50 50,98 2,50" }));
          b.appendChild(s);
        }
        var t = el("span", "mesa-slot-texto", String(k + 1));
        b.appendChild(t);
        b.setAttribute("aria-label", "Casillero " + (k + 1));
        flujo.appendChild(b);
        return { el: b, texto: t };
      }

      function actualizarHud() {
        ui.hud([["Pasos", siguiente + "/" + pasos.length]]);
      }
      ui.actualizar = actualizarHud;

      function flecha(d, clase, etiqueta, ex, ey) {
        var g = svg("g", { "class": clase || "" });
        g.appendChild(svg("path", { d: d, "marker-end": "url(#mesa-punta)" }));
        if (etiqueta) {
          var t = svg("text", { x: ex, y: ey });
          t.textContent = etiqueta;
          g.appendChild(t);
        }
        capa.appendChild(g);
      }

      function dibujarFlechas() {
        var f = flujo.getBoundingClientRect();
        capa.setAttribute("viewBox", "0 0 " + f.width + " " + f.height);
        capa.innerHTML = '<defs><marker id="mesa-punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>';
        function c(k) { return caja(slots[k].el, flujo); }
        for (var j = 0; j + 1 < principal.length; j++) {
          var a = principal[j], b = principal[j + 1];
          if (!llenos[a] || !llenos[b]) continue;
          var ca = c(a), cb = c(b);
          flecha("M" + ca.cx + " " + ca.b + "V" + (cb.t - 1), "", a === iDec ? "Sí" : "", ca.cx + 6, (ca.b + cb.t) / 2 + 4);
        }
        if (iNo >= 0 && llenos[iDec] && llenos[iNo]) {
          var cd = c(iDec), cn = c(iNo);
          flecha("M" + cd.r + " " + cd.cy + "H" + (cn.l - 1), "bucle", "No", cd.r + 2, cd.cy - 7);
        }
        var vuelve = iNo >= 0 ? pasos[iNo].vuelveA : -1;
        if (vuelve >= 0 && llenos[iNo] && llenos[vuelve]) {
          var cr = c(iNo), cv = c(vuelve);
          flecha("M" + cr.cx + " " + cr.t + "V" + cv.cy + "H" + (cv.r + 1), "bucle");
        }
      }

      function pintarSiguiente() {
        slots.forEach(function (s, k) { s.el.classList.toggle("siguiente", k === siguiente); });
      }

      function armarBandeja() {
        ui.bandeja.innerHTML = "";
        var g = el("div", "mesa-grupo");
        g.appendChild(el("span", "mesa-grupo-titulo", "Pasos sueltos: tocá el que sigue o arrastralo al casillero resaltado"));
        mezclar(pasos.map(function (p, k) { return k; })).forEach(function (k) {
          var b = el("button", "mesa-ficha", pasos[k].texto);
          b.type = "button";
          b.dataset.drag = "paso";
          b.dataset.idx = k;
          g.appendChild(b);
        });
        ui.bandeja.appendChild(g);
      }

      function colocar(f, si) {
        if (!activo) return;
        var pi = Number(f.dataset.idx);
        if (si !== siguiente) {
          ui.decir("Conectá en orden: ahora sigue el casillero " + (siguiente + 1) + ", el resaltado.", "");
          destello(slots[siguiente].el, "pide");
          return;
        }
        var slot = slots[si].el;
        if (pi !== si) {
          var texto = "«" + pasos[pi].texto + "» ";
          if (pasos[pi].forma !== pasos[si].forma) ui.rechazar(slot, texto + PISTA_FORMA[pasos[pi].forma]);
          else ui.rechazar(slot, texto + "tiene el símbolo correcto, pero va más adelante en el proceso.");
          return;
        }
        llenos[si] = true;
        slots[si].texto.textContent = pasos[si].texto;
        slot.classList.add("lleno");
        slot.setAttribute("aria-label", pasos[si].texto);
        f.remove();
        siguiente++;
        sonido.bien();
        pintarSiguiente();
        dibujarFlechas();
        actualizarHud();
        if (siguiente < pasos.length) {
          ui.decir("✓ " + pasos[si].texto + ".", "bien");
          return;
        }
        activo = false;
        flujo.classList.add("cerrado");
        cartel.hidden = false;
        ui.decir("¡Flujo cerrado! Mirá el camino del «No»: es el bucle de reintento, donde el problema se repite.", "bien");
        ui.terminarCon("Terminar estación", function () {
          terminar("Pasos conectados: " + pasos.length + " · Óvalo: inicio y fin · Rectángulo: tarea · Rombo: decisión");
        });
      }

      activarArrastre(ui.raiz, {
        puedeArrastrar: function () { return activo; },
        alLevantar: function () {},
        alSoltar: function (f, d) {
          if (d && d.dataset.drop === "slot") colocar(f, Number(d.dataset.idx));
        },
        alTocar: function (f) {
          if (activo && f) colocar(f, siguiente);
          else if (activo) ui.decir("Tocá uno de los pasos sueltos de abajo.", "");
        }
      });

      armarBandeja();
      pintarSiguiente();
      actualizarHud();
      alRedimensionar(flujo, dibujarFlechas);

      return function () {
        activo = true;
        ui.decir("¿Con qué empieza el proceso? Tocá el primer paso.", "");
      };
    }

    /* ---------- Estación 4a: gráfico de control ---------- */
    function jugarControl(ui, info, terminar) {
      var P = info.puntos;
      var N = P.length;
      var senales = {};
      info.senales.forEach(function (s) { senales[s.dia] = s; });
      var dia = 0;
      var activa = null;
      var pausa = true;
      var detectadas = 0, falsas = 0, reclamos = 0;

      var W = 340, H = 210, X0 = 30, X1 = W - 40, Y0 = 10, Y1 = H - 24;
      function fx(d) { return X0 + (d - 0.5) * (X1 - X0) / N; }
      function fy(v) { return Y1 - (v - info.escala[0]) / (info.escala[1] - info.escala[0]) * (Y1 - Y0); }

      var grafico = svg("svg", { "class": "mesa-control", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Gráfico de control: porcentaje de entregas exitosas por día" });
      function linea(v, clase, etiqueta, derecha) {
        grafico.appendChild(svg("line", { "class": clase, x1: X0, x2: X1, y1: fy(v), y2: fy(v) }));
        var t = svg("text", { "class": clase + "-texto", x: derecha ? X1 + 3 : X0 - 3, y: fy(v) + 3, "text-anchor": derecha ? "start" : "end" });
        t.textContent = etiqueta;
        grafico.appendChild(t);
      }
      linea(info.lsc, "mesa-limite", "LSC", true);
      linea(info.centro, "mesa-central", "LC", true);
      linea(info.lic, "mesa-limite", "LIC", true);
      linea(info.meta, "mesa-meta", "Meta", false);
      [info.escala[0], info.lic, info.centro, info.lsc, info.escala[1]].forEach(function (v) {
        if (v === info.meta) return;
        var t = svg("text", { "class": "mesa-eje-texto", x: X0 - 3, y: fy(v) + 3, "text-anchor": "end" });
        t.textContent = v;
        grafico.appendChild(t);
      });
      var tx = svg("text", { "class": "mesa-eje-texto", x: (X0 + X1) / 2, y: H - 6, "text-anchor": "middle" });
      tx.textContent = "Días →  (% de entregas exitosas)";
      grafico.appendChild(tx);
      var trazo = svg("polyline", { "class": "mesa-trazo", points: "" });
      grafico.appendChild(trazo);
      var puntos = svg("g", {});
      grafico.appendChild(puntos);
      var circulos = [];
      ui.escenario.appendChild(grafico);

      var frena = boton("Frená y revisá", frenar);
      frena.classList.add("mesa-frena");

      function actualizarHud() {
        ui.hud([["Día", dia + "/" + N], ["Señales", detectadas + "/" + info.senales.length], ["Falsas alarmas", falsas], ["Reclamos", reclamos]]);
      }
      ui.actualizar = actualizarHud;

      function fuera(v) { return v > info.lsc || v < info.lic; }

      function programar() {
        setTimeout(avanzar, info.intervalo * 1000);
      }

      function avanzar() {
        if (pausa || !frena.isConnected) return;
        dia++;
        var v = P[dia - 1];
        var c = svg("circle", { cx: fx(dia), cy: fy(v), r: 3.4, "class": fuera(v) ? "fuera" : "" });
        puntos.appendChild(c);
        circulos.push(c);
        trazo.setAttribute("points", P.slice(0, dia).map(function (p, k) { return fx(k + 1) + "," + fy(p); }).join(" "));
        if (senales[dia]) activa = senales[dia];
        else if (activa) reclamos++;
        actualizarHud();
        if (activa && (dia - activa.dia >= info.ventana || dia >= N)) { tarde(); return; }
        if (dia >= N) { fin(); return; }
        programar();
      }

      function marcarSenal(s) {
        var desde = s.racha ? s.dia - s.racha + 1 : s.dia;
        for (var d = desde; d <= s.dia; d++) circulos[d - 1].classList.add("senal");
      }

      function verSenal(s, titulo, extra) {
        pausa = true;
        activa = null;
        marcarSenal(s);
        var fuente = el("p", "mesa-fuente");
        fuente.appendChild(document.createTextNode("Fuente de variación: "));
        fuente.appendChild(el("strong", "", s.fuente));
        var nodos = [el("h2", "", titulo), el("p", "mesa-resumen", s.regla), fuente, el("p", "", s.detalle)];
        if (extra) nodos.push(el("p", "mesa-nota", extra));
        tarjeta(ui, nodos, "Seguir", seguir);
      }

      function seguir() {
        if (dia >= N) { fin(); return; }
        pausa = false;
        ui.decir("El proceso sigue. Atento a la próxima señal.", "");
        programar();
      }

      function frenar() {
        if (pausa) return;
        if (activa) {
          detectadas++;
          sonido.alarma();
          actualizarHud();
          verSenal(activa, "¡Bien frenado!");
          return;
        }
        var racha = info.senales.some(function (s) { return s.racha && dia > s.dia - s.racha + 2 && dia < s.dia; });
        if (racha) {
          ui.decir("Va bajando… pero todavía no es una racha: hacen falta 7 puntos seguidos en la misma dirección.", "");
          return;
        }
        falsas++;
        ui.rechazar(frena, "Falsa alarma: el punto está entre los límites. Es la variación normal del proceso, y frenar sin motivo también cuesta.");
      }

      function tarde() {
        errores++;
        sonido.mal();
        actualizarHud();
        verSenal(activa, "Llegaste tarde", "Mientras el proceso estaba fuera de control se acumularon reclamos.");
      }

      function fin() {
        pausa = true;
        frena.disabled = true;
        var prom = sumar(P) / N;
        ui.decir("Meta: " + porcentaje(info.meta) + " · Resultado obtenido: " + porcentaje(prom, 1) + " de promedio. Para llegar a la meta hay que mejorar el proceso, no solo vigilarlo.", "");
        setTimeout(function () {
          terminar("Señales detectadas a tiempo: " + detectadas + " de " + info.senales.length + " · Falsas alarmas: " + falsas +
            " · Reclamos: " + reclamos + " · Meta " + porcentaje(info.meta) + " / obtenido " + porcentaje(prom, 1));
        }, 2200);
      }

      ui.bandeja.appendChild(frena);
      actualizarHud();

      return function () {
        pausa = false;
        ui.decir("Un punto por día. Tocá «Frená y revisá» cuando veas una señal.", "");
        programar();
      };
    }

    /* ---------- Estación 4b: muestreo de aceptación ---------- */
    function jugarMuestreo(ui, info, terminar) {
      var L = info.lote;
      var D = info.defectuosos;
      var revisando = false;

      /* Probabilidad de que una muestra de n no tenga ningún dañado (se acepta un lote malo) */
      function riesgo(n) {
        var p = 1;
        for (var i = 0; i < D; i++) p *= Math.max(0, L - n - i) / (L - i);
        return p * 100;
      }
      function costo(n) { return n / L * 100; }

      var nSeguro = info.min;
      while (nSeguro < L && riesgo(nSeguro) > info.riesgoMax) nSeguro++;
      /* Orden fijo en que se destapan los paquetes y lugar de los dañados dentro de ese orden */
      var orden = mezclar(Array.apply(null, Array(L)).map(function (x, i) { return i; }), azarFijo(info.semilla));
      var lugares = [nSeguro - 3, 0.45, 0.6, 0.75, 0.9].slice(0, D).map(function (f, j) {
        return j === 0 ? f : Math.round(f * L);
      });
      var malos = {};
      lugares.forEach(function (k) { malos[orden[k]] = true; });

      var esc = ui.escenario;
      var lote = el("div", "mesa-lote");
      lote.setAttribute("role", "img");
      lote.setAttribute("aria-label", "Lote de " + L + " paquetes tapados");
      var celdas = [];
      for (var i = 0; i < L; i++) {
        var c = el("span", "mesa-celda");
        lote.appendChild(c);
        celdas.push(c);
      }
      esc.appendChild(lote);

      var panel = el("div", "mesa-muestreo");
      var etiqueta = el("label", "mesa-deslizador");
      var textoN = el("span", "");
      var rango = el("input");
      rango.type = "range";
      rango.min = info.min;
      rango.max = L;
      rango.value = info.inicial;
      etiqueta.appendChild(textoN);
      etiqueta.appendChild(rango);
      panel.appendChild(etiqueta);

      function medidor(nombre, limite) {
        var m = el("div", "mesa-medidor");
        var cab = el("div", "mesa-medidor-cab");
        cab.appendChild(el("span", "", nombre));
        var v = el("b", "");
        cab.appendChild(v);
        m.appendChild(cab);
        var pista = el("div", "mesa-medidor-pista");
        var barra = el("span", "mesa-medidor-barra");
        pista.appendChild(barra);
        var lim = el("span", "mesa-medidor-limite");
        lim.style.left = limite + "%";
        lim.title = "Límite aceptable: " + porcentaje(limite);
        pista.appendChild(lim);
        m.appendChild(pista);
        panel.appendChild(m);
        return { valor: v, barra: barra, el: m };
      }
      var mCosto = medidor("Costo de revisar", info.costoMax);
      var mRiesgo = medidor("Riesgo de dejar pasar un lote con dañados", info.riesgoMax);
      var zona = el("p", "mesa-zona");
      panel.appendChild(zona);
      esc.appendChild(panel);

      var revisar = boton("", revisarMuestra);
      revisar.classList.add("mesa-seguir");
      ui.bandeja.appendChild(revisar);

      function n() { return Number(rango.value); }

      function zonaDe(k) {
        if (costo(k) > info.costoMax) return "caro";
        if (riesgo(k) > info.riesgoMax) return "riesgoso";
        return "ok";
      }

      function actualizarHud() {
        ui.hud([["Muestra", n() + " de " + L]]);
      }
      ui.actualizar = actualizarHud;

      function pintar() {
        var k = n();
        var c = costo(k), r = riesgo(k), z = zonaDe(k);
        textoN.textContent = "Revisar " + k + " de " + L + " paquetes";
        mCosto.valor.textContent = porcentaje(c);
        mCosto.barra.style.width = c + "%";
        mCosto.el.classList.toggle("excedido", c > info.costoMax);
        mRiesgo.valor.textContent = porcentaje(r);
        mRiesgo.barra.style.width = r + "%";
        mRiesgo.el.classList.toggle("excedido", r > info.riesgoMax);
        zona.textContent = z === "caro" ? "Costo alto: revisás más de lo necesario." :
          z === "riesgoso" ? "Riesgo alto: es fácil que un lote malo pase." : "Punto razonable: costo y riesgo aceptables.";
        zona.className = "mesa-zona " + z;
        revisar.textContent = "Revisar " + k + " paquetes";
        actualizarHud();
      }

      function tapar() {
        celdas.forEach(function (c) { c.className = "mesa-celda"; });
      }

      rango.addEventListener("input", function () {
        if (revisando) return;
        tapar();
        pintar();
      });

      function revisarMuestra() {
        if (revisando) return;
        revisando = true;
        rango.disabled = true;
        revisar.disabled = true;
        tapar();
        var k = n();
        var paso = Math.min(25, 1200 / k);
        for (var j = 0; j < k; j++) {
          (function (j) {
            setTimeout(function () {
              var celda = orden[j];
              celdas[celda].classList.add(malos[celda] ? "malo" : "sano");
              if (j === k - 1) evaluar(k);
            }, j * paso);
          })(j);
        }
      }

      function evaluar(k) {
        revisando = false;
        rango.disabled = false;
        revisar.disabled = false;
        var hallados = lugares.filter(function (x) { return x < k; }).length;
        var r = porcentaje(riesgo(k));
        var z = zonaDe(k);
        if (!hallados) {
          lugares.forEach(function (x) { celdas[orden[x]].classList.add("escondido"); });
          ui.rechazar(lote, "No apareció ningún dañado y aceptaste el lote… pero tenía " + D + ". Con " + k + " paquetes el riesgo era del " + r + ". Mové el deslizador y probá de nuevo.");
          return;
        }
        if (z === "caro") {
          ui.rechazar(lote, "Encontraste dañados y rechazaste el lote, pero revisaste " + k + " de " + L + ": salió caro. ¿Podés revisar menos con un riesgo aceptable?");
          return;
        }
        if (z === "riesgoso") {
          ui.rechazar(lote, "Esta vez apareció un dañado, pero con " + k + " paquetes el riesgo de dejar pasar un lote malo era del " + r + ": tuviste suerte. Buscá un punto más seguro.");
          return;
        }
        sonido.bien();
        rango.disabled = true;
        ui.decir("Apareció " + (hallados === 1 ? "1 paquete dañado" : hallados + " paquetes dañados") + " revisando " + k + " de " + L +
          ": se rechaza el lote y se reclama. Costo " + porcentaje(costo(k)) + " y riesgo " + r + ".", "bien");
        ui.terminarCon("Terminar estación", function () {
          terminar("Muestra elegida: " + k + " de " + L + " · Costo " + porcentaje(costo(k)) + " · Riesgo " + r);
        });
      }

      pintar();

      return function () {
        ui.decir("Mové el deslizador y mirá los dos medidores. Cuando tengas un punto razonable, revisá la muestra.", "");
      };
    }

    /* ---------- Cierre ---------- */
    function cierre() {
      raiz.innerHTML = "";
      var c = el("div", "mesa-final");
      c.appendChild(el("h2", "", "Lo que te dio cada herramienta"));
      var nivel = errores <= 3 ? cfg.niveles[2] : errores <= 8 ? cfg.niveles[1] : cfg.niveles[0];
      var pn = el("p", "mesa-nivel");
      pn.appendChild(document.createTextNode("Nivel de analista: "));
      pn.appendChild(el("strong", "", nivel));
      pn.appendChild(document.createTextNode(" · " + (errores === 1 ? "1 error" : errores + " errores")));
      c.appendChild(pn);
      var ul = el("ul", "mesa-lista-final");
      cfg.etapas.forEach(function (e, i) {
        var li = el("li");
        li.style.animationDelay = i * 0.5 + "s";
        li.appendChild(icono(e.icono));
        var t = el("div");
        t.appendChild(el("strong", "", e.herramientas));
        t.appendChild(el("p", "", e.frase));
        li.appendChild(t);
        ul.appendChild(li);
      });
      c.appendChild(ul);
      var fuera = el("p", "mesa-fuera", cfg.fuera);
      fuera.style.animationDelay = cfg.etapas.length * 0.5 + "s";
      c.appendChild(fuera);
      var m = el("p", "mesa-mensaje-final", cfg.mensajeFinal);
      m.style.animationDelay = cfg.etapas.length * 0.5 + 0.3 + "s";
      c.appendChild(m);
      var acciones = el("div", "mesa-acciones");
      acciones.appendChild(boton("Jugar de nuevo", empezar));
      var volver = el("a", "mesa-link", "Volver al inicio");
      volver.href = "index.html";
      acciones.appendChild(volver);
      c.appendChild(acciones);
      raiz.appendChild(c);
    }
  }

  window.Juego = window.Juego || {};
  window.Juego.mesa = mesa;
})();
