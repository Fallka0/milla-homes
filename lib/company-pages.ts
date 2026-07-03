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
  formEyebrow: string;
  formTitle: string;
  formText: string;
  availability: string;
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
  en: { eyebrow: "Let’s talk", title: "A useful property conversation starts with what matters to you.", intro: "Tell us whether you are buying, renting or still comparing areas. A short message is enough to begin.", callTitle: "Call directly", callText: "Best when you want a quick answer about a home, area or viewing.", whatsappTitle: "Write on WhatsApp", whatsappText: "Send your criteria or a listing link and continue the conversation at your pace.", formEyebrow: "Send a message", formTitle: "Put the essentials in writing.", formText: "Share your preferred area, budget, timing and any must-haves. We will reply using the contact details you provide.", availability: "Serving Torrevieja and the surrounding Costa Blanca." },
  es: { eyebrow: "Hablemos", title: "Una conversación útil empieza por lo que de verdad te importa.", intro: "Cuéntanos si quieres comprar, alquilar o aún estás comparando zonas. Basta un mensaje breve para empezar.", callTitle: "Llama directamente", callText: "La mejor opción para una respuesta rápida sobre una vivienda, zona o visita.", whatsappTitle: "Escribe por WhatsApp", whatsappText: "Envía tus criterios o el enlace de una vivienda y sigue la conversación a tu ritmo.", formEyebrow: "Enviar mensaje", formTitle: "Cuéntanos lo esencial por escrito.", formText: "Indica zona, presupuesto, plazos y requisitos importantes. Responderemos a través de los datos que facilites.", availability: "Trabajamos en Torrevieja y la Costa Blanca cercana." },
  de: { eyebrow: "Sprechen wir", title: "Ein gutes Immobiliengespräch beginnt mit dem, was Ihnen wichtig ist.", intro: "Sagen Sie uns, ob Sie kaufen, mieten oder noch Gebiete vergleichen. Eine kurze Nachricht genügt für den Anfang.", callTitle: "Direkt anrufen", callText: "Ideal für eine schnelle Antwort zu einer Immobilie, Lage oder Besichtigung.", whatsappTitle: "Über WhatsApp schreiben", whatsappText: "Senden Sie Ihre Kriterien oder einen Immobilienlink und führen Sie das Gespräch in Ihrem Tempo fort.", formEyebrow: "Nachricht senden", formTitle: "Halten Sie das Wesentliche schriftlich fest.", formText: "Nennen Sie Wunschlage, Budget, Zeitplan und wichtige Kriterien. Wir antworten über die angegebenen Kontaktdaten.", availability: "Für Torrevieja und die umliegende Costa Blanca." },
  ru: { eyebrow: "Давайте поговорим", title: "Полезный разговор о недвижимости начинается с ваших приоритетов.", intro: "Расскажите, хотите ли вы купить, арендовать или пока сравниваете районы. Для начала достаточно короткого сообщения.", callTitle: "Позвонить напрямую", callText: "Удобно, если нужен быстрый ответ об объекте, районе или просмотре.", whatsappTitle: "Написать в WhatsApp", whatsappText: "Отправьте критерии или ссылку на объект и продолжайте общение в своём темпе.", formEyebrow: "Отправить сообщение", formTitle: "Опишите главное письменно.", formText: "Укажите район, бюджет, сроки и важные требования. Мы ответим по оставленным контактным данным.", availability: "Работаем в Торревьехе и на ближайшем побережье Коста-Бланки." },
};
