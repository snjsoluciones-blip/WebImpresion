// Guías informativas: responden preguntas que la gente busca en Google antes de pedir una pieza.
// Regla: información técnica correcta y general, sin precios ni plazos prometidos, y con
// enlaces a los servicios reales de SNJ Soluciones.

export interface GuiaSeccion {
  h2: string;
  p?: string[];
  ul?: string[];
}

export interface Guia {
  slug: string;
  nombre: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** Fecha de publicación (ISO). */
  fecha: string;
  imagen: { src: string; alt: string };
  secciones: GuiaSeccion[];
  /** Páginas de servicio relacionadas (slugs de /servicios). */
  servicios: string[];
}

export const GUIAS: Guia[] = [
  {
    slug: "pla-petg-abs-tpu-que-material-elegir",
    nombre: "PLA, PETG, ABS o TPU: qué material elegir",
    title: "PLA, PETG, ABS o TPU: qué material elegir para imprimir en 3D",
    description:
      "Diferencias entre PLA, PETG, ABS y TPU para impresión 3D: resistencia, temperatura, flexibilidad y para qué sirve cada uno. Guía simple para elegir bien.",
    h1: "PLA, PETG, ABS o TPU: qué material elegir para imprimir en 3D",
    lead: "Elegir bien el material define si tu pieza dura o se rompe. Te explicamos cada uno en simple, con ejemplos de para qué sirve.",
    fecha: "2026-10-30",
    imagen: {
      src: "/images/trofeo-piloto-dorado.jpg",
      alt: "Trofeo impreso en 3D con acabado dorado metalizado",
    },
    secciones: [
      {
        h2: "PLA: el todoterreno",
        p: [
          "Es el material más usado y el más económico. Imprime con muy buen nivel de detalle y deja una terminación superficial muy prolija.",
          "Su límite es el calor: aguanta hasta unos 55 °C, así que no conviene para piezas que van a quedar al sol dentro de un auto o cerca de un motor. Es ideal para prototipos, maquetas, piezas decorativas y trofeos.",
        ],
      },
      {
        h2: "PETG: resistente y confiable",
        p: [
          "Tiene buena resistencia mecánica y química, tolera la humedad y los golpes sin volverse frágil. Soporta hasta unos 75 °C y se puede usar en exteriores.",
          "Es una muy buena opción para repuestos funcionales, soportes y piezas de uso diario.",
        ],
      },
      {
        h2: "ABS: para exigencia térmica",
        p: [
          "Soporta impactos y temperaturas más altas, hasta unos 95 °C. Es el clásico de las piezas técnicas y automotrices.",
          "Es más exigente para imprimir que los anteriores, por eso conviene dejarlo en manos de quien tenga experiencia con el material. Sirve para piezas de auto y moto, carcasas y repuestos cerca de motores.",
        ],
      },
      {
        h2: "TPU: el flexible",
        p: [
          "Es elástico como la goma y muy resistente a la abrasión. Absorbe impactos y vibraciones.",
          "Se usa para juntas, fundas, ruedas, protectores y bujes: todo lo que tiene que doblarse sin romperse.",
        ],
      },
      {
        h2: "Cómo decidir en 30 segundos",
        ul: [
          "¿Es decorativa o un prototipo? PLA.",
          "¿Va a usarse todos los días o a la intemperie? PETG.",
          "¿Va a estar cerca de calor, como un motor? ABS.",
          "¿Tiene que ser flexible o amortiguar golpes? TPU.",
        ],
      },
      {
        h2: "¿No sabés cuál conviene?",
        p: [
          "Contanos para qué es la pieza y dónde va a estar, y te recomendamos el material. Imprimimos en los cuatro.",
        ],
      },
    ],
    servicios: ["imprimir-archivo-stl", "repuestos-3d-autos-de-carrera", "impresion-3d-pacheco"],
  },
  {
    slug: "stl-o-3mf-que-formato-conviene",
    nombre: "STL o 3MF: qué formato conviene",
    title: "Archivo STL o 3MF para imprimir en 3D: diferencias y cuál usar",
    description:
      "Qué diferencia hay entre un archivo STL y uno 3MF para impresión 3D, qué guarda cada uno y cuál conviene mandar para que te impriman la pieza.",
    h1: "Archivo STL o 3MF: cuál conviene para imprimir en 3D",
    lead: "Son los dos formatos más usados para mandar un modelo 3D a imprimir. Acá te contamos en qué se diferencian.",
    fecha: "2026-10-30",
    imagen: {
      src: "/images/gear.jpg",
      alt: "Engranaje impreso en 3D a partir de un archivo del cliente",
    },
    secciones: [
      {
        h2: "STL: el clásico",
        p: [
          "El formato STL guarda solo la forma de la pieza, como una malla de triángulos. No guarda colores, materiales ni unidades de medida. Casi cualquier programa de modelado lo exporta y todos los programas de impresión lo abren.",
          "Por eso es el más usado y el más compatible. Si tenés dudas, STL funciona.",
        ],
      },
      {
        h2: "3MF: el más completo",
        p: [
          "El formato 3MF es más moderno. Además de la forma, puede guardar las unidades, los colores, varios objetos en un solo archivo y, según el programa, algunos ajustes de impresión.",
          "Es útil cuando la pieza tiene varias partes o colores, porque evita errores de escala y de acomodamiento.",
        ],
      },
      {
        h2: "¿Cuál me conviene mandar?",
        ul: [
          "Una pieza simple y de un solo color: STL está perfecto.",
          "Varias piezas juntas, colores o necesitás que las medidas viajen sin errores: 3MF.",
          "Si tenés los dos, mandanos el 3MF y, por las dudas, también el STL.",
        ],
      },
      {
        h2: "Qué pasa si no tengo el archivo",
        p: [
          "Podés bajar un modelo ya hecho de sitios como MakerWorld, Printables o Thingiverse y mandárnoslo. Y si lo que necesitás es una pieza propia, la modelamos nosotros a partir de tu idea, un boceto o la pieza original.",
        ],
      },
      {
        h2: "Cómo mandárnoslo",
        p: [
          "En el formulario de nuestra web podés subir tu archivo STL o 3MF y verlo en 3D antes de enviarlo. Después te cotizamos por WhatsApp.",
        ],
      },
    ],
    servicios: ["imprimir-archivo-stl", "modelado-3d-a-medida", "impresion-3d-pacheco"],
  },
  {
    slug: "como-preparar-un-archivo-para-imprimir-en-3d",
    nombre: "Cómo preparar un archivo para imprimir en 3D",
    title: "Cómo preparar un archivo 3D para imprimir sin errores",
    description:
      "Checklist para que tu modelo 3D se imprima bien: unidades, paredes mínimas, tolerancias, orientación y soportes. Evitá errores antes de mandar tu archivo.",
    h1: "Cómo preparar tu archivo 3D para imprimir sin errores",
    lead: "Un modelo bien preparado se imprime mejor y más rápido. Este es el checklist que usamos antes de imprimir.",
    fecha: "2026-10-30",
    imagen: {
      src: "/images/soporte-aim-solo2.jpg",
      alt: "Soporte impreso en 3D para un display de telemetría, diseñado a medida",
    },
    secciones: [
      {
        h2: "1. Medidas en milímetros",
        p: [
          "La mayoría de los programas de impresión trabajan en milímetros. Revisá que tu pieza tenga el tamaño real que querés: un modelo exportado en otra unidad puede salir mil veces más grande o más chico.",
        ],
      },
      {
        h2: "2. Que el modelo sea sólido y cerrado",
        p: [
          "El modelo tiene que ser una forma cerrada, sin agujeros en la superficie ni caras sueltas. Los programas de modelado suelen tener una función para revisar y reparar la malla.",
        ],
      },
      {
        h2: "3. Paredes con espesor suficiente",
        p: [
          "Las paredes muy finas no se imprimen bien. Como referencia general para impresión FDM, conviene que las paredes tengan al menos un par de milímetros, y más si la pieza va a soportar esfuerzo.",
        ],
      },
      {
        h2: "4. Tolerancias en piezas que encajan",
        p: [
          "Si dos piezas tienen que ensamblar, dejá una pequeña holgura entre ellas. Como referencia, entre 0,2 y 0,4 mm según la pieza. Sin holgura, las partes quedan trabadas.",
        ],
      },
      {
        h2: "5. Pensá cómo se va a apoyar",
        p: [
          "Las impresoras construyen la pieza capa por capa, de abajo hacia arriba. Las partes que quedan en el aire necesitan soportes, que después se retiran. Una buena orientación reduce los soportes y mejora la terminación.",
        ],
      },
      {
        h2: "6. Ante la duda, mandalo igual",
        p: [
          "Si no estás seguro de si tu archivo está bien, mandanoslo y lo revisamos antes de imprimir. Y si no tenés el modelo, también lo hacemos nosotros.",
        ],
      },
    ],
    servicios: ["imprimir-archivo-stl", "modelado-3d-a-medida", "repuestos-3d-autos-de-carrera"],
  },
  {
    slug: "cuanto-cuesta-imprimir-en-3d",
    nombre: "Cuánto cuesta imprimir en 3D",
    title: "¿Cuánto cuesta imprimir una pieza en 3D? De qué depende el precio",
    description:
      "De qué depende el precio de una impresión 3D: material, tamaño, tiempo de máquina, cantidad, terminación y modelado. Cómo conseguir un presupuesto claro.",
    h1: "¿Cuánto cuesta imprimir una pieza en 3D?",
    lead: "No hay un precio fijo: depende de la pieza. Te mostramos qué factores lo definen para que sepas qué esperar.",
    fecha: "2026-10-30",
    imagen: {
      src: "/images/llavero-mc-racing.jpg",
      alt: "Tanda de llaveros personalizados impresos en 3D",
    },
    secciones: [
      {
        h2: "Lo que define el precio",
        ul: [
          "El material: cuánto pesa la pieza y qué filamento usa (PLA, PETG, ABS o TPU).",
          "El tiempo de impresión: las piezas grandes o con mucho detalle ocupan la máquina más horas.",
          "La cantidad: imprimir una tanda suele salir más conveniente por unidad que piezas sueltas.",
          "La terminación: lijado, pintura, acabados especiales como el metalizado.",
          "El modelado: si hay que diseñar la pieza porque no tenés el archivo.",
        ],
      },
      {
        h2: "Por qué no hay una tabla de precios",
        p: [
          "Dos piezas del mismo tamaño pueden costar distinto si una es maciza y la otra hueca, o si una necesita soportes y la otra no. Por eso cotizamos con tu archivo o tu idea a la vista.",
        ],
      },
      {
        h2: "Cómo conseguir un presupuesto rápido",
        ul: [
          "Subí tu archivo STL o 3MF en el formulario de la web, o mandalo por WhatsApp.",
          "Indicá el material que preferís (o pedí asesoramiento) y la cantidad.",
          "Si no tenés el archivo, contanos la idea, las medidas y mandá fotos o la pieza original.",
        ],
      },
      {
        h2: "Cómo bajar el costo sin perder calidad",
        ul: [
          "Elegir PLA o PETG cuando la pieza no exige más.",
          "Evitar paredes innecesariamente gruesas.",
          "Agrupar varias piezas en un mismo pedido.",
        ],
      },
    ],
    servicios: ["impresion-3d-pacheco", "imprimir-archivo-stl", "llaveros-personalizados-3d"],
  },
  {
    slug: "se-rompio-una-pieza-como-copiarla-en-3d",
    nombre: "Se rompió una pieza: cómo copiarla en 3D",
    title: "Se rompió una pieza: cómo replicarla e imprimirla en 3D",
    description:
      "Cómo reemplazar una pieza rota o discontinuada con impresión 3D: qué medir, qué fotos mandar, cómo se modela y qué material elegir.",
    h1: "Se rompió una pieza: cómo replicarla e imprimirla en 3D",
    lead: "Cuando una pieza se rompe o ya no se consigue, se puede modelar de nuevo e imprimir. Así se hace.",
    fecha: "2026-10-30",
    imagen: {
      src: "/images/estuche-aim-solo2.jpg",
      alt: "Estuche modelado a medida e impreso en 3D para un equipo de telemetría",
    },
    secciones: [
      {
        h2: "Qué necesitamos para replicarla",
        ul: [
          "La pieza original, aunque esté rota, o fotos de todos sus lados.",
          "Las medidas importantes: largo, ancho, alto y diámetros de agujeros.",
          "Para qué se usa y dónde va montada: si soporta esfuerzo, calor o humedad.",
        ],
      },
      {
        h2: "Cómo se hace",
        p: [
          "Con las medidas y fotos se modela la pieza en 3D y después se imprime en el material que corresponda. Si hay piezas que encajan con otras, se tienen en cuenta las holguras para que ensamble bien.",
        ],
      },
      {
        h2: "Qué material usar",
        ul: [
          "PETG para repuestos de uso diario y exteriores.",
          "ABS si va cerca de calor, como un motor.",
          "TPU si tiene que ser flexible, como juntas, fundas o protectores.",
        ],
      },
      {
        h2: "Cuándo conviene y cuándo no",
        p: [
          "Es muy útil para piezas plásticas que ya no se consiguen, soportes, carcasas, tapas y accesorios. Para piezas que soportan cargas muy altas o temperaturas extremas conviene consultar antes si el plástico es la mejor opción.",
        ],
      },
      {
        h2: "Pedí tu presupuesto",
        p: [
          "Mandanos fotos y medidas por WhatsApp o desde el formulario de la web, y te contamos si se puede replicar y cómo.",
        ],
      },
    ],
    servicios: ["modelado-3d-a-medida", "repuestos-3d-autos-de-carrera", "impresion-3d-pacheco"],
  },
];

export const getGuia = (slug: string) => GUIAS.find((g) => g.slug === slug);
