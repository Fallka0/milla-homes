"use client";

import { useEffect, useRef, useState } from "react";

import { ContratoSheet } from "./contrato-sheet";
import { parseAmountToCents } from "@/lib/facturas";
import {
  CONTRATO_DRAFT_STORAGE_KEY,
  CONTRATO_EXTRA_LOCALES,
  CONTRATO_PRINT_STORAGE_KEY,
  CONTRATO_TYPES,
  blankContrato,
  type Contrato,
  type ContratoDocLocale,
  type ContratoExtraLocale,
  type ContratoParty,
  type ContratoType,
} from "@/lib/contratos";

// UI language of the tool itself (follows the admin locale switcher). The
// printed document language is chosen separately via the version checkboxes.
export type ContratoToolLocale = "es" | "en" | "uk" | "ru";

type ToolCopy = {
  typeCard: string;
  reset: string;
  types: Record<ContratoType, { label: string; hint: string }>;
  signPlace: string;
  signDate: string;
  partyRentA: string;
  partyRentB: string;
  partySaleA: string;
  partySaleB: string;
  fullName: string;
  idDoc: string;
  domicile: string;
  propertyCard: string;
  propAddress: string;
  propCity: string;
  propRef: string;
  conditionsCard: string;
  rentStart: string;
  rentEnd: string;
  duration: string;
  durationFixed: string;
  monthlyCheck: string;
  rentMonthly: string;
  rentTotal: string;
  deposit: string;
  depositHintLong: string;
  iban: string;
  utilities: string;
  price: string;
  signalArras: string;
  signalReserva: string;
  deadlineArras: string;
  deadlineReserva: string;
  agencyHeld: string;
  badAmount: string;
  extraCard: string;
  extraPlaceholder: string;
  langsCard: string;
  langsHint: string;
  langNames: Record<ContratoExtraLocale, string>;
  previewLang: string;
  exportPdf: string;
};

