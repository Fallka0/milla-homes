import type { PublicLocale } from "@/lib/public-copy";

export type TourBookingCopy = {
  date: string;
  email: string;
  error: string;
  eyebrow: string;
  fullName: string;
  intro: string;
  notes: string;
  notesPlaceholder: string;
  phone: string;
  rateLimited: string;
  submit: string;
  submitting: string;
  success: string;
  time: string;
  timePlaceholder: string;
  title: string;
};

export const tourBookingCopy: Record<PublicLocale, TourBookingCopy> = {
  en: {
    date: "Preferred date",
    email: "Email",
    error: "Something went wrong. Please check the form and try again.",
    eyebrow: "Visit this property",
    fullName: "Full name",
    intro: "Pick a date that suits you and we will confirm your tour by email.",
    notes: "Anything we should know?",
    notesPlaceholder: "Optional message",
    phone: "Phone",
    rateLimited: "Too many requests. Please try again in a few minutes.",
    submit: "Request a tour",
    submitting: "Sending…",
    success: "Thank you! We received your tour request and will confirm it by email shortly.",
    time: "Preferred time",
    timePlaceholder: "e.g. 10:00 or afternoon",
    title: "Book a tour",
  },
  es: {
    date: "Fecha preferida",
    email: "Email",
    error: "Algo salió mal. Revisa el formulario e inténtalo de nuevo.",
    eyebrow: "Visita esta propiedad",
    fullName: "Nombre completo",
    intro: "Elige la fecha que te convenga y confirmaremos tu visita por email.",
    notes: "¿Algo que debamos saber?",
    notesPlaceholder: "Mensaje opcional",
    phone: "Teléfono",
    rateLimited: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.",
    submit: "Solicitar visita",
    submitting: "Enviando…",
    success: "¡Gracias! Hemos recibido tu solicitud de visita y la confirmaremos por email en breve.",
    time: "Hora preferida",
    timePlaceholder: "p. ej. 10:00 o por la tarde",
    title: "Reserva una visita",
  },
  ru: {
    date: "Предпочтительная дата",
    email: "Email",
    error: "Что-то пошло не так. Проверьте форму и попробуйте ещё раз.",
    eyebrow: "Посетите этот объект",
    fullName: "Полное имя",
    intro: "Выберите удобную дату, и мы подтвердим ваш визит по email.",
    notes: "Что нам стоит знать?",
    notesPlaceholder: "Сообщение (необязательно)",
    phone: "Телефон",
    rateLimited: "Слишком много запросов. Попробуйте снова через несколько минут.",
    submit: "Записаться на просмотр",
    submitting: "Отправка…",
    success: "Спасибо! Мы получили вашу заявку на просмотр и вскоре подтвердим её по email.",
    time: "Предпочтительное время",
    timePlaceholder: "например, 10:00 или после обеда",
    title: "Записаться на просмотр",
  },
  de: {
    date: "Wunschtermin",
    email: "E-Mail",
    error: "Etwas ist schiefgelaufen. Bitte prüfen Sie das Formular und versuchen Sie es erneut.",
    eyebrow: "Diese Immobilie besichtigen",
    fullName: "Vollständiger Name",
    intro: "Wählen Sie ein passendes Datum und wir bestätigen Ihre Besichtigung per E-Mail.",
    notes: "Gibt es etwas, das wir wissen sollten?",
    notesPlaceholder: "Optionale Nachricht",
    phone: "Telefon",
    rateLimited: "Zu viele Anfragen. Bitte versuchen Sie es in ein paar Minuten erneut.",
    submit: "Besichtigung anfragen",
    submitting: "Wird gesendet…",
    success: "Vielen Dank! Wir haben Ihre Anfrage erhalten und bestätigen sie in Kürze per E-Mail.",
    time: "Wunschzeit",
    timePlaceholder: "z. B. 10:00 oder nachmittags",
    title: "Besichtigung buchen",
  },
};

