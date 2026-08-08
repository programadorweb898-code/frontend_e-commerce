type Language = "es" | "en";

interface ProductLocalizedData {
  title: string;
  description: string;
}

const es: Record<number, ProductLocalizedData> = {
  1: {
    title: "Mochila Fjallraven Foldsack No. 1, para 15 laptops",
    description:
      "Tu mochila perfecta para el uso diario y paseos por el bosque. Guarda tu portátil (hasta 15 pulgadas) en la funda acolchada, tu uso diario.",
  },
  2: {
    title: "Camisetas casuales para hombre, tela premium y ajuste fino",
    description:
      "Estilo de corte fino, manga larga raglán de contraste, tapeta estilo henley de tres botones, telas ligeras y suaves para un uso transpirable y cómodo. Camisetas con costuras sólidas y cuello redondo diseñadas para durar y con un gran ajuste para uso casual y fans del béisbol. El cuello redondo estilo henley incluye tapeta de tres botones.",
  },
  3: {
    title: "Chaqueta de algodón para hombre",
    description:
      "Excelentes chaquetas exteriores para primavera, otoño e invierno, adecuadas para muchas ocasiones como trabajar, hacer senderismo, acampar, escalar, ciclismo, viajar u otras actividades al aire libre. Una excelente elección de regalo para ti o tu familia. Un regalo de corazón para papá, esposo o hijo en Acción de Gracias o Navidad.",
  },
  4: {
    title: "Camisa casual de ajuste fino para hombre",
    description:
      "El color puede diferir ligeramente entre la pantalla y en la práctica. Ten en cuenta que la complexión varía según cada persona, por lo que la información detallada de tallas debe revisarse en la descripción del producto.",
  },
  5: {
    title: "Pulsera de cadena John Hardy Legends Naga con dragón en oro y plata",
    description:
      "De nuestra colección Legends, la Naga fue inspirada en el dragón de agua mítico que protege la perla del océano. Úsala mirando hacia adentro para recibir amor y abundancia, o hacia afuera para protección.",
  },
  6: {
    title: "Micropave petite de oro macizo",
    description:
      "Satisfacción garantizada. Devuelve o cambia cualquier pedido dentro de los 30 días. Diseñado y vendido por Hafeez Center en los Estados Unidos. Garantía de satisfacción: devolución o cambio de cualquier pedido en un plazo de 30 días.",
  },
  7: {
    title: "Princess bañada en oro blanco",
    description:
      "Anillo de compromiso de solitario de diamante creado para ella. Un regalo para consentir tu amor en compromiso, bodas, aniversarios, día de San Valentín...",
  },
  8: {
    title: "Pendientes de acero inoxidable bañados en oro rosa Pierced Owl",
    description:
      "Pendientes de túnel de doble campana bañados en oro rosa. Fabricados en acero inoxidable 316L.",
  },
  9: {
    title: "Disco duro externo portátil WD 2TB Elements - USB 3.0",
    description:
      "Compatibilidad USB 3.0 y USB 2.0. Transferencias de datos rápidas, mejora el rendimiento de la PC y gran capacidad. Compatibilidad: formato NTFS para Windows 10, 8.1 y 7. Puede requerir reformateo para otros sistemas operativos. La compatibilidad puede variar según la configuración del hardware y del sistema.",
  },
  10: {
    title: "SSD interno SanDisk SSD PLUS 1TB - SATA III 6 Gb/s",
    description:
      "Mejora fácil para un arranque, apagado, carga de aplicaciones y respuesta más rápidos (comparado con un disco duro de 5400 RPM SATA 2.5\"; basado en especificaciones publicadas y pruebas de referencia internas con puntuaciones PCMark vantage). Aumenta el rendimiento de escritura por ráfagas, ideal para cargas de trabajo típicas de PC. Velocidades de lectura/escritura de hasta 535MB/s/450MB/s (según pruebas internas; el rendimiento puede variar).",
  },
  11: {
    title: "SSD Silicon Power 256GB 3D NAND A55 con caché SLC SATA III 2.5",
    description:
      "La memoria flash 3D NAND ofrece altas velocidades de transferencia, un arranque más rápido y mejor rendimiento general del sistema. La tecnología de caché SLC avanzada permite mayor rendimiento y mayor vida útil. Diseño delgado de 7mm adecuado para Ultrabooks. Compatible con TRIM, la recolección de basura, RAID y ECC para un rendimiento óptimo y mayor fiabilidad.",
  },
  12: {
    title: "Disco duro externo portátil WD 4TB Gaming compatible con Playstation 4",
    description:
      "Amplía tu experiencia de juego en PS4, juega en cualquier lugar. Configuración rápida y fácil, diseño elegante con gran capacidad y garantía limitada del fabricante de 3 años.",
  },
  13: {
    title: "Monitor Acer SB220Q bi 21.5 pulgadas Full HD (1920x1080) IPS ultra delgado",
    description:
      "Monitor IPS panorámico de 21.5 pulgadas Full HD (1920x1080) con tecnología Radeon FreeSync. Sin compatibilidad con montaje VESA. Frecuencia de actualización: 75Hz usando el puerto HDMI. Diseño sin marco, ultra delgado, tiempo de respuesta de 4ms, panel IPS, relación de aspecto 16:9, 16.7 millones de colores, 250 nits de brillo, inclinación de -5 a 15 grados.",
  },
  14: {
    title: "Monitor curvo de juego Samsung 49 pulgadas CHG90 144Hz QLED (LC49HG90DMNXZA)",
    description:
      "Monitor de juego curvo SUPER ULTRAWIDE de 49 pulgadas 32:9 con dos pantallas de 27 pulgadas una al lado de otra. Tecnología QUANTUM DOT (QLED), soporte HDR y calibración de fábrica para un color y contraste sorprendentemente realistas. Frecuencia de actualización de 144Hz y tiempo de respuesta de 1ms para eliminar el desenfoque de movimiento y reducir la latencia de entrada.",
  },
  15: {
    title: "Chaqueta de esquí 3 en 1 para mujer BIYLACLESEN, abrigos de invierno",
    description:
      "Nota: la chaqueta usa talla estándar de EE.UU. Material 100% poliéster; forro desmontable cálido de vellón. Cuello alto con forro que te mantiene abrigada. Bolsillos de cremallera: 2 bolsillos laterales, 2 en el pecho y 1 oculto. Diseños humanos: capucha y puños ajustables. El diseño desmontable 3 en 1 te permite separar el abrigo y el interior, o usarlos juntos, adaptándose a distintas temporadas y climas.",
  },
  16: {
    title: "Chaqueta motero biker de piel sintética con capucha removible para mujer",
    description:
      "100% poliuretano (exterior) 100% poliéster (forro) 75% poliéster 25% algodón (suéter). Material de cuero sintético para estilo y comodidad. 2 bolsillos frontales, chaqueta de estilo vaquero con capucha. Detalle de botón a la cintura y costuras laterales. SOLO LAVADO A MANO / NO USAR BLANQUEADOR / SECADO COLGADO / NO PLANCHAR.",
  },
  17: {
    title: "Chaqueta de lluvia para mujer, cortavientos con rayas para escalada",
    description:
      "Ligera, perfecta para viaje o uso casual. Manga larga con capucha y cintura ajustable con cordón. Cierre de botones y cremallera, forronada, con 2 bolsillos laterales de buen tamaño, cubre las caderas y tiene una campola generosa pero sin excederse. La capucha de algodón con cordones ajustables le da un estilo real.",
  },
  18: {
    title: "Blusa MBJ Women's Solids mangas cortas cuello real",
    description:
      "95% rayón 5% spandex, fabricado en EE. UU. o importado. No usar lejía. Tela ligera con gran estiramiento para mayor comodidad. Manguetas y cuello acanalados / doble costura en el dobladillo inferior.",
  },
  19: {
    title: "Blusa de manga corta Repela la humedad Opna para mujer",
    description:
      "100% poliéster, lavable a máquina, tejido de interlock de poliéster catónico 100%. Lavado a máquina y presellado para un gran ajuste. Ligera, holgada y muy transpirable con tela de absorción de humedad. Cuello de cremallera en V cómodo con un ajuste más fino que logra una silueta más femenina y un mayor confort.",
  },
  20: {
    title: "Camiseta casual de algodón de manga corta DANVOUY para mujer",
    description:
      "95% algodón, 5% spandex. Características: casual, manga corta, moligón letra, cuello en V, unise formación. Textura suave y con un poco de tiro. Ocasion: casual/oficina/playa/escuela/hogar/calle. Temporada: primavera, verano, otoño, invierno.",
  },
};

export function localizeProduct(
  product: { fakeStoreId?: number; title: string; description: string },
  language: Language
): { title: string; description: string } {
  const entry = es[product.fakeStoreId ?? -1];
  if (language === "es" && entry) {
    return {
      title: entry.title,
      description: entry.description,
    };
  }
  return { title: product.title, description: product.description };
}

const categoryEs: Record<string, string> = {
  "men's clothing": "Ropa de hombre",
  "women's clothing": "Ropa de mujer",
  jewelery: "Joyas",
  jewelry: "Joyas",
  electronics: "Electrónica",
};

export function localizeCategory(category: string, language: Language): string {
  if (language === "es" && categoryEs[category.toLowerCase()]) {
    return categoryEs[category.toLowerCase()];
  }
  return category;
}