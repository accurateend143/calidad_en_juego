/* Minijuego 3 "Guardia de Mantenimiento": Guardia.iniciar (sin librerías) */
var Guardia = (function () {
  "use strict";
  var $ = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
  var $$ = function (n) { return "$" + n.toLocaleString("es-AR"); };
  var MONEDAS = 16; /* 1 moneda = $100.000 */

  var PARES = [
    ["📜", "ISO", "Hace normas"],
    ["⭐", "ISO 9001", "Calidad"],
    ["🌱", "ISO 14001", "Ambiente"],
    ["🔍", "Certificador", "Certifica"]
  ];
  var PIEZAS = [
    { id: "motor", e: "⚙️", n: "Motor", crit: "🔴" },
    { id: "bandas", e: "🛞", n: "Bandas", crit: "🟡" },
    { id: "lectores", e: "📷", n: "Lectores", crit: "🟡" },
    { id: "impresora", e: "🖨️", n: "Impresora", crit: "🟢" },
    { id: "sensores", e: "📡", n: "Sensores", crit: "🟡" }
  ];
  var TIPOS = {
    correctivo: { e: "🔧", n: "Correctivo", m: 0 },
    preventivo: { e: "📅", n: "Preventivo", m: 3 },
    predictivo: { e: "📈", n: "Predictivo", m: 9 },
    operador: { e: "🧹", n: "Operador", m: 1 }
  };

  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* Eventos fijos según el plan (cifras del motor: entrega 3; el resto simulado) */
  function totales(plan) {
    var t = function (p) { return plan[p] || "correctivo"; };
    var prev = function (p) { return t(p) === "preventivo" || t(p) === "predictivo"; };
    var ev = [];
    ev.push(prev("lectores") ? { s: 3, c: "verde", txt: "📷 Lectores calibrados", d: 0, o: 0 } : { s: 3, c: "ambar", txt: "📷 Errores de destino", d: 200000, o: 600000 });
    ev.push(prev("bandas") ? { s: 5, c: "verde", txt: "🛞 Bandas cambiadas en la parada", d: 0, o: 0 } : { s: 5, c: "gris", txt: "🛞 ¡Parada no planificada!", d: 400000, o: 1200000 });
    ev.push(t("impresora") === "predictivo" ? { s: 6, c: "ambar", txt: "🖨️ Plata de más en algo no crítico", d: 0, o: 0 } : { s: 6, c: "verde", txt: "🖨️ Arreglo barato", d: 80000, o: 0 });
    ev.push(t("motor") === "predictivo" ? { s: 8, c: "ambar", txt: "⚙️ Vibración detectada: parada corta", d: 360000, o: 0 } : { s: 9, c: "gris", txt: "⚙️ ¡Se rompió el motor! 6 horas parado", d: 4990000, o: 9500000 });
    ev.push(t("sensores") === "operador" ? { s: 11, c: "verde", txt: "📡 Limpios en el cierre de turno", d: 0, o: 0 } : { s: 11, c: "ambar", txt: "📡 Sensores sucios: parada chica", d: 50000, o: 150000 });
    var d = 0, o = 0, prog = 0;
    ev.forEach(function (e) { d += e.d; o += e.o; });
    PIEZAS.forEach(function (p) { prog += TIPOS[t(p.id)].m * 100000; });
    return { ev: ev, d: d, o: o, prog: prog, total: d + o + prog };
  }

  function iniciar(id) {
    var raiz = document.getElementById(id);
    portada();

    function limpiar() { raiz.innerHTML = ""; }
    function hud(ronda, extra) {
      var h = $("div", "g-hud"); h.appendChild($("b", "", "Ronda " + ronda + " de 3")); h.appendChild($("span", "", extra || "")); raiz.appendChild(h);
    }
    function boton(txt, f) { var b = $("button", "btn", txt); b.type = "button"; b.onclick = f; return b; }

    function portada() {
      limpiar();
      var c = $("div", "cinta-portada");
      c.appendChild($("div", "g-hielo", "⚙️🧊"));
      c.appendChild($("p", "cinta-intro", "Cuidá el clasificador de Andreani: elegí cómo mantener cada pieza."));
      c.appendChild(boton("Jugar", ronda1));
      c.appendChild($("p", "cinta-aviso", "Juego con fines educativos. Los datos son simulados y no describen la operación real de Andreani."));
      c.lastChild.style.marginTop = "16px";
      raiz.appendChild(c);
    }

    /* Ronda 1: cables */
    function ronda1() {
      limpiar(); hud(1, "Conectá cada norma");
      var esc = $("div", "g-escena"), g = $("div", "g-cables"), c1 = $("div", "g-col"), c2 = $("div", "g-col"), izq = null, hechos = 0;
      PARES.forEach(function (p, i) {
        var b = $("button", "g-carta"); b.type = "button"; b.appendChild($("span", "e", p[0])); b.appendChild($("span", "", p[1]));
        b.onclick = function () { if (b.classList.contains("hecha")) return; if (izq) izq.classList.remove("sel"); izq = b; b.dataset.i = i; b.classList.add("sel"); };
        c1.appendChild(b);
      });
      mezclar(PARES.map(function (p, i) { return [p[2], i]; })).forEach(function (p) {
        var b = $("button", "g-carta", p[0]); b.type = "button";
        b.onclick = function () {
          if (!izq || b.classList.contains("hecha")) return;
          if (+izq.dataset.i === p[1]) {
            izq.className = "g-carta hecha"; b.className = "g-carta hecha"; izq = null; hechos++;
            if (hechos === PARES.length) {
              var s = $("div", "g-centro");
              s.appendChild($("div", "g-hielo", "✅"));
              s.appendChild($("p", "", "ISO elabora, el certificador certifica."));
              s.appendChild(boton("Siguiente", ronda2)); esc.appendChild(s);
            }
          } else { b.classList.add("sacudir"); setTimeout(function () { b.classList.remove("sacudir"); }, 350); }
        };
        c2.appendChild(b);
      });
      g.appendChild(c1); g.appendChild(c2); esc.appendChild(g); raiz.appendChild(esc);
    }

    /* Ronda 2: plan */
    function ronda2() {
      limpiar(); hud(2, "Armá el plan");
      var plan = {}, sel = null, esc = $("div", "g-escena");
      esc.appendChild($("p", "g-titulo", "Tocá o arrastrá una ficha sobre cada pieza"));
      var linea = $("div", "g-linea"), fichas = $("div", "g-fichas"), mon = $("div", "g-hud");
      var gasto = function (ex) { var s = 0; PIEZAS.forEach(function (p) { if (p.id !== ex && plan[p.id]) s += TIPOS[plan[p.id]].m; }); return s; };
      function poner(pid, tipo) {
        if (gasto(pid) + TIPOS[tipo].m > MONEDAS) { esc.classList.add("sacudir"); setTimeout(function () { esc.classList.remove("sacudir"); }, 350); return; }
        plan[pid] = tipo; pintar();
      }
      function pintar() {
        var resta = MONEDAS - gasto();
        mon.innerHTML = ""; mon.appendChild($("b", "", "🪙 " + resta)); mon.appendChild($("span", "", "🔴 crítico · 🟡 medio · 🟢 no crítico"));
        linea.innerHTML = "";
        PIEZAS.forEach(function (p) {
          var d = $("div", "g-pieza" + (plan[p.id] ? " asig" : ""));
          d.appendChild($("span", "e", p.e)); d.appendChild($("small", "", p.n + " " + p.crit));
          d.appendChild($("span", "chip", plan[p.id] ? TIPOS[plan[p.id]].e : "·"));
          d.onclick = function () { if (sel) poner(p.id, sel); };
          d.ondragover = function (e) { e.preventDefault(); d.classList.add("sobre"); };
          d.ondragleave = function () { d.classList.remove("sobre"); };
          d.ondrop = function (e) { e.preventDefault(); var t = e.dataTransfer.getData("text/plain"); if (TIPOS[t]) poner(p.id, t); };
          linea.appendChild(d);
        });
        [].forEach.call(fichas.children, function (f) { f.classList.toggle("no", TIPOS[f.dataset.k].m > resta); });
        go.disabled = Object.keys(plan).length < PIEZAS.length;
      }
      Object.keys(TIPOS).forEach(function (k) {
        var f = $("button", "g-ficha", TIPOS[k].e + " " + TIPOS[k].n + " · " + (TIPOS[k].m ? "🪙" + TIPOS[k].m : "gratis")); f.type = "button"; f.dataset.k = k; f.draggable = true;
        f.onclick = function () { sel = k; [].forEach.call(fichas.children, function (c) { c.classList.remove("sel"); }); f.classList.add("sel"); };
        f.ondragstart = function (e) { e.dataTransfer.setData("text/plain", k); };
        fichas.appendChild(f);
      });
      var go = boton("¡Arrancar 12 semanas!", function () { ronda3(plan); });
      esc.appendChild(mon); esc.appendChild(linea); esc.appendChild(fichas);
      var c = $("div", "g-centro"); c.appendChild(go); esc.appendChild(c);
      raiz.appendChild(esc); pintar();
    }

    /* Ronda 3: simulación y balance */
    function ronda3(plan) {
      limpiar(); hud(3, "Mirá qué pasa");
      var r = totales(plan), sem = 0, dAc = r.prog, esc = $("div", "g-escena");
      var belt = $("div", "g-belt"), maq = $("div", "g-maq", "⚙️"), pila = $("div", "g-pila");
      belt.appendChild(maq); belt.appendChild(pila); esc.appendChild(belt);
      var gs = $("div", "g-semanas"), cel = [];
      for (var i = 1; i <= 12; i++) { var c = $("div", "g-sem", i); cel.push(c); gs.appendChild(c); }
      esc.appendChild(gs);
      var aviso = $("div", "g-aviso", "Semana 1"); esc.appendChild(aviso);
      var cd = $("div", "g-cartel"); cd.appendChild($("span", "", "💵 Directos")); var vd = $("span", "", $$(dAc)); cd.appendChild(vd);
      var co = $("div", "g-cartel niebla"); co.appendChild($("span", "", "🧊 Oportunidad")); co.appendChild($("span", "", "???"));
      esc.appendChild(cd); esc.appendChild(co); raiz.appendChild(esc);
      var estado = "";
      var spawn = setInterval(function () {
        if (estado === "gris") { if (pila.children.length < 12) pila.appendChild($("span", "", "📦")); return; }
        var k = $("span", "g-caja", "📦"); belt.appendChild(k); setTimeout(function () { if (k.parentNode) k.parentNode.removeChild(k); }, 3300);
      }, 650);
      var h = setInterval(function () {
        sem++;
        var e = r.ev.filter(function (x) { return x.s === sem; })[0];
        if (e) {
          cel[sem - 1].classList.add(e.c); aviso.textContent = e.txt; dAc += e.d; vd.textContent = $$(dAc);
          estado = e.c; maq.className = "g-maq " + (e.c === "verde" ? "" : e.c); esc.classList.toggle("parada", e.c === "gris");
          if (e.c === "gris") { /* parada: se reanuda en 2 semanas */ }
        } else {
          cel[sem - 1].classList.add(estado === "gris" ? "gris" : "verde");
          if (estado === "gris" && sem - lastGris(r, sem) >= 2) { estado = ""; maq.className = "g-maq"; esc.classList.remove("parada"); pila.innerHTML = ""; aviso.textContent = "Semana " + sem; }
          else if (estado !== "gris") { estado = ""; maq.className = "g-maq"; aviso.textContent = "Semana " + sem; }
        }
        if (sem >= 12) { clearInterval(h); clearInterval(spawn); setTimeout(function () { balance(plan, r); }, 900); }
      }, 700);
    }
    function lastGris(r, sem) { var m = 0; r.ev.forEach(function (e) { if (e.c === "gris" && e.s <= sem) m = Math.max(m, e.s); }); return m; }

    function balance(plan, r) {
      limpiar(); hud(3, "Balance");
      var esc = $("div", "g-escena g-centro");
      esc.appendChild($("div", "g-hielo", "🧊"));
      var max = Math.max(r.d + r.prog, r.o, 1);
      var bd = $("div", "g-bar", "💵 Directos " + $$(r.d + r.prog)); bd.style.background = "#1f6feb"; bd.style.width = "10%";
      var bo = $("div", "g-bar", "🧊 Ocultos " + $$(r.o)); bo.style.background = "#3b8fb5"; bo.style.width = "10%";
      esc.appendChild(bd); esc.appendChild(bo);
      setTimeout(function () { bd.style.width = Math.max(48, (r.d + r.prog) / max * 100) + "%"; bo.style.width = Math.max(48, r.o / max * 100) + "%"; }, 80);
      var ahorro = totales({}).total - r.total;
      esc.appendChild($("p", "", (ahorro >= 0 ? "Ahorraste " : "Perdiste ") + $$(Math.abs(ahorro)) + " frente a no prevenir"));
      var ok = [plan.impresora === "correctivo", plan.motor === "predictivo", true];
      var est = Math.max(1, ok.filter(Boolean).length);
      var es = $("div", "cinta-estrellas"); for (var i = 0; i < 3; i++) { var s = $("span", i < est ? "llena" : "", "★"); es.appendChild(s); }
      esc.appendChild(es);
      var ch = $("div", "g-check");
      ch.appendChild($("span", "", (ok[0] ? "✅" : "❌") + "🖨️")); ch.appendChild($("span", "", (ok[1] ? "✅" : "❌") + "⚙️"));
      esc.appendChild(ch);
      esc.appendChild($("p", "cinta-mensaje-final", "El costo de una falla no es solo la factura de la reparación."));
      esc.lastChild.style.textAlign = "left";
      esc.appendChild(boton("Probar otro plan", ronda2));
      raiz.appendChild(esc);
    }
  }
  return { iniciar: iniciar };
})();
