import { createClient } from '@supabase/supabase-js'

const GUESTBOOK_TABLE = 'guestbook_entries'
const GUESTBOOK_BUCKET = 'guestbook-images'

export const PASTEL_COLORS = [
  { name: 'pink', value: '#ffd1ec' },
  { name: 'lavender-blue', value: '#d9dcff' },
  { name: 'lilac', value: '#efd7ff' },
  { name: 'green', value: '#ccffc8' },
  { name: 'mint', value: '#d8fff5' },
  { name: 'cream-orange', value: '#ffedcf' },
  { name: 'sky', value: '#d3f4ff' },
]

export function stableHash(value) {
  const text = String(value || '')
  let hash = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

function getStableColor(seed) {
  return PASTEL_COLORS[stableHash(seed) % PASTEL_COLORS.length].value
}

function normalizeEntry(row) {
  return {
    id: row.id,
    type: row.type,
    toName: row.to_name || '',
    fromName: row.from_name || '',
    message: row.message || '',
    frameColor: row.frame_color || getStableColor(row.id),
    imagePath: row.image_path || '',
    imageUrl: row.image_url || '',
    qrImagePath: row.qr_image_path || '',
    createdAt: row.created_at,
  }
}

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.')
  }
}

function databaseError(error) {
  if (error.code === 'PGRST205') {
    return new Error(
      'Supabase에서 public.guestbook_entries를 찾을 수 없습니다. README의 설정 순서에 따라 supabase/inspect.sql과 supabase/guestbook.sql을 확인하고 실행해주세요. 테이블이 이미 있다면 Data API의 public 스키마 노출 및 캐시를 확인해주세요.',
      { cause: error },
    )
  }
  return error
}

export async function fetchGuestbookEntries() {
  assertConfigured()
  const { data, error } = await supabase
    .from(GUESTBOOK_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw databaseError(error)
  return data.map(normalizeEntry)
}

export async function createGuestbookEntry(payload) {
  assertConfigured()
  const { data, error } = await supabase
    .from(GUESTBOOK_TABLE)
    .insert({
      type: payload.type,
      to_name: payload.toName,
      from_name: payload.fromName,
      message: payload.message,
      frame_color: payload.frameColor,
      image_path: payload.imagePath || null,
      image_url: payload.imageUrl || null,
      qr_image_path: payload.qrImagePath || null,
    })
    .select('*')
    .single()

  if (error) throw databaseError(error)
  return normalizeEntry(data)
}

export async function uploadGuestbookImage(blob, folder = 'polaroids') {
  assertConfigured()
  const extension = blob.type === 'image/webp' ? 'webp' : 'png'
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(GUESTBOOK_BUCKET)
    .upload(path, blob, {
      contentType: blob.type || 'image/png',
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage.from(GUESTBOOK_BUCKET).getPublicUrl(path)

  return {
    path,
    publicUrl: data.publicUrl,
  }
}

export function subscribeToGuestbookEntries(onInsert) {
  if (!isSupabaseConfigured || !supabase) return () => {}

  const channel = supabase
    .channel('guestbook-entry-inserts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: GUESTBOOK_TABLE,
      },
      (payload) => onInsert(normalizeEntry(payload.new)),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