const TOOL_COPY: Record<ContratoToolLocale, ToolCopy> = {
  es: {
    typeCard: "Tipo de contrato",
    reset: "Vaciar formulario",
    types: {
      "short-rent": {
        label: "Alquiler de temporada",
        hint: "Corta estancia, fechas cerradas, sin prórroga (art. 3 LAU)",
      },
      "long-rent": {
        label: "Alquiler de vivienda",
        hint: "Residencia habitual, 1 año prorrogable hasta 5 (LAU)",
      },
      reservation: {
        label: "Reserva",
        hint: "Señal para retirar el inmueble del mercado",
      },
      arras: {
        label: "Arras penitenciales",
        hint: "Compraventa, art. 1454 CC: comprador pierde / vendedor duplica",
      },
    },
    signPlace: "Lugar de firma",
    signDate: "Fecha de firma",
    partyRentA: "Arrendador (propietario)",
    partyRentB: "Arrendatario (inquilino)",
    partySaleA: "Vendedor (propietario)",
    partySaleB: "Comprador",
    fullName: "Nombre completo",
    idDoc: "DNI/NIE/Pasaporte",
    domicile: "Domicilio",
    propertyCard: "Inmueble",
    propAddress: "Dirección",
    propCity: "Ciudad",
    propRef: "Ref. catastral (opcional)",
    conditionsCard: "Condiciones",
    rentStart: "Inicio del alquiler",
    rentEnd: "Fin del alquiler",
    duration: "Duración",
    durationFixed: "1 año, prorrogable hasta 5 (LAU)",
    monthlyCheck: "La renta es mensual (en lugar de un importe total por la temporada)",
    rentMonthly: "Renta mensual (€)",
    rentTotal: "Renta total temporada (€)",
    deposit: "Fianza (€)",
    depositHintLong: "1 mensualidad",
    iban: "IBAN para el pago de la renta",
    utilities: "Suministros (agua, luz, internet) incluidos en la renta",
    price: "Precio de compraventa (€)",
    signalArras: "Importe de las arras (€)",
    signalReserva: "Importe de la reserva (€)",
    deadlineArras: "Fecha límite para la escritura pública",
    deadlineReserva: "Fecha límite para arras / escritura",
    agencyHeld: "La reserva queda depositada en Milla Homes (si no, la recibe el vendedor)",
    badAmount: "Hay un importe que no se entiende. Usa formato 2.500,00.",
    extraCard: "Otras estipulaciones (opcional)",
    extraPlaceholder:
      "Una cláusula por línea, p. ej.:\nSe permite la estancia de una mascota de pequeño tamaño.\nEl inmueble se entrega amueblado según inventario anexo.",
    langsCard: "Versiones adicionales",
    langsHint:
      "El contrato español es el que se firma; las versiones marcadas se imprimen a continuación como traducción de cortesía.",
    langNames: { en: "Inglés", uk: "Ucraniano", ru: "Ruso", de: "Alemán" },
    previewLang: "Idioma de la vista previa",
    exportPdf: "Exportar PDF",
  },
  en: {
    typeCard: "Contract type",
    reset: "Clear form",
    types: {
      "short-rent": {
        label: "Seasonal rental",
        hint: "Short stay, fixed dates, no extension (Art. 3 LAU)",
      },
      "long-rent": {
        label: "Residential rental",
        hint: "Habitual residence, 1 year extendable to 5 (LAU)",
      },
      reservation: {
        label: "Reservation",
        hint: "Deposit to take the property off the market",
      },
      arras: {
        label: "Earnest money (arras)",
        hint: "Sale, Art. 1454 CC: buyer forfeits / seller returns double",
      },
    },
    signPlace: "Place of signing",
    signDate: "Date of signing",
    partyRentA: "Landlord (owner)",
    partyRentB: "Tenant",
    partySaleA: "Seller (owner)",
    partySaleB: "Buyer",
    fullName: "Full name",
    idDoc: "ID/NIE/Passport",
    domicile: "Address",
    propertyCard: "Property",
    propAddress: "Address",
    propCity: "City",
    propRef: "Cadastral ref. (optional)",
    conditionsCard: "Terms",
    rentStart: "Rental start",
    rentEnd: "Rental end",
    duration: "Duration",
    durationFixed: "1 year, extendable to 5 (LAU)",
    monthlyCheck: "Rent is monthly (instead of a total amount for the season)",
    rentMonthly: "Monthly rent (€)",
    rentTotal: "Total rent for the season (€)",
    deposit: "Deposit (€)",
    depositHintLong: "1 month's rent",
    iban: "IBAN for rent payments",
    utilities: "Utilities (water, electricity, internet) included in the rent",
    price: "Sale price (€)",
    signalArras: "Earnest money amount (€)",
    signalReserva: "Reservation amount (€)",
    deadlineArras: "Deadline for the public deed",
    deadlineReserva: "Deadline for arras / deed",
    agencyHeld: "The reservation is held by Milla Homes (otherwise the seller receives it)",
    badAmount: "One of the amounts can't be read. Use the format 2.500,00.",
    extraCard: "Other provisions (optional)",
    extraPlaceholder:
      "One clause per line, e.g.:\nA small pet is allowed.\nThe property is delivered furnished as per the attached inventory.",
    langsCard: "Additional versions",
    langsHint:
      "The Spanish contract is the one being signed; checked versions are printed after it as a courtesy translation.",
    langNames: { en: "English", uk: "Ukrainian", ru: "Russian", de: "German" },
    previewLang: "Preview language",
    exportPdf: "Export PDF",
  },
  ru: {
    typeCard: "Тип договора",
    reset: "Очистить форму",
    types: {
      "short-rent": {
        label: "Сезонная аренда",
        hint: "Короткий срок, фиксированные даты, без продления (ст. 3 LAU)",
      },
      "long-rent": {
        label: "Долгосрочная аренда",
        hint: "Постоянное проживание, 1 год с продлением до 5 лет (LAU)",
      },
      reservation: {
        label: "Резервирование",
        hint: "Платеж, чтобы снять объект с продажи",
      },
      arras: {
        label: "Задаток (arras)",
        hint: "Купля-продажа, ст. 1454 ГК: покупатель теряет / продавец возвращает вдвойне",
      },
    },
    signPlace: "Место подписания",
    signDate: "Дата подписания",
    partyRentA: "Арендодатель (собственник)",
    partyRentB: "Арендатор",
    partySaleA: "Продавец (собственник)",
    partySaleB: "Покупатель",
    fullName: "Полное имя",
    idDoc: "DNI/NIE/Паспорт",
    domicile: "Адрес",
    propertyCard: "Объект",
    propAddress: "Адрес",
    propCity: "Город",
    propRef: "Кадастровый номер (необязательно)",
    conditionsCard: "Условия",
    rentStart: "Начало аренды",
    rentEnd: "Конец аренды",
    duration: "Срок",
    durationFixed: "1 год, с продлением до 5 лет (LAU)",
    monthlyCheck: "Плата помесячная (вместо общей суммы за сезон)",
    rentMonthly: "Месячная плата (€)",
    rentTotal: "Плата за весь сезон (€)",
    deposit: "Залог (€)",
    depositHintLong: "1 месячная плата",
    iban: "IBAN для оплаты аренды",
    utilities: "Коммунальные услуги (вода, свет, интернет) включены в плату",
    price: "Цена купли-продажи (€)",
    signalArras: "Сумма задатка (€)",
    signalReserva: "Сумма резервирования (€)",
    deadlineArras: "Крайний срок нотариального акта",
    deadlineReserva: "Крайний срок задатка / акта",
    agencyHeld: "Резервирование хранится у Milla Homes (иначе получает продавец)",
    badAmount: "Одна из сумм не распознана. Используйте формат 2.500,00.",
    extraCard: "Прочие условия (необязательно)",
    extraPlaceholder:
      "Одно условие на строку, напр.:\nРазрешено проживание небольшого домашнего животного.\nОбъект передается с мебелью согласно приложенной описи.",
    langsCard: "Дополнительные версии",
    langsHint:
      "Подписывается испанский договор; отмеченные версии печатаются после него как перевод для удобства.",
    langNames: { en: "Английский", uk: "Украинский", ru: "Русский", de: "Немецкий" },
    previewLang: "Язык предпросмотра",
    exportPdf: "Экспорт PDF",
  },
  uk: {
    typeCard: "Тип договору",
    reset: "Очистити форму",
    types: {
      "short-rent": {
        label: "Сезонна оренда",
        hint: "Короткий строк, фіксовані дати, без продовження (ст. 3 LAU)",
      },
      "long-rent": {
        label: "Довгострокова оренда",
        hint: "Постійне проживання, 1 рік із продовженням до 5 років (LAU)",
      },
      reservation: {
        label: "Резервування",
        hint: "Платіж, щоб зняти об'єкт з продажу",
      },
      arras: {
        label: "Завдаток (arras)",
        hint: "Купівля-продаж, ст. 1454 ЦК: покупець втрачає / продавець повертає вдвічі",
      },
    },
    signPlace: "Місце підписання",
    signDate: "Дата підписання",
    partyRentA: "Орендодавець (власник)",
    partyRentB: "Орендар",
    partySaleA: "Продавець (власник)",
    partySaleB: "Покупець",
    fullName: "Повне ім'я",
    idDoc: "DNI/NIE/Паспорт",
    domicile: "Адреса",
    propertyCard: "Об'єкт",
    propAddress: "Адреса",
    propCity: "Місто",
    propRef: "Кадастровий номер (необов'язково)",
    conditionsCard: "Умови",
    rentStart: "Початок оренди",
    rentEnd: "Кінець оренди",
    duration: "Строк",
    durationFixed: "1 рік, із продовженням до 5 років (LAU)",
    monthlyCheck: "Плата помісячна (замість загальної суми за сезон)",
    rentMonthly: "Місячна плата (€)",
    rentTotal: "Плата за весь сезон (€)",
    deposit: "Застава (€)",
    depositHintLong: "1 місячна плата",
    iban: "IBAN для оплати оренди",
    utilities: "Комунальні послуги (вода, світло, інтернет) включені в плату",
    price: "Ціна купівлі-продажу (€)",
    signalArras: "Сума завдатку (€)",
    signalReserva: "Сума резервування (€)",
    deadlineArras: "Крайній строк нотаріального акта",
    deadlineReserva: "Крайній строк завдатку / акта",
    agencyHeld: "Резервування зберігається в Milla Homes (інакше отримує продавець)",
    badAmount: "Одну із сум не розпізнано. Використовуйте формат 2.500,00.",
    extraCard: "Інші умови (необов'язково)",
    extraPlaceholder:
      "Одна умова на рядок, напр.:\nДозволено проживання невеликої домашньої тварини.\nОб'єкт передається з меблями згідно з доданим описом.",
    langsCard: "Додаткові версії",
    langsHint:
      "Підписується іспанський договір; позначені версії друкуються після нього як переклад для зручності.",
    langNames: { en: "Англійська", uk: "Українська", ru: "Російська", de: "Німецька" },
    previewLang: "Мова попереднього перегляду",
    exportPdf: "Експорт PDF",
  },
};

