'use client'

import { useState } from 'react'

const TRANSLATIONS = {
  ua: {
    nav: { how: 'Як це працює', people: 'Люди', faq: 'FAQ', login: 'Увійти', join: 'Приєднатись' },
    hero: {
      badge: 'Безкоштовно · Без дипломів · Тільки люди',
      h1a: 'Знайди людину.',
      h1b: 'Поділись.',
      h1c: 'Навчись.',
      desc: 'ReTech — місце де незнайомі люди зустрічаються щоб ділитись знанням. Без грошей. Без ієрархії. Просто люди і трохи часу одне для одного.',
      btnLearn: 'Хочу вчитись',
      btnShare: 'Хочу ділитись',
      stat1: 'учасників',
      stat2: 'годин разом',
      stat3: 'країни',
      statNote: 'Перший запуск — тільки 20 місць',
    },
    why: {
      label: 'Навіщо це існує',
      h2: 'Мільйони людей живуть за кордоном — і відчувають себе самотніми.',
      p1: 'Є люди які хочуть вивчити мову, розібратись в математиці, навчитись готувати борщ. І є люди які це вміють — і хочуть бути потрібними. Але вони ніколи не зустрічаються.',
      p2: 'ReTech — це місце де ця зустріч відбувається. Не як послуга. Як живий людський обмін.',
      quote: 'Тут не потрібен диплом. Достатньо знати трохи більше — і мати серце.',
    },
    how: {
      label: 'Як це працює',
      h2: 'Три кроки — і ти вже не сам.',
      steps: [
        { title: 'Розкажи про себе', desc: 'Тільки ім\'я. Що хочеш вивчити — і що можеш дати назад. Не резюме — просто ти.' },
        { title: 'Знайди людину', desc: 'Гортай стрічку людей. Коли щось резонує — натисни "давай дружити".' },
        { title: 'Зустрінься', desc: 'Онлайн, раз на тиждень. Без зобов\'язань. Просто дві людини і година яка може змінити обох.' },
      ],
    },
    who: {
      label: 'Для кого',
      h2: 'Якщо хоч одне — це про тебе.',
      items: [
        'Ти живеш за кордоном і хочеш вивчити місцеву мову — але платний курс занадто дорогий.',
        'Ти вмієш щось — і хочеш бути потрібним. Хочеш ділитись але не знаєш як і з ким.',
        'Ти відчуваєш себе самотнім — і хочеш живого зв\'язку з людиною, а не з екраном.',
        'Ти хочеш допомогти дитині з математикою — і шукаєш людину яка пояснить живо.',
      ],
    },
    people: {
      label: 'Люди на платформі',
      h2: 'Не категорії. Живі люди.',
      teaches: 'Вчить:',
      shares: 'Ділиться:',
    },
    faq: {
      label: 'Часті запитання',
      h2: 'Відповіді на те що ти вже думаєш.',
      items: [
        { q: 'Це справді безкоштовно?', a: 'Так. ReTech не бере грошей ні з кого. Люди діляться часом і знанням — не грошима. Це і є суть платформи.' },
        { q: 'Що якщо я нічого не вмію?', a: 'Кожна людина вміє щось чого не вміє інша. Готуєш? Знаєш як виживати в чужій країні? Грав колись на гітарі? Це вже скарб для когось.' },
        { q: 'Як відбуваються зустрічі?', a: 'Онлайн — відео прямо в платформі. Зазвичай раз на тиждень, 45–60 хвилин. Ти домовляєшся напряму з людиною.' },
        { q: 'Чи безпечно?', a: 'Всі зустрічі онлайн. Контакт відкривається тільки після того як обидві сторони підтвердили. Ти завжди можеш завершити зв\'язок.' },
        { q: 'Чи є зобов\'язання?', a: 'Жодних. Ти вільний зустрічатись скільки хочеш і з ким хочеш. Це не контракт — це зв\'язок між людьми.' },
      ],
    },
    cta: {
      h2a: 'Є щось що ти вмієш.',
      h2b: 'І є щось що хочеш навчитись.',
      sub: 'Почнемо з будь-якого.',
      btn: 'Створити профіль',
      login: 'Увійти',
      note: 'Безкоштовно · Без зобов\'язань · Просто люди',
    },
    footer: {
      desc: 'Місце де люди зустрічаються щоб ділитись знанням.',
      platform: 'Платформа',
      contact: 'Контакт',
      founder: 'Засновник',
      copy: '© 2026 ReTech · Зроблено з любов\'ю до людей',
      motto: 'Знайди людину. Поділись. Навчись.',
    },
  },
  ru: {
    nav: { how: 'Как это работает', people: 'Люди', faq: 'FAQ', login: 'Войти', join: 'Присоединиться' },
    hero: {
      badge: 'Бесплатно · Без дипломов · Только люди',
      h1a: 'Найди человека.',
      h1b: 'Поделись.',
      h1c: 'Учись.',
      desc: 'ReTech — место где незнакомые люди встречаются чтобы делиться знаниями. Без денег. Без иерархии. Просто люди и немного времени друг для друга.',
      btnLearn: 'Хочу учиться',
      btnShare: 'Хочу делиться',
      stat1: 'участников',
      stat2: 'часов вместе',
      stat3: 'страны',
      statNote: 'Первый запуск — только 20 мест',
    },
    why: {
      label: 'Зачем это существует',
      h2: 'Миллионы людей живут за границей — и чувствуют себя одинокими.',
      p1: 'Есть люди которые хотят выучить язык, разобраться в математике, научиться готовить борщ. И есть люди которые это умеют — и хотят быть нужными.',
      p2: 'ReTech — это место где эта встреча происходит. Не как услуга. Как живой человеческий обмен.',
      quote: 'Здесь не нужен диплом. Достаточно знать чуть больше — и иметь сердце.',
    },
    how: {
      label: 'Как это работает',
      h2: 'Три шага — и ты уже не один.',
      steps: [
        { title: 'Расскажи о себе', desc: 'Только имя. Что хочешь выучить — и что можешь дать взамен.' },
        { title: 'Найди человека', desc: 'Листай ленту людей. Когда что-то резонирует — нажми "давай дружить".' },
        { title: 'Встреться', desc: 'Онлайн, раз в неделю. Без обязательств. Просто два человека и час времени.' },
      ],
    },
    who: {
      label: 'Для кого',
      h2: 'Если хотя бы одно — это про тебя.',
      items: [
        'Ты живёшь за границей и хочешь выучить местный язык — но платный курс слишком дорогой.',
        'Ты умеешь что-то — и хочешь быть нужным. Хочешь делиться но не знаешь как и с кем.',
        'Ты чувствуешь себя одиноким — и хочешь живой связи с человеком, а не с экраном.',
        'Ты хочешь помочь ребёнку с математикой — и ищешь человека который объяснит живо.',
      ],
    },
    people: {
      label: 'Люди на платформе',
      h2: 'Не категории. Живые люди.',
      teaches: 'Учит:',
      shares: 'Делится:',
    },
    faq: {
      label: 'Частые вопросы',
      h2: 'Ответы на то что ты уже думаешь.',
      items: [
        { q: 'Это правда бесплатно?', a: 'Да. ReTech не берёт денег ни с кого. Люди делятся временем и знаниями — не деньгами.' },
        { q: 'Что если я ничего не умею?', a: 'Каждый человек умеет что-то чего не умеет другой. Готовишь? Знаешь как выживать в чужой стране? Это уже сокровище для кого-то.' },
        { q: 'Как проходят встречи?', a: 'Онлайн — видео прямо в платформе. Обычно раз в неделю, 45–60 минут.' },
        { q: 'Это безопасно?', a: 'Все встречи онлайн. Контакт открывается только после взаимного подтверждения.' },
        { q: 'Есть ли обязательства?', a: 'Никаких. Ты свободен встречаться сколько хочешь и с кем хочешь.' },
      ],
    },
    cta: {
      h2a: 'Есть что-то что ты умеешь.',
      h2b: 'И есть что-то что хочешь выучить.',
      sub: 'Начнём с любого.',
      btn: 'Создать профиль',
      login: 'Войти',
      note: 'Бесплатно · Без обязательств · Просто люди',
    },
    footer: {
      desc: 'Место где люди встречаются чтобы делиться знаниями.',
      platform: 'Платформа',
      contact: 'Контакт',
      founder: 'Основатель',
      copy: '© 2026 ReTech · Сделано с любовью к людям',
      motto: 'Найди человека. Поделись. Учись.',
    },
  },
  en: {
    nav: { how: 'How it works', people: 'People', faq: 'FAQ', login: 'Sign in', join: 'Join' },
    hero: {
      badge: 'Free · No degrees · Just people',
      h1a: 'Find a person.',
      h1b: 'Share.',
      h1c: 'Learn.',
      desc: 'ReTech is a place where strangers meet to share knowledge. No money. No hierarchy. Just people and a little time for each other.',
      btnLearn: 'I want to learn',
      btnShare: 'I want to share',
      stat1: 'members',
      stat2: 'hours together',
      stat3: 'countries',
      statNote: 'First launch — only 20 spots',
    },
    why: {
      label: 'Why this exists',
      h2: 'Millions of people live abroad — and feel alone.',
      p1: 'Some people want to learn a language, understand math, or cook borscht. Others know how — and want to be needed. But they never meet.',
      p2: 'ReTech is the place where that meeting happens. Not as a service. As a genuine human exchange.',
      quote: 'No degree needed here. Just know a little more — and have heart.',
    },
    how: {
      label: 'How it works',
      h2: 'Three steps — and you\'re no longer alone.',
      steps: [
        { title: 'Tell us about yourself', desc: 'Just your name. What you want to learn — and what you can give back.' },
        { title: 'Find a person', desc: 'Browse the feed of people. When something resonates — hit "let\'s be friends".' },
        { title: 'Meet', desc: 'Online, once a week. No commitments. Two people and an hour that can change both.' },
      ],
    },
    who: {
      label: 'Who this is for',
      h2: 'If even one of these is you.',
      items: [
        'You live abroad and want to learn the local language — but paid courses are too expensive.',
        'You know something — and want to be needed. You want to share but don\'t know how or with whom.',
        'You feel lonely — and want a real human connection, not a screen.',
        'You want to help a child with math — and need someone who can explain it naturally.',
      ],
    },
    people: {
      label: 'People on the platform',
      h2: 'Not categories. Real people.',
      teaches: 'Learns:',
      shares: 'Shares:',
    },
    faq: {
      label: 'FAQ',
      h2: 'Answers to what you\'re already thinking.',
      items: [
        { q: 'Is this really free?', a: 'Yes. ReTech charges no one. People share time and knowledge — not money.' },
        { q: 'What if I don\'t know anything useful?', a: 'Everyone knows something someone else doesn\'t. Can you cook? Do you know how to survive in a foreign country? That\'s already a treasure for someone.' },
        { q: 'How do meetings happen?', a: 'Online — video right inside the platform. Usually once a week, 45–60 minutes.' },
        { q: 'Is it safe?', a: 'All meetings are online. Contact opens only after both sides confirm.' },
        { q: 'Any commitments?', a: 'None. You\'re free to meet as much as you want, with whoever you want.' },
      ],
    },
    cta: {
      h2a: 'There\'s something you know.',
      h2b: 'And something you want to learn.',
      sub: 'Start with either.',
      btn: 'Create profile',
      login: 'Sign in',
      note: 'Free · No commitments · Just people',
    },
    footer: {
      desc: 'A place where people meet to share knowledge.',
      platform: 'Platform',
      contact: 'Contact',
      founder: 'Founder',
      copy: '© 2026 ReTech · Made with love for people',
      motto: 'Find a person. Share. Learn.',
    },
  },
}

