// Páginas de servicio para Google: una por cada cosa que la gente busca.
// Regla: SOLO hechos ya publicados en la web (trabajos reales, materiales, formatos, zona).
// Nada de precios, plazos genéricos ni promesas que no estén respaldadas.

export const SITE = "https://www.snjsoluciones.com.ar";

export interface ServicioPage {
  slug: string;
  /** Texto corto para el link del pie de página. */
  nombre: string;
  /** <title> (≈60 caracteres). */
  title: string;
  /** meta description (≈155 caracteres). */
  description: string;
  h1: string;
  lead: string;
  imagen: { src: string; alt: string };
  secciones: { h2: string; parrafos: string[] }[];
  faq: { q: string; a: string }[];
  /** Otras páginas relacionadas (slugs), para enlazar entre sí. */
  relacionadas: string[];
}

export const SERVICIOS: ServicioPage[] = [
  {
    slug: "impresion-3d-pacheco",
    nombre: "Impresión 3D en Pacheco",
    title: "Impresión 3D en Pacheco, Tigre y Zona Norte | SNJ Soluciones",
    description:
      "Impresión 3D en General Pacheco para Tigre, Zona Norte, CABA y todo el país. Subí tu archivo STL o 3MF y lo imprimimos en PLA, PETG, ABS o TPU.",
    h1: "Impresión 3D en General Pacheco",
    lead: "Taller de impresión 3D en Pacheco, con atención a Tigre, Zona Norte GBA y CABA, y envíos a todo el país.",
    imagen: {
      src: "/images/trofeo-nankang.jpeg",
      alt: "Serie de trofeos impresos en 3D en nuestro taller de General Pacheco",
    },
    secciones: [
      {
        h2: "Qué imprimimos",
        parrafos: [
          "Imprimimos piezas a pedido: repuestos, soportes, estuches a medida, trofeos, llaveros y series cortas. Trabajamos con tu archivo 3D en formato STL o 3MF, o lo modelamos nosotros si todavía no lo tenés.",
          "Ya hicimos desde una serie de dieciocho trofeos para un campeonato hasta una tanda de 500 llaveros con el logo de un cliente.",
        ],
      },
      {
        h2: "Materiales",
        parrafos: [
          "Imprimimos en PLA, PETG, ABS y TPU. PLA para prototipos y piezas decorativas, PETG para repuestos y piezas de uso diario, ABS para piezas que soportan más temperatura y TPU para piezas flexibles como juntas y protectores.",
        ],
      },
      {
        h2: "Cómo pedirlo",
        parrafos: [
          "Completá el formulario de la web o escribinos por WhatsApp. Con tu archivo o tu idea te pasamos el precio. Hacemos envíos a todo el país.",
        ],
      },
    ],
    faq: [
      {
        q: "¿A qué zonas atienden?",
        a: "Estamos en General Pacheco y atendemos Tigre, Zona Norte GBA y CABA. Además enviamos a todo el país.",
      },
      {
        q: "¿Qué formatos de archivo aceptan?",
        a: "STL y 3MF. Si no tenés el archivo, podemos modelar la pieza a partir de tu idea, un boceto o la pieza original.",
      },
    ],
    relacionadas: ["imprimir-archivo-stl", "modelado-3d-a-medida", "repuestos-3d-autos-de-carrera"],
  },
  {
    slug: "impresion-3d-zona-norte",
    nombre: "Impresión 3D en Zona Norte",
    title: "Impresión 3D en Zona Norte: Tigre, San Isidro, Pilar, Escobar y CABA",
    description:
      "Impresión y modelado 3D para Zona Norte del Gran Buenos Aires: Tigre, San Fernando, San Isidro, Vicente López, Escobar, Pilar y CABA. Taller en General Pacheco.",
    h1: "Impresión 3D en Zona Norte del Gran Buenos Aires",
    lead: "Desde nuestro taller en General Pacheco atendemos Tigre, San Fernando, San Isidro, Vicente López, Escobar, Pilar y CABA.",
    imagen: {
      src: "/images/float-estuche-valen.jpg",
      alt: "Estuche a medida impreso en 3D, hecho en nuestro taller de General Pacheco",
    },
    secciones: [
      {
        h2: "Zonas que atendemos",
        parrafos: [
          "Estamos en General Pacheco y trabajamos con clientes de Tigre, San Fernando, San Isidro, Vicente López, Escobar, Pilar y la Ciudad de Buenos Aires. Además hacemos envíos a todo el país.",
        ],
      },
      {
        h2: "Qué hacemos",
        parrafos: [
          "Imprimimos tu archivo STL o 3MF en PLA, PETG, ABS o TPU, y si todavía no tenés el modelo, lo modelamos a medida. Hicimos trofeos para campeonatos, soportes y estuches para automovilismo, llaveros con logo y repuestos.",
        ],
      },
      {
        h2: "Cómo pedirlo",
        parrafos: [
          "Subí tu archivo en el formulario de la web o escribinos por WhatsApp contando qué necesitás y en qué localidad estás. Te pasamos el presupuesto y coordinamos la entrega.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Atienden en Pilar, Escobar o San Isidro?",
        a: "Sí. Atendemos Tigre, San Fernando, San Isidro, Vicente López, Escobar, Pilar y CABA, y enviamos a todo el país.",
      },
      {
        q: "¿Cómo coordino la entrega?",
        a: "Escribinos por WhatsApp con tu localidad y lo coordinamos junto con el presupuesto.",
      },
    ],
    relacionadas: ["impresion-3d-pacheco", "imprimir-archivo-stl", "modelado-3d-a-medida"],
  },
  {
    slug: "imprimir-archivo-stl",
    nombre: "Imprimir tu archivo STL o 3MF",
    title: "Imprimir un archivo STL o 3MF en Argentina | SNJ Soluciones",
    description:
      "Subí tu archivo STL o 3MF y lo imprimimos en 3D en PLA, PETG, ABS o TPU. Servicio de impresión bajo demanda desde General Pacheco, con envíos a todo el país.",
    h1: "Imprimí tu archivo STL o 3MF",
    lead: "Ya tenés el modelo 3D: nosotros lo imprimimos. Subís el archivo, lo ves en 3D en la web y te pasamos el precio.",
    imagen: {
      src: "/images/gear.jpg",
      alt: "Engranaje impreso en 3D a partir de un archivo del cliente",
    },
    secciones: [
      {
        h2: "Cómo funciona",
        parrafos: [
          "En el formulario de la web podés subir tu archivo STL o 3MF y verlo en 3D antes de enviarlo. Elegís material y cantidad, y el pedido sale por WhatsApp para que te cotizemos.",
          "El archivo se abre en tu navegador solo para mostrarte la pieza. Después nos lo mandás por WhatsApp junto con el pedido para que lo revisemos.",
        ],
      },
      {
        h2: "Si no tenés el archivo",
        parrafos: [
          "Podés bajar modelos gratis de sitios como MakerWorld, Printables o Thingiverse y mandárnoslos. Y si lo que necesitás es una pieza propia, la modelamos nosotros y después la imprimimos.",
        ],
      },
      {
        h2: "Materiales disponibles",
        parrafos: ["PLA, PETG, ABS y TPU. Si no sabés cuál conviene para tu pieza, te asesoramos."],
      },
    ],
    faq: [
      {
        q: "¿Puedo subir un archivo STEP?",
        a: "Por ahora la web abre y recibe STL y 3MF. Si tenés otro formato, escribinos por WhatsApp y vemos cómo resolverlo.",
      },
      {
        q: "¿Mi archivo queda público?",
        a: "No. La vista 3D de la web funciona en tu navegador y no sube el archivo a ningún lado. Solo lo ve el equipo de SNJ Soluciones cuando nos lo mandás para cotizar.",
      },
    ],
    relacionadas: ["impresion-3d-pacheco", "modelado-3d-a-medida", "llaveros-personalizados-3d"],
  },
  {
    slug: "modelado-3d-a-medida",
    nombre: "Modelado 3D a medida",
    title: "Modelado 3D a medida y bajo demanda | SNJ Soluciones",
    description:
      "Modelado 3D a medida: de tu idea, boceto o pieza rota al archivo listo para imprimir. Después la imprimimos en PLA, PETG, ABS o TPU desde General Pacheco.",
    h1: "Modelado 3D a medida",
    lead: "¿Tenés una idea, un boceto o una pieza rota? La modelamos en 3D y después la imprimimos.",
    imagen: {
      src: "/images/estuche-aim-solo2.jpg",
      alt: "Estuche a medida modelado e impreso en 3D para un AiM Solo 2 y una cámara de acción",
    },
    secciones: [
      {
        h2: "Qué podemos modelar",
        parrafos: [
          "Soportes, estuches con espuma recortada a medida, trofeos, llaveros con tu logo, repuestos y piezas técnicas. Si nos mandás medidas, fotos o la pieza original, la diseñamos para que encaje.",
          "Un ejemplo real: soportes para el display AiM Solo 2 diseñados a medida para autos de competición, impresos en PETG por su resistencia.",
        ],
      },
      {
        h2: "Del modelo a la pieza",
        parrafos: [
          "Modelamos la pieza y la imprimimos en el material que mejor corresponda: PLA, PETG, ABS o TPU.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Qué necesito para pedir un modelado?",
        a: "Una descripción de la pieza, las medidas aproximadas y, si tenés, fotos de referencia o la pieza original.",
      },
      {
        q: "¿Después me entregan el archivo o solo la pieza?",
        a: "Lo conversamos en la cotización. Escribinos por WhatsApp contando qué necesitás.",
      },
    ],
    relacionadas: ["repuestos-3d-autos-de-carrera", "imprimir-archivo-stl", "trofeos-personalizados-3d"],
  },
  {
    slug: "repuestos-3d-autos-de-carrera",
    nombre: "Soportes y estuches para autos de carrera",
    title: "Soportes, estuches y repuestos 3D para autos de carrera",
    description:
      "Soportes de telemetría AiM Solo 2, estuches a medida y piezas para autos de competición, impresos en 3D en PETG. Trabajamos con pilotos y equipos de automovilismo.",
    h1: "Soportes, estuches y piezas 3D para automovilismo",
    lead: "Hacemos piezas a medida para autos de competición: soportes de telemetría, estuches y repuestos.",
    imagen: {
      src: "/images/soporte-aim-solo2.jpg",
      alt: "Soporte impreso en PETG para el display AiM Solo 2 montado en un auto de competición",
    },
    secciones: [
      {
        h2: "Soportes de telemetría",
        parrafos: [
          "Hicimos un soporte para el display AiM Solo 2 y otro para mejorar el ángulo de visión del Lisso, impresos en PETG por su resistencia y diseñados a medida para autos de competición.",
        ],
      },
      {
        h2: "Estuches a medida",
        parrafos: [
          "Estuche rígido con espuma recortada a medida para guardar el AiM Solo 2 junto con una cámara de acción, con el nombre del piloto grabado en la tapa. Ya lo hicimos para varios pilotos.",
        ],
      },
      {
        h2: "Piezas funcionales",
        parrafos: [
          "Para piezas que trabajan cerca del motor o con mucha exigencia térmica usamos ABS; para piezas de uso diario y repuestos, PETG. Contanos para qué es la pieza y te recomendamos el material.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Qué material conviene para un auto de carrera?",
        a: "PETG para soportes y piezas de uso diario por su resistencia, y ABS para piezas que soportan más temperatura. Te asesoramos según la pieza.",
      },
    ],
    relacionadas: ["modelado-3d-a-medida", "trofeos-personalizados-3d", "impresion-3d-pacheco"],
  },
  {
    slug: "trofeos-personalizados-3d",
    nombre: "Trofeos personalizados",
    title: "Trofeos personalizados impresos en 3D | SNJ Soluciones",
    description:
      "Trofeos personalizados impresos en 3D para campeonatos y eventos: series con placa por categoría, logo del sponsor en relieve y acabados como el dorado metalizado.",
    h1: "Trofeos personalizados impresos en 3D",
    lead: "Trofeos a medida para campeonatos, clubes y eventos, con el diseño y el acabado que necesites.",
    imagen: {
      src: "/images/trofeo-piloto-dorado.jpg",
      alt: "Trofeo de un piloto con las manos en alto, en acabado metalizado dorado sobre base negra",
    },
    secciones: [
      {
        h2: "Series para campeonatos",
        parrafos: [
          "Hicimos una serie de dieciocho trofeos para un campeonato, con base texturada, el logo del sponsor grabado en relieve y una placa distinta por categoría.",
        ],
      },
      {
        h2: "Acabados",
        parrafos: [
          "También hicimos un trofeo de piloto de pie con las manos en alto, en acabado metalizado dorado sobre base circular negra. Cada trofeo se diseña a medida del cliente.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Pueden hacer una serie con un diseño distinto por categoría?",
        a: "Sí. En la serie para un campeonato cada trofeo llevaba una placa distinta por categoría.",
      },
    ],
    relacionadas: ["modelado-3d-a-medida", "llaveros-personalizados-3d", "repuestos-3d-autos-de-carrera"],
  },
  {
    slug: "llaveros-personalizados-3d",
    nombre: "Llaveros personalizados con logo",
    title: "Llaveros personalizados con tu logo, impresos en 3D",
    description:
      "Llaveros personalizados con el logo de tu marca o equipo, impresos en 3D por tanda. Ya hicimos 500 llaveros a medida en menos de una semana.",
    h1: "Llaveros personalizados con tu logo",
    lead: "Llaveros impresos en 3D con el diseño de tu marca, equipo o evento, en la cantidad que necesites.",
    imagen: {
      src: "/images/llavero-mc-racing.jpg",
      alt: "Tanda de llaveros personalizados con el logo de MC Racing impresos en 3D",
    },
    secciones: [
      {
        h2: "Hechos para tu marca",
        parrafos: [
          "Hicimos una tanda de 500 llaveros con diseño 100% a medida del logo del cliente, terminados en menos de una semana.",
          "Para el local de ropa NO LO PRESTO. hicimos 100 llaveros bicolor, con la frase y el borde en relieve negro sobre base blanca, con argolla y cadena.",
          "También hicimos un llavero con la forma de un bidón de Castrol.",
        ],
      },
      {
        h2: "Llaveros con chip NFC",
        parrafos: [
          "Podemos meter un chip NFC adentro del llavero. Cuando el cliente lo acerca a su celular, se abre directo lo que elijas: el Instagram del local, el WhatsApp, la web o un catálogo, sin escanear nada.",
          "Es una forma de que tu marca quede a un toque del celular de cada cliente.",
        ],
      },
      {
        h2: "Cómo pedirlo",
        parrafos: [
          "Mandanos tu logo o la idea, la cantidad que necesitás y para cuándo lo querés. Si hace falta, lo modelamos nosotros y te pasamos el precio por WhatsApp.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Desde qué cantidad se pueden pedir?",
        a: "Contanos cuántos necesitás y te cotizamos. Ya hicimos tandas de 100 y de 500.",
      },
      {
        q: "¿Cómo funciona el llavero con NFC?",
        a: "Lleva un chip adentro. Al acercarlo a un celular con NFC activado, se abre el link que elijas, como el Instagram o el WhatsApp del local. No necesita batería ni app.",
      },
    ],
    relacionadas: ["merchandising-empresas-y-locales", "trofeos-personalizados-3d", "modelado-3d-a-medida"],
  },
  {
    slug: "maquetas-de-arquitectura-3d",
    nombre: "Maquetas de arquitectura",
    title: "Impresión 3D de maquetas de arquitectura para facultad | SNJ",
    description:
      "Imprimimos en 3D tu maqueta de arquitectura para entregas de facultad, desde tu archivo de SketchUp, Rhino o Revit. Escala a pedido. General Pacheco, Zona Norte.",
    h1: "Maquetas de arquitectura impresas en 3D",
    lead: "¿Tenés entrega en la facu? Llevamos tu proyecto a una maqueta física, a escala y lista para presentar.",
    imagen: {
      src: "/images/maqueta-arquitectura.jpg",
      alt: "Maqueta de arquitectura blanca impresa en 3D con tres edificios sobre bases planas",
    },
    secciones: [
      {
        h2: "Para estudiantes de Arquitectura",
        parrafos: [
          "Imprimimos maquetas para entregas de taller, finales y portfolio. Un ejemplo real: tres edificios a escala 1:500, con losas, divisiones de fachada y patios en los techos, en plástico blanco mate.",
        ],
      },
      {
        h2: "Qué archivo necesitamos",
        parrafos: [
          "Mandanos el modelo exportado en STL o 3MF desde SketchUp, Rhino, Revit u otro programa. Si el archivo viene con errores, que es muy común al exportar, lo revisamos y lo preparamos para que se pueda imprimir.",
        ],
      },
      {
        h2: "Escala y terminación",
        parrafos: [
          "Trabajamos en la escala que pida tu cátedra. La maqueta sale en blanco mate, como se presentan en la facultad, y se puede dividir en piezas si es grande.",
        ],
      },
      {
        h2: "Cómo pedirla",
        parrafos: [
          "Escribinos por WhatsApp con tu archivo, la escala y la fecha de entrega. Te pasamos el precio y coordinamos la entrega.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Qué programas sirven?",
        a: "Cualquiera que exporte STL o 3MF: SketchUp, Rhino, Revit, Blender, entre otros.",
      },
      {
        q: "Mi archivo de SketchUp tiene errores, ¿lo pueden imprimir igual?",
        a: "Casi siempre sí. Lo revisamos, corregimos lo necesario y te avisamos si hay algo para cambiar.",
      },
      {
        q: "¿Dónde la entregan?",
        a: "Estamos en General Pacheco y coordinamos la entrega en Zona Norte. Escribinos con tu zona y lo vemos.",
      },
    ],
    relacionadas: ["imprimir-archivo-stl", "modelado-3d-a-medida", "impresion-3d-zona-norte"],
  },
  {
    slug: "merchandising-empresas-y-locales",
    nombre: "Para empresas y locales",
    title: "Merchandising impreso en 3D para empresas y locales | SNJ",
    description:
      "Llaveros con logo, llaveros con chip NFC, trofeos para eventos y piezas con tu marca, impresos en 3D por cantidad para empresas, locales y clubes.",
    h1: "Impresión 3D para empresas y locales",
    lead: "Piezas con tu marca para regalar, vender o premiar: llaveros, llaveros con NFC, trofeos y más, por cantidad.",
    imagen: {
      src: "/images/llavero-no-lo-presto.jpg",
      alt: "Llavero NO LO PRESTO. impreso en 3D para un local de ropa, con su argolla y cadena",
    },
    secciones: [
      {
        h2: "Llaveros con tu marca",
        parrafos: [
          "Hicimos 100 llaveros para el local de ropa NO LO PRESTO. y 500 llaveros con el logo de MC Racing. Diseñamos a partir de tu logo o tu frase.",
        ],
      },
      {
        h2: "Llaveros con chip NFC",
        parrafos: [
          "Con un chip NFC adentro, el llavero abre el Instagram, el WhatsApp o la web de tu negocio con solo acercarlo al celular.",
        ],
      },
      {
        h2: "Trofeos y premios",
        parrafos: [
          "Para clubes, campeonatos y eventos: hicimos una serie de dieciocho trofeos con el logo del sponsor en relieve y una placa por categoría.",
        ],
      },
      {
        h2: "Cómo pedirlo",
        parrafos: [
          "Mandanos tu logo o la idea y la cantidad. Te armamos un primer modelo y te pasamos el precio por WhatsApp.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Hacen pedidos por cantidad?",
        a: "Sí, ese es nuestro fuerte. Ya hicimos tandas de 100 y de 500 llaveros.",
      },
      {
        q: "¿Puedo ver una muestra antes?",
        a: "Sí. Te pasamos un primer modelo según lo que quieras antes de producir la tanda completa.",
      },
    ],
    relacionadas: ["llaveros-personalizados-3d", "trofeos-personalizados-3d", "modelado-3d-a-medida"],
  },
  {
    slug: "regalos-empresariales-fin-de-anio",
    nombre: "Regalos de fin de año para empresas",
    title: "Regalos empresariales de fin de año impresos en 3D | SNJ",
    description:
      "Regalos de fin de año para clientes y empleados: llaveros con tu logo, llaveros con chip NFC y piezas con tu marca, impresos en 3D por cantidad en General Pacheco.",
    h1: "Regalos de fin de año con tu marca",
    lead: "Un regalo para clientes y equipo que se usa todos los días y lleva tu marca: llaveros con logo, con chip NFC y piezas a medida.",
    imagen: {
      src: "/images/llavero-no-lo-presto-detalle.jpg",
      alt: "Llavero bicolor impreso en 3D con letras en relieve, ejemplo de regalo empresarial con marca",
    },
    secciones: [
      {
        h2: "Para clientes y empleados",
        parrafos: [
          "Un llavero con el logo de tu empresa o local es un regalo útil que se lleva todos los días, y hace que tu marca quede presente todo el año.",
        ],
      },
      {
        h2: "Llaveros con chip NFC",
        parrafos: [
          "Podemos sumar un chip NFC adentro: al acercarlo al celular abre tu Instagram, tu WhatsApp o tu web. Un regalo que además sirve para que te vuelvan a contactar.",
        ],
      },
      {
        h2: "Por cantidad",
        parrafos: [
          "Ya hicimos tandas de 100 llaveros para un local de ropa y de 500 llaveros con el logo de MC Racing. Diseñamos a partir de tu logo o tu frase y te mostramos un primer modelo antes de producir.",
        ],
      },
      {
        h2: "Pedilo con tiempo",
        parrafos: [
          "Las fiestas se vienen encima: escribinos con la cantidad y la fecha en que los necesitás, y te pasamos el precio y los tiempos por WhatsApp.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Se pueden hacer con el logo de mi empresa?",
        a: "Sí. Mandanos el logo o la frase y lo diseñamos nosotros. Antes de producir la tanda te mostramos un primer modelo.",
      },
      {
        q: "¿Hacen envíos?",
        a: "Estamos en General Pacheco, coordinamos entregas en Zona Norte y enviamos a todo el país.",
      },
    ],
    relacionadas: ["merchandising-empresas-y-locales", "llaveros-personalizados-3d", "trofeos-personalizados-3d"],
  },
];

export const getServicio = (slug: string) => SERVICIOS.find((s) => s.slug === slug);
