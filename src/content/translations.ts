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
      en: 'How do you feel?',
      ru: 'Как настроение?',
    },
    feedback: {
      title: { en: 'Feedback', ru: 'Обратная связь' },
      subtitle: { en: 'How is the lioness feeling today?', ru: 'Как себя чувствует львица сегодня?' },
      level1: { en: 'The lioness is feeling like shit', ru: 'Львица чувствует себя дерьмово' },
      level2: { en: 'The lioness is a bit tired', ru: 'Львица немного устала' },
      level3: { en: 'The lioness feels somewhat normal', ru: 'Львица чувствует себя нормально' },
      level4: { en: 'The lioness feels great', ru: 'Львица чувствует себя отлично' },
      level5: { en: 'The lioness is at peak capacity', ru: 'Львица на пике возможностей' },
      selectBtn: { en: 'Send Feedback', ru: 'Отправить отзыв' },
      closeBtn: { en: 'Close', ru: 'Закрыть' },
      messageLabel: { en: 'Write a message to me', ru: 'Напиши мне сообщение' },
      messagePlaceholder: { en: 'Share your thoughts, feelings or write something sweet...', ru: 'Поделись мыслями, чувствами или напиши что-то милое...' },
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
        title: { en: 'Roast Mode', ru: 'Режим булинга' },
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
    notesTitle: { en: "Lioness's Notes", ru: "Заметки львицы" },
    addNoteBtn: { en: "Add Note", ru: "Добавить заметку" },
    editNoteBtn: { en: "Edit", ru: "Изменить" },
    saveNoteBtn: { en: "Save", ru: "Сохранить" },
    cancelBtn: { en: "Cancel", ru: "Отмена" },
    notePlaceholder: { en: "Write your thoughts, feelings or memories about this day...", ru: "Напиши свои мысли, чувства или воспоминания об этом дне..." },
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
    title: { en: 'Roast Mode', ru: 'Режим булинга' },
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
    themeLabel: { en: 'Mode', ru: 'Режим' },
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
  // ── Secret ───────────────────────────────────────────────
  secret: {
    passcodeTitle: { en: 'Enter Passcode', ru: 'Введите код доступа' },
    passcodeSubtitle: { en: 'Only for the lioness 🦁', ru: 'Только для львицы 🦁' },
    wrongPasscode: { en: 'Er, wrong, try again!', ru: 'Э ты чо серьёзно? Давай ещё раз!' },
    letterClosedHint: { en: 'You have a letter. Click to open it.', ru: 'У тебя письмо. Нажми, чтобы открыть.' },
    letterOpenHeader: { en: 'My Love Letter', ru: 'Мое любовное письмо' },
    lettersTitle: { en: 'My Love Letters', ru: 'Мои любовные письма' },
    lettersSubtitle: { en: 'Select a letter to read 💖', ru: 'Выбери письмо для чтения 💖' },
    letterLockedTitle: { en: 'Letter from N. N. N.', ru: 'Письмо от Н. Н. Н.' },
    letter1UnlockedTitle: { en: 'I love you', ru: 'Я люблю тебя' },
    letter2UnlockedTitle: { en: 'I love you SO MUCH', ru: 'Я ОЧЕНЬ сильно люблю тебя' },
    lockLettersBtn: { en: 'Lock letters', ru: 'Заблокировать письма' },
    letter1ClosedHint: { en: 'For her birthday 🎂', ru: 'На её день рождения 🎂' },
    letter2ClosedHint: { en: 'A special day 🌹', ru: 'Особый день 🌹' },
    letter1Question: { en: 'Do YOU 🫵 love me?', ru: 'А ты МЕНЯ 🫵 любишь?' },
    letter2Question: { en: 'Can I be YOURS, and you MINE?', ru: 'Могу я быть ТВОИМ, а ты МОЕЙ?' },
    dateQuestion: { en: 'Will you date me? 🥺👉👈', ru: 'Давай встречаться? 🥺👉👈' },
    letterBody: {
      en: "My dear,\n\nFor years I have walked this Earth thinking that 'Destiny' does not exist. It, in fact, does exist. I was fully convinced in it when I met you.\n\nWhat are the odds that all these tiny coincidences would bring us together? I would go as far as to say that WE are a match made in heaven)\n\nLook, if there is one gift I could give you, then I would give you the ability to see yourself from my eyes. So that you could see how truly gorgeous you are. So that you could see the full extent of your own beauty. I can never give you this gift fully, but I hope, some day, I will make you understand how much I adore you. Maybe through my words, or maybe through my actions. But one day, I will make you understand just how much I love you.\n\nMyrzagul, I love you.",
      ru: "Моя дорогая львица,\n\nТо, что мы вместе - чудо. Каковы шансы того что мы вместе сядем на НЦТ, или что наш ОРТ будет в одной школе, или что мы вообще найдем общий язык?\n\nЧто я хочу этим сказать - это судьба. Как бы кринжово не было, но это факт. И я бесконечно рад тому что все эти случайности позволили мне быть с тобой, ведь ты - лучшая девушка на свете. Абсолютная львица, тигрица, красавица и умница. Невероятно крутая особа которую я очень уважаю. Умная и смышленная девушка, чья красота уступает лишь её милоте)\n\nКогда ты смотришь на меня - я теряюсь с твоих глазах и это не шутка(ты сама это видела). Когда ты улыбаешься, я невольно расслабляюсь и будто на душе становится легче)\n\nМырзагүл, я люблю тебя. "
    },
    letter2Body: {
      en: "Moya lubof,\n\nLife is yours, death is mine\nPeace is yours, stress is mine\nHappiness is yours, sorrow is mine\nEverything is yours\nBut you are mine\n\nBaby, I love you and I would like to ask you this question:",
      ru: "Май лав,\n\nЖизнь твоя, смерть моя\nПокой твой, стресс мой\nСчастье твоё, грусть моя\nВсё твоё\nНо ты моя\n\nМилая, я люблю тебя и хочу задать тебе этот вопрос:"
    }
  },
} as const;

/** Convenience helper: t(translations.home.subtitle, lang) */
export function t(entry: { en: string; ru: string }, lang: Lang): string {
  return entry[lang];
}