// ---- scaled on-screen A4 preview (same approach as the facturas tool, but
// the contract grows with its text, so the natural height is observed too) ---
function ContratoPreview({ contrato, locale }: { contrato: Contrato; locale: ContratoDocLocale }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [sheetHeight, setSheetHeight] = useState(1123);

  useEffect(() => {
    const wrap = wrapRef.current;
    const sheet = sheetRef.current;
    if (!wrap || !sheet) return;
    const update = () => {
      setScale(wrap.clientWidth / 794);
      setSheetHeight(sheet.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(sheet);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="fac-preview-frame" style={{ height: sheetHeight * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 794 }}>
        <div ref={sheetRef}>
          <ContratoSheet contrato={contrato} locale={locale} />
        </div>
      </div>
    </div>
  );
}

export function ContratosTool({ locale = "es" }: { locale?: ContratoToolLocale }) {
  const copy = TOOL_COPY[locale];
  const [contrato, setContrato] = useState<Contrato>(() => blankContrato());
  const [previewLocale, setPreviewLocale] = useState<ContratoDocLocale>("es");

  // Restore the last draft so a reload doesn't lose the contract in progress.
  // localStorage isn't available during SSR, so this can't be a lazy initializer.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTRATO_DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Contrato;
      if (draft && CONTRATO_TYPES.some((option) => option.value === draft.type)) {
        // Spread over a blank so drafts saved before newer fields still work.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setContrato({ ...blankContrato(draft.type), ...draft });
      }
    } catch {
      // Corrupt draft: start blank.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CONTRATO_DRAFT_STORAGE_KEY, JSON.stringify(contrato));
    } catch {
      // Storage full/unavailable: the tool still works, just without drafts.
    }
  }, [contrato]);

  function setField<K extends keyof Contrato>(key: K, value: Contrato[K]) {
    setContrato((current) => ({ ...current, [key]: value }));
  }

  const setParty = (key: "partyA" | "partyB", patch: Partial<ContratoParty>) =>
    setContrato((current) => ({ ...current, [key]: { ...current[key], ...patch } }));

  const toggleLanguage = (lang: ContratoExtraLocale) =>
    setContrato((current) => ({
      ...current,
      extraLanguages: current.extraLanguages.includes(lang)
        ? current.extraLanguages.filter((item) => item !== lang)
        : [...current.extraLanguages, lang],
    }));

  const resetForm = () => setContrato(blankContrato(contrato.type));

  const exportPdf = () => {
    localStorage.setItem(CONTRATO_PRINT_STORAGE_KEY, JSON.stringify({ contrato }));
    window.open("/admin/contratos/print", "_blank");
  };

  const isRent = contrato.type === "short-rent" || contrato.type === "long-rent";

  const moneyFields = isRent
    ? [contrato.rentAmount, contrato.deposit]
    : [contrato.price, contrato.signalAmount];
  const hasBadAmount = moneyFields.some(
    (raw) => raw.trim() !== "" && parseAmountToCents(raw) === null,
  );

  const previewLocales: ContratoDocLocale[] = ["es", ...contrato.extraLanguages];
  const activePreviewLocale = previewLocales.includes(previewLocale) ? previewLocale : "es";

  const partyFields = (key: "partyA" | "partyB", label: string) => (
    <div className="fac-card">
      <h3 className="fac-card-title">{label}</h3>
      <div className="fac-grid-2">
        <div className="fac-field">
          <label htmlFor={`con-${key}-name`}>{copy.fullName}</label>
          <input
            id={`con-${key}-name`}
            value={contrato[key].name}
            onChange={(event) => setParty(key, { name: event.target.value })}
          />
        </div>
        <div className="fac-field">
          <label htmlFor={`con-${key}-nif`}>{copy.idDoc}</label>
          <input
            id={`con-${key}-nif`}
            value={contrato[key].nif}
            onChange={(event) => setParty(key, { nif: event.target.value })}
            placeholder="X6333357H"
          />
        </div>
      </div>
      <div className="fac-field">
        <label htmlFor={`con-${key}-address`}>{copy.domicile}</label>
        <input
          id={`con-${key}-address`}
          value={contrato[key].address}
          onChange={(event) => setParty(key, { address: event.target.value })}
          placeholder="C/ Concordia 116, 2 B, 03182 Torrevieja (Alicante)"
        />
      </div>
    </div>
  );

  return (
    <div className="fac-tool">
      <div className="fac-controls">
        {/* Contract type + place/date of signing */}
        <div className="fac-card">
          <div className="fac-card-head">
            <h3 className="fac-card-title">{copy.typeCard}</h3>
            <button type="button" className="fac-link" onClick={resetForm}>
              {copy.reset}
            </button>
          </div>
          <div className="con-type-grid" role="radiogroup" aria-label={copy.typeCard}>
            {CONTRATO_TYPES.map((option) => (
              <label
                key={option.value}
                className={`con-type-option${contrato.type === option.value ? " is-active" : ""}`}
              >
                <input
                  type="radio"
                  name="con-type"
                  value={option.value}
                  checked={contrato.type === option.value}
                  onChange={() => setField("type", option.value as ContratoType)}
                />
                <span className="con-type-label">{copy.types[option.value].label}</span>
                <span className="con-type-hint">{copy.types[option.value].hint}</span>
              </label>
            ))}
          </div>
          <div className="fac-grid-2">
            <div className="fac-field">
              <label htmlFor="con-city">{copy.signPlace}</label>
              <input
                id="con-city"
                value={contrato.city}
                onChange={(event) => setField("city", event.target.value)}
                placeholder="Orihuela Costa (Alicante)"
              />
            </div>
            <div className="fac-field">
              <label htmlFor="con-date">{copy.signDate}</label>
              <input
                id="con-date"
                type="date"
                value={contrato.date}
                onChange={(event) => setField("date", event.target.value)}
              />
            </div>
          </div>
        </div>

        {partyFields("partyA", isRent ? copy.partyRentA : copy.partySaleA)}
        {partyFields("partyB", isRent ? copy.partyRentB : copy.partySaleB)}

        {/* Property */}
        <div className="fac-card">
          <h3 className="fac-card-title">{copy.propertyCard}</h3>
          <div className="fac-field">
            <label htmlFor="con-prop-address">{copy.propAddress}</label>
            <input
              id="con-prop-address"
              value={contrato.propertyAddress}
              onChange={(event) => setField("propertyAddress", event.target.value)}
              placeholder="Calle Osa Mayor 13, bajo A"
            />
          </div>
          <div className="fac-grid-2">
            <div className="fac-field">
              <label htmlFor="con-prop-city">{copy.propCity}</label>
              <input
                id="con-prop-city"
                value={contrato.propertyCity}
                onChange={(event) => setField("propertyCity", event.target.value)}
                placeholder="03189 Orihuela Costa (Alicante)"
              />
            </div>
            <div className="fac-field">
              <label htmlFor="con-prop-ref">{copy.propRef}</label>
              <input
                id="con-prop-ref"
                value={contrato.propertyRef}
                onChange={(event) => setField("propertyRef", event.target.value)}
                placeholder="9872023VH5797S0001WX"
              />
            </div>
          </div>
        </div>

        {/* Economic terms, per type */}
        <div className="fac-card">
          <h3 className="fac-card-title">{copy.conditionsCard}</h3>

          {isRent ? (
            <>
              <div className="fac-grid-2">
                <div className="fac-field">
                  <label htmlFor="con-start">{copy.rentStart}</label>
                  <input
                    id="con-start"
                    type="date"
                    value={contrato.startDate}
                    onChange={(event) => setField("startDate", event.target.value)}
                  />
                </div>
                {contrato.type === "short-rent" ? (
                  <div className="fac-field">
                    <label htmlFor="con-end">{copy.rentEnd}</label>
                    <input
                      id="con-end"
                      type="date"
                      value={contrato.endDate}
                      onChange={(event) => setField("endDate", event.target.value)}
                    />
                  </div>
                ) : (
                  <div className="fac-field">
                    <label>{copy.duration}</label>
                    <input value={copy.durationFixed} disabled />
                  </div>
                )}
              </div>

              {contrato.type === "short-rent" ? (
                <label className="fac-check">
                  <input
                    type="checkbox"
                    checked={contrato.rentIsMonthly}
                    onChange={(event) => setField("rentIsMonthly", event.target.checked)}
                  />
                  <span>{copy.monthlyCheck}</span>
                </label>
              ) : null}

              <div className="fac-grid-2">
                <div className="fac-field">
                  <label htmlFor="con-rent">
                    {contrato.type === "long-rent" || contrato.rentIsMonthly
                      ? copy.rentMonthly
                      : copy.rentTotal}
                  </label>
                  <input
                    id="con-rent"
                    inputMode="decimal"
                    value={contrato.rentAmount}
                    onChange={(event) => setField("rentAmount", event.target.value)}
                    placeholder="1.200,00"
                  />
                </div>
                <div className="fac-field">
                  <label htmlFor="con-deposit">{copy.deposit}</label>
                  <input
                    id="con-deposit"
                    inputMode="decimal"
                    value={contrato.deposit}
                    onChange={(event) => setField("deposit", event.target.value)}
                    placeholder={contrato.type === "long-rent" ? copy.depositHintLong : "1.200,00"}
                  />
                </div>
              </div>

              <div className="fac-field">
                <label htmlFor="con-iban">{copy.iban}</label>
                <input
                  id="con-iban"
                  value={contrato.iban}
                  onChange={(event) => setField("iban", event.target.value)}
                  placeholder="ES00 0000 0000 0000 0000 0000"
                />
              </div>

              {contrato.type === "short-rent" ? (
                <label className="fac-check">
                  <input
                    type="checkbox"
                    checked={contrato.utilitiesIncluded}
                    onChange={(event) => setField("utilitiesIncluded", event.target.checked)}
                  />
                  <span>{copy.utilities}</span>
                </label>
              ) : null}
            </>
          ) : (
            <>
              <div className="fac-grid-2">
                <div className="fac-field">
                  <label htmlFor="con-price">{copy.price}</label>
                  <input
                    id="con-price"
                    inputMode="decimal"
                    value={contrato.price}
                    onChange={(event) => setField("price", event.target.value)}
                    placeholder="185.000,00"
                  />
                </div>
                <div className="fac-field">
                  <label htmlFor="con-signal">
                    {contrato.type === "arras" ? copy.signalArras : copy.signalReserva}
                  </label>
                  <input
                    id="con-signal"
                    inputMode="decimal"
                    value={contrato.signalAmount}
                    onChange={(event) => setField("signalAmount", event.target.value)}
                    placeholder={contrato.type === "arras" ? "18.500,00" : "3.000,00"}
                  />
                </div>
              </div>
              <div className="fac-field">
                <label htmlFor="con-deadline">
                  {contrato.type === "arras" ? copy.deadlineArras : copy.deadlineReserva}
                </label>
                <input
                  id="con-deadline"
                  type="date"
                  value={contrato.deadlineDate}
                  onChange={(event) => setField("deadlineDate", event.target.value)}
                />
              </div>
              {contrato.type === "reservation" ? (
                <label className="fac-check">
                  <input
                    type="checkbox"
                    checked={contrato.depositHeldByAgency}
                    onChange={(event) => setField("depositHeldByAgency", event.target.checked)}
                  />
                  <span>{copy.agencyHeld}</span>
                </label>
              ) : null}
            </>
          )}

          {hasBadAmount ? <p className="fac-error">{copy.badAmount}</p> : null}
        </div>

        {/* Extra printed versions in other languages */}
        <div className="fac-card">
          <h3 className="fac-card-title">{copy.langsCard}</h3>
          <p className="con-langs-hint">{copy.langsHint}</p>
          <div className="con-langs-row">
            {CONTRATO_EXTRA_LOCALES.map((lang) => (
              <label className="fac-check" key={lang}>
                <input
                  type="checkbox"
                  checked={contrato.extraLanguages.includes(lang)}
                  onChange={() => toggleLanguage(lang)}
                />
                <span>{copy.langNames[lang]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Extra clauses */}
        <div className="fac-card">
          <h3 className="fac-card-title">{copy.extraCard}</h3>
          <div className="fac-field">
            <textarea
              rows={4}
              aria-label={copy.extraCard}
              value={contrato.extraClauses}
              onChange={(event) => setField("extraClauses", event.target.value)}
              placeholder={copy.extraPlaceholder}
            />
          </div>
        </div>
      </div>

      {/* Preview + export */}
      <div className="fac-preview">
        <div className="fac-preview-sticky">
          <div className="fac-preview-actions">
            {previewLocales.length > 1 ? (
              <div className="con-preview-langs" role="tablist" aria-label={copy.previewLang}>
                {previewLocales.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`con-preview-lang${activePreviewLocale === lang ? " is-active" : ""}`}
                    onClick={() => setPreviewLocale(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            ) : null}
            <button type="button" className="fac-button fac-button-primary" onClick={exportPdf}>
              {copy.exportPdf}
            </button>
          </div>
          <ContratoPreview contrato={contrato} locale={activePreviewLocale} />
        </div>
      </div>
    </div>
  );
}
