
export enum Category {
  SUCCESS = 'Success',
  STUDY = 'Study',
  FITNESS = 'Fitness',
  SELF_CONFIDENCE = 'Self-Confidence',
  MENTAL_WELLNESS = 'Mental Wellness'
}

export enum Tone {
  CALM = 'Calm',
  POWERFUL = 'Powerful',
  POSITIVE = 'Positive',
  ENCOURAGING = 'Encouraging'
}

export enum Length {
  SHORT = 'Short',
  MEDIUM = 'Medium'
}

export enum Style {
  MINIMAL = 'Minimal',
  AESTHETIC = 'Aesthetic',
  DARK = 'Dark',
  BRIGHT = 'Bright'
}

export enum AspectRatio {
  SQUARE = '1:1',
  STORY = '9:16',
  WALLPAPER = '4:3'
}

export interface QuoteData {
  text: string;
  author: string;
}

export interface GenerationConfig {
  category: Category;
  tone: Tone;
  length: Length;
  style: Style;
  aspectRatio: AspectRatio;
}

export interface CanvasSettings {
  fontSize: number;
  textColor: string;
  fontFamily: 'font-modern' | 'font-serif' | 'font-script';
  position: 'top' | 'center' | 'bottom';
  overlayOpacity: number;
}
