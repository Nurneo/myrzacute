export type Lang = 'en' | 'ru';

export const translations = {
  // ── Loading ──────────────────────────────────────────────
  loading: {
    tagline: {
      en: 'Made especially for you',
      ru: 'Создано специально для тебя',
    },
  },

  // ── Home ─────────────────────────────────────────────────
  home: {
    subtitle: {
      en: 'Welcome back, lioness.',
      ru: 'С возвращением, львица.',
    },
    messageDayLabel: {
      en: 'Message of the day',
      ru: 'Сообщение дня',
    },
    messageFallback: {
      en: 'You are absolutely radiant today!',
      ru: 'Ты сегодня просто великолепна!',
    },
    exploreTitle: {
      en: 'Explore',
      ru: 'Исследовать',
    },
    exploreSubtitle: {
      en: 'What are we feeling today?',
      ru: 'Что мы чувствуем сегодня?',
    },
    moodometer: {
      title: { en: 'Moodometer', ru: 'Настроениеметр' },
      subtitle: { en: 'How is the lioness feeling today?', ru: 'Как себя чувствует львица сегодня?' },
      level1: { en: 'The lioness is feeling like shit', ru: 'Львица чувствует себя дерьмово' },
      level2: { en: 'The lioness is a bit tired', ru: 'Львица немного устала' },
      level3: { en: 'The lioness feels somewhat normal', ru: 'Львица чувствует себя нормально' },
      level4: { en: 'The lioness feels great', ru: 'Львица чувствует себя отлично' },
      level5: { en: 'The lioness is at peak capacity', ru: 'Львица на пике возможностей' },
      selectBtn: { en: 'Confirm Mood', ru: 'Подтвердить настроение' },
      closeBtn: { en: 'Close', ru: 'Закрыть' },
    },
    features: {
      calendar: {
        title: { en: 'Calendar', ru: 'Календарь' },
        description: { en: 'Our special moments', ru: 'Наши особенные моменты' },
      },
      pickupLines: {
        title: { en: 'Pick-up Lines', ru: 'Подкаты' },
        description: { en: 'Cringe but fun and cute', ru: 'Лютый кринге но мило и смешно' },
      },
      roasts: {
        title: { en: 'Roast Mode', ru: 'Режим прожарки' },
        description: { en: 'Because I love teasing you)', ru: 'Потому что я люблю тебя дразнить)' },
      },
      settings: {
        title: { en: 'Settings', ru: 'Настройки' },
        description: { en: 'Customize the app', ru: 'Настрой приложение под себя' },
      },
    },
  },

  // ── Calendar ─────────────────────────────────────────────
  calendar: {
    title: { en: 'Our Calendar', ru: 'Наш календарь' },
    subtitle: { en: 'Every day with you is a gift', ru: 'Каждый день с тобой - подарок' },
    locked: { en: 'Locked', ru: 'Закрыто' },
    unlocked: { en: 'Unlocked', ru: 'Открыто' },
    lockedQuote: {
      en: 'Patience, beautiful. This surprise is waiting for its moment.',
      ru: 'Терпение, красавица. Этот сюрприз ждёт своего момента.',
    },
    freeDay: { en: 'Free Day', ru: 'Свободный день' },
    freeDayNote: {
      en: 'No message for this day yet, but I am still thinking of you.',
      ru: 'На этот день пока нет сообщения, но я всё равно думаю о тебе.',
    },
  },

  // ── Pickup Lines ─────────────────────────────────────────
  pickupLines: {
    title: { en: 'Pick-up Lines', ru: 'Подкаты' },
    subtitle: {
      en: 'Just a reminder of how beautiful you are',
      ru: 'Просто напоминание о том, как ты прекрасна',
    },
    button: { en: 'Get a pick-up line', ru: 'Получить подкат' },
    empty: { en: 'Press the button for a dose of cringe', ru: 'Нажми на кнопку для порции кринжа' },
  },

  // ── Roasts ───────────────────────────────────────────────
  roasts: {
    title: { en: 'Roast Mode', ru: 'Режим прожарки' },
    subtitle: {
      en: "This is purely out of love)",
      ru: 'Та я это любя юноу)',
    },
    warningTitle: { en: 'Warning', ru: 'Внимание' },
    warningBody: {
      en: 'Proceed with caution. This is 100% emotional damage)',
      ru: 'Действуй осторожно. Это булинг 100%',
    },
    button: { en: 'Bully me', ru: 'Я арбузер' },
    empty: { en: 'Ready to get bullied?)', ru: 'Метр с кепкой милого гнева?)' },
  },

  // ── Settings ─────────────────────────────────────────────
  settings: {
    title: { en: 'Settings', ru: 'Настройки' },
    subtitle: { en: 'Make the app yours', ru: 'Сделай приложение своим' },
    appearance: { en: 'Appearance', ru: 'Внешний вид' },
    themeLabel: { en: 'Interface Mode', ru: 'Режим интерфейса' },
    preferences: { en: 'Preferences', ru: 'Предпочтения' },
    englishLabel: { en: 'English', ru: 'English' },
    englishSub: { en: 'Default language', ru: 'Язык по умолчанию' },
    russianLabel: { en: 'Russian', ru: 'Русский' },
    russianSub: { en: 'Russian language', ru: 'Русский язык' },
  },

  // ── NotFound ─────────────────────────────────────────────
  notFound: {
    message: { en: 'Oops! Too short to see this page)', ru: 'Упс, слишком короткая чтобы увидеть)' },
    back: { en: 'Go back home', ru: 'Вернуться на главную' },
  },
} as const;

/** Convenience helper: t(translations.home.subtitle, lang) */
export function t(entry: { en: string; ru: string }, lang: Lang): string {
  return entry[lang];
}
