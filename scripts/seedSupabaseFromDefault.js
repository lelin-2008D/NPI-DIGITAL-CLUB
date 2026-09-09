import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this seed script.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const jsonPath = resolve(repoRoot, 'data/default-data.json');
const db = JSON.parse(await readFile(jsonPath, 'utf8'));

async function upsert(table, rows) {
  const payload = Array.isArray(rows) ? rows : [rows];
  const { error } = await supabase.from(table).upsert(payload);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`Seeded ${table}: ${payload.length} row(s)`);
}

await upsert('site_settings', {
  id: 'default',
  site_title: db.settings.siteTitle,
  meta_desc: db.settings.metaDesc,
  meta_keywords: db.settings.metaKeywords,
  copyright: db.settings.copyright,
  theme: db.settings.theme || {}
});

await upsert('hero_sections', {
  id: 'default',
  title: db.hero.title,
  subtitle: db.hero.subtitle,
  description: db.hero.description,
  explore_btn: db.hero.exploreBtn,
  canvas_enabled: db.hero.canvasEnabled ?? true
});

await upsert('story_sections', {
  id: 'default',
  badge: db.story.badge,
  title: db.story.title,
  mission: db.story.mission,
  vision: db.story.vision,
  purpose: db.story.purpose,
  history: db.story.history,
  image_url: db.story.image
});

await upsert('story_stats', (db.story.stats || []).map((item, index) => ({
  id: item.id,
  label: item.label,
  number_text: item.number,
  suffix: item.suffix || '',
  sort_order: index,
  active: true
})));

await upsert('service_sections', {
  id: 'default',
  badge: db.whatWeDo.badge,
  title: db.whatWeDo.title,
  description: db.whatWeDo.description
});

await upsert('service_cards', (db.whatWeDo.cards || []).map((item, index) => ({
  id: item.id,
  title: item.title,
  description: item.desc,
  icon: item.icon,
  sort_order: index,
  active: true
})));

await upsert('projects', (db.projects || []).map((item, index) => ({
  id: item.id,
  title: item.title,
  description: item.desc,
  category: item.category,
  year: item.year,
  image_url: item.image,
  link_url: item.link,
  featured: Boolean(item.featured),
  sort_order: index,
  published: true
})));

await upsert('timeline_events', (db.timeline || []).map((item, index) => ({
  id: item.id,
  date_label: item.date,
  title: item.title,
  description: item.desc,
  location: item.location,
  sort_order: index,
  published: true
})));

await upsert('team_members', (db.team || []).map((item, index) => ({
  id: item.id,
  name: item.name,
  role: item.role,
  bio: item.bio,
  image_url: item.image,
  github_url: item.github,
  linkedin_url: item.linkedin,
  facebook_url: item.facebook || null,
  email: item.email,
  sort_order: index,
  published: true
})));

await upsert('gallery_items', (db.gallery || []).map((item, index) => ({
  id: item.id,
  image_url: item.image,
  caption: item.caption,
  category: item.category,
  sort_order: index,
  published: true
})));

await upsert('testimonials', (db.testimonials || []).map((item, index) => ({
  id: item.id,
  name: item.name,
  role: item.role,
  review: item.review,
  sort_order: index,
  published: true
})));

await upsert('quote_sections', {
  id: 'default',
  text: db.quote.text,
  author: db.quote.author
});

await upsert('contact_details', {
  id: 'default',
  email: db.contact.email,
  phone: db.contact.phone,
  address: db.contact.address,
  lat: db.contact.mapCoords?.lat || null,
  lng: db.contact.mapCoords?.lng || null
});

console.log('Supabase seed completed.');
