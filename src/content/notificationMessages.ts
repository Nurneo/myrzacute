import { Lang } from './translations';
import { dailyMessages } from './dailyMessages';
import { format } from 'date-fns';

export interface NotificationContent {
  id: string;
  type: 'midnight' | 'midday';
  title: { en: string; ru: string };
  message: { en: string; ru: string };
  icon: string;
}

export const MIDNIGHT_MESSAGES: NotificationContent[] = [
  {
    id: 'midnight-1',
    type: 'midnight',
    title: { en: 'Midnight Kiss 🌙💋', ru: 'Полночный поцелуй 🌙💋' },
    message: {
      en: 'It is 00:00! Time to rest those gorgeous eyes, lioness. Sending you the warmest hug and a midnight kiss. Sweet dreams! 💖',
      ru: 'Уже 00:00! Время закрыть свои прекрасные глазки, львица. Обнимаю тебя крепко-крепко и шлю полуночный поцелуй. Сладких снов! 💖',
    },
    icon: '🌙',
  },
  {
    id: 'midnight-2',
    type: 'midnight',
    title: { en: 'Goodnight, My Love 🌌✨', ru: 'Спокойной ночи, любимая 🌌✨' },
    message: {
      en: 'Midnight struck! Just a reminder before you sleep: you are the most precious person in my life. Goodnight, baby. 😴⭐',
      ru: 'Наступила полночь! Просто напоминание перед сном: ты самый дорогой человек в моей жизни. Спокойной ночи, беби. 😴⭐',
    },
    icon: '✨',
  },
  {
    id: 'midnight-3',
    type: 'midnight',
    title: { en: 'Starry Night Note 🌠🤍', ru: 'Звёздная записка 🌠🤍' },
    message: {
      en: 'Even the moon is jealous of how bright you shine. Sleep well and dream of us! 🌙💭',
      ru: 'Даже луна завидует тому, как ярко ты сияешь. Спи сладко и пусть тебе приснится что-то очень милое! 🌙💭',
    },
    icon: '🌠',
  },
  {
    id: 'midnight-4',
    type: 'midnight',
    title: { en: '00:00 Love Wish 🕯️💕', ru: 'Пожелание в 00:00 🕯️💕' },
    message: {
      en: '00:00 is a magical hour! Make a wish, because having you in my life is already my wish come true. 💋',
      ru: '00:00 — волшебное время! Загадай желание, ведь ты в моей жизни - это уже исполнившаяся мечта. 💋',
    },
    icon: '🕯️',
  },
];

export const MIDDAY_MESSAGES: NotificationContent[] = [
  {
    id: 'midday-1',
    type: 'midday',
    title: { en: 'Midday Sunshine ☀️💖', ru: 'Полуденное солнце ☀️💖' },
    message: {
      en: 'It is 12:00 PM! Just checking in to remind you that you are doing amazing today. Keep shining, lioness! 🦁👑',
      ru: 'Уже 12:00! Заглянул напомнить тебе, что ты умничка и отлично справляешься. Сияй, львица! 🦁👑',
    },
    icon: '☀️',
  },
  {
    id: 'midday-2',
    type: 'midday',
    title: { en: 'Lunchtime Hug ☕🌸', ru: 'Полуденное объятие ☕🌸' },
    message: {
      en: 'Half the day is done! Make sure to take a cozy break, eat well, and drink water. Love you tons! 💕',
      ru: 'Половина дня позади! Обязательно отдохни, вкусно покушай и выпей водички. Люблю тебя очень! 💕',
    },
    icon: '🌸',
  },
  {
    id: 'midday-3',
    type: 'midday',
    title: { en: '12:00 Love Boost 🚀❤️', ru: 'Заряд любви в 12:00 🚀❤️' },
    message: {
      en: 'Midday boost! If no one told you today: you are gorgeous, smart, and completely unforgettable. 😘',
      ru: 'Заряд энергии в 12:00! Если тебе никто сегодня не говорил: ты невероятно красивая, умная и незабываемая. 😘',
    },
    icon: '⚡',
  },
  {
    id: 'midday-4',
    type: 'midday',
    title: { en: 'Lioness Power Hour 🦁✨', ru: 'Время силы львицы 🦁✨' },
    message: {
      en: 'It is 12:00! Sending you all the positive energy and love in the world for the rest of your day! 💖🔥',
      ru: 'Ровно 12:00! Отправляю тебе всю самую позитивную энергию и любовь на остаток дня! 💖🔥',
    },
    icon: '👑',
  },
];

/**
 * Get message for a specific slot (midnight = 00:00, midday = 12:00)
 */
export function getNotificationMessage(
  type: 'midnight' | 'midday',
  dateStr?: string,
  lang: Lang = 'ru'
): { title: string; message: string; icon: string } {
  const list = type === 'midnight' ? MIDNIGHT_MESSAGES : MIDDAY_MESSAGES;

  // Pick message deterministically based on date if provided, or current date
  const targetDateStr = dateStr || format(new Date(), 'yyyy-MM-dd');
  const charSum = targetDateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = charSum % list.length;
  const item = list[index];

  // Try to blend with today's daily message if available
  const todayMsg = dailyMessages.find(m => m.date === targetDateStr);

  let messageText = item.message[lang];
  if (todayMsg && Math.random() > 0.5) {
    // Optionally incorporate snippet of daily message
    messageText = `${item.message[lang]}\n\n💌 "${todayMsg.message}"`;
  }

  return {
    title: item.title[lang],
    message: messageText,
    icon: item.icon,
  };
}
