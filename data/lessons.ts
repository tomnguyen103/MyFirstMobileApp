import { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  // ── Spanish ──────────────────────────────────────────────────────────────
  {
    id: "es-unit-1-lesson-1",
    unitId: "es-unit-1",
    title: "Greetings & Introductions",
    description: "Say hello and introduce yourself in Spanish.",
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
        "Hey! I'm your Spanish teacher — let's kick things off with the most useful skill in any language: how to say hello!",
      instructions:
        "I'll say each greeting, give you the meaning, and then I'd love for you to say it back — just give it a try!",
      encouragement:
        "You're doing great! These greetings will take you so far — ¡muy bien!",
    },
  },
  {
    id: "es-unit-1-lesson-2",
    unitId: "es-unit-1",
    title: "Daily Life",
    description: "Learn everyday Spanish words used around the house and city.",
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
        "Welcome back! Today we're learning some super handy everyday words — numbers and things you'll see around the house.",
      instructions:
        "I'll give you the Spanish word and what it means — picture it in your head and repeat it back when you're ready.",
      encouragement:
        "Nicely done! Every word you pick up brings you closer to sounding like a local — ¡sigue adelante!",
    },
  },
  {
    id: "es-unit-1-lesson-3",
    unitId: "es-unit-1",
    title: "At the Café",
    description: "Order food and drinks at a Spanish café.",
    xpReward: 10,
    goals: [
      { description: "Learn café and restaurant vocabulary" },
      { description: "Practice ordering food and drinks" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "café", translation: "coffee", example: "Un café con leche, por favor." },
          { word: "té", translation: "tea", example: "¿Tiene té verde?" },
          { word: "mesero", translation: "waiter", example: "El mesero trae la comida." },
          { word: "menú", translation: "menu", example: "¿Me da el menú, por favor?" },
          { word: "cuenta", translation: "bill / check", example: "La cuenta, por favor." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "¿Me trae la cuenta, por favor?",
            translation: "Can I have the bill, please?",
            pronunciation: "meh TRA-eh la KWEN-ta por fa-VOR",
          },
          {
            phrase: "Quisiera ordenar.",
            translation: "I would like to order.",
            pronunciation: "kee-SYER-a or-de-NAR",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'mesero' mean?",
        options: ["Menu", "Coffee", "Waiter", "Bill"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Hola! Imagine you're sitting at a cozy café in Madrid — that's exactly where today's lesson takes us!",
      instructions:
        "I'll walk you through how to order, and then it's your turn — don't worry if it's not perfect, we'll figure it out together.",
      encouragement:
        "Excellent! You're practically ready to stroll into any café in Spain — ¡buen provecho!",
    },
  },
  {
    id: "es-unit-1-lesson-4",
    unitId: "es-unit-1",
    title: "Travel & Directions",
    description: "Ask for and understand directions in Spanish.",
    xpReward: 10,
    goals: [
      { description: "Learn direction and transport vocabulary" },
      { description: "Practice asking for directions" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "aeropuerto", translation: "airport", example: "El aeropuerto está lejos." },
          { word: "hotel", translation: "hotel", example: "¿Dónde está el hotel?" },
          { word: "mapa", translation: "map", example: "Necesito un mapa." },
          { word: "norte", translation: "north", example: "Ve hacia el norte." },
          { word: "derecha", translation: "right", example: "Gira a la derecha." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "¿Dónde está la estación?",
            translation: "Where is the station?",
            pronunciation: "DON-deh es-TA la es-ta-SYON",
          },
          {
            phrase: "Gire a la izquierda.",
            translation: "Turn left.",
            pronunciation: "HEE-reh a la is-KYER-da",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'norte' mean?",
        options: ["South", "East", "West", "North"],
        correctIndex: 3,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "¡Hola! Let's say you're wandering through a beautiful Spanish city — today I'll teach you how to ask for directions.",
      instructions:
        "I'll say each phrase with the translation, and then I'd love for you to try it back — slow is totally fine!",
      encouragement:
        "Yes! You've got this — now you can navigate like a local. ¡Muy bien!",
    },
  },
  {
    id: "es-unit-1-lesson-5",
    unitId: "es-unit-1",
    title: "Shopping",
    description: "Buy things and negotiate prices in Spanish.",
    xpReward: 10,
    goals: [
      { description: "Learn shopping vocabulary" },
      { description: "Practice asking for prices" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "tienda", translation: "shop / store", example: "La tienda está abierta." },
          { word: "precio", translation: "price", example: "¿Cuál es el precio?" },
          { word: "descuento", translation: "discount", example: "¿Hay algún descuento?" },
          { word: "caro", translation: "expensive", example: "Esto es muy caro." },
          { word: "barato", translation: "cheap", example: "¡Qué barato!" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "¿Cuánto cuesta esto?",
            translation: "How much does this cost?",
            pronunciation: "KWAN-toh KWES-ta ES-toh",
          },
          {
            phrase: "¿Tiene una talla más grande?",
            translation: "Do you have a bigger size?",
            pronunciation: "TYE-neh OO-na TA-ya mas GRAN-deh",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'barato' mean?",
        options: ["Expensive", "Cheap", "Discount", "Price"],
        correctIndex: 1,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "¡Hola! Picture a bustling Spanish market — today we're learning how to shop and ask about prices!",
      instructions:
        "I'll introduce each phrase step by step, and whenever you're ready, give it a go — I'll gently guide you if needed.",
      encouragement:
        "Fantastic! You're shopping like a pro now — ¡buen trabajo!",
    },
  },
  {
    id: "es-unit-1-lesson-6",
    unitId: "es-unit-1",
    title: "Family & Friends",
    description: "Talk about your family and friends in Spanish.",
    xpReward: 10,
    goals: [
      { description: "Learn family member vocabulary" },
      { description: "Describe your family in Spanish" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "familia", translation: "family", example: "Mi familia es grande." },
          { word: "madre", translation: "mother", example: "Mi madre se llama Ana." },
          { word: "padre", translation: "father", example: "Mi padre trabaja mucho." },
          { word: "hermano", translation: "brother", example: "Tengo un hermano mayor." },
          { word: "amigo", translation: "friend", example: "Él es mi mejor amigo." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Esta es mi familia.",
            translation: "This is my family.",
            pronunciation: "ES-ta es mee fa-MEE-lya",
          },
          {
            phrase: "Tengo dos hermanos.",
            translation: "I have two siblings.",
            pronunciation: "TEN-go dos er-MA-nos",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'hermano' mean?",
        options: ["Friend", "Father", "Brother", "Mother"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "¡Hola! Today we're talking about the people who matter most — your family and friends.",
      instructions:
        "I'll say each family word with its meaning — then try using it in a sentence about your own family!",
      encouragement:
        "That's wonderful! Now you can talk about the people you love in Spanish — ¡sigue así!",
    },
  },

  // ── French ────────────────────────────────────────────────────────────────
  {
    id: "fr-unit-1-lesson-1",
    unitId: "fr-unit-1",
    title: "Greetings & Introductions",
    description: "Say hello and introduce yourself in French.",
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
        "Bonjour! I'm so excited to start this journey with you — let's begin with French greetings, the very first step!",
      instructions:
        "I'll say each phrase nice and slowly with the translation — just repeat after me and don't worry about being perfect.",
      encouragement:
        "Très bien! You're picking this up really fast — keep it up, you're doing wonderfully!",
    },
  },
  {
    id: "fr-unit-1-lesson-2",
    unitId: "fr-unit-1",
    title: "Daily Life",
    description: "Learn everyday French words used around the house and city.",
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
        "Bonjour encore! Let's build on what you know — today we're tackling numbers and everyday words you'll use constantly.",
      instructions:
        "I'll say each word, explain what it means, and I'd love for you to say it back — notice the silent letters as we go!",
      encouragement:
        "Excellent travail! You're building a really solid foundation here — keep going!",
    },
  },
  {
    id: "fr-unit-1-lesson-3",
    unitId: "fr-unit-1",
    title: "At the Café",
    description: "Order food and drinks at a French café.",
    xpReward: 10,
    goals: [
      { description: "Learn café and restaurant vocabulary" },
      { description: "Practice ordering food and drinks in French" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "café", translation: "coffee", example: "Un café, s'il vous plaît." },
          { word: "thé", translation: "tea", example: "Je voudrais un thé." },
          { word: "serveur", translation: "waiter", example: "Le serveur est très aimable." },
          { word: "carte", translation: "menu", example: "La carte, s'il vous plaît." },
          { word: "addition", translation: "bill / check", example: "L'addition, s'il vous plaît." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "L'addition, s'il vous plaît.",
            translation: "The bill, please.",
            pronunciation: "la-dee-SYON, seel voo PLAY",
          },
          {
            phrase: "Je voudrais commander.",
            translation: "I would like to order.",
            pronunciation: "zhuh voo-DREH koh-mahn-DAY",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'addition' mean in a café context?",
        options: ["Menu", "Waiter", "Bill", "Coffee"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Bonjour! Imagine you're stepping into a beautiful Parisian café — that's exactly the scene for today's lesson!",
      instructions:
        "I'll show you how to order like a local — try each phrase after me and I'll help you if you get stuck.",
      encouragement:
        "Magnifique! You're genuinely ready for a Parisian café now — bon appétit!",
    },
  },
  {
    id: "fr-unit-1-lesson-4",
    unitId: "fr-unit-1",
    title: "Travel & Directions",
    description: "Ask for and understand directions in French.",
    xpReward: 10,
    goals: [
      { description: "Learn direction and transport vocabulary" },
      { description: "Practice asking for directions in French" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "aéroport", translation: "airport", example: "L'aéroport est loin." },
          { word: "hôtel", translation: "hotel", example: "Où est l'hôtel?" },
          { word: "carte", translation: "map", example: "J'ai besoin d'une carte." },
          { word: "nord", translation: "north", example: "Allez vers le nord." },
          { word: "droite", translation: "right", example: "Tournez à droite." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Où est la gare?",
            translation: "Where is the train station?",
            pronunciation: "OO eh la GAR",
          },
          {
            phrase: "Tournez à gauche.",
            translation: "Turn left.",
            pronunciation: "toor-NAY ah GOHSH",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'droite' mean?",
        options: ["Left", "North", "Right", "South"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Bonjour! Let's say you're wandering the streets of Paris — today I'll teach you how to ask where things are.",
      instructions:
        "I'll say each direction phrase with the translation — give it a try after me, even if it sounds tricky at first!",
      encouragement:
        "Bravo! You can really find your way around now — continuez comme ça!",
    },
  },
  {
    id: "fr-unit-1-lesson-5",
    unitId: "fr-unit-1",
    title: "Shopping",
    description: "Buy things and ask about prices in French.",
    xpReward: 10,
    goals: [
      { description: "Learn shopping vocabulary in French" },
      { description: "Practice asking for prices" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "magasin", translation: "shop / store", example: "Le magasin est ouvert." },
          { word: "prix", translation: "price", example: "Quel est le prix?" },
          { word: "réduction", translation: "discount", example: "Il y a une réduction?" },
          { word: "cher", translation: "expensive", example: "C'est trop cher." },
          { word: "pas cher", translation: "cheap / affordable", example: "C'est pas cher!" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Combien ça coûte?",
            translation: "How much does it cost?",
            pronunciation: "komb-YAN sa KOOT",
          },
          {
            phrase: "Je cherche une robe.",
            translation: "I am looking for a dress.",
            pronunciation: "zhuh SHAIRSH oon ROB",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'cher' mean?",
        options: ["Cheap", "Price", "Expensive", "Discount"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Bonjour! France is famous for its incredible shopping — and today we're learning exactly how to do it in French!",
      instructions:
        "I'll walk through each phrase with you — try repeating after me and I'll help you sound natural.",
      encouragement:
        "Parfait! You're all set to shop in Paris — bon shopping!",
    },
  },
  {
    id: "fr-unit-1-lesson-6",
    unitId: "fr-unit-1",
    title: "Family & Friends",
    description: "Talk about your family and friends in French.",
    xpReward: 10,
    goals: [
      { description: "Learn family member vocabulary in French" },
      { description: "Describe your family in French" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "famille", translation: "family", example: "Ma famille est grande." },
          { word: "mère", translation: "mother", example: "Ma mère s'appelle Claire." },
          { word: "père", translation: "father", example: "Mon père travaille beaucoup." },
          { word: "frère", translation: "brother", example: "J'ai un grand frère." },
          { word: "ami(e)", translation: "friend", example: "C'est mon meilleur ami." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Voici ma famille.",
            translation: "Here is my family.",
            pronunciation: "vwa-SEE ma fa-MEE",
          },
          {
            phrase: "J'ai deux frères.",
            translation: "I have two brothers.",
            pronunciation: "zhay duh FRAIR",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'frère' mean?",
        options: ["Friend", "Father", "Sister", "Brother"],
        correctIndex: 3,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Bonjour! Today we're talking about famille et amis — the people closest to your heart.",
      instructions:
        "I'll say each family word with its meaning — then try describing your own family using what you've learned!",
      encouragement:
        "Très bien! You can talk about your loved ones in French now — continuez!",
    },
  },

  // ── Japanese ──────────────────────────────────────────────────────────────
  {
    id: "ja-unit-1-lesson-1",
    unitId: "ja-unit-1",
    title: "Greetings & Introductions",
    description: "Say hello and introduce yourself in Japanese.",
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
        "こんにちは! Don't let the script worry you — today we're just focusing on how these greetings sound and what they mean.",
      instructions:
        "I'll say each phrase slowly and clearly with the translation — just repeat after me, nice and easy!",
      encouragement:
        "すごい! You're genuinely doing amazing — Japanese is a beautiful language and you're already making real progress!",
    },
  },
  {
    id: "ja-unit-1-lesson-2",
    unitId: "ja-unit-1",
    title: "Daily Life",
    description: "Learn everyday Japanese words used around the house and city.",
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
        "Welcome back! Today we're learning Japanese numbers and some everyday words you'll use all the time.",
      instructions:
        "I'll give you each word with its meaning — just picture what it looks like and say it back when you're ready.",
      encouragement:
        "よくできました! Seriously, well done — every word you learn connects you deeper to Japanese culture!",
    },
  },
  {
    id: "ja-unit-1-lesson-3",
    unitId: "ja-unit-1",
    title: "At the Café",
    description: "Order food and drinks at a Japanese café.",
    xpReward: 10,
    goals: [
      { description: "Learn café and restaurant vocabulary in Japanese" },
      { description: "Practice ordering food and drinks" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "コーヒー", translation: "coffee", example: "コーヒーをください。" },
          { word: "おちゃ", translation: "green tea", example: "おちゃがすきです。" },
          { word: "てんいん", translation: "staff / waiter", example: "てんいんをよんでください。" },
          { word: "メニュー", translation: "menu", example: "メニューをみせてください。" },
          { word: "おかんじょう", translation: "bill / check", example: "おかんじょうをください。" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "おかんじょうをください。",
            translation: "The bill, please.",
            pronunciation: "o-kan-JOH wo ku-da-SAI",
          },
          {
            phrase: "ちゅうもんをおねがいします。",
            translation: "I would like to order.",
            pronunciation: "chuu-MON wo o-ne-GAI shi-mas",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'コーヒー' mean?",
        options: ["Tea", "Menu", "Coffee", "Bill"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "こんにちは! Japan's café scene is incredible — let's learn how to order like a true local today!",
      instructions:
        "I'll take you through the café phrases one by one with translations — give each one a try after me!",
      encouragement:
        "すばらしい! You're totally ready to enjoy a Japanese café — よくできました!",
    },
  },
  {
    id: "ja-unit-1-lesson-4",
    unitId: "ja-unit-1",
    title: "Travel & Directions",
    description: "Ask for and understand directions in Japanese.",
    xpReward: 10,
    goals: [
      { description: "Learn direction and transport vocabulary in Japanese" },
      { description: "Practice asking for directions" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "くうこう", translation: "airport", example: "くうこうはどこですか?" },
          { word: "ホテル", translation: "hotel", example: "ホテルはちかいです。" },
          { word: "ちず", translation: "map", example: "ちずをみせてください。" },
          { word: "きた", translation: "north", example: "きたにむかってください。" },
          { word: "みぎ", translation: "right", example: "みぎにまがってください。" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "えきはどこですか?",
            translation: "Where is the train station?",
            pronunciation: "e-KI wa do-KO des-KA",
          },
          {
            phrase: "ひだりにまがってください。",
            translation: "Please turn left.",
            pronunciation: "hi-DA-ri ni ma-GAT-te ku-da-SAI",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'みぎ' mean?",
        options: ["Left", "North", "South", "Right"],
        correctIndex: 3,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "こんにちは! Japan's train system is amazing — and today I'll teach you how to ask for directions when you need them.",
      instructions:
        "I'll say each phrase with the translation — try saying it back to me and I'll help you with the rhythm.",
      encouragement:
        "すごい! You can find your way around Japan now — どんどんすすもう!",
    },
  },
  {
    id: "ja-unit-1-lesson-5",
    unitId: "ja-unit-1",
    title: "Shopping",
    description: "Buy things and ask about prices in Japanese.",
    xpReward: 10,
    goals: [
      { description: "Learn shopping vocabulary in Japanese" },
      { description: "Practice asking for prices" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "みせ", translation: "shop / store", example: "このみせはやすいです。" },
          { word: "ねだん", translation: "price", example: "ねだんはいくらですか?" },
          { word: "わりびき", translation: "discount", example: "わりびきがありますか?" },
          { word: "たかい", translation: "expensive", example: "これはたかいです。" },
          { word: "やすい", translation: "cheap / inexpensive", example: "これはやすいです。" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "これはいくらですか?",
            translation: "How much is this?",
            pronunciation: "ko-RE wa i-KU-ra des-KA",
          },
          {
            phrase: "べつのサイズはありますか?",
            translation: "Do you have another size?",
            pronunciation: "BET-su no SAI-zu wa a-ri-MAS-KA",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'やすい' mean?",
        options: ["Expensive", "Discount", "Cheap", "Price"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "こんにちは! From convenience stores to department stores, Japan's shopping is incredible — let's learn how to navigate it!",
      instructions:
        "I'll walk you through each shopping phrase — say it back after me and I'll help you get the sounds just right.",
      encouragement:
        "よくできました! You're ready to shop in Japan — いっぱいかいものしよう!",
    },
  },
  {
    id: "ja-unit-1-lesson-6",
    unitId: "ja-unit-1",
    title: "Family & Friends",
    description: "Talk about your family and friends in Japanese.",
    xpReward: 10,
    goals: [
      { description: "Learn family member vocabulary in Japanese" },
      { description: "Describe your family in Japanese" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "かぞく", translation: "family", example: "わたしのかぞくはおおきいです。" },
          { word: "おかあさん", translation: "mother", example: "おかあさんはやさしいです。" },
          { word: "おとうさん", translation: "father", example: "おとうさんはいしゃです。" },
          { word: "おにいさん", translation: "older brother", example: "おにいさんはがくせいです。" },
          { word: "ともだち", translation: "friend", example: "ともだちとあそびます。" },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "これはわたしのかぞくです。",
            translation: "This is my family.",
            pronunciation: "ko-RE wa wa-ta-SHI no ka-ZO-ku des",
          },
          {
            phrase: "あにがふたりいます。",
            translation: "I have two older brothers.",
            pronunciation: "a-NI ga fu-TA-ri i-MAS",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'ともだち' mean?",
        options: ["Family", "Brother", "Mother", "Friend"],
        correctIndex: 3,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "こんにちは! Today we're learning how to talk about かぞく — that means 'family', and it's one of the most important topics in any language.",
      instructions:
        "I'll say each family word with the translation — then try using it in a simple sentence about your own family after me!",
      encouragement:
        "すばらしい! You can talk about your family in Japanese now — がんばってください!",
    },
  },

  // ── Vietnamese ────────────────────────────────────────────────────────────
  {
    id: "vi-unit-1-lesson-1",
    unitId: "vi-unit-1",
    title: "Greetings & Introductions",
    description: "Say hello and introduce yourself in Vietnamese.",
    xpReward: 10,
    goals: [
      { description: "Learn basic Vietnamese greetings" },
      { description: "Practice polite introductions" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "Xin chào", translation: "Hello", example: "Xin chào, bạn khỏe không?" },
          { word: "Tạm biệt", translation: "Goodbye", example: "Tạm biệt, hẹn gặp lại." },
          { word: "Chào buổi sáng", translation: "Good morning", example: "Chào buổi sáng, cô Lan." },
          { word: "Cảm ơn", translation: "Thank you", example: "Cảm ơn bạn rất nhiều." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Bạn khỏe không?",
            translation: "How are you?",
            pronunciation: "bahn khweh khom",
          },
          {
            phrase: "Tôi khỏe, cảm ơn.",
            translation: "I am well, thank you.",
            pronunciation: "toy khweh, gahm uhn",
          },
          {
            phrase: "Rất vui được gặp bạn.",
            translation: "Nice to meet you.",
            pronunciation: "zuht vui duhk gap bahn",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "How do you say 'Thank you' in Vietnamese?",
        options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Chào buổi sáng"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Xin chào! I'm your Vietnamese teacher. Let's start with greetings you can use right away.",
      instructions:
        "I'll say each phrase with the meaning, then you try it back slowly. Pay attention to the gentle tone changes.",
      encouragement:
        "Giỏi lắm! You're already building a friendly Vietnamese foundation.",
    },
  },
  {
    id: "vi-unit-1-lesson-2",
    unitId: "vi-unit-1",
    title: "Daily Life",
    description: "Learn everyday Vietnamese words used around the house and city.",
    xpReward: 10,
    goals: [
      { description: "Learn numbers 1 to 5 in Vietnamese" },
      { description: "Learn common everyday nouns" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "một", translation: "one" },
          { word: "hai", translation: "two" },
          { word: "ba", translation: "three" },
          { word: "nước", translation: "water", example: "Cho tôi nước, làm ơn." },
          { word: "nhà", translation: "house", example: "Nhà của tôi ở gần đây." },
        ],
      },
      {
        type: "translation",
        prompt: "Translate: 'Water, please.'",
        answer: "Cho tôi nước, làm ơn.",
      },
      {
        type: "multiple-choice",
        question: "What does 'nhà' mean?",
        options: ["Water", "House", "Friend", "Food"],
        correctIndex: 1,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Welcome back! Today we're learning Vietnamese numbers and everyday words you'll hear constantly.",
      instructions:
        "I'll say each word clearly with its meaning. Repeat after me and picture the word in a real-life moment.",
      encouragement:
        "Tốt lắm! These everyday words will help you understand Vietnamese faster.",
    },
  },
  {
    id: "vi-unit-1-lesson-3",
    unitId: "vi-unit-1",
    title: "At the Café",
    description: "Order food and drinks at a Vietnamese café.",
    xpReward: 10,
    goals: [
      { description: "Learn café and restaurant vocabulary in Vietnamese" },
      { description: "Practice ordering food and drinks" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "cà phê", translation: "coffee", example: "Cho tôi một ly cà phê." },
          { word: "trà", translation: "tea", example: "Tôi thích trà nóng." },
          { word: "nhân viên", translation: "staff / waiter", example: "Nhân viên rất thân thiện." },
          { word: "thực đơn", translation: "menu", example: "Cho tôi xem thực đơn." },
          { word: "hóa đơn", translation: "bill / check", example: "Cho tôi hóa đơn, làm ơn." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Cho tôi hóa đơn, làm ơn.",
            translation: "Can I have the bill, please?",
            pronunciation: "cho toy hwa don, lahm uhn",
          },
          {
            phrase: "Tôi muốn gọi món.",
            translation: "I would like to order.",
            pronunciation: "toy muon goy mon",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'cà phê' mean?",
        options: ["Tea", "Menu", "Coffee", "Bill"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Xin chào! Imagine you're at a cozy Vietnamese café. Today we'll learn how to order with confidence.",
      instructions:
        "I'll introduce each café phrase with its meaning, then you repeat it after me at a comfortable pace.",
      encouragement:
        "Tuyệt vời! You're ready to enjoy a Vietnamese café moment.",
    },
  },
  {
    id: "vi-unit-1-lesson-4",
    unitId: "vi-unit-1",
    title: "Travel & Directions",
    description: "Ask for and understand directions in Vietnamese.",
    xpReward: 10,
    goals: [
      { description: "Learn direction and transport vocabulary in Vietnamese" },
      { description: "Practice asking for directions" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "sân bay", translation: "airport", example: "Sân bay ở đâu?" },
          { word: "khách sạn", translation: "hotel", example: "Khách sạn gần đây không?" },
          { word: "bản đồ", translation: "map", example: "Tôi cần một bản đồ." },
          { word: "phía bắc", translation: "north", example: "Đi về phía bắc." },
          { word: "bên phải", translation: "right", example: "Rẽ bên phải." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Nhà ga ở đâu?",
            translation: "Where is the station?",
            pronunciation: "nya ga uh dau",
          },
          {
            phrase: "Rẽ trái, làm ơn.",
            translation: "Turn left, please.",
            pronunciation: "zeh chai, lahm uhn",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'bên phải' mean?",
        options: ["Left", "North", "Right", "South"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Xin chào! Let's pretend you're exploring a city in Vietnam and need to ask for directions.",
      instructions:
        "I'll say each travel phrase with the translation. Try repeating it, and we'll keep the rhythm simple.",
      encouragement:
        "Hay quá! You can now ask your way around in Vietnamese.",
    },
  },
  {
    id: "vi-unit-1-lesson-5",
    unitId: "vi-unit-1",
    title: "Shopping",
    description: "Buy things and ask about prices in Vietnamese.",
    xpReward: 10,
    goals: [
      { description: "Learn shopping vocabulary in Vietnamese" },
      { description: "Practice asking for prices" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "cửa hàng", translation: "shop / store", example: "Cửa hàng này mở cửa." },
          { word: "giá", translation: "price", example: "Giá bao nhiêu?" },
          { word: "giảm giá", translation: "discount", example: "Có giảm giá không?" },
          { word: "đắt", translation: "expensive", example: "Cái này hơi đắt." },
          { word: "rẻ", translation: "cheap / inexpensive", example: "Cái này rất rẻ." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Cái này bao nhiêu tiền?",
            translation: "How much does this cost?",
            pronunciation: "gai nay bao nyew tyen",
          },
          {
            phrase: "Có kích cỡ khác không?",
            translation: "Do you have another size?",
            pronunciation: "gaw kik guh khak khom",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'rẻ' mean?",
        options: ["Expensive", "Discount", "Cheap", "Price"],
        correctIndex: 2,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Xin chào! Vietnamese markets are lively and fun, so today we'll practice shopping and asking prices.",
      instructions:
        "I'll guide you through each shopping phrase. Repeat after me and imagine you're pointing to something you want to buy.",
      encouragement:
        "Xuất sắc! You're ready to shop in Vietnamese.",
    },
  },
  {
    id: "vi-unit-1-lesson-6",
    unitId: "vi-unit-1",
    title: "Family & Friends",
    description: "Talk about your family and friends in Vietnamese.",
    xpReward: 10,
    goals: [
      { description: "Learn family member vocabulary in Vietnamese" },
      { description: "Describe your family in Vietnamese" },
    ],
    activities: [
      {
        type: "vocabulary",
        items: [
          { word: "gia đình", translation: "family", example: "Gia đình tôi rất vui vẻ." },
          { word: "mẹ", translation: "mother", example: "Mẹ tôi rất tốt." },
          { word: "bố", translation: "father", example: "Bố tôi làm việc nhiều." },
          { word: "anh trai", translation: "older brother", example: "Tôi có một anh trai." },
          { word: "bạn", translation: "friend", example: "Bạn tôi học tiếng Việt." },
        ],
      },
      {
        type: "phrase",
        items: [
          {
            phrase: "Đây là gia đình tôi.",
            translation: "This is my family.",
            pronunciation: "day lah za din toy",
          },
          {
            phrase: "Tôi có hai anh em.",
            translation: "I have two siblings.",
            pronunciation: "toy gaw high anh em",
          },
        ],
      },
      {
        type: "multiple-choice",
        question: "What does 'gia đình' mean?",
        options: ["Friend", "Family", "Father", "Mother"],
        correctIndex: 1,
      },
    ],
    aiTeacherPrompt: {
      intro:
        "Xin chào! Today we're talking about family and friends, one of the warmest topics in Vietnamese.",
      instructions:
        "I'll say each family word with its meaning. Then try using it in a short sentence about someone you know.",
      encouragement:
        "Rất tốt! You can now talk about people you care about in Vietnamese.",
    },
  },
];

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons.filter((l) => l.unitId === unitId);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
