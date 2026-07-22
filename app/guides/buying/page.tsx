import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { ContactActions } from "@/components/contact-actions";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { publicCopy, resolvePublicLocale, type PublicLocale } from "@/lib/public-copy";
import { getPublicSiteUrl } from "@/lib/site-urls";

export const dynamic = "force-dynamic";

type GuideContent = {
  eyebrow: string;
  title: string;
  intro: string;
  overviewLabel: string;
  overview: Array<{ value: string; label: string }>;
  processEyebrow: string;
  processTitle: string;
  steps: Array<{ title: string; body: string }>;
  costs: {
    eyebrow: string;
    title: string;
    intro: string;
    resaleTitle: string;
    resaleBody: string;
    newBuildTitle: string;
    newBuildBody: string;
    otherTitle: string;
    otherItems: string[];
    note: string;
  };
  faqEyebrow: string;
  faqTitle: string;
  faq: Array<{ q: string; a: string }>;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
};

const guideContent: Record<PublicLocale, GuideContent> = {
  en: {
    eyebrow: "A clear route to the keys",
    title: "Buying property in Spain",
    intro: "A calm, practical overview of buying on the Costa Blanca—from preparing your paperwork to signing at the notary. Every purchase is different, but the route is usually reassuringly familiar.",
    overviewLabel: "At a glance",
    overview: [
      { value: "6", label: "Typical stages" },
      { value: "4–8 weeks", label: "Common resale timeline" },
      { value: "Independent", label: "Legal advice recommended" },
    ],
    processEyebrow: "The process",
    processTitle: "From first decision to front door",
    steps: [
      { title: "Prepare your essentials", body: "You will need an NIE (the Spanish foreigner identification number) and, in practice, a Spanish bank account for purchase costs, taxes and household payments." },
      { title: "Set the brief and budget", body: "Decide where, what and how you want to buy. If you need finance, obtain an early mortgage assessment and include taxes and professional fees in your budget." },
      { title: "Choose independent advice", body: "Appoint an independent Spanish lawyer to review ownership, debts, planning status, contracts and the property registry before you become fully committed." },
      { title: "Reserve the property", body: "A reservation agreement and deposit can take the home off the market while legal checks continue. Confirm the refund conditions in writing before paying." },
      { title: "Agree the purchase contract", body: "The private contract records the price, completion date, fixtures and conditions. A further deposit is commonly paid at this point, so legal review matters." },
      { title: "Complete at the notary", body: "The deed is signed, the balance is paid and the keys are handed over. Your lawyer can then arrange tax filings and registration of the new ownership." },
    ],
    costs: {
      eyebrow: "Planning the budget",
      title: "Purchase costs depend on the property",
      intro: "Resale and new-build homes are taxed differently. Ask your lawyer for a written, property-specific estimate before reserving.",
      resaleTitle: "Resale home",
      resaleBody: "The buyer pays regional transfer tax (ITP). The rate depends on the autonomous community and may vary with the buyer or property, so it should be confirmed for the specific transaction.",
      newBuildTitle: "New-build home",
      newBuildBody: "A first delivery from a developer generally carries 10% VAT (IVA), plus regional stamp duty (AJD). Reduced or special rates can apply in limited cases.",
      otherTitle: "Also allow for",
      otherItems: ["Notary and Land Registry fees", "Independent legal advice", "Mortgage valuation and any agreed lender fees", "Translations, powers of attorney or administrative support where needed"],
      note: "General information only, reviewed July 2026. Tax rates, eligibility and purchase costs can change. Confirm the figures with an independent lawyer or tax adviser before committing funds.",
    },
    faqEyebrow: "Good to know",
    faqTitle: "Common questions",
    faq: [
      { q: "Can non-residents buy property in Spain?", a: "Yes. Spain generally allows non-residents, including non-EU nationals, to buy property. You will need an NIE to complete the purchase." },
      { q: "How long does the process take?", a: "A straightforward resale purchase often completes in around four to eight weeks, but finance, legal findings and the parties’ preferred dates can change the timetable." },
      { q: "Do I need to be in Spain to buy?", a: "Not always. An independent lawyer may be able to complete many steps under a notarised power of attorney. Ask them what can be handled remotely in your case." },
      { q: "Should I use the seller’s lawyer?", a: "Independent representation is strongly recommended. Your lawyer should act for you alone and carry out the legal checks before you sign or transfer substantial funds." },
      { q: "Is a reservation deposit refundable?", a: "That depends on the agreement. Make sure the amount, deadline and refund conditions—especially if finance or legal checks fail—are clear in writing before paying." },
    ],
    ctaEyebrow: "Start with the right home",
    ctaTitle: "Ready to explore the Costa Blanca?",
    ctaText: "Browse current homes or tell us what you are looking for. We will help you narrow the search, without the hard sell.",
  },
  es: {
    eyebrow: "Un camino claro hasta las llaves",
    title: "Comprar una vivienda en España",
    intro: "Una guía práctica y tranquila para comprar en la Costa Blanca: desde preparar la documentación hasta firmar ante notario. Cada compra es distinta, pero el recorrido suele seguir unos pasos claros.",
    overviewLabel: "En resumen",
    overview: [{ value: "6", label: "Etapas habituales" }, { value: "4–8 semanas", label: "Plazo común en segunda mano" }, { value: "Independiente", label: "Asesoramiento legal recomendado" }],
    processEyebrow: "El proceso",
    processTitle: "De la primera decisión a la puerta de casa",
    steps: [
      { title: "Prepara lo esencial", body: "Necesitarás un NIE y, en la práctica, una cuenta bancaria española para los gastos de compra, impuestos y pagos de la vivienda." },
      { title: "Define búsqueda y presupuesto", body: "Decide zona, tipo de vivienda y forma de pago. Si necesitas financiación, solicita una evaluación hipotecaria temprana e incluye impuestos y honorarios." },
      { title: "Elige asesoramiento independiente", body: "Contrata a un abogado español independiente para revisar titularidad, cargas, situación urbanística, contratos y registro antes de comprometerte." },
      { title: "Reserva la vivienda", body: "Un acuerdo de reserva y una señal pueden retirar la vivienda del mercado mientras continúan las comprobaciones. Confirma por escrito cuándo se devuelve la señal." },
      { title: "Acuerda el contrato privado", body: "El contrato fija precio, fecha, mobiliario y condiciones. Suele abonarse otra cantidad en este momento, por lo que la revisión legal es importante." },
      { title: "Firma ante notario", body: "Se firma la escritura, se paga el saldo y se entregan las llaves. Después, tu abogado puede gestionar impuestos e inscripción de la propiedad." },
    ],
    costs: {
      eyebrow: "Planifica el presupuesto", title: "Los gastos dependen de la vivienda", intro: "La segunda mano y la obra nueva tributan de forma distinta. Pide a tu abogado un cálculo escrito para la operación concreta antes de reservar.",
      resaleTitle: "Vivienda de segunda mano", resaleBody: "El comprador paga el impuesto autonómico de transmisiones patrimoniales (ITP). El tipo depende de la comunidad autónoma y puede variar según comprador o inmueble.",
      newBuildTitle: "Vivienda de obra nueva", newBuildBody: "La primera entrega por un promotor suele llevar un 10% de IVA, además del impuesto autonómico de actos jurídicos documentados (AJD). Puede haber tipos especiales en casos limitados.",
      otherTitle: "Ten en cuenta también", otherItems: ["Notaría y Registro de la Propiedad", "Asesoramiento jurídico independiente", "Tasación hipotecaria y comisiones pactadas con el banco", "Traducciones, poderes notariales o gestiones cuando sean necesarios"],
      note: "Información general revisada en julio de 2026. Los impuestos, requisitos y gastos pueden cambiar. Confirma las cifras con un abogado o asesor fiscal independiente antes de comprometer fondos.",
    },
    faqEyebrow: "Conviene saber", faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Pueden comprar los no residentes?", a: "Sí. En general, España permite comprar a no residentes, también de fuera de la UE. Necesitarás un NIE para completar la operación." },
      { q: "¿Cuánto tarda el proceso?", a: "Una compraventa sencilla de segunda mano suele completarse en unas cuatro a ocho semanas, aunque la financiación, las comprobaciones y las fechas acordadas pueden modificar el plazo." },
      { q: "¿Tengo que estar en España?", a: "No siempre. Un abogado independiente puede gestionar muchos trámites mediante poder notarial. Consulta qué puede hacerse a distancia en tu caso." },
      { q: "¿Debo usar el abogado del vendedor?", a: "Se recomienda representación independiente. Tu abogado debe defender únicamente tus intereses y revisar la operación antes de firmar o transferir cantidades importantes." },
      { q: "¿Se devuelve la señal de reserva?", a: "Depende del acuerdo. Antes de pagar, deja claros por escrito el importe, el plazo y las condiciones de devolución, especialmente si falla la financiación o la revisión legal." },
    ],
    ctaEyebrow: "Empieza por la vivienda adecuada", ctaTitle: "¿Exploramos la Costa Blanca?", ctaText: "Consulta las viviendas disponibles o cuéntanos qué buscas. Te ayudaremos a centrar la búsqueda, sin presiones.",
  },
  de: {
    eyebrow: "Ein klarer Weg bis zur Schlüsselübergabe", title: "Eine Immobilie in Spanien kaufen", intro: "Ein ruhiger, praktischer Überblick über den Immobilienkauf an der Costa Blanca – von den ersten Unterlagen bis zum Notartermin. Jeder Kauf ist anders, der Ablauf folgt jedoch meist vertrauten Schritten.",
    overviewLabel: "Auf einen Blick", overview: [{ value: "6", label: "Typische Schritte" }, { value: "4–8 Wochen", label: "Häufiger Zeitraum bei Bestandsimmobilien" }, { value: "Unabhängig", label: "Rechtsberatung empfohlen" }],
    processEyebrow: "Der Ablauf", processTitle: "Von der Entscheidung bis zur Haustür",
    steps: [
      { title: "Grundlagen vorbereiten", body: "Sie benötigen eine NIE (spanische Ausländer-Identifikationsnummer) und in der Praxis ein spanisches Bankkonto für Kaufnebenkosten, Steuern und laufende Zahlungen." },
      { title: "Suche und Budget festlegen", body: "Bestimmen Sie Lage, Immobilientyp und Finanzierung. Bei Finanzierungsbedarf empfiehlt sich eine frühe Kreditprüfung; Steuern und Honorare gehören ins Gesamtbudget." },
      { title: "Unabhängige Beratung wählen", body: "Beauftragen Sie einen unabhängigen spanischen Anwalt, der Eigentum, Belastungen, Baurecht, Verträge und Grundbuch prüft, bevor Sie sich vollständig binden." },
      { title: "Immobilie reservieren", body: "Eine Reservierungsvereinbarung mit Anzahlung kann die Immobilie vom Markt nehmen. Lassen Sie vor der Zahlung die Bedingungen einer Rückerstattung schriftlich festhalten." },
      { title: "Privatvertrag vereinbaren", body: "Der Vertrag regelt Preis, Übergabetermin, Inventar und Bedingungen. Häufig wird jetzt eine weitere Anzahlung fällig, deshalb ist die rechtliche Prüfung wichtig." },
      { title: "Beim Notar abschließen", body: "Die Urkunde wird unterzeichnet, der Restbetrag bezahlt und die Schlüssel werden übergeben. Anschließend können Steuererklärung und Eigentumsumschreibung erfolgen." },
    ],
    costs: {
      eyebrow: "Das Budget planen", title: "Die Kaufkosten hängen von der Immobilie ab", intro: "Bestands- und Neubauimmobilien werden unterschiedlich besteuert. Lassen Sie sich vor der Reservierung eine schriftliche, objektspezifische Kostenaufstellung geben.",
      resaleTitle: "Bestandsimmobilie", resaleBody: "Der Käufer zahlt die regionale Grunderwerbsteuer (ITP). Der Satz richtet sich nach der autonomen Region und kann je nach Käufer oder Immobilie variieren.",
      newBuildTitle: "Neubau", newBuildBody: "Der Ersterwerb vom Bauträger unterliegt in der Regel 10 % Mehrwertsteuer (IVA) sowie der regionalen Stempelsteuer (AJD). In begrenzten Fällen können Sonder- oder ermäßigte Sätze gelten.",
      otherTitle: "Zusätzlich einplanen", otherItems: ["Notar- und Grundbuchkosten", "Unabhängige Rechtsberatung", "Immobilienbewertung für die Hypothek und vereinbarte Bankgebühren", "Übersetzungen, Vollmachten oder Verwaltungshilfe bei Bedarf"],
      note: "Nur allgemeine Informationen, geprüft im Juli 2026. Steuern, Voraussetzungen und Kosten können sich ändern. Bestätigen Sie die Zahlen vor einer Zahlung mit einem unabhängigen Anwalt oder Steuerberater.",
    },
    faqEyebrow: "Gut zu wissen", faqTitle: "Häufige Fragen",
    faq: [
      { q: "Können Nichtresidenten in Spanien kaufen?", a: "Ja. Spanien erlaubt grundsätzlich auch Nichtresidenten und Nicht-EU-Bürgern den Immobilienkauf. Für den Abschluss benötigen Sie eine NIE." },
      { q: "Wie lange dauert der Kauf?", a: "Ein unkomplizierter Kauf einer Bestandsimmobilie dauert häufig vier bis acht Wochen. Finanzierung, Prüfergebnisse und vereinbarte Termine können den Zeitplan verändern." },
      { q: "Muss ich in Spanien sein?", a: "Nicht immer. Ein unabhängiger Anwalt kann viele Schritte mit notarieller Vollmacht übernehmen. Klären Sie, was in Ihrem Fall aus der Ferne möglich ist." },
      { q: "Sollte ich den Anwalt des Verkäufers nutzen?", a: "Eine unabhängige Vertretung wird dringend empfohlen. Ihr Anwalt sollte ausschließlich Ihre Interessen vertreten und vor Unterschrift oder größeren Zahlungen prüfen." },
      { q: "Ist die Reservierungszahlung erstattbar?", a: "Das richtet sich nach der Vereinbarung. Betrag, Frist und Rückzahlungsbedingungen sollten vor Zahlung schriftlich feststehen – besonders bei Finanzierungsvorbehalt oder negativen Prüfergebnissen." },
    ],
    ctaEyebrow: "Mit dem passenden Zuhause beginnen", ctaTitle: "Bereit für die Costa Blanca?", ctaText: "Sehen Sie sich aktuelle Immobilien an oder erzählen Sie uns, wonach Sie suchen. Wir helfen Ihnen, die Auswahl ohne Verkaufsdruck einzugrenzen.",
  },
  uk: {
    eyebrow: "Зрозумілий шлях до отримання ключів", title: "Купівля нерухомості в Іспанії", intro: "Спокійний і практичний огляд купівлі житла на Коста-Бланці — від підготовки документів до підписання в нотаріуса. Кожна угода індивідуальна, але основні етапи зазвичай схожі.",
    overviewLabel: "Коротко", overview: [{ value: "6", label: "Основних етапів" }, { value: "4–8 тижнів", label: "Звичайний термін для вторинного житла" }, { value: "Незалежна", label: "Юридична консультація рекомендована" }],
    processEyebrow: "Процес", processTitle: "Від першого рішення до вхідних дверей",
    steps: [
      { title: "Підготуйте необхідне", body: "Вам знадобиться NIE — ідентифікаційний номер іноземця — і, як правило, рахунок в іспанському банку для оплати витрат, податків і комунальних послуг." },
      { title: "Визначте запит і бюджет", body: "Оберіть район, тип нерухомості та спосіб оплати. Якщо потрібна іпотека, заздалегідь отримайте оцінку банку та включіть податки й професійні послуги в бюджет." },
      { title: "Оберіть незалежного юриста", body: "Незалежний іспанський адвокат має перевірити право власності, борги, містобудівний статус, договори та дані реєстру до ухвалення зобов'язань." },
      { title: "Зарезервуйте об'єкт", body: "Договір резервування та завдаток можуть зняти об'єкт із продажу на час перевірок. До оплати письмово зафіксуйте умови повернення коштів." },
      { title: "Узгодьте приватний договір", body: "Договір визначає ціну, дату завершення, комплектацію та умови угоди. На цьому етапі часто вноситься наступний платіж, тому юридична перевірка особливо важлива." },
      { title: "Завершіть угоду в нотаріуса", body: "Сторони підписують купчу, покупець сплачує залишок і отримує ключі. Потім юрист може оформити податки та реєстрацію нового власника." },
    ],
    costs: {
      eyebrow: "Планування бюджету", title: "Витрати залежать від типу нерухомості", intro: "Вторинне та нове житло оподатковуються по-різному. До резервування попросіть юриста підготувати письмовий розрахунок за конкретним об'єктом.",
      resaleTitle: "Вторинне житло", resaleBody: "Покупець сплачує регіональний податок на передачу власності (ITP). Ставка залежить від автономної спільноти й може відрізнятися залежно від покупця чи об'єкта.",
      newBuildTitle: "Новобудова", newBuildBody: "Перший продаж забудовником, як правило, оподатковується ПДВ (IVA) 10% і регіональним гербовим збором (AJD). В окремих випадках можливі спеціальні чи пільгові ставки.",
      otherTitle: "Також передбачте", otherItems: ["Послуги нотаріуса та Реєстру власності", "Незалежну юридичну консультацію", "Оцінку для іпотеки та узгоджені комісії банку", "Переклади, довіреності та адміністративну допомогу за потреби"],
      note: "Лише загальна інформація, перевірено в липні 2026 року. Податки, умови та витрати можуть змінюватися. До внесення коштів підтвердіть розрахунки в незалежного юриста або податкового консультанта.",
    },
    faqEyebrow: "Корисно знати", faqTitle: "Часті запитання",
    faq: [
      { q: "Чи можуть нерезиденти купувати нерухомість?", a: "Так. Іспанія загалом дозволяє купівлю нерезидентам, включно з громадянами країн поза ЄС. Для завершення угоди знадобиться NIE." },
      { q: "Скільки часу займає купівля?", a: "Нескладна угода з вторинним житлом часто займає чотири–вісім тижнів. Іпотека, результати перевірок і узгоджені дати можуть змінити термін." },
      { q: "Чи потрібно перебувати в Іспанії?", a: "Не завжди. Незалежний юрист може виконати багато дій за нотаріальною довіреністю. Уточніть, що можна зробити дистанційно саме у вашому випадку." },
      { q: "Чи можна скористатися юристом продавця?", a: "Наполегливо рекомендується незалежне представництво. Ваш юрист має захищати лише ваші інтереси та перевірити угоду до підписання чи переказу значних сум." },
      { q: "Чи повертається резервний депозит?", a: "Це залежить від договору. До оплати письмово зафіксуйте суму, термін і умови повернення, особливо на випадок відмови у фінансуванні чи проблем під час перевірки." },
    ],
    ctaEyebrow: "Почніть із відповідного дому", ctaTitle: "Готові дослідити Коста-Бланку?", ctaText: "Перегляньте актуальні об'єкти або розкажіть, що ви шукаєте. Ми допоможемо звузити вибір — без нав'язливих продажів.",
  },
  ru: {
    eyebrow: "Понятный путь до получения ключей", title: "Покупка недвижимости в Испании", intro: "Спокойный и практичный обзор покупки жилья на Коста-Бланке — от подготовки документов до подписания у нотариуса. Каждая сделка индивидуальна, но основные этапы обычно схожи.",
    overviewLabel: "Кратко", overview: [{ value: "6", label: "Основных этапов" }, { value: "4–8 недель", label: "Обычный срок для вторичного жилья" }, { value: "Независимая", label: "Юридическая консультация рекомендована" }],
    processEyebrow: "Процесс", processTitle: "От первого решения до входной двери",
    steps: [
      { title: "Подготовьте необходимое", body: "Вам понадобится NIE — идентификационный номер иностранца — и, как правило, счёт в испанском банке для оплаты расходов, налогов и коммунальных услуг." },
      { title: "Определите запрос и бюджет", body: "Выберите район, тип недвижимости и способ оплаты. Если нужна ипотека, заранее получите оценку банка и включите налоги и профессиональные услуги в бюджет." },
      { title: "Выберите независимого юриста", body: "Независимый испанский адвокат должен проверить право собственности, долги, градостроительный статус, договоры и данные реестра до принятия обязательств." },
      { title: "Зарезервируйте объект", body: "Договор резервирования и задаток могут снять объект с продажи на время проверок. До оплаты письменно зафиксируйте условия возврата средств." },
      { title: "Согласуйте частный договор", body: "Договор определяет цену, дату завершения, комплектацию и условия сделки. На этом этапе часто вносится следующий платёж, поэтому юридическая проверка особенно важна." },
      { title: "Завершите сделку у нотариуса", body: "Стороны подписывают купчую, покупатель оплачивает остаток и получает ключи. Затем юрист может оформить налоги и регистрацию нового владельца." },
    ],
    costs: {
      eyebrow: "Планирование бюджета", title: "Расходы зависят от типа недвижимости", intro: "Вторичное и новое жильё облагаются налогами по-разному. До резервирования попросите юриста подготовить письменный расчёт по конкретному объекту.",
      resaleTitle: "Вторичное жильё", resaleBody: "Покупатель платит региональный налог на передачу собственности (ITP). Ставка зависит от автономного сообщества и может различаться в зависимости от покупателя или объекта.",
      newBuildTitle: "Новостройка", newBuildBody: "Первая продажа застройщиком, как правило, облагается НДС (IVA) 10% и региональным гербовым сбором (AJD). В отдельных случаях возможны специальные или льготные ставки.",
      otherTitle: "Также предусмотрите", otherItems: ["Услуги нотариуса и Реестра собственности", "Независимую юридическую консультацию", "Оценку для ипотеки и согласованные комиссии банка", "Переводы, доверенности и административную помощь при необходимости"],
      note: "Только общая информация, проверено в июле 2026 года. Налоги, условия и расходы могут меняться. До внесения средств подтвердите расчёты у независимого юриста или налогового консультанта.",
    },
    faqEyebrow: "Полезно знать", faqTitle: "Частые вопросы",
    faq: [
      { q: "Могут ли нерезиденты покупать недвижимость?", a: "Да. Испания в целом разрешает покупку нерезидентам, включая граждан стран вне ЕС. Для завершения сделки понадобится NIE." },
      { q: "Сколько времени занимает покупка?", a: "Несложная сделка со вторичным жильём часто занимает четыре–восемь недель. Ипотека, результаты проверок и согласованные даты могут изменить срок." },
      { q: "Нужно ли находиться в Испании?", a: "Не всегда. Независимый юрист может выполнить многие действия по нотариальной доверенности. Уточните, что можно сделать дистанционно именно в вашем случае." },
      { q: "Можно ли воспользоваться юристом продавца?", a: "Настоятельно рекомендуется независимое представительство. Ваш юрист должен защищать только ваши интересы и проверить сделку до подписания или перевода значительных сумм." },
      { q: "Возвращается ли резервный депозит?", a: "Это зависит от договора. До оплаты письменно зафиксируйте сумму, срок и условия возврата, особенно на случай отказа в финансировании или проблем при проверке." },
    ],
    ctaEyebrow: "Начните с подходящего дома", ctaTitle: "Готовы изучить Коста-Бланку?", ctaText: "Посмотрите актуальные объекты или расскажите, что вы ищете. Мы поможем сузить выбор — без навязчивых продаж.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const content = guideContent[locale];

  return {
    title: content.title,
    description: content.intro,
    alternates: { canonical: "/guides/buying" },
    openGraph: { title: `${content.title} · Milla Homes`, description: content.intro, url: "/guides/buying", type: "article" },
  };
}