// ─── Легко змінювати: ліміт заявок і статистика ───────────────────────────
const SITE_CONFIG = {
  requestsLimit: 20,       // максимум заявок "хочу вчитись"
  stats: { people: '20', hours: '5', countries: '2' },
}
// ──────────────────────────────────────────────────────────────────────────

const PEOPLE = [
  {
    initials: 'МО', bg: '#FAECE7', color: '#712B13',
    name: { ua: 'Марія, 24 · Мілан', ru: 'Мария, 24 · Милан', en: 'Maria, 24 · Milan' },
    teaches: { ua: 'Англійська', ru: 'Английский', en: 'English' },
    shares: { ua: 'Готування', ru: 'Кулинария', en: 'Cooking' },
    quote: { ua: '"Вже починаю думати англійською перед сном. Цього ніколи не було раніше."', ru: '"Уже начинаю думать по-английски перед сном. Раньше такого никогда не было."', en: '"I\'m starting to think in English before sleep. That never happened before."' },
  },
  {
    initials: 'НВ', bg: '#EDF2F7', color: '#243344',
    name: { ua: 'Наталя, 38 · Торонто', ru: 'Наталья, 38 · Торонто', en: 'Natalia, 38 · Toronto' },
    teaches: { ua: 'Українська', ru: 'Украинский', en: 'Ukrainian' },
    shares: { ua: 'Французька', ru: 'Французский', en: 'French' },
    quote: { ua: '"Знайшла подругу з якою спілкуюсь щотижня. Не очікувала що платформа дасть мені це."', ru: '"Нашла подругу с которой общаюсь каждую неделю. Не ожидала что платформа даст мне это."', en: '"Found a friend I talk to every week. I didn\'t expect the platform to give me that."' },
  },
  {
    initials: 'ЮМ', bg: '#FAECE7', color: '#712B13',
    name: { ua: 'Юлія, 29 · Лондон', ru: 'Юлия, 29 · Лондон', en: 'Julia, 29 · London' },
    teaches: { ua: 'Готування', ru: 'Кулинария', en: 'Cooking' },
    shares: { ua: 'Йога', ru: 'Йога', en: 'Yoga' },
    quote: { ua: '"Зварила борщ і заплакала від смаку. Три роки без домашньої їжі — і раптом вдома."', ru: '"Сварила борщ и заплакала от вкуса. Три года без домашней еды — и вдруг дома."', en: '"I made borscht and cried from the taste. Three years without home food — and suddenly I was home."' },
  },
]

