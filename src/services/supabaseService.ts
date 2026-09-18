import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import type { SiteDatabase } from '../types/site';

const SINGLETON_ID = 'default';

const sortByOrder = (items: any[] = []) =>
  [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const cleanObject = (value: Record<string, any>) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));

const postgrestTextIn = (ids: (string | number)[]) =>
  `(${ids.map((id) => `"${String(id).replace(/"/g, '\\"')}"`).join(',')})`;

async function requireClient() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

function throwIfError(result: { error: any; data?: any }, context: string) {
  if (result.error) {
    throw new Error(`${context}: ${result.error.message}`);
  }
  return result.data;
}

async function maybeSingle(supabase: any, table: string) {
  const result = await supabase.from(table).select('*').eq('id', SINGLETON_ID).maybeSingle();
  if (result.error) throw new Error(`Failed to load ${table}: ${result.error.message}`);
  return result.data;
}

async function orderedRows(supabase: any, table: string, includeUnpublished = false, statusColumn = 'published') {
  let query = supabase.from(table).select('*').order('sort_order', { ascending: true });
  if (!includeUnpublished && statusColumn) {
    query = query.eq(statusColumn, true);
  }
  const result = await query;
  if (result.error) throw new Error(`Failed to load ${table}: ${result.error.message}`);
  return result.data || [];
}

export class SupabaseService {
  static isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  static async getSession() {
    if (!this.isConfigured()) return { session: null, user: null, role: null };
    const supabase = await requireClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    const user = data.session?.user || null;
    if (!user) return { session: null, user: null, role: null };

    const profile = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile.error) throw profile.error;

