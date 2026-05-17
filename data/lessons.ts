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
        "Welcome back! Today we're going to expand your vocabulary with common everyday words.",
      instructions:
        "I'll say each word and its meaning. Try to create a mental image for each word — it helps you remember them faster.",
      encouragement:
        "Every word you learn is a step closer to fluency. ¡Sigue adelante!",
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
        "¡Bienvenido! Today we visit a Spanish café. I'll teach you how to order like a local.",
      instructions:
        "Café culture is huge in Spanish-speaking countries. These phrases will help you feel at home in any café.",
      encouragement:
        "¡Excelente! You're ready to order at any café. ¡Buen provecho!",
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
        "¡Hola viajero! Today we learn how to navigate Spanish cities with confidence.",
      instructions:
        "Knowing directions is essential when travelling. Practice these phrases out loud to build confidence.",
      encouragement:
        "¡Muy bien! You can now ask for directions in Spanish. Keep exploring!",
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
        "¡Vamos de compras! Today we head to a Spanish market to practice shopping phrases.",
      instructions:
        "In many Spanish-speaking countries, bargaining is common. These phrases will help you shop confidently.",
      encouragement:
        "¡Fantástico! You're now a savvy Spanish shopper. ¡Buen trabajo!",
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
        "¡Hola familia! Today we talk about the people closest to you — family and friends.",
      instructions:
        "Family vocabulary is used every day. Practice introducing your family members in Spanish.",
      encouragement:
        "¡Qué bien! You can now talk about your loved ones in Spanish. ¡Sigue así!",
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
        "Bonjour encore! Today we continue building your French vocabulary with numbers and common words.",
      instructions:
        "Pay attention to silent letters in French — many words have letters you don't pronounce. I'll highlight these as we go.",
      encouragement:
        "Excellent travail! You're building a strong foundation. Keep it up!",
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
        "Bonjour! French café culture is world-famous. Let's learn how to enjoy it like a Parisian!",
      instructions:
        "In France, asking for the bill is customary — the waiter won't bring it unless you ask. Practice these phrases!",
      encouragement:
        "Magnifique! You're ready for a Parisian café. Bon appétit!",
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
        "Bonjour voyageur! Today we navigate the beautiful streets of France in French.",
      instructions:
        "French cities are easy to navigate once you know the direction words. Let's practice!",
      encouragement:
        "Bravo! You can now find your way around France. Continuez comme ça!",
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
        "Bonjour fashionista! France is famous for its shopping. Let's learn how to shop in French.",
      instructions:
        "French sales staff are polite and formal. These phrases will help you shop with confidence.",
      encouragement:
        "Parfait! You're ready to shop in Paris. Bon shopping!",
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
        "Bonjour! Today we talk about the most important people in our lives — famille et amis!",
      instructions:
        "Family words are used every day. Practice describing your family members in French.",
      encouragement:
        "Très bien! You can now talk about your loved ones in French. Continuez!",
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
        "Welcome back! Today we learn numbers and common words in Japanese.",
      instructions:
        "Japanese numbers are straightforward. Once you learn 1 to 10, counting to 100 follows a simple pattern. Let's start small today.",
      encouragement:
        "よくできました! Well done! Every word you learn connects you deeper to the Japanese language and culture.",
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
        "こんにちは! Japan has amazing café culture. Let's learn how to order like a local!",
      instructions:
        "Japanese cafés often have detailed menus with pictures. These phrases will help you order confidently.",
      encouragement:
        "すばらしい! You're ready to enjoy a Japanese café. よくできました!",
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
        "こんにちは旅人! Japan has an excellent transport system. Let's learn how to navigate it!",
      instructions:
        "Japanese trains are famous for being on time. Knowing how to ask for directions will make your journey smooth.",
      encouragement:
        "すごい! You can now find your way around Japan. どんどんすすもう!",
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
        "こんにちは! Japan has incredible shopping from convenience stores to department stores. Let's learn how to shop!",
      instructions:
        "In Japan, prices are fixed so bargaining is uncommon. But knowing these phrases will help you shop smoothly.",
      encouragement:
        "よくできました! You're ready to shop in Japan. いっぱいかいものしよう!",
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
        "こんにちは! Today we learn about family and friendship — かぞくとともだち!",
      instructions:
        "Japanese has different words for family members depending on whether they're yours or someone else's. Today we focus on your own family.",
      encouragement:
        "すばらしい! You can now talk about your family in Japanese. がんばってください!",
    },
  },
];

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons.filter((l) => l.unitId === unitId);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
