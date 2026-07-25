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
  {
    id: 'midnight-5',
    type: 'midnight',
    title: { en: 'Sweet Dreams, Lioness 🛋️💖', ru: 'Сладких снов, львица 🛋️💖' },
    message: {
      en: 'Time to rest! Fall asleep knowing how truly incredible you are and how deeply I love you. 💖💤',
      ru: 'Пора отдохнуть! Засыпай с мысли о том, насколько ты невероятная и как сильно я тебя люблю. 💖💤',
    },
    icon: '🛌',
  },
  {
    id: 'midnight-6',
    type: 'midnight',
    title: { en: 'Night Hug 🧸✨', ru: 'Ночное объятие 🧸✨' },
    message: {
      en: 'If I were next to you right now, I would hold you tight until you fell asleep smiling. Goodnight! 💋',
      ru: 'Если бы я был рядом, я бы обнял тебя так крепко, чтобы ты заснула с улыбкой. Сладких снов, жаным! 💋',
    },
    icon: '🧸',
  },
  {
    id: 'midnight-7',
    type: 'midnight',
    title: { en: 'Peaceful Night 🌃🖤', ru: 'Тишина и покой 🌃🖤' },
    message: {
      en: 'May tonight bring you the deepest and most restful sleep. You deserve the best rest! 🌙',
      ru: 'Пусть эта ночь принесет тебе самый глубокий и расслабляющий сон. Ты заслужила лучший отдых! 🌙',
    },
    icon: '🌃',
  },
  {
    id: 'midnight-8',
    type: 'midnight',
    title: { en: 'Bedtime Kiss 💋⭐', ru: 'Поцелуй перед сном 💋⭐' },
    message: {
      en: 'Catching a virtual kiss on your cheek before sleep! Wake up tomorrow in a wonderful mood. 💤💖',
      ru: 'Лови виртуальный поцелуй в щечку перед сном! Просыпайся завтра с отличным настроением. 💤💖',
    },
    icon: '💋',
  },
];

// ── 2. MIDDAY MESSAGES (12:00) — 8 Variations ──
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
  {
    id: 'midday-5',
    type: 'midday',
    title: { en: 'Lunch Break Cheer 🥪☕', ru: 'Обеденный перерыв 🥪☕' },
    message: {
      en: '12:00! Take a break, eat delicious food, and smile. May the rest of the day be effortless! ☀️',
      ru: '12:00! Время сделать паузу, покушать вкусняшек и улыбнуться. Пусть остаток дня пройдет легко! ☀️',
    },
    icon: '☕',
  },
  {
    id: 'midday-6',
    type: 'midday',
    title: { en: 'Midday Love Reminder 💌💎', ru: 'Напоминание о любви 💌💎' },
    message: {
      en: 'Just wanted to say in the middle of the day: you are the best thing that ever happened to me. Have a great day, baby! 💕',
      ru: 'Просто хотел сказать среди дня: ты — лучшее, что случилось со мной. Удачного дня, беби! 💕',
    },
    icon: '💌',
  },
  {
    id: 'midday-7',
    type: 'midday',
    title: { en: 'Sunny Greetings ☀️👑', ru: 'Солнечный привет ☀️👑' },
    message: {
      en: 'You shine brighter than any sun! May the second half of your day be light and productive! 🦁✨',
      ru: 'Ты светишь ярче любого солнца! Пусть вторая половина дня будет легкой и продуктивной! 🦁✨',
    },
    icon: '🌞',
  },
  {
    id: 'midday-8',
    type: 'midday',
    title: { en: 'G-Wagon Energy 🚙🔥', ru: 'Мой любимый гелик 🚙🔥' },
    message: {
      en: 'You are a G-Wagon among outdated cars! Reminding you at 12:00 that you are an unmatched lioness. Go conquer the world! 👑💖',
      ru: 'Ты гелик на фоне жигулей! Напоминаю в 12:00, что ты непревзойденная львица. Вперед покорять мир! 👑💖',
    },
    icon: '🏎️',
  },
];

