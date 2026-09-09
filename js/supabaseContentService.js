import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.js';

const SINGLETON_ID = 'default';

const sortByOrder = (items = []) =>
  [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const cleanObject = (value) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));

const postgrestTextIn = (ids) =>
  `(${ids.map((id) => `"${String(id).replaceAll('"', '\\"')}"`).join(',')})`;

async function requireClient() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

function throwIfError(result, context) {
  if (result.error) {
    throw new Error(`${context}: ${result.error.message}`);
  }
  return result.data;
}

async function maybeSingle(supabase, table) {
  const result = await supabase.from(table).select('*').eq('id', SINGLETON_ID).maybeSingle();
  if (result.error) throw new Error(`Failed to load ${table}: ${result.error.message}`);
  return result.data;
}

async function orderedRows(supabase, table, includeUnpublished = false, statusColumn = 'published') {
  let query = supabase.from(table).select('*').order('sort_order', { ascending: true });
  if (!includeUnpublished && statusColumn) {
    query = query.eq(statusColumn, true);
  }

  const result = await query;
  if (result.error) throw new Error(`Failed to load ${table}: ${result.error.message}`);
  return result.data || [];
}

function toSiteData(records) {
  const settings = records.settings || {};
  const hero = records.hero || {};
  const story = records.story || {};
  const services = records.services || {};
  const contact = records.contact || {};
  const quote = records.quote || {};

  return {
    settings: {
      siteTitle: settings.site_title || '',
      metaDesc: settings.meta_desc || '',
      metaKeywords: settings.meta_keywords || '',
      copyright: settings.copyright || '',
      theme: settings.theme || {}
    },
    hero: {
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      exploreBtn: hero.explore_btn || '',
      canvasEnabled: hero.canvas_enabled ?? true
    },
    story: {
      badge: story.badge || '',
      title: story.title || '',
      mission: story.mission || '',
      vision: story.vision || '',
      purpose: story.purpose || '',
      history: story.history || '',
      image: story.image_url || '',
      stats: sortByOrder(records.storyStats).map((item) => ({
        id: item.id,
        label: item.label,
        number: item.number_text,
        suffix: item.suffix || ''
      }))
    },
    whatWeDo: {
      badge: services.badge || '',
      title: services.title || '',
      description: services.description || '',
      cards: sortByOrder(records.serviceCards).map((item) => ({
        id: item.id,
        title: item.title,
        desc: item.description,
        icon: item.icon
      }))
    },
    projects: sortByOrder(records.projects).map((item) => ({
      id: item.id,
      title: item.title,
      desc: item.description,
      category: item.category,
      year: item.year,
      image: item.image_url,
      link: item.link_url,
      featured: item.featured
    })),
    timeline: sortByOrder(records.timeline).map((item) => ({
      id: item.id,
      date: item.date_label,
      title: item.title,
      desc: item.description,
      location: item.location
    })),
    team: sortByOrder(records.team).map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      bio: item.bio,
      image: item.image_url,
      github: item.github_url,
      linkedin: item.linkedin_url,
      facebook: item.facebook_url,
      email: item.email
    })),
    gallery: sortByOrder(records.gallery).map((item) => ({
      id: item.id,
      image: item.image_url,
      caption: item.caption,
      category: item.category
    })),
    testimonials: sortByOrder(records.testimonials).map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      review: item.review
    })),
    quote: {
      text: quote.text || '',
      author: quote.author || ''
    },
    contact: {
      email: contact.email || '',
      phone: contact.phone || '',
      address: contact.address || '',
      mapCoords: {
        lat: contact.lat === null || contact.lat === undefined ? '' : String(contact.lat),
        lng: contact.lng === null || contact.lng === undefined ? '' : String(contact.lng)
      }
    }
  };
}

function singletonRows(db) {
  return {
    settings: cleanObject({
      id: SINGLETON_ID,
      site_title: db.settings?.siteTitle || '',
      meta_desc: db.settings?.metaDesc || '',
      meta_keywords: db.settings?.metaKeywords || '',
      copyright: db.settings?.copyright || '',
      theme: db.settings?.theme || {}
    }),
    hero: cleanObject({
      id: SINGLETON_ID,
      title: db.hero?.title || '',
      subtitle: db.hero?.subtitle || '',
      description: db.hero?.description || '',
      explore_btn: db.hero?.exploreBtn || '',
      canvas_enabled: db.hero?.canvasEnabled ?? true
    }),
    story: cleanObject({
      id: SINGLETON_ID,
      badge: db.story?.badge || '',
      title: db.story?.title || '',
      mission: db.story?.mission || '',
      vision: db.story?.vision || '',
      purpose: db.story?.purpose || '',
      history: db.story?.history || '',
      image_url: db.story?.image || ''
    }),
    services: cleanObject({
      id: SINGLETON_ID,
      badge: db.whatWeDo?.badge || '',
      title: db.whatWeDo?.title || '',
      description: db.whatWeDo?.description || ''
    }),
    quote: cleanObject({
      id: SINGLETON_ID,
      text: db.quote?.text || '',
      author: db.quote?.author || ''
    }),
    contact: cleanObject({
      id: SINGLETON_ID,
      email: db.contact?.email || '',
      phone: db.contact?.phone || '',
      address: db.contact?.address || '',
      lat: db.contact?.mapCoords?.lat || null,
      lng: db.contact?.mapCoords?.lng || null
    })
  };
}

