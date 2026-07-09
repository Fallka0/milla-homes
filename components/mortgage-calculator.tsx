"use client";

import { useMemo, useState } from "react";

import { formatPrice } from "@/lib/property-shared";
import type { PublicLocale } from "@/lib/public-copy";

type MortgageCalculatorProps = {
  locale: PublicLocale;
  price: number;
};

type CalculatorCopy = {
  deposit: string;
  eyebrow: string;
  interest: string;
  loanAmount: string;
  monthly: string;
  note: string;
  purchaseCosts: string;
  term: string;
  termUnit: string;
  title: string;
  upfront: string;
};

const copyByLocale: Record<PublicLocale, CalculatorCopy> = {
  en: {
    deposit: "Deposit",
    eyebrow: "Plan your purchase",
    interest: "Interest rate",
    loanAmount: "Loan amount",
    monthly: "Estimated monthly payment",
    note: "Indicative only — not a mortgage offer. Purchase costs are an estimate for a resale in the Valencia region.",
    purchaseCosts: "Purchase costs (≈11%)",
    term: "Term",
    termUnit: "years",
    title: "Mortgage calculator",
    upfront: "Upfront (deposit + costs)",
  },
  es: {
    deposit: "Entrada",
    eyebrow: "Planifica tu compra",
    interest: "Tipo de interés",
    loanAmount: "Importe del préstamo",
    monthly: "Cuota mensual estimada",
    note: "Solo orientativo — no es una oferta hipotecaria. Los gastos de compra son una estimación para segunda mano en la Comunidad Valenciana.",
    purchaseCosts: "Gastos de compra (≈11%)",
    term: "Plazo",
    termUnit: "años",
    title: "Calculadora de hipoteca",
    upfront: "Inicial (entrada + gastos)",
  },
  ru: {
    deposit: "Первый взнос",
    eyebrow: "Спланируйте покупку",
    interest: "Процентная ставка",
    loanAmount: "Сумма кредита",
    monthly: "Примерный ежемесячный платёж",
    note: "Только для ориентира — не является ипотечным предложением. Расходы на покупку — оценка для вторичного жилья в Валенсии.",
    purchaseCosts: "Расходы на покупку (≈11%)",
    term: "Срок",
    termUnit: "лет",
    title: "Ипотечный калькулятор",
    upfront: "Первоначально (взнос + расходы)",
  },
  de: {
    deposit: "Anzahlung",
    eyebrow: "Planen Sie Ihren Kauf",
    interest: "Zinssatz",
    loanAmount: "Darlehensbetrag",
    monthly: "Geschätzte monatliche Rate",
    note: "Nur zur Orientierung — kein Hypothekenangebot. Kaufnebenkosten sind eine Schätzung für einen Wiederverkauf in der Region Valencia.",
    purchaseCosts: "Kaufnebenkosten (≈11%)",
    term: "Laufzeit",
    termUnit: "Jahre",
    title: "Hypothekenrechner",
    upfront: "Vorab (Anzahlung + Kosten)",
  },
};

const PURCHASE_COST_RATE = 0.11;

function blurOnWheel(event: React.WheelEvent<HTMLInputElement>) {
  event.currentTarget.blur();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function MortgageCalculator({ locale, price }: MortgageCalculatorProps) {
  const copy = copyByLocale[locale];
  const [depositPct, setDepositPct] = useState(20);
  const [rate, setRate] = useState(3.5);
  const [termYears, setTermYears] = useState(25);

  const result = useMemo(() => {
    const safeDeposit = clamp(depositPct, 0, 100);
    const deposit = (price * safeDeposit) / 100;
    const loan = Math.max(price - deposit, 0);
    const months = clamp(termYears, 1, 40) * 12;
    const monthlyRate = clamp(rate, 0, 25) / 100 / 12;

    const monthly =
      monthlyRate === 0
        ? loan / months
        : (loan * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

    const purchaseCosts = price * PURCHASE_COST_RATE;

    return {
      deposit,
      loan,
      monthly: Number.isFinite(monthly) ? monthly : 0,
      purchaseCosts,
      upfront: deposit + purchaseCosts,
    };
  }, [depositPct, price, rate, termYears]);

  return (
    <article className="detail-copy-card mortgage-card">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2>{copy.title}</h2>

      <div className="mortgage-inputs">
        <label>
          {copy.deposit} (%)
          <input
            max={100}
            min={0}
            onChange={(event) => setDepositPct(Number(event.target.value))}
            onWheel={blurOnWheel}
            type="number"
            value={depositPct}
          />
        </label>
        <label>
          {copy.interest} (%)
          <input
            max={25}
            min={0}
            onChange={(event) => setRate(Number(event.target.value))}
            onWheel={blurOnWheel}
            step={0.1}
            type="number"
            value={rate}
          />
        </label>
        <label>
          {copy.term} ({copy.termUnit})
          <input
            max={40}
            min={1}
            onChange={(event) => setTermYears(Number(event.target.value))}
            onWheel={blurOnWheel}
            type="number"
            value={termYears}
          />
        </label>
      </div>

      <div className="mortgage-monthly">
        <span>{copy.monthly}</span>
        <strong>{formatPrice(Math.round(result.monthly))}</strong>
      </div>

      <dl className="mortgage-breakdown">
        <div>
          <dt>{copy.loanAmount}</dt>
          <dd>{formatPrice(Math.round(result.loan))}</dd>
        </div>
        <div>
          <dt>{copy.purchaseCosts}</dt>
          <dd>{formatPrice(Math.round(result.purchaseCosts))}</dd>
        </div>
        <div>
          <dt>{copy.upfront}</dt>
          <dd>{formatPrice(Math.round(result.upfront))}</dd>
        </div>
      </dl>

      <p className="detail-location-note">{copy.note}</p>
    </article>
  );
}
