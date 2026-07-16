import type { PublicLocale } from "@/lib/public-copy";

export type OwnerPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sell: string;
  longRent: string;
  holidayRent: string;
  choicesTitle: string;
  choices: Array<{ title: string; body: string }>;
  processEyebrow: string;
  processTitle: string;
  steps: Array<{ title: string; body: string }>;
  formEyebrow: string;
  formTitle: string;
  formIntro: string;
  form: {
    intent: string;
    location: string;
    locationPlaceholder: string;
    propertyType: string;
    propertyTypePlaceholder: string;
    bedrooms: string;
    targetPrice: string;
    targetPricePlaceholder: string;
    timing: string;
    timingPlaceholder: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
  };
  reassurance: string;
};

export const ownerPageContent: Record<PublicLocale, OwnerPageContent> = {
  en: {
    eyebrow: "For property owners", title: "Thinking of selling or renting your property?", intro: "Tell us the essentials. We will start with a practical conversation about the property, your timing and the kind of outcome you are looking for—without an inflated promise or a hard sell.",
    sell: "Sell", longRent: "Long-term rent", holidayRent: "Holiday rent", choicesTitle: "Choose the route that fits your plans.",
    choices: [{ title: "Sell your property", body: "Start with the property, location, condition and timing so the next conversation is grounded in the real brief." }, { title: "Find a long-term tenant", body: "Share the expected availability and the kind of tenancy you are considering." }, { title: "Explore holiday rentals", body: "Ask about seasonal positioning and next steps. Licensing and management requirements must be assessed separately." }],
    processEyebrow: "A clear first step", processTitle: "What happens after you enquire", steps: [{ title: "Share the basics", body: "Send the property details you already know. Perfect measurements and polished photos are not required for the first conversation." }, { title: "Talk through the brief", body: "We clarify the property, timing and your priorities, and identify any information still needed." }, { title: "Review the right route", body: "The next steps depend on whether you intend to sell, rent long term or explore holiday letting." }, { title: "Decide without pressure", body: "You choose whether and how to continue. Independent legal, tax and licensing advice may be needed." }],
    formEyebrow: "Property enquiry", formTitle: "Start with a few useful details.", formIntro: "This is an initial enquiry, not an instruction to market the property or a formal valuation.",
    form: { intent: "I am considering", location: "Property location", locationPlaceholder: "Area, street or urbanisation", propertyType: "Property type", propertyTypePlaceholder: "Apartment, villa, townhouse…", bedrooms: "Bedrooms", targetPrice: "Approximate target price or rent", targetPricePlaceholder: "Optional", timing: "Preferred timing", timingPlaceholder: "Now, within 3 months, later this year…", name: "Your name", email: "Email", phone: "Phone", notes: "Anything else we should know?", notesPlaceholder: "Condition, occupancy, availability, questions or useful context", submit: "Request a property conversation" },
    reassurance: "Prefer to start informally? Send the property location and a short note by WhatsApp.",
  },
  es: {
    eyebrow: "Para propietarios", title: "¿Estás pensando en vender o alquilar tu vivienda?", intro: "Cuéntanos lo esencial. Empezaremos con una conversación práctica sobre la vivienda, tus plazos y el resultado que buscas, sin promesas infladas ni presión.",
    sell: "Vender", longRent: "Alquiler de larga duración", holidayRent: "Alquiler vacacional", choicesTitle: "Elige la vía que encaja con tus planes.",
    choices: [{ title: "Vender tu vivienda", body: "Empezamos por la ubicación, estado y plazos para que la siguiente conversación parta de datos reales." }, { title: "Buscar un inquilino estable", body: "Indica la disponibilidad prevista y el tipo de alquiler que estás considerando." }, { title: "Explorar el alquiler vacacional", body: "Consulta el enfoque estacional y los siguientes pasos. Licencias y gestión deben evaluarse por separado." }],
    processEyebrow: "Un primer paso claro", processTitle: "Qué ocurre después de tu consulta", steps: [{ title: "Comparte lo básico", body: "Envía los datos que ya conozcas. No necesitas medidas perfectas ni fotos profesionales para la primera conversación." }, { title: "Comentamos el objetivo", body: "Aclaramos vivienda, plazos y prioridades, e identificamos la información que falta." }, { title: "Revisamos la vía adecuada", body: "Los siguientes pasos dependen de si quieres vender, alquilar a largo plazo o valorar el alquiler vacacional." }, { title: "Decide sin presión", body: "Tú eliges si quieres continuar. Puede ser necesario asesoramiento legal, fiscal o sobre licencias." }],
    formEyebrow: "Consulta de propiedad", formTitle: "Empieza con algunos datos útiles.", formIntro: "Es una consulta inicial, no un encargo de comercialización ni una tasación formal.",
    form: { intent: "Estoy pensando en", location: "Ubicación de la vivienda", locationPlaceholder: "Zona, calle o urbanización", propertyType: "Tipo de vivienda", propertyTypePlaceholder: "Apartamento, villa, adosado…", bedrooms: "Dormitorios", targetPrice: "Precio o renta aproximada", targetPricePlaceholder: "Opcional", timing: "Plazo preferido", timingPlaceholder: "Ahora, en 3 meses, más adelante…", name: "Tu nombre", email: "Email", phone: "Teléfono", notes: "¿Algo más que debamos saber?", notesPlaceholder: "Estado, ocupación, disponibilidad, dudas o contexto útil", submit: "Solicitar una conversación" },
    reassurance: "¿Prefieres empezar de manera informal? Envía la ubicación y una nota breve por WhatsApp.",
  },
  de: {
    eyebrow: "Für Eigentümer", title: "Möchten Sie Ihre Immobilie verkaufen oder vermieten?", intro: "Nennen Sie uns die wichtigsten Eckdaten. Wir beginnen mit einem sachlichen Gespräch über Immobilie, Zeitplan und Ziel—ohne übertriebene Versprechen oder Verkaufsdruck.",
    sell: "Verkaufen", longRent: "Langzeitvermietung", holidayRent: "Ferienvermietung", choicesTitle: "Wählen Sie den Weg, der zu Ihren Plänen passt.",
    choices: [{ title: "Immobilie verkaufen", body: "Ausgangspunkt sind Lage, Zustand und Zeitplan, damit das nächste Gespräch auf dem tatsächlichen Auftrag basiert." }, { title: "Langfristig vermieten", body: "Teilen Sie Verfügbarkeit und die Art des Mietverhältnisses mit, die Sie erwägen." }, { title: "Ferienvermietung prüfen", body: "Fragen Sie nach saisonaler Positionierung und nächsten Schritten. Lizenz- und Verwaltungsfragen müssen separat geprüft werden." }],
    processEyebrow: "Ein klarer erster Schritt", processTitle: "Was nach Ihrer Anfrage passiert", steps: [{ title: "Grunddaten senden", body: "Teilen Sie die bereits bekannten Details. Perfekte Maße oder professionelle Fotos sind für das erste Gespräch nicht nötig." }, { title: "Auftrag besprechen", body: "Wir klären Immobilie, Zeitplan und Prioritäten und bestimmen, welche Informationen noch fehlen." }, { title: "Passenden Weg prüfen", body: "Die nächsten Schritte richten sich danach, ob Sie verkaufen, langfristig vermieten oder Ferienvermietung prüfen möchten." }, { title: "Ohne Druck entscheiden", body: "Sie entscheiden, ob und wie es weitergeht. Unabhängige Rechts-, Steuer- oder Lizenzberatung kann erforderlich sein." }],
    formEyebrow: "Immobilienanfrage", formTitle: "Beginnen Sie mit einigen hilfreichen Angaben.", formIntro: "Dies ist eine erste Anfrage, kein Vermarktungsauftrag und keine formelle Bewertung.",
    form: { intent: "Ich erwäge", location: "Lage der Immobilie", locationPlaceholder: "Gebiet, Straße oder Anlage", propertyType: "Immobilientyp", propertyTypePlaceholder: "Apartment, Villa, Reihenhaus…", bedrooms: "Schlafzimmer", targetPrice: "Ungefährer Zielpreis oder Miete", targetPricePlaceholder: "Optional", timing: "Gewünschter Zeitplan", timingPlaceholder: "Jetzt, in 3 Monaten, später im Jahr…", name: "Ihr Name", email: "E-Mail", phone: "Telefon", notes: "Was sollten wir noch wissen?", notesPlaceholder: "Zustand, Belegung, Verfügbarkeit, Fragen oder Kontext", submit: "Immobiliengespräch anfragen" },
    reassurance: "Lieber informell beginnen? Senden Sie Lage und eine kurze Nachricht per WhatsApp.",
  },
  uk: {
    eyebrow: "Для власників", title: "Плануєте продати або здати свою нерухомість?", intro: "Розкажіть головне. Почнемо з практичної розмови про об'єкт, терміни та бажаний результат — без завищених обіцянок і тиску.",
    sell: "Продати", longRent: "Довгострокова оренда", holidayRent: "Короткострокова оренда", choicesTitle: "Оберіть варіант, який відповідає вашим планам.",
    choices: [{ title: "Продати нерухомість", body: "Почнемо з розташування, стану та термінів, щоб наступна розмова спиралася на реальні дані." }, { title: "Знайти довгострокового орендаря", body: "Вкажіть очікувану доступність і формат оренди, який ви розглядаєте." }, { title: "Розглянути короткострокову оренду", body: "Дізнайтеся про сезонне позиціонування та наступні кроки. Ліцензії та управління оцінюються окремо." }],
    processEyebrow: "Зрозумілий перший крок", processTitle: "Що станеться після звернення", steps: [{ title: "Повідомте основні дані", body: "Надішліть відому інформацію. Для першої розмови не потрібні ідеальні заміри чи професійні фотографії." }, { title: "Обговоримо завдання", body: "Уточнимо об'єкт, терміни та пріоритети, а також визначимо, якої інформації бракує." }, { title: "Оберемо відповідний шлях", body: "Наступні кроки залежать від того, чи хочете ви продати, здати надовго або розглянути короткострокову оренду." }, { title: "Вирішуйте без тиску", body: "Ви самі обираєте, чи продовжувати процес. Може знадобитися незалежна юридична, податкова чи ліцензійна консультація." }],
    formEyebrow: "Заявка власника", formTitle: "Почніть із кількох корисних деталей.", formIntro: "Це початковий запит, а не доручення на продаж і не офіційна оцінка.",
    form: { intent: "Я розглядаю", location: "Розташування об'єкта", locationPlaceholder: "Район, вулиця або житловий комплекс", propertyType: "Тип нерухомості", propertyTypePlaceholder: "Квартира, вілла, таунхаус…", bedrooms: "Спальні", targetPrice: "Орієнтовна ціна або оренда", targetPricePlaceholder: "Необов'язково", timing: "Бажані терміни", timingPlaceholder: "Зараз, протягом 3 місяців, пізніше…", name: "Ваше ім'я", email: "Email", phone: "Телефон", notes: "Що ще нам варто знати?", notesPlaceholder: "Стан, зайнятість, доступність, запитання або контекст", submit: "Запросити консультацію" },
    reassurance: "Волієте почати неформально? Надішліть розташування та коротке повідомлення у WhatsApp.",
  },
  ru: {
    eyebrow: "Для владельцев", title: "Планируете продать или сдать свою недвижимость?", intro: "Расскажите главное. Начнём с практичного разговора об объекте, сроках и желаемом результате—без завышенных обещаний и давления.",
    sell: "Продать", longRent: "Долгосрочная аренда", holidayRent: "Краткосрочная аренда", choicesTitle: "Выберите вариант, который соответствует вашим планам.",
    choices: [{ title: "Продать недвижимость", body: "Начнём с расположения, состояния и сроков, чтобы следующий разговор опирался на реальные данные." }, { title: "Найти долгосрочного арендатора", body: "Укажите предполагаемую доступность и формат аренды, который вы рассматриваете." }, { title: "Рассмотреть краткосрочную аренду", body: "Узнайте о сезонном позиционировании и следующих шагах. Лицензии и управление оцениваются отдельно." }],
    processEyebrow: "Понятный первый шаг", processTitle: "Что произойдёт после обращения", steps: [{ title: "Сообщите основные данные", body: "Отправьте известную информацию. Для первого разговора не нужны идеальные замеры или профессиональные фотографии." }, { title: "Обсудим задачу", body: "Уточним объект, сроки и приоритеты, а также определим, какой информации не хватает." }, { title: "Выберем подходящий путь", body: "Следующие шаги зависят от того, хотите ли вы продать, сдать надолго или рассмотреть краткосрочную аренду." }, { title: "Решайте без давления", body: "Вы сами выбираете, продолжать ли процесс. Может потребоваться независимая юридическая, налоговая или лицензионная консультация." }],
    formEyebrow: "Заявка владельца", formTitle: "Начните с нескольких полезных деталей.", formIntro: "Это первоначальный запрос, а не поручение на продажу и не официальная оценка.",
    form: { intent: "Я рассматриваю", location: "Расположение объекта", locationPlaceholder: "Район, улица или жилой комплекс", propertyType: "Тип недвижимости", propertyTypePlaceholder: "Квартира, вилла, таунхаус…", bedrooms: "Спальни", targetPrice: "Ориентировочная цена или аренда", targetPricePlaceholder: "Необязательно", timing: "Желаемые сроки", timingPlaceholder: "Сейчас, в течение 3 месяцев, позже…", name: "Ваше имя", email: "Email", phone: "Телефон", notes: "Что ещё нам следует знать?", notesPlaceholder: "Состояние, занятость, доступность, вопросы или контекст", submit: "Запросить консультацию" },
    reassurance: "Предпочитаете начать неформально? Отправьте расположение и короткое сообщение в WhatsApp.",
  },
};
