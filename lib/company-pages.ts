import type { PublicLocale } from "@/lib/public-copy";

type AboutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  storyEyebrow: string;
  storyTitle: string;
  story: string[];
  values: Array<{ title: string; body: string }>;
  areasEyebrow: string;
  areasTitle: string;
  ctaTitle: string;
  ctaText: string;
};

type ContactContent = {
  eyebrow: string;
  title: string;
  intro: string;
  callTitle: string;
  callText: string;
  whatsappTitle: string;
  whatsappText: string;
  visitTitle: string;
  visitText: string;
  formEyebrow: string;
  formTitle: string;
  formText: string;
  availability: string;
};

type OfficeContent = {
  eyebrow: string;
  title: string;
  intro: string;
  galleryEyebrow: string;
  galleryTitle: string;
  galleryAlts: [string, string, string, string, string];
  visitEyebrow: string;
  visitTitle: string;
  visitText: string;
  addressLabel: string;
  mapsCta: string;
  mapLabel: string;
  mapNote: string;
  parkingEyebrow: string;
  parkingTitle: string;
  parkingText: string[];
  ctaTitle: string;
  ctaText: string;
};

export const aboutContent: Record<PublicLocale, AboutContent> = {
  en: {
    eyebrow: "Boutique real estate on the Costa Blanca",
    title: "A more personal way to find your place by the sea.",
    intro: "Milla Homes helps buyers and renters make sense of the Costa Blanca market with carefully presented homes, honest context and conversations that move at a human pace.",
    storyEyebrow: "Our approach", storyTitle: "Fewer distractions. Better decisions.",
    story: ["A property search should feel considered, not crowded. We focus on the homes, areas and practical details that genuinely fit the way you want to live.", "From a first shortlist to a viewing request, our role is to make the next step clearer. Legal and financial advice stays with independent professionals chosen by you."],
    values: [{ title: "Clarity first", body: "Listings and locations are explained plainly, with the details needed to compare confidently." }, { title: "Local perspective", body: "We focus on Torrevieja and the surrounding coast, where each area has a distinct rhythm and property mix." }, { title: "No hard sell", body: "Good decisions need room. We would rather refine the brief than push the wrong viewing." }],
    areasEyebrow: "Our coast", areasTitle: "Six areas, many different ways to live.",
    ctaTitle: "Tell us what home feels like to you.", ctaText: "Share your preferred area, budget and timing. We will help turn a broad search into a useful shortlist.",
  },
  es: {
    eyebrow: "Inmobiliaria boutique en la Costa Blanca", title: "Una forma más personal de encontrar tu lugar junto al mar.", intro: "Milla Homes ayuda a compradores e inquilinos a entender el mercado de la Costa Blanca con viviendas bien presentadas, contexto honesto y conversaciones a un ritmo humano.",
    storyEyebrow: "Nuestro enfoque", storyTitle: "Menos distracciones. Mejores decisiones.", story: ["La búsqueda de vivienda debe sentirse cuidada, no saturada. Nos centramos en las propiedades, zonas y detalles prácticos que encajan de verdad con tu forma de vivir.", "Desde la primera selección hasta una solicitud de visita, buscamos que el siguiente paso sea más claro. El asesoramiento legal y financiero corresponde a profesionales independientes elegidos por ti."],
    values: [{ title: "Claridad ante todo", body: "Explicamos viviendas y zonas de forma directa, con los datos necesarios para comparar con confianza." }, { title: "Perspectiva local", body: "Nos centramos en Torrevieja y su costa cercana, donde cada zona tiene su propio ritmo y tipo de vivienda." }, { title: "Sin presión", body: "Las buenas decisiones necesitan espacio. Preferimos afinar la búsqueda antes que forzar una visita equivocada." }],
    areasEyebrow: "Nuestra costa", areasTitle: "Seis zonas, muchas formas distintas de vivir.", ctaTitle: "Cuéntanos cómo imaginas tu hogar.", ctaText: "Comparte zona, presupuesto y plazos. Te ayudaremos a convertir una búsqueda amplia en una selección útil.",
  },
  de: {
    eyebrow: "Boutique-Immobilienservice an der Costa Blanca", title: "Ein persönlicherer Weg zu Ihrem Zuhause am Meer.", intro: "Milla Homes hilft Käufern und Mietern, den Markt an der Costa Blanca mit sorgfältig präsentierten Immobilien, ehrlichem Kontext und Gesprächen in menschlichem Tempo zu verstehen.",
    storyEyebrow: "Unser Ansatz", storyTitle: "Weniger Ablenkung. Bessere Entscheidungen.", story: ["Eine Immobiliensuche sollte durchdacht wirken, nicht überladen. Wir konzentrieren uns auf Häuser, Orte und praktische Details, die wirklich zu Ihrer Lebensweise passen.", "Von der ersten Auswahl bis zur Besichtigungsanfrage machen wir den nächsten Schritt klarer. Rechtliche und finanzielle Beratung bleibt bei unabhängigen Fachleuten Ihrer Wahl."],
    values: [{ title: "Klarheit zuerst", body: "Immobilien und Lagen werden verständlich erklärt, damit Sie sicher vergleichen können." }, { title: "Lokale Perspektive", body: "Unser Fokus liegt auf Torrevieja und der umliegenden Küste mit ihren unterschiedlichen Wohnlagen." }, { title: "Kein Verkaufsdruck", body: "Gute Entscheidungen brauchen Raum. Wir schärfen lieber das Suchprofil, als eine unpassende Besichtigung zu drängen." }],
    areasEyebrow: "Unsere Küste", areasTitle: "Sechs Gebiete, viele verschiedene Arten zu leben.", ctaTitle: "Erzählen Sie uns, wie sich Zuhause für Sie anfühlt.", ctaText: "Teilen Sie Lage, Budget und Zeitplan. Wir machen aus einer breiten Suche eine hilfreiche Auswahl.",
  },
  ru: {
    eyebrow: "Бутик-недвижимость на Коста-Бланке", title: "Более личный путь к своему месту у моря.", intro: "Milla Homes помогает покупателям и арендаторам ориентироваться на рынке Коста-Бланки благодаря понятной подаче объектов, честному контексту и спокойному общению.",
    storyEyebrow: "Наш подход", storyTitle: "Меньше шума. Более точные решения.", story: ["Поиск недвижимости должен быть продуманным, а не перегруженным. Мы сосредоточены на домах, районах и практических деталях, которые действительно подходят вашему образу жизни.", "От первого списка до запроса на просмотр мы делаем следующий шаг понятнее. Юридические и финансовые консультации остаются за независимыми специалистами, которых выбираете вы."],
    values: [{ title: "Сначала ясность", body: "Мы понятно рассказываем об объектах и районах, чтобы их было легче уверенно сравнивать." }, { title: "Местный взгляд", body: "Мы сосредоточены на Торревьехе и близлежащем побережье, где у каждого района свой ритм и выбор жилья." }, { title: "Без давления", body: "Хорошим решениям нужно пространство. Лучше уточнить запрос, чем навязывать неподходящий просмотр." }],
    areasEyebrow: "Наше побережье", areasTitle: "Шесть районов — множество разных сценариев жизни.", ctaTitle: "Расскажите, каким вы видите свой дом.", ctaText: "Поделитесь желаемым районом, бюджетом и сроками. Мы превратим широкий поиск в полезную подборку.",
  },
};

