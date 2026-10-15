/* Motores de juego reutilizables: Juego.quiz y Juego.pares */
(function () {
  "use strict";

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

  function mensajeFinal(porcentaje) {
    if (porcentaje === 100) return "¡Perfecto! Sos un experto en calidad.";
    if (porcentaje >= 70) return "¡Muy bien! Ya dominás los conceptos.";
    if (porcentaje >= 40) return "¡Bien! Con una vuelta más lo tenés.";
    return "¡Buen intento! Probá de nuevo y vas a mejorar.";
  }

  /* ---------- QUIZ de opción múltiple ---------- */
  function quiz(cfg) {
    var raiz = document.getElementById(cfg.contenedor);
    var preguntas = mezclar(cfg.preguntas);
    var indice = 0;
    var aciertos = 0;

    function mostrarPregunta() {
      raiz.innerHTML = "";
      var p = preguntas[indice];

      var prog = el("div", "progreso");
      prog.appendChild(el("span", "", "Pregunta " + (indice + 1) + " de " + preguntas.length));
      prog.appendChild(el("span", "", "Aciertos: " + aciertos));
      raiz.appendChild(prog);

      var barra = el("div", "barra");
      var relleno = el("span");
      relleno.style.width = (indice / preguntas.length) * 100 + "%";
      barra.appendChild(relleno);
      raiz.appendChild(barra);

      raiz.appendChild(el("p", "pregunta", p.texto));

      var caja = el("div", "opciones");
      var opciones = mezclar(p.opciones.map(function (t, i) {
        return { texto: t, correcta: i === p.correcta };
      }));
      var respondida = false;

      opciones.forEach(function (op) {
        var b = el("button", "opcion", op.texto);
        b.type = "button";
        b.addEventListener("click", function () {
          if (respondida) return;
          respondida = true;
          if (op.correcta) {
            aciertos++;
            b.classList.add("correcta");
          } else {
            b.classList.add("incorrecta");
          }
          Array.prototype.forEach.call(caja.children, function (hijo, i) {
            hijo.disabled = true;
            if (opciones[i].correcta) hijo.classList.add("correcta");
          });
          var exp = el("div", "explicacion");
          var titulo = el("strong", "", op.correcta ? "¡Correcto! " : "No exactamente. ");
          exp.appendChild(titulo);
          exp.appendChild(document.createTextNode(p.explicacion));
          raiz.appendChild(exp);

          var sig = el("button", "btn", indice + 1 < preguntas.length ? "Siguiente" : "Ver resultado");
          sig.type = "button";
          sig.addEventListener("click", function () {
            indice++;
            if (indice < preguntas.length) mostrarPregunta(); else mostrarResultado();
          });
          raiz.appendChild(sig);
          sig.focus();
        });
        caja.appendChild(b);
      });
      raiz.appendChild(caja);
    }

    function mostrarResultado() {
      raiz.innerHTML = "";
      var porcentaje = Math.round((aciertos / preguntas.length) * 100);
      var r = el("div", "resultado");
      r.appendChild(el("div", "puntaje", aciertos + " / " + preguntas.length));
      r.appendChild(el("div", "mensaje", mensajeFinal(porcentaje)));

      var otra = el("button", "btn", "Jugar de nuevo");
      otra.type = "button";
      otra.addEventListener("click", function () { quiz(cfg); });
      r.appendChild(otra);

      if (cfg.repaso && cfg.repaso.length) {
        var rep = el("div", "repaso");
        rep.appendChild(el("h2", "", "Para llevarte"));
        var ul = el("ul");
        cfg.repaso.forEach(function (t) { ul.appendChild(el("li", "", t)); });
        rep.appendChild(ul);
        r.appendChild(rep);
      }
      raiz.appendChild(r);
    }

    mostrarPregunta();
  }

  /* ---------- Juego de PARES (tocar concepto y definición) ---------- */
  function pares(cfg) {
    var raiz = document.getElementById(cfg.contenedor);
    raiz.innerHTML = "";
    var total = cfg.pares.length;
    var hechos = 0;
    var errores = 0;
    var selConcepto = null;
    var selDefinicion = null;

    var prog = el("div", "progreso");
    var spanHechos = el("span", "", "Pares: 0 de " + total);
    var spanErrores = el("span", "", "Errores: 0");
    prog.appendChild(spanHechos);
    prog.appendChild(spanErrores);
    raiz.appendChild(prog);

    var barra = el("div", "barra");
    var relleno = el("span");
    barra.appendChild(relleno);
    raiz.appendChild(barra);

    var grilla = el("div", "pares");
    var colA = el("div", "columna");
    var colB = el("div", "columna");
    grilla.appendChild(colA);
    grilla.appendChild(colB);
    raiz.appendChild(grilla);

    var items = cfg.pares.map(function (p, i) { return { id: i, concepto: p[0], definicion: p[1] }; });

    function crearFicha(texto, clase, id) {
      var b = el("button", "ficha " + clase, texto);
      b.type = "button";
      b.dataset.id = id;
      return b;
    }

    mezclar(items).forEach(function (it) { colA.appendChild(crearFicha(it.concepto, "concepto", it.id)); });
    mezclar(items).forEach(function (it) { colB.appendChild(crearFicha(it.definicion, "definicion", it.id)); });

    function limpiarSeleccion() {
      if (selConcepto) selConcepto.classList.remove("seleccionada");
      if (selDefinicion) selDefinicion.classList.remove("seleccionada");
      selConcepto = null;
      selDefinicion = null;
    }

    function evaluar() {
      if (!selConcepto || !selDefinicion) return;
      var a = selConcepto, b = selDefinicion;
      if (a.dataset.id === b.dataset.id) {
        a.classList.remove("seleccionada"); b.classList.remove("seleccionada");
        a.classList.add("hecha"); b.classList.add("hecha");
        a.disabled = true; b.disabled = true;
        selConcepto = null; selDefinicion = null;
        hechos++;
        spanHechos.textContent = "Pares: " + hechos + " de " + total;
        relleno.style.width = (hechos / total) * 100 + "%";
        if (hechos === total) setTimeout(mostrarResultado, 500);
      } else {
        errores++;
        spanErrores.textContent = "Errores: " + errores;
        a.classList.add("error"); b.classList.add("error");
        selConcepto = null; selDefinicion = null;
        setTimeout(function () {
          a.classList.remove("error", "seleccionada");
          b.classList.remove("error", "seleccionada");
        }, 600);
      }
    }

    grilla.addEventListener("click", function (ev) {
      var b = ev.target.closest("button.ficha");
      if (!b || b.disabled || b.classList.contains("error")) return;
      if (b.classList.contains("concepto")) {
        if (selConcepto) selConcepto.classList.remove("seleccionada");
        selConcepto = b;
      } else {
        if (selDefinicion) selDefinicion.classList.remove("seleccionada");
        selDefinicion = b;
      }
      b.classList.add("seleccionada");
      evaluar();
    });

    function mostrarResultado() {
      raiz.innerHTML = "";
      var porcentaje = Math.max(0, Math.round(((total - errores) / total) * 100));
      var r = el("div", "resultado");
      r.appendChild(el("div", "puntaje", errores === 0 ? "Sin errores" : errores + (errores === 1 ? " error" : " errores")));
      r.appendChild(el("div", "mensaje", mensajeFinal(porcentaje)));

      var otra = el("button", "btn", "Jugar de nuevo");
      otra.type = "button";
      otra.addEventListener("click", function () { pares(cfg); });
      r.appendChild(otra);

      var rep = el("div", "repaso");
      rep.appendChild(el("h2", "", "Repasá los conceptos"));
      var ul = el("ul");
      cfg.pares.forEach(function (p) {
        var li = el("li");
        li.appendChild(el("strong", "", p[0] + ": "));
        li.appendChild(document.createTextNode(p[1]));
        ul.appendChild(li);
      });
      rep.appendChild(ul);
      r.appendChild(rep);
      raiz.appendChild(r);
    }
  }

  window.Juego = { quiz: quiz, pares: pares };
})();