export default async function BuyingGuidePage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const adminLocale = resolveAdminLocale(locale);
  const authState = await getAdminAuthState();
  const content = guideContent[locale];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
    url: getPublicSiteUrl("/guides/buying"),
  };

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PublicHeader adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined} compact currentLocale={locale} languageLabel={copy.languageLabel} nav={copy.nav} />

      <article className="buying-guide">
        <header className="guide-hero">
          <div className="guide-hero-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="guide-lead">{content.intro}</p>
            <div className="guide-hero-actions">
              <Link className="button button-primary" href="/properties">{copy.buttons.browseProperties}</Link>
              <ContactActions callLabel={copy.buttons.callNow} className="contact-actions" whatsappLabel={copy.buttons.whatsapp} whatsappMessage={copy.contact.whatsappMessage} />
            </div>
          </div>

          <aside className="guide-overview" aria-label={content.overviewLabel}>
            <p className="guide-overview-label">{content.overviewLabel}</p>
            {content.overview.map((item) => <div className="guide-overview-item" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
          </aside>
        </header>

        <section className="guide-section" data-reveal aria-labelledby="guide-process-title">
          <div className="guide-section-heading">
            <p className="eyebrow">{content.processEyebrow}</p>
            <h2 id="guide-process-title">{content.processTitle}</h2>
          </div>
          <ol className="guide-timeline">
            {content.steps.map((step, index) => <li className="guide-step" key={step.title}><span className="guide-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}
          </ol>
        </section>

        <section className="guide-costs" data-reveal aria-labelledby="guide-costs-title">
          <div className="guide-costs-heading">
            <p className="eyebrow">{content.costs.eyebrow}</p>
            <h2 id="guide-costs-title">{content.costs.title}</h2>
            <p>{content.costs.intro}</p>
          </div>
          <div className="guide-cost-grid">
            <article><span className="guide-cost-marker">01</span><h3>{content.costs.resaleTitle}</h3><p>{content.costs.resaleBody}</p></article>
            <article><span className="guide-cost-marker">02</span><h3>{content.costs.newBuildTitle}</h3><p>{content.costs.newBuildBody}</p></article>
          </div>
          <div className="guide-other-costs"><h3>{content.costs.otherTitle}</h3><ul>{content.costs.otherItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <p className="guide-legal-note">{content.costs.note}</p>
        </section>

        <section className="guide-section guide-faq" data-reveal aria-labelledby="guide-faq-title">
          <div className="guide-section-heading"><p className="eyebrow">{content.faqEyebrow}</p><h2 id="guide-faq-title">{content.faqTitle}</h2></div>
          <div className="guide-faq-list">{content.faq.map((item) => <details className="guide-faq-item" key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
        </section>

        <section className="guide-cta" data-reveal>
          <div><p className="eyebrow">{content.ctaEyebrow}</p><h2>{content.ctaTitle}</h2><p>{content.ctaText}</p></div>
          <div className="guide-cta-actions"><Link className="button button-primary" href="/properties">{copy.buttons.browseProperties}</Link><ContactActions callLabel={copy.buttons.callNow} className="contact-actions" whatsappLabel={copy.buttons.whatsapp} whatsappMessage={copy.contact.whatsappMessage} /></div>
        </section>
      </article>

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