export type AdminBookingCopy = {
  calendar: {
    allProperties: string;
    eyebrow: string;
    nextMonth: string;
    prevMonth: string;
    title: string;
    weekdays: string[];
  };
  form: {
    clientEmail: string;
    clientName: string;
    clientPhone: string;
    endDate: string;
    eyebrow: string;
    notes: string;
    optional: string;
    property: string;
    selectProperty: string;
    startDate: string;
    submit: string;
    submitting: string;
    title: string;
    tourDate: string;
    tourTime: string;
    type: string;
  };
  list: {
    created: string;
    empty: string;
    eyebrow: string;
    pastToggle: string;
    title: string;
  };
  navLabel: string;
  pageEyebrow: string;
  pageTitle: string;
  pending: {
    confirm: string;
    decline: string;
    empty: string;
    eyebrow: string;
    title: string;
  };
  picker: {
    change: string;
    choose: string;
    close: string;
    empty: string;
    searchPlaceholder: string;
    title: string;
  };
  actions: {
    cancel: string;
    confirm: string;
    decline: string;
    delete: string;
    deleteConfirm: string;
  };
  errors: {
    generic: string;
    invalidDates: string;
    missingFields: string;
    overlap: string;
  };
  statusLabels: Record<string, string>;
  typeLabels: Record<string, string>;
};

export function getAdminBookingCopy(locale: PublicLocale): AdminBookingCopy {
  return locale === "es" || locale === "ru" ? adminBookingCopy[locale] : adminBookingCopy.en;
}

