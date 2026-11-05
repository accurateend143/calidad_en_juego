<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mesa de Datos · Calidad en juego</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/mesa.css">
</head>
<body class="pagina-juego">
  <header class="banda">
    <div class="banda-contenido">
      <a class="volver" href="index.html">← Volver al inicio</a>
      <h1>📊 Mesa de Datos</h1>
      <p>Herramientas de Calidad · 4 estaciones cortas. Se juega arrastrando o tocando.</p>
    </div>
  </header>

  <main class="contenedor contenedor-juego">
    <section class="panel panel-juego">
      <div id="juego"></div>
    </section>
  </main>

  <footer class="sitio">Instituto La Salette · 6° Computación · Muestra de fin de año</footer>

  <script src="js/mesa.js"></script>
  <script>
    /* Datos tomados de la segunda entrega corregida (Herramientas y Control de la Calidad).
       Las cifras son simuladas, como en la entrega, y fijas: el resultado es siempre el mismo. */
    Juego.mesa({
      contenedor: "juego",
      intro: "Sos analista de calidad de Andreani y tenés que descubrir por qué fallan las entregas domiciliarias. En cada estación usás una herramienta distinta, en el mismo orden que la segunda entrega: del proceso a los números.",
      aviso: "Juego con fines educativos. Los datos son simulados y no describen la operación real de Andreani.",

      /* Barra de progreso y resumen final. Las frases retoman el Cuadro 1 de la entrega. */
      etapas: [
        { corto: "Proceso", icono: "flechas", herramientas: "Diagrama de flujo", frase: "¿Cómo funciona realmente el proceso? Mostró tres condiciones que se verifican en la puerta y un reintento que repite el proceso completo." },
        { corto: "Causas", icono: "espina", herramientas: "Diagrama de causa y efecto", frase: "¿Cuáles son todas las causas posibles? Las ordenó en seis familias, con responsables distintos." },
        { corto: "Contar", icono: "barras", herramientas: "Lista de verificación y gráfico de Pareto", frase: "¿Cuáles son las pocas causas que explican la mayoría de los casos? Tres de ocho explican el 77,1 %." },
        { corto: "Control", icono: "control", herramientas: "Gráfico de control, histograma y muestreo", frase: "¿El proceso es estable en el tiempo? Separó causas comunes de especiales, y la muestra mostró cuánto revisar sin gastar de más." }
      ],

      /* Estación 1: Figura 1 de la entrega.
         forma: "ovalo" (inicio y fin), "rect" (actividad) o "rombo" (decisión).
         col y fila ubican cada paso en la grilla; "fijo" son los que ya vienen puestos.
         El jugador completa los demás en el orden de esta lista. */
      flujo: {
        titulo: "Estación 1 · Ver el proceso",
        herramientas: "Diagrama de flujo",
        consigna: "Armá el proceso de entrega domiciliaria: tocá los pasos en orden y fijate que cada uno vaya en el símbolo que le corresponde.",
        pasos: [
          { id: "inicio", texto: "Inicio: el envío llega a la sucursal de distribución", forma: "ovalo", col: 1, fila: 1, fijo: true },
          { id: "clasif", texto: "Clasificación del envío y asignación a una hoja de ruta", forma: "rect", col: 1, fila: 2 },
          { id: "notif", texto: "Notificación al destinatario", forma: "rect", col: 1, fila: 3 },
          { id: "salida", texto: "Salida a reparto", forma: "rect", col: 1, fila: 4 },
          { id: "llegada", texto: "Llegada al domicilio", forma: "rect", col: 1, fila: 5 },
          { id: "acceso", texto: "¿Es posible acceder al domicilio?", forma: "rombo", col: 1, fila: 6 },
          { id: "persona", texto: "¿Hay una persona autorizada para recibir?", forma: "rombo", col: 1, fila: 7 },
          { id: "datos", texto: "¿La documentación y los datos son correctos?", forma: "rombo", col: 1, fila: 8 },
          { id: "entrega", texto: "Entrega efectiva", forma: "rect", col: 1, fila: 9 },
          { id: "registro", texto: "Registro de la entrega en el sistema", forma: "rect", col: 1, fila: 10 },
          { id: "fin1", texto: "Fin", forma: "ovalo", col: 1, fila: 11, fijo: true },
          { id: "fallida", texto: "Visita fallida", forma: "rect", col: 2, fila: 8 },
          { id: "intentos", texto: "¿Quedan intentos de entrega disponibles?", forma: "rombo", col: 2, fila: 9 },
          { id: "devolucion", texto: "Devolución al remitente", forma: "rect", col: 2, fila: 10 },
          { id: "fin2", texto: "Fin", forma: "ovalo", col: 2, fila: 11, fijo: true }
        ],
        /* salida/entrada: lado del paso donde sale y llega la flecha. "bucle" se ilumina al final. */
        conexiones: [
          { de: "inicio", a: "clasif", salida: "abajo", entrada: "arriba" },
          { de: "clasif", a: "notif", salida: "abajo", entrada: "arriba" },
          { de: "notif", a: "salida", salida: "abajo", entrada: "arriba" },
          { de: "salida", a: "llegada", salida: "abajo", entrada: "arriba" },
          { de: "llegada", a: "acceso", salida: "abajo", entrada: "arriba" },
          { de: "acceso", a: "persona", salida: "abajo", entrada: "arriba", etiqueta: "Sí" },
          { de: "persona", a: "datos", salida: "abajo", entrada: "arriba", etiqueta: "Sí" },
          { de: "datos", a: "entrega", salida: "abajo", entrada: "arriba", etiqueta: "Sí" },
          { de: "entrega", a: "registro", salida: "abajo", entrada: "arriba" },
          { de: "registro", a: "fin1", salida: "abajo", entrada: "arriba" },
          { de: "acceso", a: "fallida", salida: "derecha", entrada: "arriba", etiqueta: "No", bucle: true },
          { de: "persona", a: "fallida", salida: "derecha", entrada: "arriba", etiqueta: "No", bucle: true },
          { de: "datos", a: "fallida", salida: "derecha", entrada: "izquierda", etiqueta: "No", bucle: true },
          { de: "fallida", a: "intentos", salida: "abajo", entrada: "arriba", bucle: true },
          { de: "intentos", a: "devolucion", salida: "abajo", entrada: "arriba", etiqueta: "No" },
          { de: "devolucion", a: "fin2", salida: "abajo", entrada: "arriba" },
          { de: "intentos", a: "clasif", salida: "derecha", entrada: "derecha", etiqueta: "Sí", bucle: true }
        ],
        cartel: { texto: "Retorno a sucursal y reprogramación: el proceso se ejecuta completo tantas veces como intentos se realicen, pero el ingreso sigue siendo uno solo.", col: 2, fila: 3, filas: 3 },
        alCerrar: "¡Flujo cerrado! Mirá los tres «No»: si falla cualquiera de las tres condiciones, el resultado es el mismo. Y se verifican recién en la puerta, cuando el traslado ya se pagó.",
        resumen: "Pasos conectados: 12 · Tres condiciones en la puerta: acceso, persona autorizada y datos correctos · Bucle de reintento",
        aprendizaje: "cada símbolo tiene su función (óvalo: inicio y fin; rectángulo: actividad; rombo: decisión). El diagrama muestra que la visita fallida resulta de tres condiciones distintas y que cada reintento repite el proceso completo."
      },

      /* Estación 2: Figura 2 de la entrega (ramas y causas textuales).
         Quedan fuera del juego, para que no se haga largo: Exceso de paradas por jornada (Personal),
         Restricciones de circulación (Entorno), Desperfectos en los vehículos (Tecnología),
         Franjas horarias amplias (Método) y Teléfono desactualizado (Información). */
      causas: {
        titulo: "Estación 2 · Buscar la causa",
        herramientas: "Diagrama de causa y efecto (espina de pescado)",
        consigna: "Cada tarjeta es una posible causa de la entrega domiciliaria fallida. Ponela en la espina de su familia.",
        efecto: "Entrega domiciliaria fallida",
        ramas: ["Personal", "Entorno", "Tecnología", "Método", "Información", "Medición"],
        pistas: {
          "Personal": "tiene que ver con las personas que hacen el reparto.",
          "Entorno": "es algo de afuera, que la empresa no controla.",
          "Tecnología": "tiene que ver con los vehículos o los sistemas.",
          "Método": "es la forma en que se organiza y se coordina la entrega.",
          "Información": "es un dato del envío que llega mal cargado.",
          "Medición": "tiene que ver con qué se registra y qué se mide."
        },
        tarjetas: [
          { texto: "Alta rotación de personal", rama: "Personal" },
          { texto: "Personal transitorio sin conocer la zona", rama: "Personal" },
          { texto: "Picos estacionales de demanda", rama: "Entorno" },
          { texto: "Edificios sin portero y barrios cerrados", rama: "Entorno" },
          { texto: "Flota insuficiente en fechas pico", rama: "Tecnología" },
          { texto: "Seguimiento desactualizado", rama: "Tecnología" },
          { texto: "Notificación con poca anticipación", rama: "Método" },
          { texto: "Sin confirmación previa", rama: "Método" },
          { texto: "Dirección incompleta o sin piso", rama: "Información" },
          { texto: "Código postal erróneo", rama: "Información" },
          { texto: "No se registra la causa de cada falla", rama: "Medición" },
          { texto: "Indicadores que no distinguen fallas", rama: "Medición" }
        ],
        alTerminar: "Todas las causas están en su rama. Fijate que no dependen del mismo responsable: Información se origina antes del reparto, Método y Personal son internas y Entorno es en buena medida externo.",
        aprendizaje: "el diagrama de causa y efecto obliga a revisar todas las familias de causas, incluso las que no aparecen solas (como no registrar el motivo de cada falla). Pero enumera causas sin decir cuál pesa más: para eso hacen falta datos."
      },

      /* Estación 3: Cuadro 2 de la entrega (1.000 visitas fallidas del mes).
         Los motivos van desordenados a propósito: el jugador los ordena. */
      conteo: {
        titulo: "Estación 3 · Contar y priorizar",
        herramientas: "Lista de verificación y gráfico de Pareto",
        consigna: "Llegan los tickets de las visitas fallidas del mes. Registrá el motivo de cada una, ordená las barras y encontrá las pocas causas que explican casi todo.",
        aMano: 12, /* tickets que se clasifican a mano; el resto del mes se carga de una vez */
        motivos: [
          { nombre: "Dirección incompleta o incorrecta", corto: "Dirección", cantidad: 231 },
          { nombre: "Visita fuera de la franja horaria informada", corto: "Franja", cantidad: 64 },
          { nombre: "Destinatario ausente", corto: "Ausente", cantidad: 412 },
          { nombre: "Demora o desperfecto del vehículo", corto: "Vehículo", cantidad: 24 },
          { nombre: "Imposibilidad de acceso al domicilio", corto: "Acceso", cantidad: 128 },
          { nombre: "Otras causas", corto: "Otras", cantidad: 13 },
          { nombre: "Teléfono de contacto desactualizado", corto: "Teléfono", cantidad: 41 },
          { nombre: "Sin persona autorizada o sin documentación", corto: "Autoriz.", cantidad: 87 }
        ],
        sinRegistro: "Sin el motivo anotado, este ticket no entra en ningún casillero. Es la causa de la rama Medición: si no se registra por qué falló cada visita, no se puede contar ni priorizar nada.",
        nota: "Este Pareto existe solo porque se anotó el motivo de cada visita. Y dice qué causas pesan más, pero no qué hacer: para eso hay que volver al diagrama de causa y efecto (Ausente es un problema de Método; Dirección, de Información).",
        aprendizaje: "la lista de verificación registra cuántas veces pasa cada cosa y el gráfico de Pareto las ordena para priorizar: tres de ocho causas explican el 77,1 % de las visitas fallidas."
      },

      /* Estación 4a: apartado 3.5 de la entrega. Gráfico p semanal, meta 95 %, obtenido 92 %.
         Los límites de control son simulados. Fuentes especiales del punto II. */
      control: {
        titulo: "Estación 4a · Controlar el proceso",
        herramientas: "Gráfico de control e histograma",
        consigna: "Cada punto es el porcentaje semanal de entregas efectivas en el primer intento. Tocá «Frená y revisá» cuando aparezca una causa especial: un punto fuera de los límites o 7 semanas seguidas del mismo lado de la línea central.",
        unidad: "Semana",
        ejeX: "Semanas →  (% de entregas efectivas en el primer intento)",
        escala: [84, 100],
        lic: 88, centro: 92, lsc: 96,
        meta: 95,
        intervalo: 0.9, /* segundos entre puntos */
        ventana: 3,     /* puntos que se pueden dejar pasar antes de que sea tarde */
        puntos: [
          92.6, 93.9, 92.5, 91.8, 94.0, 92.6, 93.1, 87.6, 93.4, 92.4, 94.0, 91.3, 90.6,
          91.1, 90.2, 90.9, 89.8, 90.5, 92.9, 94.0, 92.2, 94.0, 87.4, 93.6, 92.7, 93.8
        ],
        senales: [
          { dia: 8, regla: "Un punto por debajo del límite inferior.", fuente: "Pico estacional de demanda", detalle: "Hot Sale: el volumen se multiplica y se incorpora personal transitorio que no conoce la zona." },
          { dia: 18, racha: 7, regla: "Siete semanas seguidas por debajo de la línea central.", fuente: "Datos de domicilio cargados en origen", detalle: "Un cliente contratante nuevo carga las direcciones con un formulario deficiente." },
          { dia: 23, regla: "Un punto por debajo del límite inferior.", fuente: "Interrupción externa de la circulación", detalle: "Un temporal y varios cortes de calle impidieron completar las hojas de ruta." }
        ],
        conclusionHistograma: "El proceso puede estar bajo control y aun así no llegar a la meta: es estable pero no capaz. Para mejorar hay que rediseñarlo, no ajustarlo semana a semana.",
        aprendizaje: "todo proceso varía por causas comunes. El gráfico de control avisa cuándo actúa una causa especial, para no intervenir de más ni de menos. El histograma muestra la forma de la distribución de una variable numérica."
      },

      /* Estación 4b: apartado 3.4 y punto IV del 3.5 (auditoría de datos de domicilio) */
      muestreo: {
        titulo: "Estación 4b · Revisar una muestra",
        herramientas: "Muestreo de aceptación",
        consigna: "Llegó un lote de 100 envíos con sus direcciones cargadas por el cliente. Revisarlas todas es inviable: elegí cuántas revisar. Si en la muestra aparece alguna dirección deficiente (sin altura, piso, código postal correcto o teléfono vigente), se rechaza el lote.",
        unidades: "envíos",
        defecto: { singular: "dirección deficiente", plural: "direcciones deficientes" },
        accionRechazo: "se corrige el formulario de carga en origen",
        lote: 100,
        defectuosos: 5,
        min: 5,
        inicial: 10,
        costoMax: 50,  /* % del lote: más que esto es caro */
        riesgoMax: 20, /* % de probabilidad de aceptar un lote malo: el NIST cita valores típicos de 0,20 a 0,01 */
        semilla: 7,
        aprendizaje: "una muestra aleatoria bien tomada informa casi lo mismo que revisar todo, a una fracción del costo, pero implica aceptar un riesgo. Y sigue siendo una verificación posterior: controlar el proceso es mejor porque previene."
      },

      niveles: ["Principiante", "Analista", "Experto"],
      fuera: "Quedó afuera el diagrama de dispersión, que muestra si dos variables están relacionadas (por ejemplo, paradas asignadas por jornada y entregas no concretadas). Que estén relacionadas no prueba que una cause la otra.",
      mensajeFinal: "Las herramientas de calidad permiten decidir con datos y no solo con intuición: reemplazan la opinión por la evidencia."
    });
  </script>
</body>
</html>