function collectionRows(db) {
  return {
    story_stats: (db.story?.stats || []).map((item, index) => ({
      id: item.id,
      label: item.label || '',
      number_text: item.number || '',
      suffix: item.suffix || '',
      sort_order: index,
      active: true
    })),
    service_cards: (db.whatWeDo?.cards || []).map((item, index) => ({
      id: item.id,
      title: item.title || '',
      description: item.desc || '',
      icon: item.icon || '',
      sort_order: index,
      active: true
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
      published: true
    })),
    timeline_events: (db.timeline || []).map((item, index) => ({
      id: item.id,
      date_label: item.date || '',
      title: item.title || '',
      description: item.desc || '',
      location: item.location || '',
      sort_order: index,
      published: true
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
      published: true
    })),
    gallery_items: (db.gallery || []).map((item, index) => ({
      id: item.id,
      image_url: item.image || '',
      caption: item.caption || '',
      category: item.category || '',
      sort_order: index,
      published: true
    })),
    testimonials: (db.testimonials || []).map((item, index) => ({
      id: item.id,
      name: item.name || '',
      role: item.role || '',
      review: item.review || '',
      sort_order: index,
      published: true
    }))
  };
}

export class SupabaseContentService {
  static isConfigured() {
    return isSupabaseConfigured();
  }

  static async getSession() {
    if (!this.isConfigured()) return { session: null, user: null, role: null };
    const supabase = requireClient();
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
      role: profile.data?.role || null
    };
  }

  static async signIn(email, password) {
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

  static async fetchSiteData({ includeUnpublished = false } = {}) {
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
      testimonials
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
      orderedRows(supabase, 'testimonials', includeUnpublished, 'published')
    ]);

    if (!settings && !hero && !story) return null;

    return toSiteData({
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
      testimonials
    });
  }

  static async saveSiteData(db) {
    const supabase = await requireClient();
    const singletons = singletonRows(db);
    const collections = collectionRows(db);

    await Promise.all([
      throwIfError(await supabase.from('site_settings').upsert(singletons.settings), 'Failed to save settings'),
      throwIfError(await supabase.from('hero_sections').upsert(singletons.hero), 'Failed to save hero'),
      throwIfError(await supabase.from('story_sections').upsert(singletons.story), 'Failed to save story'),
      throwIfError(await supabase.from('service_sections').upsert(singletons.services), 'Failed to save services header'),
      throwIfError(await supabase.from('quote_sections').upsert(singletons.quote), 'Failed to save quote'),
      throwIfError(await supabase.from('contact_details').upsert(singletons.contact), 'Failed to save contact')
    ]);

    await Promise.all(
      Object.entries(collections).map(async ([table, rows]) => {
        const ids = rows.map((item) => item.id);
        if (ids.length > 0) {
          throwIfError(await supabase.from(table).upsert(rows), `Failed to save ${table}`);
          throwIfError(await supabase.from(table).delete().not('id', 'in', postgrestTextIn(ids)), `Failed to prune ${table}`);
        } else {
          throwIfError(await supabase.from(table).delete().neq('id', ''), `Failed to clear ${table}`);
        }
      })
    );

    return db;
  }

  static async uploadImage(file, folder = 'gallery') {
    const supabase = await requireClient();
    const safeFolder = String(folder).replace(/[^a-z0-9-_]/gi, '').toLowerCase() || 'gallery';
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const path = `${safeFolder}/${Date.now()}-${baseName}.${extension}`;

    const upload = await supabase.storage.from('site-media').upload(path, file, {
      cacheControl: '31536000',
      upsert: false
    });
    throwIfError(upload, 'Failed to upload image');

    const { data } = supabase.storage.from('site-media').getPublicUrl(path);
    const asset = await supabase
      .from('media_assets')
      .insert({
        bucket: 'site-media',
        path,
        public_url: data.publicUrl,
        mime_type: file.type,
        size_bytes: file.size
      })
      .select()
      .single();

    return throwIfError(asset, 'Failed to register uploaded image');
  }

  static async deleteImage(assetId) {
    const supabase = await requireClient();
    const asset = throwIfError(
      await supabase.from('media_assets').select('*').eq('id', assetId).single(),
      'Failed to load media asset'
    );

    throwIfError(await supabase.storage.from(asset.bucket).remove([asset.path]), 'Failed to delete stored image');
    throwIfError(await supabase.from('media_assets').delete().eq('id', assetId), 'Failed to delete media registry row');
    return true;
  }

  static async submitContact({ name, email, subject, message }) {
    const supabase = await requireClient();
    const result = await supabase
      .from('contact_submissions')
      .insert({ name, email, subject, message });

    throwIfError(result, 'Failed to send contact message');
    return true;
  }

  static async submitRSVP({ eventId, name, email, roll }) {
    const supabase = await requireClient();
    const result = await supabase
      .from('event_rsvps')
      .insert({
        event_id: eventId,
        name,
        email,
        roll
      });

    throwIfError(result, 'Failed to confirm RSVP');
    return true;
  }
}