    return {
      session: data.session,
      user,
      role: profile.data?.role || null,
    };
  }

  static async signIn(email: string, password: string) {
    const supabase = await requireClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { role } = await this.getSession();
    if (role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('This account is not authorized for the admin console.');
    }

    return { user: data.user, session: data.session, role };
  }

  static async signOut() {
    if (!this.isConfigured()) return;
    const supabase = await requireClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async fetchSiteData({ includeUnpublished = false } = {}): Promise<SiteDatabase | null> {
    if (!this.isConfigured()) return null;
    const supabase = await requireClient();

    const [
      settings,
      hero,
      story,
      services,
      quote,
      contact,
      storyStats,
      serviceCards,
      projects,
      timeline,
      team,
      gallery,
      testimonials,
    ] = await Promise.all([
      maybeSingle(supabase, 'site_settings'),
      maybeSingle(supabase, 'hero_sections'),
      maybeSingle(supabase, 'story_sections'),
      maybeSingle(supabase, 'service_sections'),
      maybeSingle(supabase, 'quote_sections'),
      maybeSingle(supabase, 'contact_details'),
      orderedRows(supabase, 'story_stats', includeUnpublished, 'active'),
      orderedRows(supabase, 'service_cards', includeUnpublished, 'active'),
      orderedRows(supabase, 'projects', includeUnpublished, 'published'),
      orderedRows(supabase, 'timeline_events', includeUnpublished, 'published'),
      orderedRows(supabase, 'team_members', includeUnpublished, 'published'),
      orderedRows(supabase, 'gallery_items', includeUnpublished, 'published'),
      orderedRows(supabase, 'testimonials', includeUnpublished, 'published'),
    ]);

    if (!settings && !hero && !story) return null;

    return {
      settings: {
        siteTitle: settings?.site_title || '',
        metaDesc: settings?.meta_desc || '',
        metaKeywords: settings?.meta_keywords || '',
        copyright: settings?.copyright || '',
        theme: settings?.theme || {},
      },
      hero: {
        title: hero?.title || '',
        subtitle: hero?.subtitle || '',
        description: hero?.description || '',
        exploreBtn: hero?.explore_btn || '',
        canvasEnabled: hero?.canvas_enabled ?? true,
      },
      story: {
        badge: story?.badge || '',
        title: story?.title || '',
        mission: story?.mission || '',
        vision: story?.vision || '',
        purpose: story?.purpose || '',
        history: story?.history || '',
        image: story?.image_url || '',
        stats: sortByOrder(storyStats).map((item) => ({
          id: item.id,
          label: item.label,
          number: item.number_text,
          suffix: item.suffix || '',
        })),
      },
      whatWeDo: {
        badge: services?.badge || '',
        title: services?.title || '',
        description: services?.description || '',
        cards: sortByOrder(serviceCards).map((item) => ({
          id: item.id,
          title: item.title,
          desc: item.description,
          icon: item.icon,
        })),
      },
      projects: sortByOrder(projects).map((item) => ({
        id: item.id,
        title: item.title,
        desc: item.description,
        category: item.category,
        year: item.year,
        image: item.image_url,
        link: item.link_url,
        featured: item.featured,
      })),
      timeline: sortByOrder(timeline).map((item) => ({
        id: item.id,
        date: item.date_label,
        title: item.title,
        desc: item.description,
        location: item.location,
      })),
      team: sortByOrder(team).map((item) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        bio: item.bio,
        image: item.image_url,
        github: item.github_url,
        linkedin: item.linkedin_url,
        facebook: item.facebook_url,
        email: item.email,
      })),
      gallery: sortByOrder(gallery).map((item) => ({
        id: item.id,
        image: item.image_url,
        caption: item.caption,
        category: item.category,
      })),
      testimonials: sortByOrder(testimonials).map((item) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        review: item.review,
      })),
      quote: {
        text: quote?.text || '',
        author: quote?.author || '',
      },
      contact: {
        email: contact?.email || '',
        phone: contact?.phone || '',
        address: contact?.address || '',
        mapCoords: {
          lat: contact?.lat === null || contact?.lat === undefined ? '' : String(contact.lat),
          lng: contact?.lng === null || contact?.lng === undefined ? '' : String(contact.lng),
        },
      },
    };
  }

  static async saveSiteData(db: SiteDatabase) {
    if (!this.isConfigured()) return db;
    const supabase = await requireClient();

    const singletons = {
      settings: cleanObject({
        id: SINGLETON_ID,
        site_title: db.settings?.siteTitle || '',
        meta_desc: db.settings?.metaDesc || '',
        meta_keywords: db.settings?.metaKeywords || '',
        copyright: db.settings?.copyright || '',
        theme: db.settings?.theme || {},
      }),
      hero: cleanObject({
        id: SINGLETON_ID,
        title: db.hero?.title || '',
        subtitle: db.hero?.subtitle || '',
        description: db.hero?.description || '',
        explore_btn: db.hero?.exploreBtn || '',
        canvas_enabled: db.hero?.canvasEnabled ?? true,
      }),
      story: cleanObject({
        id: SINGLETON_ID,
        badge: db.story?.badge || '',
        title: db.story?.title || '',
        mission: db.story?.mission || '',
        vision: db.story?.vision || '',
        purpose: db.story?.purpose || '',
        history: db.story?.history || '',
        image_url: db.story?.image || '',
      }),
      services: cleanObject({
        id: SINGLETON_ID,
        badge: db.whatWeDo?.badge || '',
        title: db.whatWeDo?.title || '',
        description: db.whatWeDo?.description || '',
      }),
      quote: cleanObject({
        id: SINGLETON_ID,
        text: db.quote?.text || '',
        author: db.quote?.author || '',
      }),
      contact: cleanObject({
        id: SINGLETON_ID,
        email: db.contact?.email || '',
        phone: db.contact?.phone || '',
        address: db.contact?.address || '',
        lat: db.contact?.mapCoords?.lat || null,
        lng: db.contact?.mapCoords?.lng || null,
      }),
    };

    const collections = {
      story_stats: (db.story?.stats || []).map((item, index) => ({
        id: item.id,
        label: item.label || '',
        number_text: item.number || '',
        suffix: item.suffix || '',
        sort_order: index,
        active: true,
      })),
      service_cards: (db.whatWeDo?.cards || []).map((item, index) => ({
        id: item.id,
        title: item.title || '',
        description: item.desc || '',
        icon: item.icon || '',
        sort_order: index,
        active: true,
      })),
      projects: (db.projects || []).map((item, index) => ({
        id: item.id,
        title: item.title || '',
        description: item.desc || '',
        category: item.category || '',
        year: item.year || '',
        image_url: item.image || '',
        link_url: item.link || '#',
        featured: Boolean(item.featured),
        sort_order: index,
        published: true,
      })),
      timeline_events: (db.timeline || []).map((item, index) => ({
        id: item.id,
        date_label: item.date || '',
        title: item.title || '',
        description: item.desc || '',
        location: item.location || '',
        sort_order: index,
        published: true,
      })),
      team_members: (db.team || []).map((item, index) => ({
        id: item.id,
        name: item.name || '',
        role: item.role || '',
        bio: item.bio || '',
        image_url: item.image || '',
        github_url: item.github || '#',
        linkedin_url: item.linkedin || '#',
        facebook_url: item.facebook || null,
        email: item.email || '',
        sort_order: index,
        published: true,
      })),
      gallery_items: (db.gallery || []).map((item, index) => ({
        id: item.id,
        image_url: item.image || '',
        caption: item.caption || '',
        category: item.category || '',
        sort_order: index,
        published: true,
      })),
      testimonials: (db.testimonials || []).map((item, index) => ({
        id: item.id,
        name: item.name || '',
        role: item.role || '',
        review: item.review || '',
        sort_order: index,
        published: true,
      })),
    };

    await Promise.all([
      throwIfError(await supabase.from('site_settings').upsert(singletons.settings), 'Failed to save settings'),
      throwIfError(await supabase.from('hero_sections').upsert(singletons.hero), 'Failed to save hero'),
      throwIfError(await supabase.from('story_sections').upsert(singletons.story), 'Failed to save story'),
      throwIfError(await supabase.from('service_sections').upsert(singletons.services), 'Failed to save services header'),
      throwIfError(await supabase.from('quote_sections').upsert(singletons.quote), 'Failed to save quote'),
      throwIfError(await supabase.from('contact_details').upsert(singletons.contact), 'Failed to save contact'),
    ]);

    await Promise.all(
      Object.entries(collections).map(async ([table, rows]) => {
        const ids = rows.map((item: any) => item.id);
        if (ids.length > 0) {
          throwIfError(await (supabase.from(table as any) as any).upsert(rows), `Failed to save ${table}`);
          throwIfError(await (supabase.from(table as any) as any).delete().not('id', 'in', postgrestTextIn(ids)), `Failed to prune ${table}`);
        } else {
          throwIfError(await (supabase.from(table as any) as any).delete().neq('id', ''), `Failed to clear ${table}`);
        }
      })
    );

    return db;
  }

  static async submitContact({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
    if (!this.isConfigured()) return true;
    const supabase = await requireClient();
    const result = await supabase.from('contact_submissions').insert({ name, email, subject, message });
    throwIfError(result, 'Failed to send contact message');
    return true;
  }

  static async submitRSVP({ eventId, name, email, roll }: { eventId: string; name: string; email: string; roll: string }) {
    if (!this.isConfigured()) return true;
    const supabase = await requireClient();
    const result = await supabase.from('event_rsvps').insert({
      event_id: eventId,
      name,
      email,
      roll,
    });
    throwIfError(result, 'Failed to confirm RSVP');
    return true;
  }
}
