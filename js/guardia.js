/* Guardia de Mantenimiento: juego 3 (sin librerías) */
var Guardia = (function () {
  "use strict";
  var $ = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
  var $$ = function (n) { return "$" + n.toLocaleString("es-AR"); };
  var BUDGET = 1600000;

  var PARES = [
    ["ISO", "Organización que elabora normas voluntarias (no certifica)"],
    ["ISO 9001", "Sistema de gestión de la calidad"],
    ["ISO 14001", "Sistema de gestión ambiental (flota, aceites, baterías)"],
    ["Organismo certificador", "Audita y entrega la certificación"]
  ];
  var PIEZAS = [
    { id: "motor", n: "Motorreductor principal", d: "Crítico, sin reemplazo" },
    { id: "bandas", n: "Bandas y rodillos", d: "Se desgastan por uso" },
    { id: "lectores", n: "Lectores de código y balanzas", d: "Se desajustan con el tiempo" },
    { id: "impresora", n: "Impresora de etiquetas de repuesto", d: "No crítica, hay reemplazo" },
    { id: "sensores", n: "Sensores del cierre de turno", d: "Se ensucian (tarea del operador)" }
  ];
  var TIPOS = {
    correctivo: { n: "Correctivo", costo: 0, d: "Se arregla al romperse", frec: "Al fallar", resp: "Técnico" },
    preventivo: { n: "Preventivo", costo: 300000, d: "Por calendario", frec: "Mensual", resp: "Mantenimiento" },
    predictivo: { n: "Predictivo", costo: 900000, d: "Mide la condición", frec: "Según condición", resp: "Técnico predictivo" },
    operador: { n: "Operador (MPT)", costo: 100000, d: "Limpieza e inspección diaria", frec: "Diaria", resp: "Operador" }
  };

  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* Calcula los 6 eventos fijos según el plan */
  function simular(plan) {
    var t = function (p) { return plan[p] || "correctivo"; };
    var ev = [];
    var prev = function (p) { return t(p) === "preventivo" || t(p) === "predictivo"; };
    ev.push(prev("lectores")
      ? { s: 3, c: "verde", txt: "Los lectores se desajustan: calibración preventiva, sin problema.", d: 0, o: 0 }
      : { s: 3, c: "ambar", txt: "Los lectores se desajustan: errores de destino, baja la calidad.", d: 200000, o: 600000 });
    ev.push(prev("bandas")
      ? { s: 5, c: "verde", txt: "Se gastan las bandas: se cambian en la parada programada.", d: 0, o: 0 }
      : { s: 5, c: "gris", txt: "Se gastan las bandas: parada no planificada.", d: 400000, o: 1200000 });
    ev.push(t("impresora") === "predictivo"
      ? { s: 6, c: "ambar", txt: "Falla la impresora de repuesto: se gastó plata de más en algo no crítico.", d: 0, o: 0 }
      : { s: 6, c: "verde", txt: "Falla la impresora de repuesto: se arregla barato, no pasa nada grave.", d: 80000, o: 0 });
    if (t("motor") === "predictivo") {
      ev.push({ s: 8, c: "ambar", txt: "Vibración anormal en el motorreductor: se interviene a tiempo (parada corta y planificada).", d: 360000, o: 0 });
    } else {
      ev.push({ s: 9, c: "gris", txt: "Se rompe el motorreductor: PARADA TOTAL de 6 horas.", d: 4990000, o: 9500000 });
    }
    ev.push(t("sensores") === "operador"
      ? { s: 11, c: "verde", txt: "Sensores sucios: se resuelve en el cierre de turno.", d: 0, o: 0 }
      : { s: 11, c: "ambar", txt: "Sensores sucios: pequeña parada.", d: 50000, o: 150000 });
    return ev;
  }
  function totales(plan) {
    var ev = simular(plan), d = 0, o = 0, prog = 0;
    ev.forEach(function (e) { d += e.d; o += e.o; });
    PIEZAS.forEach(function (p) { prog += TIPOS[plan[p.id] || "correctivo"].costo; });
    return { ev: ev, d: d, o: o, prog: prog, total: d + o + prog };
  }

  function iniciar(id) {
    var raiz = document.getElementById(id);
    fase0();

    /* ---- Fase 0: conectar ---- */
    function fase0() {
      raiz.innerHTML = "";
      raiz.appendChild($("h2", "", "1. Conectá las normas"));
      raiz.appendChild($("p", "consigna", "Tocá un concepto de la izquierda y después su descripción."));
      var hechos = 0, izq = null, grid = $("div", "g-par"), c1 = $("div", "g-col"), c2 = $("div", "g-col");
      PARES.forEach(function (p, i) {
        var b = $("button", "ficha concepto", p[0]); b.type = "button";
        b.onclick = function () { if (b.classList.contains("hecha")) return; if (izq) izq.classList.remove("seleccionada"); izq = b; b.classList.add("seleccionada"); b.dataset.i = i; };
        c1.appendChild(b);
      });
      mezclar(PARES.map(function (p, i) { return [p[1], i]; })).forEach(function (p) {
        var b = $("button", "ficha", p[0]); b.type = "button";
        b.onclick = function () {
          if (!izq || b.classList.contains("hecha")) return;
          if (+izq.dataset.i === p[1]) {
            izq.className = "ficha concepto hecha"; b.className = "ficha hecha"; izq = null; hechos++;
            if (hechos === PARES.length) {
              var s = $("div", "g-sello");
              s.appendChild($("b", "", "Edición vigente: 2026"));
              s.appendChild($("p", "", "Una certificación acredita que el sistema existe y funciona, no que la empresa sea perfecta."));
              var n = $("button", "btn", "Siguiente: armar el plan"); n.type = "button"; n.onclick = fase1;
              s.appendChild(n); raiz.appendChild(s);
            }
          } else { b.classList.add("error"); setTimeout(function () { b.classList.remove("error"); }, 500); }
        };
        c2.appendChild(b);
      });
      grid.appendChild(c1); grid.appendChild(c2); raiz.appendChild(grid);
    }

    /* ---- Fase 1: plan ---- */
    function fase1() {
      raiz.innerHTML = "";
      var plan = {}, sel = null;
      raiz.appendChild($("h2", "", "2. Armá el plan"));
      raiz.appendChild($("p", "consigna", "Elegí una ficha y tocá (o arrastrá) sobre una pieza. El presupuesto no alcanza para predictivo en todo: priorizá por criticidad."));
      var presu = $("div", "g-presu"); raiz.appendChild(presu);
      var cajaP = $("div", "g-piezas"), cajaF = $("div", "g-fichas"), msg = $("div", "g-msg");
      var tabla = $("table", "g-tabla");
      var gasto = function (excepto) { var s = 0; PIEZAS.forEach(function (p) { if (p.id !== excepto && plan[p.id]) s += TIPOS[plan[p.id]].costo; }); return s; };
      function asignar(pid, tipo) {
        if (gasto(pid) + TIPOS[tipo].costo > BUDGET) { msg.textContent = "No alcanza el presupuesto para eso."; return; }
        msg.textContent = ""; plan[pid] = tipo; pintar();
      }
      function pintar() {
        presu.innerHTML = "";
        var resta = BUDGET - gasto();
        presu.appendChild($("span", "", "Presupuesto: " + $$(BUDGET)));
        presu.appendChild($("span", "sobra", "Queda: " + $$(resta)));
        cajaP.innerHTML = "";
        PIEZAS.forEach(function (p) {
          var d = $("div", "g-pieza" + (plan[p.id] ? " asig" : "")); d.dataset.id = p.id;
          if (plan[p.id]) d.appendChild($("span", "tipo", TIPOS[plan[p.id]].n));
          d.appendChild($("b", "", p.n)); d.appendChild($("small", "", p.d));
          d.onclick = function () { if (sel) asignar(p.id, sel); else msg.textContent = "Primero elegí una ficha."; };
          d.ondragover = function (e) { e.preventDefault(); d.classList.add("sobre"); };
          d.ondragleave = function () { d.classList.remove("sobre"); };
          d.ondrop = function (e) { e.preventDefault(); var t = e.dataTransfer.getData("text/plain"); if (TIPOS[t]) asignar(p.id, t); };
          cajaP.appendChild(d);
        });
        tabla.innerHTML = "<tr><th>Actividad</th><th>Tipo</th><th>Frecuencia</th><th>Responsable</th></tr>";
        PIEZAS.forEach(function (p) {
          var t = TIPOS[plan[p.id] || "correctivo"], r = tabla.insertRow();
          [p.n, t.n + (plan[p.id] ? "" : " (por defecto)"), t.frec, t.resp].forEach(function (x) { r.insertCell().textContent = x; });
        });
        ok.disabled = Object.keys(plan).length < PIEZAS.length;
      }
      Object.keys(TIPOS).forEach(function (k) {
        var f = $("button", "g-ficha"); f.type = "button"; f.draggable = true;
        f.appendChild($("b", "", TIPOS[k].n + " · " + (TIPOS[k].costo ? $$(TIPOS[k].costo) : "gratis")));
        f.appendChild($("small", "", TIPOS[k].d));
        f.onclick = function () { sel = k; [].forEach.call(cajaF.children, function (c) { c.classList.remove("sel"); }); f.classList.add("sel"); };
        f.ondragstart = function (e) { e.dataTransfer.setData("text/plain", k); };
        cajaF.appendChild(f);
      });
      var ok = $("button", "btn", "Iniciar simulación de 12 semanas"); ok.type = "button";
      ok.onclick = function () { fase2(plan); };
      raiz.appendChild(cajaP); raiz.appendChild(cajaF); raiz.appendChild(msg); raiz.appendChild(tabla); raiz.appendChild(ok);
      pintar();
    }

    /* ---- Fase 2: simulación ---- */
    function fase2(plan) {
      raiz.innerHTML = "";
      var r = totales(plan), sem = 0, dAc = 0;
      raiz.appendChild($("h2", "", "3. Simulación"));
      var maq = $("div", "g-maq", "Clasificador funcionando"); raiz.appendChild(maq);
      var gs = $("div", "g-semanas"), cel = [];
      for (var i = 1; i <= 12; i++) { var c = $("div", "g-sem", i); cel.push(c); gs.appendChild(c); }
      raiz.appendChild(gs);
      var evt = $("div", "g-evento", "Semana 1…"); raiz.appendChild(evt);
      var cd = $("div", "g-cartel"); cd.appendChild($("span", "", "Costos directos")); var vd = $("b", "", $$(r.prog)); cd.appendChild(vd);
      var co = $("div", "g-cartel niebla"); co.appendChild($("span", "", "Costos de oportunidad")); co.appendChild($("b", "", "??? (oculto)"));
      raiz.appendChild(cd); raiz.appendChild(co);
      dAc = r.prog;
      var h = setInterval(function () {
        sem++;
        var e = r.ev.filter(function (x) { return x.s === sem; })[0];
        if (e) {
          cel[sem - 1].classList.add(e.c); evt.textContent = "Semana " + sem + ": " + e.txt;
          maq.className = "g-maq " + (e.c === "verde" ? "" : e.c); maq.textContent = e.c === "gris" ? "Clasificador PARADO · bultos acumulándose" : e.c === "ambar" ? "Atención" : "Funcionando";
          dAc += e.d; vd.textContent = $$(dAc);
        } else { cel[sem - 1].classList.add("verde"); maq.className = "g-maq"; maq.textContent = "Clasificador funcionando"; }
        if (sem >= 12) { clearInterval(h); setTimeout(function () { fase3(plan, r); }, 900); }
      }, 600);
    }

    /* ---- Fase 3: balance ---- */
    function fase3(plan, r) {
      raiz.innerHTML = "";
      raiz.appendChild($("h2", "", "4. El balance"));
      var max = Math.max(r.d + r.prog, r.o, 1);
      var bd = $("div", "g-barra", "Directos: " + $$(r.d + r.prog)); bd.style.background = "#1f6feb"; bd.style.width = Math.max(30, (r.d + r.prog) / max * 100) + "%";
      var bo = $("div", "g-barra", "Oportunidad (oculto): " + $$(r.o)); bo.style.background = "#3b8fb5"; bo.style.width = Math.max(30, r.o / max * 100) + "%";
      raiz.appendChild(bd); raiz.appendChild(bo);
      raiz.appendChild($("p", "", "Costo total de las 12 semanas: " + $$(r.total) + " (programa de mantenimiento: " + $$(r.prog) + ")."));
      var base = totales({}), ahorro = base.total - r.total;
      var res = $("p", "mensaje", ahorro >= 0 ? "Ahorro frente a no prevenir nada (todo correctivo): " + $$(ahorro) : "Pérdida frente a no prevenir nada: " + $$(-ahorro));
      res.style.fontWeight = "700"; raiz.appendChild(res);
      var c1 = plan.impresora === "correctivo", c2 = plan.motor === "predictivo", c3 = Object.keys(plan).length === PIEZAS.length;
      var est = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0); est = Math.max(est, 1);
      raiz.appendChild($("div", "g-estrellas", "★".repeat(est) + "☆".repeat(3 - est)));
      var ul = $("ul", "g-check");
      ul.appendChild($("li", "", (c1 ? "✔" : "✘") + " Sin sobregastar en piezas no críticas"));
      ul.appendChild($("li", "", (c2 ? "✔" : "✘") + " Se evitó la parada de 6 horas"));
      ul.appendChild($("li", "", (c3 ? "✔" : "✘") + " Plan completo"));
      raiz.appendChild(ul);
      raiz.appendChild($("div", "explicacion", "El costo de una falla no es solo la factura de la reparación: el costo de oportunidad (bultos sin procesar, horas extra, penalidades, redistribución) suele ser mayor que el directo. Prevenir puede ser ahorrar, pero no todo equipo merece el mismo mantenimiento: eso es RCM."));
      var rp = $("div", "repaso"); rp.appendChild($("h2", "", "Repaso"));
      var l = $("ul");
      ["Correctivo: se repara después de la falla.", "Preventivo: por calendario.", "Predictivo: según la condición medida.", "MPT: el operador cuida su máquina."].forEach(function (x) { l.appendChild($("li", "", x)); });
      rp.appendChild(l); raiz.appendChild(rp);
      var b = $("button", "btn", "Probar otro plan"); b.type = "button"; b.onclick = fase1; raiz.appendChild(b);
    }
  }
  return { iniciar: iniciar };
})();
