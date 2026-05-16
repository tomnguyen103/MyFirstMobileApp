export type Language = {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  totalUnits: number;
  learners?: string;
};

export type VocabItem = {
  word: string;
  translation: string;
  example?: string;
};

export type Phrase = {
  phrase: string;
  translation: string;
  pronunciation?: string;
};

export type VocabularyActivity = {
  type: "vocabulary";
  items: VocabItem[];
};

export type PhraseActivity = {
  type: "phrase";
  items: Phrase[];
};

export type MultipleChoiceActivity = {
  type: "multiple-choice";
  question: string;
  options: string[];
  correctIndex: number;
};

export type TranslationActivity = {
  type: "translation";
  prompt: string;
  answer: string;
};

export type Activity =
  | VocabularyActivity
  | PhraseActivity
  | MultipleChoiceActivity
  | TranslationActivity;

export type LessonGoal = {
  description: string;
};

export type AITeacherPrompt = {
  intro: string;
  instructions: string;
  encouragement: string;
};

export type Lesson = {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  goals: LessonGoal[];
  activities: Activity[];
  aiTeacherPrompt: AITeacherPrompt;
};

export type Unit = {
  id: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
  lessonIds: string[];
};