export const adminBookingCopy: Record<"en" | "es" | "ru", AdminBookingCopy> = {
  en: {
    calendar: {
      allProperties: "All properties",
      eyebrow: "Calendar",
      nextMonth: "Next month",
      prevMonth: "Previous month",
      title: "Bookings and tours",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    form: {
      clientEmail: "Client email",
      clientName: "Client name",
      clientPhone: "Client phone",
      endDate: "Check-out",
      eyebrow: "New entry",
      notes: "Notes",
      optional: "Optional",
      property: "Property",
      selectProperty: "Select a property",
      startDate: "Check-in",
      submit: "Add booking",
      submitting: "Saving…",
      title: "Create a booking or tour",
      tourDate: "Tour date",
      tourTime: "Tour time",
      type: "Type",
    },
    list: {
      created: "Requested",
      empty: "No upcoming bookings or tours yet.",
      eyebrow: "Agenda",
      pastToggle: "Show past entries",
      title: "Upcoming",
    },
    navLabel: "Bookings",
    pageEyebrow: "Bookings",
    pageTitle: "Booking calendar",
    pending: {
      confirm: "Confirm",
      decline: "Decline",
      empty: "No pending tour requests.",
      eyebrow: "Needs attention",
      title: "Tour requests",
    },
    picker: {
      change: "Change property",
      choose: "Choose a property",
      close: "Close",
      empty: "No properties match your search.",
      searchPlaceholder: "Search by name, reference or location…",
      title: "Choose a property",
    },
    actions: {
      cancel: "Cancel booking",
      confirm: "Confirm",
      decline: "Decline",
      delete: "Delete",
      deleteConfirm: "Delete this entry permanently?",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      invalidDates: "Please check the dates: check-out must be after check-in.",
      missingFields: "Please fill in the property, dates and client name.",
      overlap: "This property already has a confirmed rental booking overlapping those dates.",
    },
    statusLabels: {
      cancelled: "Cancelled",
      confirmed: "Confirmed",
      declined: "Declined",
      pending: "Pending",
    },
    typeLabels: {
      rent: "Rental",
      tour: "Tour",
    },
  },
  es: {
    calendar: {
      allProperties: "Todas las propiedades",
      eyebrow: "Calendario",
      nextMonth: "Mes siguiente",
      prevMonth: "Mes anterior",
      title: "Reservas y visitas",
      weekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    },
    form: {
      clientEmail: "Email del cliente",
      clientName: "Nombre del cliente",
      clientPhone: "Teléfono del cliente",
      endDate: "Salida",
      eyebrow: "Nueva entrada",
      notes: "Notas",
      optional: "Opcional",
      property: "Propiedad",
      selectProperty: "Selecciona una propiedad",
      startDate: "Entrada",
      submit: "Añadir reserva",
      submitting: "Guardando…",
      title: "Crear reserva o visita",
      tourDate: "Fecha de la visita",
      tourTime: "Hora de la visita",
      type: "Tipo",
    },
    list: {
      created: "Solicitada",
      empty: "Aún no hay reservas ni visitas próximas.",
      eyebrow: "Agenda",
      pastToggle: "Mostrar entradas pasadas",
      title: "Próximas",
    },
    navLabel: "Reservas",
    pageEyebrow: "Reservas",
    pageTitle: "Calendario de reservas",
    pending: {
      confirm: "Confirmar",
      decline: "Rechazar",
      empty: "No hay solicitudes de visita pendientes.",
      eyebrow: "Requiere atención",
      title: "Solicitudes de visita",
    },
    picker: {
      change: "Cambiar propiedad",
      choose: "Elegir propiedad",
      close: "Cerrar",
      empty: "Ninguna propiedad coincide con tu búsqueda.",
      searchPlaceholder: "Buscar por nombre, referencia o zona…",
      title: "Elige una propiedad",
    },
    actions: {
      cancel: "Cancelar reserva",
      confirm: "Confirmar",
      decline: "Rechazar",
      delete: "Eliminar",
      deleteConfirm: "¿Eliminar esta entrada de forma permanente?",
    },
    errors: {
      generic: "Algo salió mal. Inténtalo de nuevo.",
      invalidDates: "Revisa las fechas: la salida debe ser posterior a la entrada.",
      missingFields: "Completa la propiedad, las fechas y el nombre del cliente.",
      overlap: "Esta propiedad ya tiene una reserva de alquiler confirmada en esas fechas.",
    },
    statusLabels: {
      cancelled: "Cancelada",
      confirmed: "Confirmada",
      declined: "Rechazada",
      pending: "Pendiente",
    },
    typeLabels: {
      rent: "Alquiler",
      tour: "Visita",
    },
  },
  ru: {
    calendar: {
      allProperties: "Все объекты",
      eyebrow: "Календарь",
      nextMonth: "Следующий месяц",
      prevMonth: "Предыдущий месяц",
      title: "Брони и просмотры",
      weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    },
    form: {
      clientEmail: "Email клиента",
      clientName: "Имя клиента",
      clientPhone: "Телефон клиента",
      endDate: "Выезд",
      eyebrow: "Новая запись",
      notes: "Заметки",
      optional: "Необязательно",
      property: "Объект",
      selectProperty: "Выберите объект",
      startDate: "Заезд",
      submit: "Добавить бронь",
      submitting: "Сохранение…",
      title: "Создать бронь или просмотр",
      tourDate: "Дата просмотра",
      tourTime: "Время просмотра",
      type: "Тип",
    },
    list: {
      created: "Заявка от",
      empty: "Предстоящих броней и просмотров пока нет.",
      eyebrow: "Расписание",
      pastToggle: "Показать прошедшие",
      title: "Предстоящие",
    },
    navLabel: "Брони",
    pageEyebrow: "Брони",
    pageTitle: "Календарь броней",
    pending: {
      confirm: "Подтвердить",
      decline: "Отклонить",
      empty: "Нет ожидающих заявок на просмотр.",
      eyebrow: "Требует внимания",
      title: "Заявки на просмотр",
    },
    picker: {
      change: "Сменить объект",
      choose: "Выбрать объект",
      close: "Закрыть",
      empty: "По вашему запросу ничего не найдено.",
      searchPlaceholder: "Поиск по названию, референсу или району…",
      title: "Выберите объект",
    },
    actions: {
      cancel: "Отменить бронь",
      confirm: "Подтвердить",
      decline: "Отклонить",
      delete: "Удалить",
      deleteConfirm: "Удалить эту запись навсегда?",
    },
    errors: {
      generic: "Что-то пошло не так. Попробуйте ещё раз.",
      invalidDates: "Проверьте даты: выезд должен быть позже заезда.",
      missingFields: "Заполните объект, даты и имя клиента.",
      overlap: "У этого объекта уже есть подтверждённая аренда на эти даты.",
    },
    statusLabels: {
      cancelled: "Отменена",
      confirmed: "Подтверждена",
      declined: "Отклонена",
      pending: "Ожидает",
    },
    typeLabels: {
      rent: "Аренда",
      tour: "Просмотр",
    },
  },
};