const WHO_ICONS = ['map-pin', 'heart', 'users', 'school']
const WHO_COLORS = [
  { bg: '#FAECE7', color: '#712B13', icon: '#C85A2A' },
  { bg: '#EDF2F7', color: '#243344', icon: '#4A6580' },
  { bg: '#FAECE7', color: '#712B13', icon: '#C85A2A' },
  { bg: '#EDF2F7', color: '#243344', icon: '#4A6580' },
]

export default function Home() {
  const [lang, setLang] = useState<'ua' | 'ru' | 'en'>('ua')
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const t = TRANSLATIONS[lang]

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #1a1a1a; line-height: 1.6; }
        :root {
          --fire: #C85A2A; --fire-bg: #FAECE7; --fire-dark: #712B13; --fire-light: #F5C4B3;
          --blue: #4A6580; --blue-bg: #EDF2F7; --blue-dark: #243344;
          --gray: #f5f5f3; --border: rgba(0,0,0,0.08); --text: #1a1a1a; --muted: #666; --hint: #999;
          --r: 10px; --rl: 14px;
        }
        @media (prefers-color-scheme: dark) {
          body { background: #111; color: #e8e8e6; }
          :root {
            --gray: #1e1e1c; --border: rgba(255,255,255,0.1);
            --text: #e8e8e6; --muted: #aaa; --hint: #777;
            --fire-bg: #2a1a10; --fire-dark: #F5C4B3;
            --blue-bg: #0f1a24; --blue-dark: #A8BDD0;
          }
        }
        .container { max-width: 680px; margin: 0 auto; padding: 0 20px; }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; background: var(--fire); color: #fff; border: none; border-radius: var(--r); padding: 12px 26px; font-size: 15px; font-weight: 500; cursor: pointer; transition: opacity .15s, transform .1s; font-family: inherit; text-decoration: none; }
        .btn-primary:hover { opacity: .9; }
        .btn-primary:active { transform: scale(.98); }
        .btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: var(--fire); border: 1.5px solid var(--fire); border-radius: var(--r); padding: 11px 24px; font-size: 15px; font-weight: 500; cursor: pointer; transition: background .15s; font-family: inherit; text-decoration: none; }
        .btn-outline:hover { background: var(--fire-bg); }
        .btn-ghost { display: inline-flex; align-items: center; gap: 5px; background: transparent; color: var(--muted); border: 0.5px solid var(--border); border-radius: 8px; padding: 7px 13px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .15s; }
        .btn-ghost:hover { background: var(--gray); }
        .lang-btn { padding: 5px 10px; font-size: 12px; border: 0.5px solid var(--border); border-radius: 6px; background: transparent; color: var(--muted); cursor: pointer; font-family: inherit; transition: all .15s; }
        .lang-btn.active { background: var(--fire-bg); color: var(--fire-dark); border-color: var(--fire-light); }
        .section { padding: 3rem 0; border-bottom: 0.5px solid var(--border); }
        .section:last-child { border-bottom: none; }
        .label { font-size: 11px; font-weight: 500; color: var(--hint); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1rem; }
        .h2 { font-size: 22px; font-weight: 500; color: var(--text); line-height: 1.4; margin-bottom: 1.25rem; }
        .badge-fire { display: inline-block; background: var(--fire-bg); color: var(--fire-dark); border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 500; }
        .badge-blue { display: inline-block; background: var(--blue-bg); color: var(--blue-dark); border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 500; }
        .person-card { background: #fff; border: 0.5px solid var(--border); border-radius: var(--rl); padding: 1rem 1.25rem; margin-bottom: 10px; }
        @media (prefers-color-scheme: dark) { .person-card { background: #1a1a18; } }
        .avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; flex-shrink: 0; }
        .step-num { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; flex-shrink: 0; margin-top: 2px; }
        .faq-item { border-bottom: 0.5px solid var(--border); padding: 14px 0; cursor: pointer; }
        .faq-item:last-child { border-bottom: none; }
        .mobile-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; border-bottom: 0.5px solid var(--border); padding: 1rem 20px; z-index: 20; }
        @media (prefers-color-scheme: dark) { .mobile-menu { background: #111; } }
        .mobile-menu.open { display: block; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-right { display: none; }
          .burger { display: flex !important; }
          .lang-row { display: flex; gap: 6px; margin-bottom: 1rem; }
          .mobile-nav-links { display: flex; flex-direction: column; gap: 12px; }
          .mobile-nav-links button { font-size: 16px; color: var(--text); background: none; border: none; cursor: pointer; font-family: inherit; text-align: left; }
          .mobile-cta { display: flex; gap: 8px; margin-top: 1rem; }
          .btn-primary, .btn-outline { font-size: 14px; padding: 11px 20px; }
          .hero-buttons { flex-direction: column; align-items: stretch; }
          .hero-buttons .btn-primary, .hero-buttons .btn-outline { justify-content: center; }
          .stats-grid { grid-template-columns: 1fr 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; gap: 4px; }
          .h2 { font-size: 20px; }
          .who-grid { grid-template-columns: 1fr !important; }
        }
        .burger { display: none; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; padding: 6px; color: var(--text); }
        scroll-margin-top: 70px;
        #how, #people, #who, #faq { scroll-margin-top: 70px; }
      `}</style>

      {/* ШАПКА */}
      <header style={{ position: 'sticky', top: 0, background: 'var(--gray)', borderBottom: '0.5px solid var(--border)', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', gap: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.02em', cursor: 'pointer', flexShrink: 0 }} onClick={() => scrollTo('top')}>
            <span style={{ color: 'var(--fire)' }}>Re</span>
            <span style={{ color: 'var(--blue)' }}>Tech</span>
          </div>

          <nav className="nav-links" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {[['how', t.nav.how], ['people', t.nav.people], ['faq', t.nav.faq]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--fire)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>{label}</button>
            ))}
          </nav>

          <div className="nav-right" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {(['ua', 'ru', 'en'] as const).map(l => (
                <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button className="btn-ghost">{t.nav.login}</button>
            <button className="btn-primary" style={{ fontSize: 13, padding: '9px 18px' }}>{t.nav.join}</button>
          </div>

          <button className="burger" aria-label="Меню" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen
                ? <><line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
                : <><line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
              }
            </svg>
          </button>
        </div>

        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          <div className="lang-row">
            {(['ua', 'ru', 'en'] as const).map(l => (
              <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div className="mobile-nav-links">
            {[['how', t.nav.how], ['people', t.nav.people], ['faq', t.nav.faq]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </div>
          <div className="mobile-cta">
            <button className="btn-ghost">{t.nav.login}</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{t.nav.join}</button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ГЕРОЙ */}
        <div className="section container" style={{ paddingTop: '3rem', paddingBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
            <div style={{ display: 'inline-block', background: 'var(--fire-bg)', color: 'var(--fire-dark)', borderRadius: 20, padding: '6px 16px', fontSize: 12, fontWeight: 500, marginBottom: '1.25rem' }}>
              {t.hero.badge}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3, marginBottom: '1rem' }}>
              {t.hero.h1a}<br />
              <span style={{ color: 'var(--fire)' }}>{t.hero.h1b}</span>{' '}
              <span style={{ color: 'var(--blue)' }}>{t.hero.h1c}</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, margin: '0 auto 1.5rem', maxWidth: 420 }}>
              {t.hero.desc}
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button className="btn-primary">{t.hero.btnLearn} →</button>
              <button className="btn-outline">{t.hero.btnShare}</button>
            </div>
          </div>

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, textAlign: 'center' }}>
            {[
              { num: SITE_CONFIG.stats.people, label: t.hero.stat1, bg: 'var(--fire-bg)', color: 'var(--fire)', labelColor: 'var(--fire-dark)' },
              { num: SITE_CONFIG.stats.hours, label: t.hero.stat2, bg: 'var(--blue-bg)', color: 'var(--blue)', labelColor: 'var(--blue-dark)' },
              { num: SITE_CONFIG.stats.countries, label: t.hero.stat3, bg: 'var(--gray)', color: 'var(--text)', labelColor: 'var(--muted)' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 'var(--rl)', padding: '1.25rem 1rem' }}>
                <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.num}</div>
                <div style={{ fontSize: 12, color: s.labelColor, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--hint)', background: 'var(--fire-bg)', borderRadius: 8, padding: '8px 16px', display: 'inline-block', width: '100%' }}>
            {t.hero.statNote}
          </div>
        </div>

        {/* НАВІЩО */}
        <div className="section container">
          <div className="label">{t.why.label}</div>
          <h2 className="h2">{t.why.h2}</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem' }}>{t.why.p1}</p>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>{t.why.p2}</p>
          <div style={{ borderLeft: '2.5px solid var(--fire)', padding: '10px 0 10px 16px', fontSize: 14, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.7, borderRadius: 0 }}>
            {t.why.quote}
          </div>
        </div>

        {/* ЯК ПРАЦЮЄ */}
        <div id="how" className="section container">
          <div className="label">{t.how.label}</div>
          <h2 className="h2">{t.how.h2}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {t.how.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div className="step-num" style={{ background: i === 1 ? 'var(--blue-bg)' : 'var(--fire-bg)', color: i === 1 ? 'var(--blue-dark)' : 'var(--fire-dark)' }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ДЛЯ КОГО */}
        <div id="who" className="section container">
          <div className="label">{t.who.label}</div>
          <h2 className="h2">{t.who.h2}</h2>
          <div className="who-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {t.who.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 12, background: WHO_COLORS[i].bg, borderRadius: 'var(--r)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WHO_COLORS[i].icon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  {WHO_ICONS[i] === 'map-pin' && <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>}
                  {WHO_ICONS[i] === 'heart' && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>}
                  {WHO_ICONS[i] === 'users' && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                  {WHO_ICONS[i] === 'school' && <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>}
                </svg>
                <div style={{ fontSize: 13, color: WHO_COLORS[i].color, lineHeight: 1.7 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ЛЮДИ */}
        <div id="people" className="section container">
          <div className="label">{t.people.label}</div>
          <h2 className="h2">{t.people.h2}</h2>
          {PEOPLE.map((p, i) => (
            <div key={i} className="person-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div className="avatar" style={{ background: p.bg, color: p.color }}>{p.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{p.name[lang]}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
                    <span className="badge-fire">{t.people.teaches} {p.teaches[lang]}</span>
                    <span className="badge-blue">{t.people.shares} {p.shares[lang]}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, fontStyle: 'italic' }}>{p.quote[lang]}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div id="faq" className="section container">
          <div className="label">{t.faq.label}</div>
          <h2 className="h2">{t.faq.h2}</h2>
          <div>
            {t.faq.items.map((item, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  {item.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--hint)' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                {openFaq === i && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginTop: 10 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="section container" style={{ borderBottom: 'none' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>
              {t.cta.h2a}<br />{t.cta.h2b}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: '1.75rem', fontStyle: 'italic' }}>{t.cta.sub}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>{t.cta.btn} →</button>
              <button className="btn-ghost" style={{ padding: '12px 24px', fontSize: 14 }}>{t.cta.login}</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--hint)' }}>{t.cta.note}</div>
          </div>
        </div>
      </main>

      {/* ПІДВАЛ */}
      <footer style={{ borderTop: '0.5px solid var(--border)', padding: '2rem 0 1rem' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                <span style={{ color: 'var(--fire)' }}>Re</span>
                <span style={{ color: 'var(--blue)' }}>Tech</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--hint)', lineHeight: 1.7, marginBottom: 12 }}>{t.footer.desc}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { title: 'Telegram', path: 'M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.165l3.898 1.3 2.025 6.386a.75.75 0 0 0 1.352.175L13.6 19.4l4.2 3.15a2.25 2.25 0 0 0 3.55-1.35l3-16.5a2.25 2.25 0 0 0-3.152-2.267z' },
                  { title: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z' },
                  { title: 'Email', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
                ].map(icon => (
                  <button key={icon.title} className="btn-ghost" style={{ padding: '7px 10px' }} aria-label={icon.title}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon.path} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--hint)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>{t.footer.platform}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['how', t.nav.how], ['people', t.nav.people], ['faq', t.nav.faq]].map(([id, label]) => (
                  <button key={id} onClick={() => scrollTo(id)} style={{ fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', padding: 0, transition: 'color .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--fire)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>{label}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--hint)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>{t.footer.contact}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--hint)' }}>hello@retech.world</div>
                <div style={{ fontSize: 13, color: 'var(--hint)' }}>@retech_app</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  <span style={{ color: 'var(--hint)' }}>{t.footer.founder}:</span><br />
                  <span style={{ fontWeight: 500 }}>Oleksandr Krychylskyi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom" style={{ borderTop: '0.5px solid var(--border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--hint)' }}>{t.footer.copy}</div>
            <div style={{ fontSize: 12, color: 'var(--hint)', fontStyle: 'italic' }}>{t.footer.motto}</div>
          </div>
        </div>
      </footer>
    </>
  )
}
