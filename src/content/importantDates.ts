export interface ImportantDate {
  date: string;
  title: {
    en: string;
    ru: string;
  };
  description?: {
    en: string;
    ru: string;
  };
}

export const importantDates: ImportantDate[] = [
  {
    date: '26.04.2026',
    title: {
      en: 'First meeting at NCT',
      ru: 'Мы впервые познакомились на НЦТ'
    }
  },
  {
    date: '16.05.2026',
    title: {
      en: 'First message on Instagram',
      ru: 'Ты первая написала мне в инсте'
    },
    description: {
      en: '18:32 — You initiated the chat and our communication began!',
      ru: '18:32 — Ты первая написала мне в инсте, и мы начали наше общение'
    }
  },
  {
    date: '17.05.2026 - 19.05.2026',
    title: {
      en: 'ORT Exam Days',
      ru: 'Дни ОРТ'
    },
    description: {
      en: 'Days of the ORT exam where we chatted closely and connected.',
      ru: 'Дни ОРТ, где мы плотно общались)'
    }
  },
  {
    date: '28.05.2026',
    title: {
      en: 'Date at Cyclone',
      ru: 'Свиданка в Циклоне'
    },
    description: {
      en: 'Our date at Cyclone. I really liked it.',
      ru: 'Свиданка в Циклоне. Мне понравилась атмосфера)'
    }
  },
  {
    date: '05.06.2026',
    title: {
      en: 'First Hug on parting',
      ru: 'Первое объятие'
    },
    description: {
      en: 'After the exam, we hugged each other goodbye for the first time.',
      ru: 'После экзамена по матеше, и когда мы впервые обнялись на прощание)'
    }
  },
  {
    date: '26.06.2026',
    title: {
      en: 'Your Birthday & Love Confession',
      ru: 'Твой день рождения'
    },
    description: {
      en: 'Your birthday — and my confession of love to you.',
      ru: 'Твое день рождение - и мое признание тебе в любви)'
    }
  },
  {
    date: '03.07.2026',
    title: {
      en: 'Our Library Date',
      ru: 'Свидание в библиотеке'
    },
    description: {
      en: 'Our library date where I kissed you on the cheek for the first time.',
      ru: 'Наш Library-date где я тебя впервые поцеловал в щечку, получив и сразу же уничтожив свой лимит)'
    }
  },
  {
    date: '07.07.2026',
    title: {
      en: 'Day We Started Dating',
      ru: 'День, когда мы начали встречаться'
    },
    description: {
      en: 'The day we officially became a couple 💖',
      ru: 'День когда мы начали встречаться 💖'
    }
  },
  {
    date: '10.07.2026',
    title: {
      en: 'Our First Kiss',
      ru: 'Наш первый поцелуй'
    },
    description: {
      en: 'The day we kissed for the first time 💋',
      ru: 'День когда впервые поцеловались 💋'
    }
  },
  {
    date: '17.07.2026',
    title: {
      en: 'No longer Extra Virgin',
      ru: 'Особый шаг в отношениях'
    },
    description: {
      en: 'The day we were no longer Extra virgin, you know 😉',
      ru: 'День когда мы больше не Extra virgin, юноу 😉'
    }
  }
];
