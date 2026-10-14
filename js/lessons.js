// Temario: de cero a dibujar figuras y cabezas.
// Cada lección: teoría corta + ejercicio en el lienzo + autoevaluación.
// exercise.guide → guía generada sobre el papel (ver guides.js)
// exercise.models → modelos para copiar o calcar (ver models.js)

export const MODULES = [
  {
    id: "m1", title: "Primeros trazos", tagline: "Controlar el lápiz antes que nada",
    lessons: [
      {
        id: "preparacion", title: "Antes de empezar", mins: 5,
        intro: "Dibujar es una habilidad, no un talento: se entrena como aprender a escribir. Aquí vas a practicar poco y a menudo, y esa constancia es lo que te hará mejorar.",
        sections: [
          { h: "Mueve el brazo, no la muñeca", p: "Casi todos los principiantes dibujan moviendo solo los dedos y la muñeca. Eso sirve para detalles pequeños, pero las líneas largas salen temblorosas. Para trazos largos, mueve el brazo desde el <b>hombro</b>; para medianos, desde el <b>codo</b>. Bloquea un poco la muñeca." },
          { h: "Cómo usar el lienzo", p: "Apoya la mano en la pantalla sin miedo: cuando la app detecta tu lápiz, ignora la palma. Toca con <b>dos dedos</b> para deshacer. Las líneas azules son guías del ejercicio; tus trazos son grises como el grafito." },
          { h: "Una regla importante", p: "Durante los ejercicios de línea, <b>no borres</b>. Si una línea sale mal, déjala y haz la siguiente mejor. Borrar te hace dibujar con miedo, y el miedo se nota en el trazo." },
        ],
        exercise: {
          goal: "Soltar la mano y conocer tu lápiz.",
          steps: [
            "Llena la hoja de espirales, ondas y garabatos grandes.",
            "Prueba a apretar más y menos: mira cómo cambia el grosor.",
            "Haz algunos garabatos moviendo solo la muñeca y otros con todo el brazo. Nota la diferencia.",
          ],
          guide: "none", time: 300,
        },
        review: ["¿Has movido el brazo entero en los trazos grandes?", "¿Has probado distintas presiones?"],
      },
      {
        id: "rectas", title: "Líneas rectas: el método fantasma", mins: 10,
        intro: "Una línea segura se dibuja rápido y de una vez. La forma de conseguirlo es planearla antes de tocar la pantalla.",
        sections: [
          { h: "Planea, ensaya, traza", p: "1) Mira los dos puntos que quieres unir. 2) Haz el movimiento varias veces <b>en el aire</b>, justo encima de la pantalla, hasta que salga solo. 3) Apoya el lápiz y traza de un golpe, sin parar ni corregir. Esto se llama <i>ghosting</i> o método fantasma.", fig: "ghost3" },
          { h: "Seguridad antes que precisión", p: "Es mejor una línea recta y decidida que se pasa un poco del punto que una línea temblorosa que acierta. La precisión llega sola con la práctica; la seguridad hay que buscarla desde el principio.", fig: "lineConfidence" },
          { h: "Gira el papel... o la tablet", p: "Cada persona tiene direcciones cómodas. Si una línea te cuesta, gira la tablet para trazarla en tu ángulo favorito. Los profesionales lo hacen todo el rato." },
        ],
        exercise: {
          goal: "Une cada par de puntos con una línea recta usando el método fantasma.",
          steps: ["Mira los dos puntos.", "Ensaya el movimiento en el aire 3 o 4 veces.", "Traza de una vez, rápido, sin corregir.", "Cuando acabes la hoja, pulsa «Nueva hoja» y repite."],
          guide: "dots", time: 600,
        },
        review: ["¿Tus líneas son rectas aunque no acierten del todo en los puntos?", "¿Has trazado sin pararte a mitad?", "¿Has evitado repasar líneas?"],
      },
      {
        id: "repasar", title: "Repetir sobre la misma línea", mins: 8,
        intro: "Repasar varias veces exactamente la misma línea entrena la memoria muscular, igual que repetir una escala en un instrumento.",
        sections: [
          { h: "Líneas superpuestas", p: "Traza encima de cada línea azul unas 6 u 8 veces, siempre de un solo golpe y a buen ritmo. La meta es que todas tus pasadas se acerquen a una sola línea, no que salga perfecta la primera." },
          { h: "Ritmo constante", p: "No vayas muy despacio: la lentitud produce temblor. Busca un ritmo cómodo y regular, como al firmar." },
        ],
        exercise: {
          goal: "Repasa cada línea guía 6–8 veces seguidas.",
          steps: ["Coloca el lápiz al inicio de la línea.", "Traza toda la línea de un golpe.", "Repite sin parar hasta 6–8 pasadas.", "Cambia de línea. Gira la tablet si te ayuda."],
          guide: "traceLines", time: 480,
        },
        review: ["¿Tus pasadas se agrupan cada vez más juntas?", "¿Has mantenido un ritmo regular?"],
      },
      {
        id: "curvas", title: "Curvas suaves", mins: 8,
        intro: "Las curvas son las líneas de los objetos vivos: brazos, hojas, telas. El secreto es el mismo: planear y trazar con decisión.",
        sections: [
          { h: "Curvas desde el codo", p: "Una curva suave nace de un arco del brazo. Para curvas grandes usa el hombro; para curvas medianas, el codo. Evita «dibujar» la curva a trocitos." },
          { h: "Fíjate en la dirección", p: "Antes de trazar, piensa hacia dónde se abre la curva y dónde está su parte más curvada. Ensaya en el aire siguiendo la guía." },
        ],
        exercise: {
          goal: "Repasa cada curva 4–6 veces y después dibuja curvas parecidas en el hueco libre.",
          steps: ["Ensaya en el aire siguiendo la curva azul.", "Traza encima 4–6 veces.", "Copia la misma curva al lado, sin guía."],
          guide: "arcs", time: 480,
        },
        review: ["¿Tus curvas son fluidas, sin ángulos ni rebotes?", "¿La copia sin guía se parece a la original?"],
      },
      {
        id: "elipses", title: "Círculos y elipses", mins: 10,
        intro: "La elipse es probablemente la forma más importante del dibujo: aparece en tazas, ruedas, ojos, brazos y cabezas. Un círculo visto en ángulo es una elipse.",
        sections: [
          { h: "Grados de una elipse", p: "Según cuánto gires un círculo, la elipse será más estrecha o más abierta. Fíjate en los dos ejes: el largo y el corto se cruzan en el centro y son perpendiculares.", fig: "ellipseDegrees" },
          { h: "Cómo dibujarlas", p: "Gira el brazo en el aire siguiendo la forma, apoya el lápiz y da <b>dos o tres vueltas</b> seguidas sin levantarlo. Que quede suave y redonda; no importa que no sea perfecta. Nunca deben tener picos." },
        ],
        exercise: {
          goal: "Repasa cada elipse dando 2–3 vueltas sin levantar el lápiz.",
          steps: ["Ensaya el giro en el aire.", "Apoya y da 2–3 vueltas continuas encima de la guía.", "Haz otra parecida al lado sin guía.", "Oculta la guía (botón del ojo) para ver solo tus trazos."],
          guide: "ellipses", time: 600,
        },
        review: ["¿Tus elipses son suaves y sin picos en los extremos?", "¿Has movido el hombro y no solo la muñeca?", "¿Mantienen la inclinación de la guía?"],
      },
      {
        id: "presion", title: "Presión y grosor", mins: 8,
        intro: "Un buen dibujo no tiene todas las líneas iguales. Controlar la presión del lápiz te permite dar vida, peso y profundidad.",
        sections: [
          { h: "Tres trazos básicos", p: "Practica líneas que empiezan finas y acaban gruesas, al revés, y las que son finas en los extremos y gruesas en el centro. Esta última es la línea más elegante del dibujo.", fig: "pressureDemo" },
          { h: "Para qué sirve", p: "Más adelante usarás líneas gruesas para lo que está cerca o en sombra, y finas para lo que está lejos o iluminado. Es la forma más sencilla de dar volumen sin sombrear." },
        ],
        exercise: {
          goal: "Rellena cada fila con el tipo de trazo que indica.",
          steps: ["Lee la etiqueta de cada fila.", "Haz líneas paralelas cambiando la presión mientras trazas.", "Prueba también con el grosor «fino» y «grueso» del pincel."],
          guide: "pressure", time: 480,
        },
        review: ["¿Se ve claramente el cambio de grosor?", "¿El cambio es gradual y no a saltos?"],
      },
    ],
  },
  {
    id: "m2", title: "Formas", tagline: "Ver el mundo como formas simples",
    lessons: [
      {
        id: "formas", title: "Todo está hecho de formas", mins: 8,
        intro: "Cualquier cosa, por complicada que parezca, se puede simplificar en círculos, cuadrados y triángulos. Ver esas formas es el primer superpoder del dibujante.",
        sections: [
          { h: "Las tres formas", p: "Círculo, cuadrado y triángulo. Dibújalas con el mismo método fantasma: planea cada lado, traza con decisión.", fig: "shapes2d" },
          { h: "Cuadrados que cierran", p: "En el cuadrado, el reto es que los lados sean rectos y las esquinas se cierren. En el círculo, que quede redondo. Si sale torcido, no lo corrijas: haz otro." },
        ],
        exercise: {
          goal: "Dibuja en cada casilla la forma que indica su icono, llenándola sin tocar los bordes.",
          steps: ["Mira el icono de la esquina.", "Planea la forma en el aire.", "Dibújala grande dentro de la casilla.", "Repite con «Nueva hoja»."],
          guide: "shapes2d", time: 480,
        },
        review: ["¿Los cuadrados cierran en las esquinas?", "¿Los círculos son redondos y sin picos?"],
      },
      {
        id: "siluetas", title: "Objetos con formas planas", mins: 12,
        intro: "Ahora vamos a construir cosas reconocibles uniendo formas. Así es como dibujan muchos artistas: primero la estructura simple, luego el detalle.",
        sections: [
          { h: "Mira, descompón, construye", p: "Antes de dibujar, pregúntate: ¿qué formas veo? Una casa es un cuadrado con un triángulo. Un árbol, círculos sobre un rectángulo. Un gato, dos círculos y unos triángulos.", fig: "cat" },
          { h: "Primero lo grande", p: "Empieza siempre por la forma más grande y luego coloca las pequeñas. Si empiezas por los detalles, las proporciones se descontrolan." },
        ],
        exercise: {
          goal: "Copia el modelo empezando por las formas grandes.",
          steps: ["Observa el modelo e identifica sus formas.", "Dibuja primero la forma más grande.", "Añade las demás formas encima.", "Pulsa «Nueva hoja» para el siguiente modelo.", "Truco: cambia a «Calcar» si quieres repasarlo primero."],
          models: ["house", "tree", "cat"], time: 720,
        },
        review: ["¿Has empezado por la forma grande?", "¿El tamaño de cada parte se parece al del modelo?"],
      },
    ],
  },
  {
    id: "m3", title: "Volumen", tagline: "Del papel plano a las tres dimensiones",
    lessons: [
      {
        id: "volumen", title: "Del plano al volumen", mins: 8,
        intro: "Un dibujo es plano, pero puede parecer profundo. Hay trucos muy simples que tu cerebro interpreta como profundidad.",
        sections: [
          { h: "Superposición", p: "Lo que tapa a otra cosa está delante. Es la señal de profundidad más fuerte que existe y la más fácil de usar.", fig: "overlap" },
          { h: "Tamaño y altura", p: "Lo que está lejos se ve más pequeño y, normalmente, más arriba en el papel. Combinando superposición y tamaño ya consigues un dibujo con fondo." },
        ],
        exercise: {
          goal: "Copia el modelo y luego inventa una escena con 5 cajas que se tapan unas a otras.",
          steps: ["Copia el modelo.", "En el resto de la hoja, dibuja rectángulos superpuestos.", "Haz los lejanos más pequeños y más altos.", "No dibujes las líneas que quedan tapadas."],
          models: ["overlap"], time: 480,
        },
        review: ["¿Se entiende qué objeto está delante?", "¿Has borrado (o no dibujado) las líneas tapadas?"],
      },
      {
        id: "cubo", title: "El cubo", mins: 12,
        intro: "El cubo es la forma base de todo lo que tiene caras planas: muebles, edificios, cajas, incluso el torso humano.",
        sections: [
          { h: "Tres caras visibles", p: "Normalmente vemos tres caras de un cubo. La arista más cercana es vertical, y las demás aristas se van alejando. Las líneas que no se ven (discontinuas) también se dibujan suaves al principio: así entiendes la forma como un objeto sólido, «transparente».", fig: "cube" },
          { h: "Dibujar a través", p: "Dibujar también lo que está oculto se llama <i>dibujar a través</i> de la forma. Te ayuda a que las caras encajen y es una costumbre de los buenos dibujantes." },
        ],
        exercise: {
          goal: "Calca el cubo 3 veces y después cópialo 5 veces en distintos tamaños.",
          steps: ["Empieza en modo «Calcar» y repasa el cubo.", "Cambia a «Copiar».", "Dibuja la arista vertical delantera primero.", "Añade las caras laterales y la de arriba.", "Termina con las aristas ocultas en línea suave."],
          models: ["cube"], mode: "trace", time: 720,
        },
        review: ["¿La arista delantera es vertical?", "¿Las aristas paralelas parecen paralelas?", "¿Has dibujado las aristas ocultas?"],
      },
      {
        id: "esfera-cilindro", title: "Esfera, cilindro y cono", mins: 12,
        intro: "Las formas redondas son la base de lo orgánico: cabezas, brazos, tazas, árboles. Todas se construyen con elipses.",
        sections: [
          { h: "La esfera", p: "Un círculo no parece una bola hasta que le añades una línea que la rodea, como el ecuador de un globo terráqueo. Esa elipse le da volumen.", fig: "sphere" },
          { h: "El cilindro", p: "Dos elipses unidas por dos líneas. Truco clave: la elipse de abajo es <b>un poco más redonda</b> que la de arriba si miras desde arriba. Y los extremos de la elipse nunca son picos.", fig: "cylinder" },
          { h: "El cono", p: "Una elipse y un punto. Une los extremos de la elipse con la punta.", fig: "cone" },
        ],
        exercise: {
          goal: "Copia cada forma varias veces. Pulsa «Nueva hoja» para cambiar de forma.",
          steps: ["Dibuja primero el eje (línea central) suave.", "Coloca las elipses perpendiculares al eje.", "Une con líneas laterales.", "Repite cada forma en tamaños distintos."],
          models: ["sphere", "cylinder", "cone"], time: 720,
        },
        review: ["¿Las elipses son suaves, sin picos?", "¿La elipse inferior del cilindro es algo más abierta?", "¿Los lados tocan la elipse justo en sus extremos?"],
      },
      {
        id: "combinar", title: "Combinar formas", mins: 10,
        intro: "Casi todos los objetos son combinaciones de cajas, esferas, cilindros y conos. Un helado es una esfera sobre un cono; una taza, un cilindro con un asa.",
        sections: [
          { h: "Construcción", p: "Dibuja cada forma completa, aunque luego quede tapada. Después repasa más fuerte solo las líneas que se ven. Esa diferencia de presión hace que el dibujo se lea claro.", fig: "icecream" },
        ],
        exercise: {
          goal: "Copia los objetos construyéndolos con formas básicas.",
          steps: ["Identifica las formas del modelo.", "Dibújalas completas con línea suave.", "Repasa con más presión las líneas visibles."],
          models: ["icecream", "cup"], time: 600,
        },
        review: ["¿Se entiende de qué formas está hecho el objeto?", "¿Las líneas finales son más marcadas que las de construcción?"],
      },
    ],
  },
  {
    id: "m4", title: "Perspectiva", tagline: "Que las cosas parezcan estar en un espacio",
    lessons: [
      {
        id: "p1", title: "Perspectiva de un punto", mins: 12,
        intro: "La perspectiva explica por qué las vías del tren parecen juntarse a lo lejos. Con dos ideas básicas puedes dibujar habitaciones, calles y cajas creíbles.",
        sections: [
          { h: "Horizonte y punto de fuga", p: "El <b>horizonte</b> es una línea a la altura de tus ojos. Las líneas que se alejan de ti se juntan en un <b>punto de fuga</b> (PF) sobre el horizonte. Lo que está por debajo del horizonte lo ves desde arriba; lo de encima, desde abajo.", fig: "persp1Demo" },
          { h: "Construir una caja", p: "Dibuja la cara frontal (un rectángulo normal). Desde cada esquina, traza líneas suaves hacia el PF. Decide la profundidad y cierra la cara de atrás con líneas paralelas a la frontal." },
        ],
        exercise: {
          goal: "Convierte cada rectángulo azul en una caja en perspectiva de un punto.",
          steps: ["Traza líneas suaves de cada esquina al PF.", "Corta la profundidad con una línea paralela al lado frontal.", "Completa la cara trasera.", "Repasa fuerte solo las aristas visibles."],
          guide: "persp1", time: 720,
        },
        review: ["¿Todas las líneas de profundidad van al punto de fuga?", "¿Las cajas bajo el horizonte enseñan su cara de arriba?"],
      },
      {
        id: "p2", title: "Perspectiva de dos puntos", mins: 12,
        intro: "Cuando miras una esquina de un objeto en lugar de una cara, aparecen dos puntos de fuga. Es la perspectiva más natural para objetos sueltos.",
        sections: [
          { h: "Dos puntos de fuga", p: "Pon el horizonte y dos puntos de fuga muy separados. Empieza por la arista vertical más cercana. Desde sus extremos, traza líneas a ambos puntos de fuga. Las verticales siguen siendo verticales.", fig: "persp2Demo" },
          { h: "Puntos lejanos", p: "Si los puntos de fuga están muy juntos, las cajas se deforman. En la vida real suelen estar fuera del papel; por eso luego aprenderás a estimarlos a ojo." },
        ],
        exercise: {
          goal: "Construye una caja a partir de cada línea vertical azul.",
          steps: ["Desde los extremos de la vertical, traza a los dos PF.", "Pon otras dos verticales para limitar la caja.", "Cierra la tapa con líneas cruzadas a los PF.", "Añade las aristas ocultas en suave."],
          guide: "persp2", time: 720,
        },
        review: ["¿Las verticales son realmente verticales?", "¿Cada arista apunta a su punto de fuga?"],
      },
      {
        id: "cajas", title: "Cajas a mano alzada", mins: 12,
        intro: "Ahora sin puntos de fuga dibujados. Esto entrena tu ojo para la perspectiva, que es lo que usarás al dibujar de verdad.",
        sections: [
          { h: "Estimar la convergencia", p: "Imagina los puntos de fuga fuera de la hoja. Las líneas que van en la misma dirección deben converger ligeramente, nunca abrirse. Dibuja las aristas ocultas para comprobarlo." },
          { h: "Cantidad sobre calidad", p: "Dibujar cientos de cajas es un ejercicio clásico. Cada caja enseña algo: no te paralices intentando que una salga perfecta." },
        ],
        exercise: {
          goal: "Dibuja una caja en cada cruz, en distintas posiciones y giros.",
          steps: ["Empieza por la arista delantera vertical.", "Imagina los puntos de fuga sobre el horizonte.", "Dibuja la caja entera, también lo oculto.", "Revisa: ¿alguna línea diverge? Corrígelo en la siguiente."],
          guide: "boxes", time: 720,
        },
        review: ["¿Las líneas paralelas convergen un poco (sin abrirse)?", "¿Se ven sólidas, con las caras bien cerradas?"],
      },
    ],
  },
  {
    id: "m5", title: "Observar y construir", tagline: "Dibujar lo que ves, no lo que crees ver",
    lessons: [
      {
        id: "construir", title: "Construir objetos reales", mins: 15,
        intro: "Ya sabes cajas, cilindros y conos. Con eso puedes dibujar casi cualquier objeto de tu casa.",
        sections: [
          { h: "Del objeto a las formas", p: "Una lámpara es un cono truncado, un cilindro fino y un disco. Primero dibuja las formas con línea suave, comprobando que los ejes y elipses encajan. Luego refina el contorno.", fig: "lamp" },
          { h: "Ejes alineados", p: "En objetos redondos, todas las elipses comparten el mismo eje central y son perpendiculares a él. Dibuja el eje primero." },
        ],
        exercise: {
          goal: "Copia los modelos y después dibuja un objeto real de tu casa (una taza, una botella, una caja).",
          steps: ["Dibuja el eje central.", "Coloca las elipses o cajas principales.", "Une las formas.", "Repasa el contorno final con más presión."],
          models: ["lamp", "cup"], time: 900,
        },
        review: ["¿Las elipses comparten el mismo eje?", "¿Se distinguen las líneas de construcción de las finales?"],
      },
      {
        id: "contorno", title: "Dibujo de contorno", mins: 10,
        intro: "Este ejercicio famoso cambia la forma en que miras. Sirve para dejar de dibujar «símbolos» (el ojo que crees que es un ojo) y empezar a dibujar lo que realmente ves.",
        sections: [
          { h: "Contorno ciego", p: "Mira tu mano libre (o cualquier objeto). Pon el lápiz en la pantalla y, <b>sin mirar la tablet</b>, sigue con los ojos muy despacio cada borde y arruga, moviendo el lápiz al mismo ritmo. El resultado será raro. Da igual: el objetivo es entrenar la conexión ojo-mano." },
          { h: "Contorno modificado", p: "Repite, pero ahora puedes mirar la tablet de vez en cuando para recolocarte. Ve lento: un milímetro de borde, un milímetro de línea." },
        ],
        exercise: {
          goal: "Haz 2 contornos ciegos de tu mano y 1 contorno modificado.",
          steps: ["Coloca tu mano en una pose interesante.", "Contorno ciego: 2 minutos, sin mirar la tablet.", "Repite otra vez.", "Contorno modificado: 5 minutos, mirando poco."],
          guide: "none", time: 600,
        },
        review: ["¿Has mirado el objeto mucho más que el dibujo?", "¿Has ido despacio siguiendo cada detalle?"],
      },
      {
        id: "observar", title: "Dibujar del natural", mins: 15,
        intro: "Dibujar lo que tienes delante es el mejor entrenamiento que existe. Esta lección te da las herramientas para hacerlo con buenas proporciones.",
        sections: [
          { h: "Entrecierra los ojos", p: "Al entrecerrar los ojos desaparecen los detalles y ves las formas grandes. Empieza por esas." },
          { h: "Mide con relaciones", p: "Compara: ¿cuántas veces cabe el ancho en el alto? ¿Dónde cae el asa respecto a la mitad de la taza? Usa una parte del objeto como unidad y mide las demás con ella." },
          { h: "Del encaje al detalle", p: "Primero un encaje rápido y suave del conjunto (1–2 min). Comprueba proporciones. Solo entonces ve a los detalles." },
        ],
        exercise: {
          goal: "Dibuja 3 objetos reales: 3 minutos, 5 minutos y 7 minutos.",
          steps: ["Elige objetos simples (fruta, taza, zapatilla).", "Encaje suave de formas grandes.", "Comprueba proporciones comparando medidas.", "Refina contorno y añade algún detalle.", "Usa «Nueva hoja» entre objetos."],
          guide: "none", time: 900,
        },
        review: ["¿Las proporciones generales se parecen al objeto?", "¿Has empezado por lo grande?"],
      },
    ],
  },
  {
    id: "m6", title: "Sombra con líneas", tagline: "Dar volumen sin pintar: solo trazos",
    lessons: [
      {
        id: "valor", title: "Valor con tramas", mins: 10,
        intro: "El valor es lo claro u oscuro que es algo. Sin pintar, lo consigues con <i>tramas</i>: líneas paralelas más o menos juntas.",
        sections: [
          { h: "Trama paralela y cruzada", p: "Líneas separadas = gris claro. Líneas juntas = gris medio. Si cruzas una segunda capa en otra dirección, obtienes oscuros. Todas las líneas de una capa van en la misma dirección.", fig: "valueDemo" },
          { h: "Trazos cortos y rápidos", p: "Haz trazos con un movimiento de muñeca, rápidos, todos del mismo largo. Ahora sí está bien usar la muñeca: son líneas cortas." },
        ],
        exercise: {
          goal: "Rellena las dos escalas de valor, del 1 (papel) al 5 (muy oscuro).",
          steps: ["Deja la casilla 1 vacía.", "Primera fila: solo trama paralela, cada vez más junta.", "Segunda fila: añade capas cruzadas.", "Comprueba que cada casilla es más oscura que la anterior."],
          guide: "valueScale", time: 600,
        },
        review: ["¿Hay un salto claro entre cada paso?", "¿Las líneas de cada capa son paralelas?"],
      },
      {
        id: "luz", title: "Luz y sombra en las formas", mins: 12,
        intro: "Cuando la luz viene de un lado, cada forma tiene una zona iluminada, una zona en sombra y una sombra proyectada en el suelo.",
        sections: [
          { h: "Partes de la sombra", p: "La <b>luz</b> es la zona que mira hacia la fuente de luz. La <b>sombra propia</b> está en el lado contrario. La <b>sombra proyectada</b> cae en el suelo y es la parte más oscura, sobre todo donde toca el objeto.", fig: "sphereShade" },
          { h: "En el cubo es más fácil", p: "Cada cara recibe la luz de una forma: una clara, otra media y otra oscura. Decide primero de dónde viene la luz y mantenla igual en todo el dibujo.", fig: "cubeShade" },
        ],
        exercise: {
          goal: "Copia la esfera y el cubo con sus sombras, usando la luz desde arriba a la izquierda.",
          steps: ["Dibuja la forma.", "Marca suave la línea donde empieza la sombra.", "Rellena la sombra con trama.", "Añade la sombra proyectada, más oscura junto al objeto."],
          models: ["sphereShade", "cubeShade"], time: 720,
        },
        review: ["¿Toda la sombra está en el lado contrario a la luz?", "¿La sombra proyectada es lo más oscuro?"],
      },
      {
        id: "trama-forma", title: "Tramas que siguen la forma", mins: 10,
        intro: "Si las líneas de sombra siguen la superficie del objeto, refuerzan el volumen. Es como si envolvieras el objeto con hilo.",
        sections: [
          { h: "Líneas de contorno", p: "En un cilindro, las tramas son trozos de elipse paralelos a las tapas. En una esfera, curvas que la rodean. Esta técnica hace que un dibujo a línea parezca muy sólido.", fig: "contourCyl" },
        ],
        exercise: {
          goal: "Copia el cilindro y sombréalo con líneas que lo rodean. Luego prueba con una esfera.",
          steps: ["Dibuja el cilindro.", "Traza elipses a lo largo del cuerpo, paralelas a la tapa.", "Junta más las líneas en la zona de sombra."],
          models: ["contourCyl", "sphere"], time: 600,
        },
        review: ["¿Las líneas parecen envolver el objeto?", "¿Se juntan más en la zona oscura?"],
      },
    ],
  },
  {
    id: "m7", title: "Figura humana", tagline: "Proporción, movimiento y volumen",
    lessons: [
      {
        id: "proporciones", title: "El cuerpo medido en cabezas", mins: 12,
        intro: "Para que una figura parezca bien hecha, sus partes tienen que tener el tamaño correcto entre sí. La unidad de medida clásica es la cabeza.",
        sections: [
          { h: "Ocho cabezas", p: "Una figura idealizada mide unas 8 cabezas. Referencias: barbilla (1), pecho (2), ombligo (3), entrepierna (4, la mitad del cuerpo), rodillas (6) y pies (8). Las muñecas caen a la altura de la entrepierna. Las personas reales suelen medir 7–7,5 cabezas.", fig: "figure8" },
          { h: "Hombros y caderas", p: "Los hombros miden unas 2 cabezas de ancho en un hombre y algo menos en una mujer; las caderas, al revés. No hace falta memorizarlo todo: usa la guía." },
        ],
        exercise: {
          goal: "Copia la figura encajándola en las líneas de la regla.",
          steps: ["Dibuja la cabeza en la primera franja.", "Marca barbilla, pecho, ombligo, entrepierna, rodillas y pies.", "Dibuja el tronco y las piernas con formas simples.", "Repite 3 veces más rápido cada vez."],
          models: ["figure8"], guide: "figureRuler", time: 720,
        },
        review: ["¿La entrepierna está en la mitad de la figura?", "¿Los brazos llegan a mitad del muslo?"],
      },
      {
        id: "gesto", title: "Gesto y línea de acción", mins: 12,
        intro: "Una figura bien proporcionada puede parecer un maniquí rígido. El gesto es lo que le da vida: la sensación de movimiento y peso.",
        sections: [
          { h: "La línea de acción", p: "Es una curva imaginaria que recorre el cuerpo de la cabeza al pie de apoyo. Casi siempre tiene forma de C, S o I. Empieza cada figura con esa línea.", fig: "actionLines" },
          { h: "Hombros y caderas inclinados", p: "Cuando alguien apoya el peso en una pierna, la cadera de ese lado sube y los hombros se inclinan al contrario. Esa inclinación opuesta da naturalidad.", fig: "stickPose" },
          { h: "Rápido y suelto", p: "Los dibujos de gesto se hacen en 30 segundos o 2 minutos. No hay tiempo para detalles: solo el movimiento. Para practicar con fotos de poses reales, usa webs como line-of-action.com o quickposes.com en otra pestaña." },
        ],
        exercise: {
          goal: "Sobre cada línea de acción, construye una figura de palitos con articulaciones.",
          steps: ["Usa la línea azul como columna.", "Añade hombros y caderas inclinados en sentidos opuestos.", "Añade brazos y piernas con puntos en codos y rodillas.", "Máximo 1 minuto por figura. Luego copia los modelos."],
          guide: "actionLines", models: ["stickPose", "runPose"], time: 720,
        },
        review: ["¿Tus figuras parecen moverse o tener peso?", "¿Hombros y caderas tienen inclinaciones distintas?"],
      },
      {
        id: "maniqui", title: "El maniquí: volumen del cuerpo", mins: 15,
        intro: "Ahora damos volumen a la figura de palitos: el tórax es un huevo, la pelvis una caja y las extremidades cilindros.",
        sections: [
          { h: "Formas del cuerpo", p: "Tórax: un huevo grande. Pelvis: una caja más pequeña. Brazos y piernas: cilindros que se estrechan hacia la mano y el pie. Articulaciones: esferas. Es el mismo trabajo que en el módulo de volumen, aplicado al cuerpo.", fig: "bean" },
        ],
        exercise: {
          goal: "Copia el maniquí y luego vístelo de volumen sobre tus figuras de palitos.",
          steps: ["Dibuja la figura de palitos.", "Encima, el huevo del tórax y la caja de la pelvis.", "Añade cilindros para las extremidades.", "Marca las articulaciones con esferas."],
          models: ["bean"], time: 900,
        },
        review: ["¿Las formas encajan sobre la estructura?", "¿Los cilindros se estrechan hacia manos y pies?"],
      },
      {
        id: "manos", title: "Manos simplificadas", mins: 10,
        intro: "Las manos asustan a todo el mundo. El truco es no dibujar cinco dedos de golpe, sino una forma simple que luego divides.",
        sections: [
          { h: "Palma y manopla", p: "La palma es una caja algo más alta que ancha. Los dedos juntos forman una manopla. El pulgar es un bloque aparte que sale del lateral de la palma. Los nudillos forman un arco, no una línea recta.", fig: "mitten" },
        ],
        exercise: {
          goal: "Copia el modelo y después dibuja tu propia mano en 3 posiciones.",
          steps: ["Caja de la palma.", "Manopla de los dedos.", "Bloque del pulgar.", "Divide los dedos siguiendo el arco de los nudillos."],
          models: ["mitten"], time: 600,
        },
        review: ["¿El dedo corazón es el más largo?", "¿Los nudillos forman un arco?"],
      },
    ],
  },
  {
    id: "m8", title: "La cabeza", tagline: "El método Loomis paso a paso",
    lessons: [
      {
        id: "loomis", title: "La cabeza de frente", mins: 12,
        intro: "Andrew Loomis enseñó un método para dibujar cabezas que se sigue usando hoy: una esfera para el cráneo y una mandíbula colgada de ella.",
        sections: [
          { h: "Esfera y línea central", p: "Dibuja un círculo. Traza la línea central vertical y la línea de las cejas horizontal, que cruza por el centro del círculo.", fig: "loomisFront" },
          { h: "Tres partes iguales", p: "Desde el nacimiento del pelo hasta la barbilla hay tres partes iguales: hasta las cejas, hasta la base de la nariz y hasta la barbilla. Los ojos están a mitad de la cabeza; las orejas, entre cejas y nariz." },
        ],
        exercise: {
          goal: "Copia la cabeza de frente. Después usa los círculos de la derecha para hacer más cabezas.",
          steps: ["Círculo del cráneo.", "Línea central y línea de cejas.", "Divide en tres partes y dibuja la mandíbula.", "Coloca ojos, nariz, boca y orejas."],
          models: ["loomisFront"], guide: "headCircles", time: 720,
        },
        review: ["¿Las tres partes de la cara miden igual?", "¿Los ojos están en mitad de la cabeza?"],
      },
      {
        id: "cabeza-giro", title: "Cabeza de 3/4 y perfil", mins: 15,
        intro: "Al girar la cabeza, las líneas guía se curvan sobre la esfera como meridianos de un globo terráqueo.",
        sections: [
          { h: "Tres cuartos", p: "Se ve un lado del cráneo como una elipse (el plano lateral). La línea central se curva y se desplaza hacia el lado al que mira la cara. El ojo lejano se ve más estrecho.", fig: "loomis34" },
          { h: "Perfil", p: "El plano lateral se ve casi como un círculo. La oreja queda justo detrás de la mitad de la cabeza. El perfil de la cara sale fuera del círculo.", fig: "profile" },
        ],
        exercise: {
          goal: "Copia la cabeza de 3/4 y la de perfil varias veces.",
          steps: ["Círculo del cráneo.", "Elipse del plano lateral.", "Línea central curvada y línea de cejas.", "Mandíbula y rasgos."],
          models: ["loomis34", "profile"], time: 900,
        },
        review: ["¿Las líneas guía se curvan con la esfera?", "¿La oreja está detrás de la mitad del cráneo?"],
      },
      {
        id: "rasgos", title: "Ojos, nariz y boca", mins: 12,
        intro: "Los rasgos son formas 3D, no símbolos. Un ojo es una esfera dentro de unos párpados; la nariz, una cuña.",
        sections: [
          { h: "Formas simples", p: "Ojo: almendra con el iris parcialmente tapado por el párpado de arriba. Nariz: una cuña con una bola en la punta y dos alas a los lados. Boca: la línea central es la más oscura; el labio superior suele ser más fino.", fig: "features" },
        ],
        exercise: {
          goal: "Copia los rasgos varias veces y después busca un rostro en una foto para practicar.",
          steps: ["Ojo: almendra, iris, pupila, párpado.", "Nariz: cuña, bola, alas.", "Boca: línea central primero, luego labios."],
          models: ["features"], time: 720,
        },
        review: ["¿El párpado tapa la parte de arriba del iris?", "¿La línea central de la boca es la más marcada?"],
      },
    ],
  },
  {
    id: "m9", title: "Seguir aprendiendo", tagline: "Hacer del dibujo un hábito",
    lessons: [
      {
        id: "rutina", title: "Tu rutina a partir de ahora", mins: 5,
        intro: "Has visto lo fundamental. A partir de aquí, la mejora viene de dibujar mucho y de forma variada.",
        sections: [
          { h: "Una sesión ideal (20–30 min)", p: "5 min de calentamiento (líneas y elipses) · 10 min de un fundamento (cajas, formas, cabezas) · 10–15 min de dibujo libre de algo que te guste." },
          { h: "Repite lecciones", p: "Vuelve a las lecciones cada pocas semanas y compara en la galería. Ver tu progreso es la mejor motivación." },
          { h: "Recursos gratuitos", p: "Drawabox.com (fundamentos en profundidad), el canal de Proko en YouTube (anatomía y figura), y line-of-action.com para gesto con fotos." },
        ],
        exercise: {
          goal: "Dibuja libremente algo que te guste usando todo lo aprendido.",
          steps: ["Elige un tema que te motive.", "Encaja con formas simples.", "Construye volumen.", "Remata con líneas de distinto grosor y algo de trama."],
          guide: "none", time: 900,
        },
        review: ["¿Has empezado por formas simples?", "¿Has variado el grosor de línea?"],
      },
    ],
  },
];

export const LESSONS = MODULES.flatMap((mod) => mod.lessons.map((l) => ({ ...l, module: mod })));
export const lessonById = (id) => LESSONS.find((l) => l.id === id);
export const lessonIndex = (id) => LESSONS.findIndex((l) => l.id === id);