export const contactContent: Record<PublicLocale, ContactContent> = {
  en: { eyebrow: "Let’s talk", title: "A useful property conversation starts with what matters to you.", intro: "Tell us whether you are buying, renting or still comparing areas. A short message is enough to begin.", callTitle: "Call directly", callText: "Best when you want a quick answer about a home, area or viewing.", whatsappTitle: "Write on WhatsApp", whatsappText: "Send your criteria or a listing link and continue the conversation at your pace.", visitTitle: "Visit the office", visitText: "We are in the centre of Torrevieja, a short walk from the seafront. See photos, the map and parking tips.", formEyebrow: "Send a message", formTitle: "Put the essentials in writing.", formText: "Share your preferred area, budget, timing and any must-haves. We will reply using the contact details you provide.", availability: "Serving Torrevieja and the surrounding Costa Blanca." },
  es: { eyebrow: "Hablemos", title: "Una conversación útil empieza por lo que de verdad te importa.", intro: "Cuéntanos si quieres comprar, alquilar o aún estás comparando zonas. Basta un mensaje breve para empezar.", callTitle: "Llama directamente", callText: "La mejor opción para una respuesta rápida sobre una vivienda, zona o visita.", whatsappTitle: "Escribe por WhatsApp", whatsappText: "Envía tus criterios o el enlace de una vivienda y sigue la conversación a tu ritmo.", visitTitle: "Visita la oficina", visitText: "Estamos en el centro de Torrevieja, a un paseo del mar. Consulta fotos, mapa y consejos de aparcamiento.", formEyebrow: "Enviar mensaje", formTitle: "Cuéntanos lo esencial por escrito.", formText: "Indica zona, presupuesto, plazos y requisitos importantes. Responderemos a través de los datos que facilites.", availability: "Trabajamos en Torrevieja y la Costa Blanca cercana." },
  de: { eyebrow: "Sprechen wir", title: "Ein gutes Immobiliengespräch beginnt mit dem, was Ihnen wichtig ist.", intro: "Sagen Sie uns, ob Sie kaufen, mieten oder noch Gebiete vergleichen. Eine kurze Nachricht genügt für den Anfang.", callTitle: "Direkt anrufen", callText: "Ideal für eine schnelle Antwort zu einer Immobilie, Lage oder Besichtigung.", whatsappTitle: "Über WhatsApp schreiben", whatsappText: "Senden Sie Ihre Kriterien oder einen Immobilienlink und führen Sie das Gespräch in Ihrem Tempo fort.", visitTitle: "Büro besuchen", visitText: "Wir sind im Zentrum von Torrevieja, wenige Gehminuten vom Meer. Fotos, Karte und Parkhinweise finden Sie hier.", formEyebrow: "Nachricht senden", formTitle: "Halten Sie das Wesentliche schriftlich fest.", formText: "Nennen Sie Wunschlage, Budget, Zeitplan und wichtige Kriterien. Wir antworten über die angegebenen Kontaktdaten.", availability: "Für Torrevieja und die umliegende Costa Blanca." },
  ru: { eyebrow: "Давайте поговорим", title: "Полезный разговор о недвижимости начинается с ваших приоритетов.", intro: "Расскажите, хотите ли вы купить, арендовать или пока сравниваете районы. Для начала достаточно короткого сообщения.", callTitle: "Позвонить напрямую", callText: "Удобно, если нужен быстрый ответ об объекте, районе или просмотре.", whatsappTitle: "Написать в WhatsApp", whatsappText: "Отправьте критерии или ссылку на объект и продолжайте общение в своём темпе.", visitTitle: "Приходите в офис", visitText: "Мы в центре Торревьехи, в нескольких минутах от набережной. Здесь фото, карта и советы по парковке.", formEyebrow: "Отправить сообщение", formTitle: "Опишите главное письменно.", formText: "Укажите район, бюджет, сроки и важные требования. Мы ответим по оставленным контактным данным.", availability: "Работаем в Торревьехе и на ближайшем побережье Коста-Бланки." },
};

