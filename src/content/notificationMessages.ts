import { Lang } from './translations';
import { dailyMessages } from './dailyMessages';
import { format } from 'date-fns';

export interface NotificationContent {
  id: string;
  type: 'midnight' | 'midday' | 'secret';
  title: { en: string; ru: string };
  message: { en: string; ru: string };
  icon: string;
}

// ── 1. MIDNIGHT MESSAGES (00:00) — 8 Variations ──
export const MIDNIGHT_MESSAGES: NotificationContent[] = [
  {
    id: 'midnight-1',
    type: 'midnight',
    title: { en: 'Midnight Kiss 💋', ru: 'Полночный поцелуй 💋' },
    message: {
      en: 'It is 00:00! Time to rest those gorgeous eyes, baby. Sending you the warmest hug and a midnight kiss. Sweet dreams! 💖',
      ru: 'Уже 00:00! Время закрыть свои прекрасные глазки, беби. Обнимаю тебя крепко-крепко и шлю полуночный поцелуй. Сладких снов! 💖',
    },
    icon: '🌙',
  },
  {
    id: 'midnight-2',
    type: 'midnight',
    title: { en: 'Goodnight, My Love', ru: 'Спокойной ночи, любимая' },
    message: {
      en: 'Just a reminder before you sleep: you are the most precious person in my life. Goodnight, baby.',
      ru: 'Просто напоминание перед сном: ты самый дорогой человек в моей жизни. Спокойной ночи, беби.',
    },
    icon: '✨',
  },
  {
    id: 'midnight-3',
    type: 'midnight',
    title: { en: 'Gotosleep', ru: 'Пошласпать' },
    message: {
      en: 'Even the moon is jealous of how bright you shine, dear. Sleep well suygonum)',
      ru: 'Даже луна завидует тому, как ярко ты сияешь. Спи сладко ловер)',
    },
    icon: '🌠',
  },
  {
    id: 'midnight-4',
    type: 'midnight',
    title: { en: '00:00', ru: '00:00' },
    message: {
      en: 'Go to sleep, a machine like you needs a rest, you know, baby)',
      ru: 'Иди спать, такой машине как ты нужен отдых юноу, беби)',
    },
    icon: '🕯️',
  },
  {
    id: 'midnight-5',
    type: 'midnight',
    title: { en: 'Sweet Dreams, Lioness', ru: 'Сладких снов, львица' },
    message: {
      en: 'Time to rest, fall asleep knowing how truly incredible you are and how deeply I love you.',
      ru: 'Пора отдохнуть, засыпай с мысли о том, насколько ты невероятная и как сильно я тебя люблю.',
    },
    icon: '🛌',
  },
  {
    id: 'midnight-6',
    type: 'midnight',
    title: { en: 'Night Hug', ru: 'Ночное объятие' },
    message: {
      en: 'Goodnight, dear-darling-sweety)',
      ru: 'Спокойной ночи, жанымка-любимка-шладкая-моя',
    },
    icon: '🧸',
  },
  {
    id: 'midnight-7',
    type: 'midnight',
    title: { en: 'Question', ru: 'Вопрос' },
    message: {
      en: 'Have you told me that you love me a million times? Fix it now.',
      ru: 'Ты мне сказала что ллюбишь меня стописять тыщ раз седня? Исправляй.',
    },
    icon: '🌃',
  },
  {
    id: 'midnight-8',
    type: 'midnight',
    title: { en: 'Yo girl', ru: 'Э кыз' },
    message: {
      en: 'Have you sent me a virtual kiss yet? No - do it now, yes - do it again.',
      ru: 'Ты мне отправила ркужочек с виртуальным поцелуем? Нет - сделай это сейчас, да - сделай это еще раз)',
    },
    icon: '💋',
  },
];

// ── 2. MIDDAY MESSAGES (12:00) — 8 Variations ──
export const MIDDAY_MESSAGES: NotificationContent[] = [
  {
    id: 'midday-1',
    type: 'midday',
    title: { en: 'Yo girl', ru: 'Э кыз' },
    message: {
      en: 'Had you had a boyfriend who reminds you that he loves you all the time... oh wait, you have one) I love you)',
      ru: 'Был бы у тебя парень который напоминает что любит тебя... а ну да, у тебя ж есть) Я люблю тебя)',
    },
    icon: '☀️',
  },
  {
    id: 'midday-2',
    type: 'midday',
    title: { en: 'Hey, dear', ru: 'Жаным' },
    message: {
      en: 'Baby. I am truly happy that I am in a relationship with you, even though you are an abuser and a tyrant)',
      ru: 'Я, кстати, счастлив что я в отношениях с тобой)',
    },
    icon: '🌸',
  },
  {
    id: 'midday-3',
    type: 'midday',
    title: { en: 'My love', ru: 'Беби' },
    message: {
      en: 'You can do everything, baby. I mean, you got me right?)',
      ru: 'У тебя все получится беби, меня ведь получила верно?)',
    },
    icon: '⚡',
  },
  {
    id: 'midday-4',
    type: 'midday',
    title: { en: 'Optimus Prime', ru: 'Э шладкая' },
    message: {
      en: 'My girlfriend is the prettiest, most fabulous girl in the world)',
      ru: 'Benim девушкам en guzel)',
    },
    icon: '👑',
  },
  {
    id: 'midday-5',
    type: 'midday',
    title: { en: 'My personal anti-stresser', ru: 'Эу кыз' },
    message: {
      en: 'Open your gallery and look at our photos, are they not cute?)',
      ru: 'Открой галерею и посмотри на наши фотки, ну разве они не милашки йоу)',
    },
    icon: '☕',
  },
  {
    id: 'midday-6',
    type: 'midday',
    title: { en: 'Sweetheart', ru: 'Любимка' },
    message: {
      en: 'I missed you btw)',
      ru: 'Соскучился жанымка)',
    },
    icon: '💌',
  },
  {
    id: 'midday-7',
    type: 'midday',
    title: { en: 'Ze love', ru: 'Май беби' },
    message: {
      en: 'Do not forget that I love you)',
      ru: 'Не забывай что я люблю тебя)',
    },
    icon: '🌞',
  },
  {
    id: 'midday-8',
    type: 'midday',
    title: { en: 'Yo darling', ru: 'Ау ау ау' },
    message: {
      en: 'Send me a voice note with a kiss, please. I will be waiting)',
      ru: 'Атпраф мне кружочек с поцелуем, я жду)',
    },
    icon: '🏎️',
  },
];

