import { type PublicLocale } from "@/lib/public-copy";

type Benefit = {
  title: string;
  body: string;
};

type Step = {
  title: string;
  body: string;
};

export type CollaborateContent = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefits: Benefit[];
  howEyebrow: string;
  howTitle: string;
  steps: Step[];
  closingTitle: string;
  closingBody: string;
};

export const collaborateContent: Record<PublicLocale, CollaborateContent> = {
  en: {
    eyebrow: "Collaborate",
    titleLead: "Grow your business",
    titleAccent: "alongside a local team that knows the Costa Blanca.",
    intro:
      "Milla Homes works with agents, partners and referrers across the Costa Blanca. If you have clients looking to buy, sell or rent — or listings that would suit ours — let's find a way to work together.",
    ctaPrimary: "Start a conversation",
    ctaSecondary: "Talk to our team",
    benefitsEyebrow: "Why collaborate",
    benefitsTitle: "A straightforward, human way to partner.",
    benefits: [
      {
        title: "Local knowledge",
        body: "We know Torrevieja, Orihuela Costa and the surrounding areas in detail — the streets, the communities and the realistic prices.",
      },
      {
        title: "Shared listings",
        body: "Co-list and cross-refer properties so your clients see more of the right homes, and ours reach more serious buyers.",
      },
      {
        title: "Clear communication",
        body: "One point of contact, honest timelines, and no games — the way we already work with buyers and sellers.",
      },
      {
        title: "Aligned interests",
        body: "We agree the terms of each collaboration up front so everyone knows where they stand before we begin.",
      },
    ],
    howEyebrow: "How it works",
    howTitle: "Three simple steps.",
    steps: [
      {
        title: "Get in touch",
        body: "Tell us who you work with and what you're looking for. A short call or message is enough to start.",
      },
      {
        title: "Agree the basics",
        body: "We set out how we'll collaborate — referrals, co-listing or something in between — and the terms for each side.",
      },
      {
        title: "Work the deals",
        body: "We stay close on every shared client and keep each other updated until the deal is done.",
      },
    ],
    closingTitle: "Interested in working together?",
    closingBody: "Send a message or give us a call. We'll get back to you quickly and keep it practical.",
  },
  es: {
    eyebrow: "Colabora",
    titleLead: "Haz crecer tu negocio",
    titleAccent: "junto a un equipo local que conoce la Costa Blanca.",
    intro:
      "Milla Homes colabora con agentes, socios y prescriptores por toda la Costa Blanca. Si tienes clientes que quieren comprar, vender o alquilar —o propiedades que encajen con las nuestras— busquemos la manera de trabajar juntos.",
    ctaPrimary: "Empieza la conversación",
    ctaSecondary: "Habla con nuestro equipo",
    benefitsEyebrow: "Por qué colaborar",
    benefitsTitle: "Una forma clara y cercana de asociarse.",
    benefits: [
      {
        title: "Conocimiento local",
        body: "Conocemos al detalle Torrevieja, Orihuela Costa y las zonas cercanas: las calles, las urbanizaciones y los precios reales.",
      },
      {
        title: "Propiedades compartidas",
        body: "Comparte y refiere propiedades para que tus clientes vean más viviendas adecuadas y las nuestras lleguen a más compradores serios.",
      },
      {
        title: "Comunicación clara",
        body: "Un único punto de contacto, plazos honestos y sin rodeos, como ya trabajamos con compradores y vendedores.",
      },
      {
        title: "Intereses alineados",
        body: "Acordamos las condiciones de cada colaboración de antemano para que todos sepan a qué atenerse antes de empezar.",
      },
    ],
    howEyebrow: "Cómo funciona",
    howTitle: "Tres pasos sencillos.",
    steps: [
      {
        title: "Ponte en contacto",
        body: "Cuéntanos con quién trabajas y qué buscas. Una llamada o un mensaje breve bastan para empezar.",
      },
      {
        title: "Acordamos lo básico",
        body: "Definimos cómo colaboraremos —referencias, propiedad compartida o algo intermedio— y las condiciones de cada parte.",
      },
      {
        title: "Cerramos operaciones",
        body: "Seguimos de cerca cada cliente compartido y nos mantenemos informados hasta cerrar la operación.",
      },
    ],
    closingTitle: "¿Te interesa trabajar juntos?",
    closingBody: "Envíanos un mensaje o llámanos. Te responderemos rápido y de forma práctica.",
  },
  de: {
    eyebrow: "Zusammenarbeit",
    titleLead: "Wachsen Sie gemeinsam",
    titleAccent: "mit einem lokalen Team, das die Costa Blanca kennt.",
    intro:
      "Milla Homes arbeitet mit Maklern, Partnern und Empfehlungsgebern an der gesamten Costa Blanca zusammen. Wenn Sie Kunden haben, die kaufen, verkaufen oder mieten möchten – oder Angebote, die zu unseren passen – finden wir einen Weg der Zusammenarbeit.",
    ctaPrimary: "Gespräch beginnen",
    ctaSecondary: "Mit unserem Team sprechen",
    benefitsEyebrow: "Warum zusammenarbeiten",
    benefitsTitle: "Eine klare, persönliche Art der Partnerschaft.",
    benefits: [
      {
        title: "Lokale Kenntnis",
        body: "Wir kennen Torrevieja, Orihuela Costa und die Umgebung im Detail – die Straßen, die Wohnanlagen und die realistischen Preise.",
      },
      {
        title: "Gemeinsame Angebote",
        body: "Teilen und vermitteln Sie Objekte, damit Ihre Kunden mehr passende Immobilien sehen und unsere mehr ernsthafte Käufer erreichen.",
      },
      {
        title: "Klare Kommunikation",
        body: "Ein Ansprechpartner, ehrliche Zeitpläne und keine Spielchen – so, wie wir bereits mit Käufern und Verkäufern arbeiten.",
      },
      {
        title: "Gemeinsame Interessen",
        body: "Wir legen die Bedingungen jeder Zusammenarbeit vorab fest, damit alle wissen, woran sie sind, bevor wir beginnen.",
      },
    ],
    howEyebrow: "So funktioniert es",
    howTitle: "Drei einfache Schritte.",
    steps: [
      {
        title: "Kontakt aufnehmen",
        body: "Sagen Sie uns, mit wem Sie arbeiten und was Sie suchen. Ein kurzer Anruf oder eine Nachricht genügt für den Anfang.",
      },
      {
        title: "Das Wesentliche klären",
        body: "Wir legen fest, wie wir zusammenarbeiten – Empfehlungen, gemeinsame Angebote oder etwas dazwischen – und die Bedingungen für jede Seite.",
      },
      {
        title: "Abschlüsse begleiten",
        body: "Wir bleiben bei jedem gemeinsamen Kunden nah dran und halten uns gegenseitig auf dem Laufenden, bis der Abschluss steht.",
      },
    ],
    closingTitle: "Interesse an einer Zusammenarbeit?",
    closingBody: "Schreiben Sie uns oder rufen Sie an. Wir melden uns schnell und bleiben praktisch.",
  },
  uk: {
    eyebrow: "Співпраця",
    titleLead: "Розвивайте свій бізнес",
    titleAccent: "разом із місцевою командою, що знає Коста-Бланку.",
    intro:
      "Milla Homes співпрацює з агентами, партнерами та рекомендувачами по всій Коста-Бланці. Якщо у вас є клієнти, які хочуть купити, продати чи орендувати — або об'єкти, що підійдуть нашим, — знайдімо спосіб працювати разом.",
    ctaPrimary: "Почати розмову",
    ctaSecondary: "Поговорити з командою",
    benefitsEyebrow: "Чому варто співпрацювати",
    benefitsTitle: "Зрозумілий і людяний спосіб партнерства.",
    benefits: [
      {
        title: "Знання регіону",
        body: "Ми детально знаємо Торрев'єху, Оріуела-Косту та сусідні райони — вулиці, комплекси та реальні ціни.",
      },
      {
        title: "Спільні об'єкти",
        body: "Діліться об'єктами й рекомендуйте їх, щоб ваші клієнти бачили більше потрібного житла, а наші — більше серйозних покупців.",
      },
      {
        title: "Чітка комунікація",
        body: "Одна контактна особа, чесні строки й без ігор — так само, як ми вже працюємо з покупцями та продавцями.",
      },
      {
        title: "Спільні інтереси",
        body: "Ми узгоджуємо умови кожної співпраці заздалегідь, щоб усі знали свою позицію ще до початку.",
      },
    ],
    howEyebrow: "Як це працює",
    howTitle: "Три прості кроки.",
    steps: [
      {
        title: "Зв'яжіться з нами",
        body: "Розкажіть, з ким ви працюєте і що шукаєте. Короткого дзвінка або повідомлення достатньо для початку.",
      },
      {
        title: "Узгодимо основне",
        body: "Визначимо, як співпрацюватимемо — рекомендації, спільні об'єкти чи щось проміжне — та умови для кожної сторони.",
      },
      {
        title: "Ведемо угоди",
        body: "Ми уважно ведемо кожного спільного клієнта й тримаємо одне одного в курсі до завершення угоди.",
      },
    ],
    closingTitle: "Хочете працювати разом?",
    closingBody: "Напишіть або зателефонуйте. Ми швидко відповімо й залишимося по суті.",
  },
  ru: {
    eyebrow: "Сотрудничество",
    titleLead: "Развивайте свой бизнес",
    titleAccent: "вместе с местной командой, знающей Коста-Бланку.",
    intro:
      "Milla Homes сотрудничает с агентами, партнёрами и теми, кто рекомендует нас, по всей Коста-Бланке. Если у вас есть клиенты, желающие купить, продать или арендовать — или объекты, подходящие нашим, — давайте найдём способ работать вместе.",
    ctaPrimary: "Начать разговор",
    ctaSecondary: "Поговорить с командой",
    benefitsEyebrow: "Почему стоит сотрудничать",
    benefitsTitle: "Понятный и человечный подход к партнёрству.",
    benefits: [
      {
        title: "Знание региона",
        body: "Мы детально знаем Торревьеху, Ориуэла-Косту и соседние районы — улицы, комплексы и реальные цены.",
      },
      {
        title: "Общие объекты",
        body: "Делитесь объектами и рекомендуйте их, чтобы ваши клиенты видели больше подходящего жилья, а наши — больше серьёзных покупателей.",
      },
      {
        title: "Чёткое общение",
        body: "Один контакт, честные сроки и без игр — так же, как мы уже работаем с покупателями и продавцами.",
      },
      {
        title: "Общие интересы",
        body: "Мы заранее согласуем условия каждого сотрудничества, чтобы все понимали свою позицию до начала работы.",
      },
    ],
    howEyebrow: "Как это работает",
    howTitle: "Три простых шага.",
    steps: [
      {
        title: "Свяжитесь с нами",
        body: "Расскажите, с кем вы работаете и что ищете. Короткого звонка или сообщения достаточно для начала.",
      },
      {
        title: "Согласуем основное",
        body: "Определим, как будем сотрудничать — рекомендации, общие объекты или что-то среднее — и условия для каждой стороны.",
      },
      {
        title: "Ведём сделки",
        body: "Мы внимательно ведём каждого общего клиента и держим друг друга в курсе до закрытия сделки.",
      },
    ],
    closingTitle: "Хотите работать вместе?",
    closingBody: "Напишите или позвоните. Мы ответим быстро и по делу.",
  },
};
