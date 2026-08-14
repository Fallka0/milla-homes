import type { ShareLocale } from "@/lib/share-property";

// The "How rent-to-own works" explainer is identical on every property page.
// It lives here, once, so editing the wording updates all ten pages at the same
// time. Hand-written in each language — do not translate this file mechanically.

export type RentToOwnStep = {
  title: string;
  body: string;
};

export type RentToOwnContent = {
  heading: string;
  intro: string;
  steps: RentToOwnStep[];
  footnote: string;
};

export const rentToOwnContent: Record<ShareLocale, RentToOwnContent> = {
  es: {
    heading: "Cómo funciona el alquiler con opción a compra",
    intro:
      "Entras a vivir como inquilino y fijas hoy el precio de compra. Cada mes que pagas cuenta a tu favor, y decides si compras dentro del plazo acordado.",
    steps: [
      {
        title: "1. Se fija el precio y el plazo",
        body: "Firmamos un contrato de alquiler con opción a compra ante notario. El precio de venta queda cerrado desde el primer día, normalmente por un plazo de dos a tres años, y no cambia aunque el mercado suba.",
      },
      {
        title: "2. Pagas una prima de opción",
        body: "Se abona una entrada inicial, habitualmente entre el 3 % y el 10 % del precio. Esa cantidad se descuenta íntegramente del precio final si compras.",
      },
      {
        title: "3. Parte de la renta se descuenta",
        body: "Un porcentaje pactado de cada mensualidad se acumula y se resta del precio de compra. Vives en la casa mientras vas reduciendo lo que quedará por pagar.",
      },
      {
        title: "4. Decides dentro del plazo",
        body: "Antes de que termine el plazo eliges: ejercer la opción y comprar, con la prima y las rentas ya descontadas, o no comprar y marcharte al vencimiento del alquiler.",
      },
    ],
    footnote:
      "Cada operación se redacta a medida y se firma ante notario. Los porcentajes y plazos concretos se acuerdan por escrito antes de la firma.",
  },
  en: {
    heading: "How rent-to-own works",
    intro:
      "You move in as a tenant and lock in the purchase price today. Every month you pay counts towards the property, and you decide whether to buy within the agreed period.",
    steps: [
      {
        title: "1. The price and the period are fixed",
        body: "We sign a rent-to-own contract before a notary. The sale price is locked from day one, usually for a two- to three-year period, and does not change even if the market rises.",
      },
      {
        title: "2. You pay an option premium",
        body: "An upfront payment is made, typically between 3% and 10% of the price. That amount is deducted in full from the final price if you go on to buy.",
      },
      {
        title: "3. Part of the rent is credited",
        body: "An agreed percentage of each monthly payment accumulates and is subtracted from the purchase price. You live in the house while reducing what is left to pay.",
      },
      {
        title: "4. You decide within the period",
        body: "Before the period ends you choose: exercise the option and buy, with the premium and credited rent already deducted, or walk away when the tenancy ends.",
      },
    ],
    footnote:
      "Every agreement is drafted individually and signed before a notary. The exact percentages and time limits are agreed in writing before signing.",
  },
  ru: {
    heading: "Как работает аренда с правом выкупа",
    intro:
      "Вы въезжаете как арендатор и фиксируете цену покупки уже сегодня. Каждый оплаченный месяц идёт в зачёт, а решение о покупке вы принимаете в течение оговорённого срока.",
    steps: [
      {
        title: "1. Фиксируются цена и срок",
        body: "Мы подписываем договор аренды с правом выкупа у нотариуса. Цена продажи закрепляется с первого дня — обычно на два-три года — и не меняется, даже если рынок вырастет.",
      },
      {
        title: "2. Вы вносите опционную премию",
        body: "Вносится первоначальный платёж, как правило от 3 % до 10 % от цены. Эта сумма полностью вычитается из итоговой цены, если вы решите купить.",
      },
      {
        title: "3. Часть аренды идёт в зачёт",
        body: "Согласованный процент от каждого ежемесячного платежа накапливается и вычитается из цены покупки. Вы живёте в доме и одновременно уменьшаете остаток.",
      },
      {
        title: "4. Вы решаете в течение срока",
        body: "До окончания срока вы выбираете: реализовать опцион и купить — с уже учтёнными премией и зачтённой арендой — либо не покупать и съехать по окончании аренды.",
      },
    ],
    footnote:
      "Каждая сделка составляется индивидуально и подписывается у нотариуса. Конкретные проценты и сроки согласовываются письменно до подписания.",
  },
  de: {
    heading: "So funktioniert Mietkauf",
    intro:
      "Sie ziehen als Mieter ein und legen den Kaufpreis schon heute fest. Jeder gezahlte Monat wird angerechnet, und Sie entscheiden innerhalb der vereinbarten Frist, ob Sie kaufen.",
    steps: [
      {
        title: "1. Preis und Laufzeit werden festgelegt",
        body: "Wir schließen einen Mietkaufvertrag vor einem Notar. Der Kaufpreis steht ab dem ersten Tag fest — in der Regel für zwei bis drei Jahre — und ändert sich auch bei steigendem Markt nicht.",
      },
      {
        title: "2. Sie zahlen eine Optionsprämie",
        body: "Es wird eine Anzahlung geleistet, üblicherweise zwischen 3 % und 10 % des Preises. Dieser Betrag wird beim Kauf vollständig vom Endpreis abgezogen.",
      },
      {
        title: "3. Ein Teil der Miete wird angerechnet",
        body: "Ein vereinbarter Prozentsatz jeder Monatsmiete wird angesammelt und vom Kaufpreis abgezogen. Sie wohnen im Haus und verringern gleichzeitig den Restbetrag.",
      },
      {
        title: "4. Sie entscheiden innerhalb der Frist",
        body: "Vor Ablauf der Frist entscheiden Sie: die Option ausüben und kaufen — Prämie und angerechnete Miete bereits abgezogen — oder nicht kaufen und zum Mietende ausziehen.",
      },
    ],
    footnote:
      "Jede Vereinbarung wird individuell aufgesetzt und vor einem Notar unterzeichnet. Die genauen Prozentsätze und Fristen werden vor der Unterzeichnung schriftlich vereinbart.",
  },
};