// ── 3. SECRET MESSAGES (Passcode 000000 & Secret Page) — 8 Variations ──
export const SECRET_MESSAGES: NotificationContent[] = [
  {
    id: 'secret-1',
    type: 'secret',
    title: { en: 'Yo girl', ru: 'ЭУ КЫЗ' },
    message: {
      en: 'Did you say you love me 150000 times yet? Go do it now.',
      ru: 'Я ТЯ ЛУБЛУ ЕСИЧО)',
    },
    icon: '🤫',
  },
  {
    id: 'secret-2',
    type: 'secret',
    title: { en: 'Moshi-moshi', ru: 'Алло-алло' },
    message: {
      en: 'I love you btw, and you should definitely text me)',
      ru: 'Олё-олё, мен сени суйом) Напиши что тоже любишб пж',
    },
    icon: '🦁',
  },
  {
    id: 'secret-3',
    type: 'secret',
    title: { en: 'Hey, honey', ru: 'Любимка' },
    message: {
      en: 'I missed you a lot. Send me a voice note with a kiss plz)',
      ru: 'Атпраф поцелуй пжпжпжпжпжппж, скучаю',
    },
    icon: '👑',
  },
  {
    id: 'secret-4',
    type: 'secret',
    title: { en: 'My girlfriend.', ru: 'Моя девушка.' },
    message: {
      en: 'I, your boyfriend, say to you - I love you)',
      ru: 'Я, твой парень, говорю тебе - Я люблю тебя',
    },
    icon: '💋',
  },
  {
    id: 'secret-5',
    type: 'secret',
    title: { en: 'Hear my words', ru: 'Сөздөрүмдү ук' },
    message: {
      en: 'Hear my words, for I tell you that I doeth loveth thy eyes and thy assets too)',
      ru: 'Сөздөрүмдү ук, анткени менин сага айта турча сөздөрүм - мен сенин көздөрүңдү сүйөм жана сенин активдериңди да сүйөм)))',
    },
    icon: '🌟',
  },
  {
    id: 'secret-6',
    type: 'secret',
    title: { en: 'Yo, lovely girlfriend', ru: 'э кыз' },
    message: {
      en: 'My lovely girlfriend, please know that I love you dearly)',
      ru: 'Напоминалка-аналка чито я тибя люблю ооооч сильно)',
    },
    icon: '⚡',
  },
  {
    id: 'secret-7',
    type: 'secret',
    title: { en: 'Moya Lubof', ru: 'Май лав' },
    message: {
      en: 'My boobs are made for you btw)',
      ru: 'Я сиси свои качаю ради тебя кстати)',
    },
    icon: '🌹',
  },
  {
    id: 'secret-8',
    type: 'secret',
    title: { en: 'Hey, love', ru: 'Беби' },
    message: {
      en: 'it is illegal to be this cute)',
      ru: 'Нельзя быть такой милой, йомае)',
    },
    icon: '✨',
  },
];

/**
 * Get message for a specific type ('midnight' | 'midday' | 'secret')
 */
export function getNotificationMessage(
  type: 'midnight' | 'midday' | 'secret',
  dateStr?: string,
  lang: Lang = 'ru',
  explicitIndex?: number
): { title: string; message: string; icon: string } {
  let list: NotificationContent[];
  if (type === 'midnight') {
    list = MIDNIGHT_MESSAGES;
  } else if (type === 'midday') {
    list = MIDDAY_MESSAGES;
  } else {
    list = SECRET_MESSAGES;
  }

  let index: number;
  if (explicitIndex !== undefined) {
    index = Math.abs(explicitIndex) % list.length;
  } else {
    const targetDateStr = dateStr || format(new Date(), 'yyyy-MM-dd');
    const charSum = targetDateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    index = charSum % list.length;
  }

  const item = list[index];

  return {
    title: item.title[lang],
    message: item.message[lang],
    icon: item.icon,
  };
}
