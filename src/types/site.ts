export interface SiteSettings {
  siteTitle: string;
  metaDesc: string;
  metaKeywords: string;
  copyright: string;
  theme?: Record<string, any>;
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  exploreBtn: string;
  canvasEnabled?: boolean;
}

export interface StoryStat {
  id: string;
  label: string;
  number: string;
  suffix?: string;
}

export interface StoryData {
  badge: string;
  title: string;
  mission: string;
  vision: string;
  purpose: string;
  history: string;
  image: string;
  stats: StoryStat[];
}

export interface ServiceCard {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface WhatWeDoData {
  badge: string;
  title: string;
  description: string;
  cards: ServiceCard[];
}

export interface ProjectItem {
  id: string;
  title: string;
  desc: string;
  category: string;
  year: string;
  image: string;
  link: string;
  featured?: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  desc: string;
  location: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  github: string;
  linkedin: string;
  facebook?: string | null;
  email: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  review: string;
}

export interface QuoteData {
  text: string;
  author: string;
}

export interface ContactData {
  email: string;
  phone: string;
  address: string;
  mapCoords: {
    lat: string;
    lng: string;
  };
}

export interface SiteDatabase {
  settings: SiteSettings;
  hero: HeroData;
  story: StoryData;
  whatWeDo: WhatWeDoData;
  projects: ProjectItem[];
  timeline: TimelineEvent[];
  team: TeamMember[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  quote: QuoteData;
  contact: ContactData;
}
