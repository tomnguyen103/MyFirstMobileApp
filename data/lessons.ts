import { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  // ── Spanish ──────────────────────────────────────────────────────────────
  {
    id: "es-unit-1-lesson-1",
    unitId: "es-unit-1",
    title: "Greetings",
    description: "Say hello and goodbye in Spanish.",
    xpReward: 10,
    goals: [
      { description: "Learn basic Spanish greetings" },
      { description: "Understand when to use formal vs informal greetings" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "Hola", translation: "Hello", example: "Hola, ¿cómo estás?" },
          { word: "Adiós", translation: "Goodbye", example: "Adiós, hasta luego." },
          { word: "Buenos días", translation: "Good morning", example: "Buenos días, señor." },
          { word: "Buenas noches", translation: "Good night", example: "Buenas noches, dormid bien." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "¿Cómo estás?",
            translation: "How are you?",
            pronunciation: "KOH-moh es-TAHS",
          },
          {
            phrase: "Estoy bien, gracias.",
            translation: "I am fine, thank you.",
            pronunciation: "es-TOY BYEN, GRA-syas",
          },
          {
            phrase: "Mucho gusto.",
            translation: "Nice to meet you.",
            pronunciation: "MOO-cho GOOS-toh",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "How do you say 'Good morning' in Spanish?",
        options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hola"],
        correctIndex: 1,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "¡Hola! I'm your AI Spanish teacher. Today we're going to learn how to greet people in Spanish.",
      instructions:
        "Listen carefully as I pronounce each greeting. Repeat after me and pay attention to the accent marks — they change the stress of the word.",
      encouragement:
        "You're doing great! Greetings are the foundation of every conversation. ¡Muy bien!",
    },
  },
  {
    id: "es-unit-1-lesson-2",
    unitId: "es-unit-1",
    title: "Common Words",
    description: "Learn everyday Spanish words.",
    xpReward: 10,
    goals: [
      { description: "Learn numbers 1 to 5 in Spanish" },
      { description: "Learn common everyday nouns" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "uno", translation: "one" },
          { word: "dos", translation: "two" },
          { word: "tres", translation: "three" },
          { word: "agua", translation: "water", example: "Quiero agua, por favor." },
          { word: "casa", translation: "house", example: "Mi casa es grande." },
        ],
      },
      {
        type: "translation",
        prompt: "Translate: 'I want water, please.'",
        answer: "Quiero agua, por favor.",
      },
      {
        type: "multiple-choice",
        question: "What does 'casa' mean?",
        options: ["Water", "Friend", "House", "Food"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Welcome back! Today we're going to expand your vocabulary with common everyday words.",
      instructions:
        "I'll say each word and its meaning. Try to create a mental image for each word — it helps you remember them faster.",
      encouragement:
        "Every word you learn is a step closer to fluency. ¡Sigue adelante!",
    },
  },

  // ── French ────────────────────────────────────────────────────────────────
  {
    id: "fr-unit-1-lesson-1",
    unitId: "fr-unit-1",
    title: "Greetings",
    description: "Say hello and goodbye in French.",
    xpReward: 10,
    goals: [
      { description: "Learn basic French greetings" },
      { description: "Practice polite expressions" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "Bonjour", translation: "Hello / Good morning", example: "Bonjour, comment allez-vous?" },
          { word: "Bonsoir", translation: "Good evening", example: "Bonsoir, madame." },
          { word: "Au revoir", translation: "Goodbye", example: "Au revoir, à bientôt." },
          { word: "Merci", translation: "Thank you", example: "Merci beaucoup!" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Comment allez-vous?",
            translation: "How are you? (formal)",
            pronunciation: "koh-MAHN tah-lay-VOO",
          },
          {
            phrase: "Je vais bien, merci.",
            translation: "I am well, thank you.",
            pronunciation: "zhuh vay BYAN, mair-SEE",
          },
          {
            phrase: "Enchanté(e).",
            translation: "Nice to meet you.",
            pronunciation: "ahn-shahn-TAY",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "How do you say 'Thank you' in French?",
        options: ["Bonjour", "Au revoir", "Merci", "Bonsoir"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Bonjour! I'm your AI French teacher. Let's start with the most important part of any language — greetings!",
      instructions:
        "French has nasal vowels that can be tricky. Listen closely to how I pronounce each word and imitate the sound.",
      encouragement:
        "Très bien! You're picking it up fast. Keep going, you're doing wonderfully!",
    },
  },
  {
    id: "fr-unit-1-lesson-2",
    unitId: "fr-unit-1",
    title: "Common Words",
    description: "Learn everyday French words.",
    xpReward: 10,
    goals: [
      { description: "Learn numbers 1 to 5 in French" },
      { description: "Learn common everyday nouns" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "un", translation: "one" },
          { word: "deux", translation: "two" },
          { word: "trois", translation: "three" },
          { word: "eau", translation: "water", example: "Je veux de l'eau." },
          { word: "maison", translation: "house", example: "Ma maison est grande." },
        ],
      },
      {
        type: "translation",
        prompt: "Translate: 'I want water.'",
        answer: "Je veux de l'eau.",
      },
      {
        type: "multiple-choice",
        question: "What does 'maison' mean?",
        options: ["Water", "House", "Friend", "Food"],
        correctIndex: 1,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Bonjour encore! Today we continue building your French vocabulary with numbers and common words.",
      instructions:
        "Pay attention to silent letters in French — many words have letters you don't pronounce. I'll highlight these as we go.",
      encouragement:
        "Excellent travail! You're building a strong foundation. Keep it up!",
    },
  },

  // ── Japanese ──────────────────────────────────────────────────────────────
  {
    id: "ja-unit-1-lesson-1",
    unitId: "ja-unit-1",
    title: "Greetings",
    description: "Say hello and goodbye in Japanese.",
    xpReward: 10,
    goals: [
      { description: "Learn basic Japanese greetings" },
      { description: "Understand formal vs casual speech" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "こんにちは", translation: "Hello", example: "こんにちは、元気ですか?" },
          { word: "おはよう", translation: "Good morning", example: "おはよう、今日もいい日だね。" },
          { word: "さようなら", translation: "Goodbye", example: "さようなら、またね。" },
          { word: "ありがとう", translation: "Thank you", example: "ありがとうございます。" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "元気ですか?",
            translation: "How are you?",
            pronunciation: "GEN-ki des-KA",
          },
          {
            phrase: "元気です、ありがとう。",
            translation: "I'm well, thank you.",
            pronunciation: "GEN-ki des, ah-ree-GAH-toh",
          },
          {
            phrase: "はじめまして。",
            translation: "Nice to meet you.",
            pronunciation: "ha-ji-me-MASH-te",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "How do you say 'Good morning' in Japanese?",
        options: ["さようなら", "こんにちは", "おはよう", "ありがとう"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "こんにちは! I'm your AI Japanese teacher. Japanese may look different, but we'll start simple with greetings you'll use every day.",
      instructions:
        "Japanese is written in three scripts, but don't worry — today we focus on pronunciation and meaning. Listen carefully and repeat each phrase.",
      encouragement:
        "すごい! You're doing amazing. Japanese is a beautiful language and you're already making progress!",
    },
  },
  {
    id: "ja-unit-1-lesson-2",
    unitId: "ja-unit-1",
    title: "Common Words",
    description: "Learn everyday Japanese words.",
    xpReward: 10,
    goals: [
      { description: "Learn numbers 1 to 5 in Japanese" },
      { description: "Learn common everyday nouns" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "いち", translation: "one" },
          { word: "に", translation: "two" },
          { word: "さん", translation: "three" },
          { word: "みず", translation: "water", example: "みずをください。" },
          { word: "いえ", translation: "house", example: "わたしのいえはおおきい。" },
        ],
      },
      {
        type: "translation",
        prompt: "Translate: 'Water, please.'",
        answer: "みずをください。",
      },
      {
        type: "multiple-choice",
        question: "What does 'みず' mean?",
        options: ["House", "Friend", "Water", "Food"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Welcome back! Today we learn numbers and common words in Japanese.",
      instructions:
        "Japanese numbers are straightforward. Once you learn 1 to 10, counting to 100 follows a simple pattern. Let's start small today.",
      encouragement:
        "よくできました! Well done! Every word you learn connects you deeper to the Japanese language and culture.",
    },
  },
];

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons.filter((l) => l.unitId === unitId);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