// ── 3. SECRET MESSAGES (Passcode 000000 & Secret Page) — 8 Variations ──
export const SECRET_MESSAGES: NotificationContent[] = [
  {
    id: 'secret-1',
    type: 'secret',
    title: { en: 'Secret Reminder 🤫💖', ru: 'Секретное напоминание 🤫💖' },
    message: {
      en: 'Did you know that you are the coolest and most incredible lioness in the universe? Now you know! 🦁💎',
      ru: 'Ты знала, что ты самая крутая и невероятная львица во вселенной? Теперь знаешь! 🦁💎',
    },
    icon: '🤫',
  },
  {
    id: 'secret-2',
    type: 'secret',
    title: { en: 'Lioness Compliment 🦁✨', ru: 'Комплимент для львицы 🦁✨' },
    message: {
      en: 'Your level of cuteness and charisma exceeds all possible limits. You are absolute perfection! 🔥💋',
      ru: 'Уровень твоей милоты и харизмы зашкаливает за все возможные лимиты. Ты просто разрыв! 🔥💋',
    },
    icon: '🦁',
  },
  {
    id: 'secret-3',
    type: 'secret',
    title: { en: 'Secret Love Note 💌👑', ru: 'Секретная записка 💌👑' },
    message: {
      en: 'You are a G-Wagon among unfinished Toyotas! Never forget how truly special you are. 💕',
      ru: 'Ты Гелик на фоне недоделанных Тойот и всяких жигулей! Никогда не забывай, насколько ты особенная. 💕',
    },
    icon: '👑',
  },
  {
    id: 'secret-4',
    type: 'secret',
    title: { en: 'Sudden Kiss 💋🔥', ru: 'Внезапный поцелуй 💋🔥' },
    message: {
      en: 'Catch a sudden dose of love and kisses! You make this world a hundred thousand times better. 🥰',
      ru: 'Лови внезапную порцию любви и поцелуев! Ты делаешь этот мир в стописять тыщ раз лучше. 🥰',
    },
    icon: '💋',
  },
  {
    id: 'secret-5',
    type: 'secret',
    title: { en: 'You Are Amazing 🌟💖', ru: 'Ты невероятная 🌟💖' },
    message: {
      en: 'Just a random reminder: your intelligence, beauty, and sense of humor are 100 out of 10! 👑🔥',
      ru: 'Просто напоминание без повода: твой интеллект, красота и чувство юмора — 100 из 10! 👑🔥',
    },
    icon: '🌟',
  },
  {
    id: 'secret-6',
    type: 'secret',
    title: { en: 'Secret Spark ⚡💕', ru: 'Секретный заряд ⚡💕' },
    message: {
      en: 'Sending you a secret boost of great mood. Keep smiling, a smile suits you so much! 💋',
      ru: 'Отправляю тебе секретный заряд отличного настроения. Улыбнись, тебе очень идет улыбка! 💋',
    },
    icon: '⚡',
  },
  {
    id: 'secret-7',
    type: 'secret',
    title: { en: 'Moya Lubof 🌹💎', ru: 'Май лав 🌹💎' },
    message: {
      en: 'Life is yours, peace is yours, everything is yours — and you are mine! Reminding you that you are my favorite lioness. 🥰💖',
      ru: 'Жизнь твоя, покой твой, все твоё — а ты моя! Напоминаю, что ты моя любимая львица. 🥰💖',
    },
    icon: '🌹',
  },
  {
    id: 'secret-8',
    type: 'secret',
    title: { en: 'Secret Power 🦸‍♀️✨', ru: 'Секретная суперсила 🦸‍♀️✨' },
    message: {
      en: 'Your superpower is being the most charming and cute girl in the world. Love you so much! 💋👑',
      ru: 'Твоя суперсила — быть самой обворожительной и милой девушкой на свете. Люблю тебя очень! 💋👑',
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
