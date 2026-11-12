/* Minijuego 3 "Guardia de Mantenimiento": Guardia.iniciar (sin librerías) */
var Guardia = (function () {
  "use strict";
  var $ = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
  var $$ = function (n) { return "$" + n.toLocaleString("es-AR"); };
  var mezclar = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  /* Ronda 1: clasificar. Cajones: 0 ISO 9001, 1 ISO 14001, 2 Certificador */
  var CAJONES = ["⭐ ISO 9001", "🌱 ISO 14001", "🔍 Certificador"];
  var ITEMS = [
    ["🛢️", "Aceite usado", 1], ["🚚", "Humo de camiones", 1], ["🔋", "Baterías usadas", 1],
    ["😀", "Cliente contento", 0], ["📞", "Reclamos de clientes", 0], ["📋", "Mejora continua", 0],
    ["🕵️", "Auditoría externa", 2], ["🏅", "Sello de certificación", 2]
  ];

  /* Ronda 2: piezas. t = segundos hasta que se rompe si nadie la toca */
  var PIEZAS = [
    { id: "motor", e: "⚙️", n: "Motor", tag: "🔴 crítico", t: 45, parada: 6, d: 4990000, o: 9500000 },
    { id: "bandas", e: "🛞", n: "Bandas", tag: "se gastan", t: 25, parada: 3, d: 400000, o: 1200000 },
    { id: "lectores", e: "📷", n: "Lectores", tag: "se desajustan", t: 18, parada: 0, d: 200000, o: 600000 },
    { id: "impresora", e: "🖨️", n: "Impresora", tag: "🟢 no crítica", t: 32, parada: 0, d: 80000, o: 0 },
    { id: "sensores", e: "📡", n: "Sensores", tag: "se ensucian", t: 55, parada: 1.5, d: 50000, o: 150000 }
  ];
  var MONEDAS = 10, SEG_SEMANA = 4, SEMANAS = 12, BASE = 17170000; /* BASE: todo correctivo */
  var HERR = { cal: { e: "📅", n: "Calendario", c: 1 }, sen: { e: "📈", n: "Sensor", c: 5 }, ope: { e: "🧹", n: "Operador", c: 1 } };

  function iniciar(id) {
    var raiz = document.getElementById(id), timers = [];
    portada();

    function limpiar() { timers.forEach(clearInterval); timers = []; raiz.innerHTML = ""; }
    function hud(a, b) { var h = $("div", "g-hud"); h.appendChild($("b", "", a)); h.appendChild($("span", "", b || "")); raiz.appendChild(h); return h; }
    function boton(txt, f) { var b = $("button", "btn", txt); b.type = "button"; b.onclick = f; return b; }

    function portada() {
      limpiar();
      var c = $("div", "cinta-portada");
      c.appendChild($("div", "g-hielo", "⚙️🧊"));
      c.appendChild($("p", "cinta-intro", "Es tu turno de guardia: mantené el clasificador andando 12 semanas."));
      c.appendChild(boton("Jugar", intro1));
      var a = $("p", "cinta-aviso", "Juego con fines educativos. Los datos son simulados y no describen la operación real de Andreani.");
      a.style.marginTop = "16px"; c.appendChild(a); raiz.appendChild(c);
    }


    function intro(ronda, titulo, lineas, cb) {
      limpiar(); hud(ronda, "");
      var c = $("div", "g-escena g-instr");
      c.appendChild($("h2", "", titulo));
      lineas.forEach(function (l) { c.appendChild($("p", "", l)); });
      c.appendChild(boton("¡Empezar!", cb)); raiz.appendChild(c);
    }
    function intro1() {
      intro("Ronda 1 de 2", "📦 Al cajón", [
        "Llegan objetos a la cinta. Tocá el cajón correcto antes de que se acabe el tiempo.",
        "⭐ ISO 9001 = calidad y clientes",
        "🌱 ISO 14001 = ambiente",
        "🔍 Certificador = auditoría y sello"
      ], ronda1);
    }
    function intro2() {
      intro("Ronda 2 de 2", "⚙️ La guardia", [
        "Las piezas se desgastan solas. ¡Que el clasificador no se pare!",
        "1️⃣ Elegí una herramienta",
        "2️⃣ Tocá una pieza",
        "💥 Si se rompe, tocala para arreglarla (la máquina se para).",
        "📅 Calendario: la cuida a ciegas · 📈 Sensor: te muestra su desgaste · 🧹 Operador: cuida los sensores",
        "🪙 Las monedas no alcanzan para todo: cuidá primero lo crítico 🔴."
      ], ronda2);
    }

    /* Ronda 1: clasificá lo que llega a la cinta antes de que se acabe el tiempo */
    function ronda1() {
      limpiar();
      var lista = mezclar(ITEMS), i = 0, vidas = 3, ok = 0;
      var h = hud("Ronda 1 de 2", "Mandalo a su cajón");
      var esc = $("div", "g-escena g-centro"), vi = $("div", "g-vidas"), card = $("div", "g-item"), barra = $("div", "g-tiempo"), rel = $("span"), caj = $("div", "g-cajones");
      barra.appendChild(rel); esc.appendChild(vi); esc.appendChild(card); esc.appendChild(barra);
      CAJONES.forEach(function (n, k) { var b = $("button", "g-carta", n); b.type = "button"; b.onclick = function () { elegir(k); }; caj.appendChild(b); });
      esc.appendChild(caj); raiz.appendChild(esc);
      var tm = null;
      function pintarVidas() { vi.textContent = "❤️".repeat(vidas) + "🖤".repeat(3 - vidas) + "  ✔ " + ok; }
      function siguiente() {
        if (i >= lista.length || vidas === 0) return fin();
        var it = lista[i]; card.textContent = ""; card.appendChild($("div", "g-emoji", it[0])); card.appendChild($("div", "", it[1]));
        rel.style.transition = "none"; rel.style.width = "100%"; void rel.offsetWidth; rel.style.transition = "width 4s linear"; rel.style.width = "0%";
        clearTimeout(tm); tm = setTimeout(function () { elegir(-1); }, 4000); pintarVidas();
      }
      function elegir(k) {
        clearTimeout(tm);
        if (k === lista[i][2]) { ok++; card.classList.add("bien"); } else { vidas--; card.classList.add("sacudir"); }
        setTimeout(function () { card.className = "g-item"; i++; siguiente(); }, 280);
        pintarVidas();
      }
      function fin() {
        clearTimeout(tm); esc.innerHTML = "";
        esc.appendChild($("div", "g-hielo", ok >= 6 ? "🏅" : "👍"));
        esc.appendChild($("p", "", ok + " de " + lista.length + " bien"));
        var m = $("p", "cinta-mensaje-final", "ISO escribe las normas. Certifica un organismo independiente."); m.style.textAlign = "left"; esc.appendChild(m);
        esc.appendChild(boton("A la guardia", intro2));
      }
      siguiente();
    }

    /* Ronda 2: 12 semanas en tiempo real */
    function ronda2() {
      limpiar();
      var coins = MONEDAS, tool = "cal", t = 0, bultos = 0, d = 0, o = 0, fallas = 0, gastoImp = 0, motorOk = true, fin = false;
      var P = {}; PIEZAS.forEach(function (p) { P[p.id] = { def: p, h: 100, rate: 100 / (p.t * 0.8), estado: "ok", sensor: false, ope: false, libre: 0 }; });
      var info = hud("Semana 1", "");
      var esc = $("div", "g-escena"), barra = $("div", "g-herr"), belt = $("div", "g-belt"), maq = $("div", "g-maq", "⚙️"), pila = $("div", "g-pila");
      var linea = $("div", "g-linea"), gs = $("div", "g-semanas"), aviso = $("div", "g-aviso", "Elegí una herramienta y tocá una pieza. Si se rompe: tocala para arreglarla."), cel = [];
      Object.keys(HERR).forEach(function (k) {
        var b = $("button", "g-ficha" + (k === tool ? " sel" : ""), HERR[k].e + " " + HERR[k].n + " 🪙" + HERR[k].c); b.type = "button";
        b.onclick = function () { tool = k; [].forEach.call(barra.children, function (c) { c.classList.remove("sel"); }); b.classList.add("sel"); };
        barra.appendChild(b);
      });
      belt.appendChild(maq); belt.appendChild(pila);
      for (var s = 1; s <= SEMANAS; s++) { var c = $("div", "g-sem", s); cel.push(c); gs.appendChild(c); }
      var cd = $("div", "g-cartel"), vd = $("span", "", $$(0)), co = $("div", "g-cartel niebla");
      cd.appendChild($("span", "", "💵 Directos")); cd.appendChild(vd); co.appendChild($("span", "", "🧊 Oportunidad")); co.appendChild($("span", "", "???"));
      esc.appendChild(barra); esc.appendChild(belt); esc.appendChild(linea); esc.appendChild(gs); esc.appendChild(aviso); esc.appendChild(cd); esc.appendChild(co);
      raiz.appendChild(esc);

      PIEZAS.forEach(function (p) {
        var el = $("div", "g-pieza"); el.id = "gp-" + p.id; el.onclick = function () { tocar(p.id); };
        el.appendChild($("span", "e", p.e)); el.appendChild($("small", "", p.n)); el.appendChild($("small", "", p.tag));
        var bar = $("div", "g-vida"); bar.appendChild($("span")); el.appendChild(bar); el.appendChild($("span", "chip", ""));
        linea.appendChild(el);
      });

      function gastar(n) { if (coins < n) { sacudir(esc); return false; } coins -= n; return true; }
      function sacudir(e) { e.classList.add("sacudir"); setTimeout(function () { e.classList.remove("sacudir"); }, 300); }
      function tocar(id) {
        var p = P[id];
        if (fin) return;
        if (p.estado === "roto") { /* correctivo: gratis, pero con la máquina parada */
          p.estado = "arreglando"; p.libre = t + p.def.parada; p.h = 100; p.rate *= 0.6; aviso.textContent = "🔧 Arreglando " + p.def.n.toLowerCase(); return;
        }
        if (p.estado !== "ok") return;
        if (tool === "cal") {
          if (!gastar(1)) return; if (id === "impresora") gastoImp++;
          p.h = 100; p.rate *= 0.6; p.estado = "plan"; p.libre = t + 1; aviso.textContent = "📅 Calibrado a tiempo";
          if (id === "motor" && p.sensor) { d += 360000; }
        } else if (tool === "sen") {
          if (p.sensor) return; if (!gastar(5)) return; p.sensor = true; if (id === "impresora") gastoImp++; aviso.textContent = "📈 Sensor: ahora ves el estado";
        } else if (tool === "ope") {
          if (id !== "sensores") { sacudir(esc); aviso.textContent = "🧹 Esto lo limpia el operador: los sensores"; return; }
          if (p.ope) return; if (!gastar(1)) return; p.ope = true; aviso.textContent = "🧹 El operador los limpia cada turno";
        }
      }
      /* con sensor, tocar una pieza con poca vida con 📅 cuesta lo mismo; el motor con sensor se repara en parada corta */

      function frame() {
        t += 0.1;
        var parado = false, ambar = false;
        PIEZAS.forEach(function (def) {
          var p = P[def.id];
          if (p.estado === "ok") {
            if (!p.ope) p.h -= p.rate * 0.1; else if (def.id === "sensores") p.h = 100;
            if (p.h <= 0) { p.h = 0; p.estado = "roto"; fallas += (def.id === "impresora" ? 0 : 1); d += def.d; o += def.o; if (def.id === "motor") motorOk = false; aviso.textContent = "💥 ¡Falla! " + def.n; }
          } else if ((p.estado === "plan" || p.estado === "arreglando") && t >= p.libre) p.estado = "ok";
          if ((p.estado === "roto" || p.estado === "arreglando") && def.parada > 0) parado = true;
          if (p.estado === "plan" || (p.estado === "roto" && def.parada === 0 && def.id === "lectores")) ambar = true;
        });
        var est = parado ? "gris" : ambar ? "ambar" : "verde";
        maq.className = "g-maq " + (est === "verde" ? "" : est); esc.classList.toggle("parada", parado);
        var w = Math.min(SEMANAS, Math.floor(t / SEG_SEMANA) + 1);
        cel[w - 1].className = "g-sem " + (cel[w - 1].classList.contains("gris") ? "gris" : est);
        if (parado && pila.children.length < 12 && Math.round(t * 10) % 6 === 0) pila.appendChild($("span", "", "📦"));
        if (!parado) { pila.innerHTML = ""; if (Math.round(t * 10) % 6 === 0) { var k = $("span", "g-caja", "📦"); belt.appendChild(k); bultos++; setTimeout(function () { if (k.parentNode) k.parentNode.removeChild(k); }, 3300); } }
        pintar(w);
        if (t >= SEMANAS * SEG_SEMANA) { fin = true; clearInterval(h); setTimeout(function () { balance(d, o, MONEDAS - coins, fallas, motorOk, gastoImp, bultos); }, 600); }
      }
      function pintar(w) {
        info.lastChild.textContent = "";
        info.firstChild.textContent = "Semana " + w + " de " + SEMANAS;
        info.lastChild.textContent = "🪙 " + coins + "  📦 " + bultos;
        vd.textContent = $$(d + (MONEDAS - coins) * 100000);
        PIEZAS.forEach(function (def) {
          var p = P[def.id], el = document.getElementById("gp-" + def.id);
          el.className = "g-pieza " + (p.estado === "roto" ? "roto" : p.estado === "ok" ? "" : "asig");
          var bar = el.children[3]; bar.style.display = p.sensor ? "block" : "none";
          bar.firstChild.style.width = p.h + "%"; bar.firstChild.className = p.h < 35 ? "bajo" : "";
          el.lastChild.textContent = (p.estado === "roto" ? "💥" : p.sensor && p.h < 35 ? "⚠️" : "") + (p.sensor ? "📈" : "") + (p.ope ? "🧹" : "");
        });
      }
      var h = setInterval(frame, 100); timers.push(h); pintar(1);
    }

    function balance(d, o, gasto, fallas, motorOk, gastoImp, bultos) {
      limpiar(); hud("Balance", "📦 " + bultos + " bultos");
      var prog = gasto * 100000, dir = d + prog, tot = dir + o;
      var esc = $("div", "g-escena g-centro");
      esc.appendChild($("div", "g-hielo", "🧊"));
      var max = Math.max(dir, o, 1);
      var bd = $("div", "g-bar", "💵 Directos " + $$(dir)); bd.style.background = "#1f6feb"; bd.style.width = "10%";
      var bo = $("div", "g-bar", "🧊 Ocultos " + $$(o)); bo.style.background = "#3b8fb5"; bo.style.width = "10%";
      esc.appendChild(bd); esc.appendChild(bo);
      setTimeout(function () { bd.style.width = Math.max(48, dir / max * 100) + "%"; bo.style.width = Math.max(48, o / max * 100) + "%"; }, 80);
      var ah = BASE - tot;
      esc.appendChild($("p", "", (ah >= 0 ? "Ahorraste " : "Perdiste ") + $$(Math.abs(ah)) + " frente a no prevenir nada"));
      var oks = [motorOk, gastoImp === 0, fallas <= 1], est = Math.max(1, oks.filter(Boolean).length);
      var es = $("div", "cinta-estrellas"); for (var i = 0; i < 3; i++) es.appendChild($("span", i < est ? "llena" : "", "★"));
      esc.appendChild(es);
      var ch = $("div", "g-check"); [["⚙️", oks[0]], ["🖨️", oks[1]], ["🔧", oks[2]]].forEach(function (x) { ch.appendChild($("span", "", (x[1] ? "✅" : "❌") + x[0])); });
      esc.appendChild(ch);
      var m = $("p", "cinta-mensaje-final", "El costo de una falla no es solo la factura de la reparación."); m.style.textAlign = "left"; esc.appendChild(m);
      esc.appendChild(boton("Jugar otra vez", ronda2)); raiz.appendChild(esc);
    }
  }
  return { iniciar: iniciar };
})();