export const officeContent: Record<PublicLocale, OfficeContent> = {
  en: {
    eyebrow: "Our office",
    title: "Come and see us in the heart of Torrevieja.",
    intro: "The Milla Homes office sits on Calle Canónigo Torres, a calm pedestrian street in the old town just a few minutes' walk from the seafront. Drop by for a coffee and an honest conversation about buying, selling or renting on the Costa Blanca.",
    galleryEyebrow: "Inside and outside",
    galleryTitle: "A calm space for unhurried conversations.",
    galleryAlts: [
      "Milla Homes office interior with a white desk, green velvet chairs and the gold Milla Homes logo on the wall",
      "Front desk of the Milla Homes office with the Milla Homes Real Estate logo",
      "Seating corner of the Milla Homes office with a dark green sofa and yellow cushions",
      "Calle Canónigo Torres, the pedestrian street outside the Milla Homes office",
      "Palm-lined pedestrian square next to the Milla Homes office in central Torrevieja",
    ],
    visitEyebrow: "Where to find us",
    visitTitle: "Right in the pedestrian centre.",
    visitText: "We are on the ground floor, with the office opening directly onto the street. Look for the gold Milla Homes lettering in the window.",
    addressLabel: "Address",
    mapsCta: "Open in Google Maps",
    mapLabel: "Map showing the location of the Milla Homes office in Torrevieja",
    mapNote: "Calle Canónigo Torres is pedestrianised, so plan to arrive on foot for the last stretch.",
    parkingEyebrow: "Parking",
    parkingTitle: "Park at Paseo del Mar and walk over.",
    parkingText: [
      "The easiest option is the Paseo del Mar car park by the waterfront. From there it is a short, pleasant walk through the old town to our door.",
      "Since the streets immediately around the office are pedestrian-only, parking at Paseo del Mar saves you circling the centre looking for a space.",
    ],
    ctaTitle: "Tell us you are coming.",
    ctaText: "A quick call or WhatsApp message is enough — we will make sure someone is ready to receive you.",
  },
  es: {
    eyebrow: "Nuestra oficina",
    title: "Ven a vernos en pleno centro de Torrevieja.",
    intro: "La oficina de Milla Homes está en la calle Canónigo Torres, una tranquila calle peatonal del casco antiguo a pocos minutos a pie del paseo marítimo. Pásate a tomar un café y hablar con calma sobre comprar, vender o alquilar en la Costa Blanca.",
    galleryEyebrow: "Por dentro y por fuera",
    galleryTitle: "Un espacio tranquilo para conversaciones sin prisa.",
    galleryAlts: [
      "Interior de la oficina de Milla Homes con escritorio blanco, sillas de terciopelo verde y el logotipo dorado en la pared",
      "Mostrador principal de la oficina de Milla Homes con el logotipo de Milla Homes Real Estate",
      "Rincón de espera de la oficina de Milla Homes con sofá verde oscuro y cojines amarillos",
      "Calle Canónigo Torres, la calle peatonal donde está la oficina de Milla Homes",
      "Plaza peatonal con palmeras junto a la oficina de Milla Homes en el centro de Torrevieja",
    ],
    visitEyebrow: "Dónde encontrarnos",
    visitTitle: "En pleno centro peatonal.",
    visitText: "Estamos a pie de calle, con la oficina abierta directamente a la vía peatonal. Busca las letras doradas de Milla Homes en el escaparate.",
    addressLabel: "Dirección",
    mapsCta: "Abrir en Google Maps",
    mapLabel: "Mapa con la ubicación de la oficina de Milla Homes en Torrevieja",
    mapNote: "La calle Canónigo Torres es peatonal, así que el último tramo se hace a pie.",
    parkingEyebrow: "Aparcamiento",
    parkingTitle: "Aparca en Paseo del Mar y ven caminando.",
    parkingText: [
      "La opción más cómoda es el aparcamiento de Paseo del Mar, junto al mar. Desde allí hay un paseo corto y agradable por el casco antiguo hasta nuestra puerta.",
      "Como las calles alrededor de la oficina son peatonales, aparcar en Paseo del Mar te evita dar vueltas por el centro buscando sitio.",
    ],
    ctaTitle: "Avísanos de que vienes.",
    ctaText: "Basta una llamada o un WhatsApp: nos aseguraremos de que alguien esté listo para recibirte.",
  },
  de: {
    eyebrow: "Unser Büro",
    title: "Besuchen Sie uns im Herzen von Torrevieja.",
    intro: "Das Büro von Milla Homes liegt in der Calle Canónigo Torres, einer ruhigen Fußgängerstraße der Altstadt, nur wenige Gehminuten von der Strandpromenade entfernt. Kommen Sie auf einen Kaffee vorbei und sprechen Sie in Ruhe über Kauf, Verkauf oder Miete an der Costa Blanca.",
    galleryEyebrow: "Innen und außen",
    galleryTitle: "Ein ruhiger Ort für Gespräche ohne Eile.",
    galleryAlts: [
      "Innenraum des Milla-Homes-Büros mit weißem Schreibtisch, grünen Samtstühlen und goldenem Milla-Homes-Logo an der Wand",
      "Empfangsbereich des Milla-Homes-Büros mit dem Logo von Milla Homes Real Estate",
      "Sitzecke des Milla-Homes-Büros mit dunkelgrünem Sofa und gelben Kissen",
      "Calle Canónigo Torres, die Fußgängerstraße vor dem Milla-Homes-Büro",
      "Von Palmen gesäumter Fußgängerplatz neben dem Milla-Homes-Büro im Zentrum von Torrevieja",
    ],
    visitEyebrow: "So finden Sie uns",
    visitTitle: "Mitten in der Fußgängerzone.",
    visitText: "Wir sind im Erdgeschoss, das Büro öffnet sich direkt zur Straße. Achten Sie auf den goldenen Milla-Homes-Schriftzug im Schaufenster.",
    addressLabel: "Adresse",
    mapsCta: "In Google Maps öffnen",
    mapLabel: "Karte mit dem Standort des Milla-Homes-Büros in Torrevieja",
    mapNote: "Die Calle Canónigo Torres ist Fußgängerzone – das letzte Stück legen Sie zu Fuß zurück.",
    parkingEyebrow: "Parken",
    parkingTitle: "Am Paseo del Mar parken und zu Fuß herüberkommen.",
    parkingText: [
      "Am einfachsten parken Sie im Parkhaus Paseo del Mar an der Uferpromenade. Von dort sind es nur wenige Minuten Spaziergang durch die Altstadt bis zu unserer Tür.",
      "Da die Straßen rund um das Büro Fußgängerzone sind, ersparen Sie sich mit dem Paseo del Mar die Parkplatzsuche im Zentrum.",
    ],
    ctaTitle: "Sagen Sie uns, dass Sie kommen.",
    ctaText: "Ein kurzer Anruf oder eine WhatsApp-Nachricht genügt – wir sorgen dafür, dass jemand für Sie da ist.",
  },
  ru: {
    eyebrow: "Наш офис",
    title: "Приходите к нам в самый центр Торревьехи.",
    intro: "Офис Milla Homes находится на улице Канониго Торрес (C. Canónigo Torres) — тихой пешеходной улице старого города, в нескольких минутах ходьбы от набережной. Заходите на чашку кофе и спокойный разговор о покупке, продаже или аренде на Коста-Бланке.",
    galleryEyebrow: "Внутри и снаружи",
    galleryTitle: "Спокойное место для неспешных разговоров.",
    galleryAlts: [
      "Интерьер офиса Milla Homes: белый стол, зелёные бархатные кресла и золотой логотип Milla Homes на стене",
      "Стойка офиса Milla Homes с логотипом Milla Homes Real Estate",
      "Зона ожидания в офисе Milla Homes с тёмно-зелёным диваном и жёлтыми подушками",
      "Улица Канониго Торрес — пешеходная улица у офиса Milla Homes",
      "Пешеходная площадь с пальмами рядом с офисом Milla Homes в центре Торревьехи",
    ],
    visitEyebrow: "Как нас найти",
    visitTitle: "В самом центре пешеходной зоны.",
    visitText: "Мы на первом этаже, офис выходит прямо на улицу. Ориентир — золотые буквы Milla Homes на витрине.",
    addressLabel: "Адрес",
    mapsCta: "Открыть в Google Maps",
    mapLabel: "Карта с расположением офиса Milla Homes в Торревьехе",
    mapNote: "Улица Канониго Торрес пешеходная, поэтому последний отрезок пути — пешком.",
    parkingEyebrow: "Парковка",
    parkingTitle: "Оставьте машину на парковке Paseo del Mar.",
    parkingText: [
      "Удобнее всего парковка Paseo del Mar у набережной. Оттуда до нашей двери — короткая приятная прогулка через старый город.",
      "Улицы вокруг офиса пешеходные, так что парковка Paseo del Mar избавит вас от кружения по центру в поисках места.",
    ],
    ctaTitle: "Предупредите нас о визите.",
    ctaText: "Достаточно звонка или сообщения в WhatsApp — мы позаботимся, чтобы вас встретили.",
  },
};
