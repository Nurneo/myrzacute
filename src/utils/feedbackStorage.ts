import { supabase } from './supabase';

export interface FeedbackData {
  mood: number | null;
  note: string | null;
}

/**
 * Fetch feedback (mood and note) for a specific date
 */
export async function fetchFeedback(date: string): Promise<FeedbackData> {
  if (supabase) {
    const { data, error } = await supabase
      .from('lioness_feedback')
      .select('mood, note')
      .eq('date', date)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return {
      mood: data?.mood ?? null,
      note: data?.note ?? null,
    };
  }

  // Fallback to LocalStorage
  const moodVal = localStorage.getItem(`lioness-mood-${date}`);
  const noteVal = localStorage.getItem(`lioness-note-${date}`);
  return {
    mood: moodVal ? Number(moodVal) : null,
    note: noteVal || null,
  };
}

/**
 * Save feedback (mood and/or note) for a specific date
 */
export async function saveFeedback(
  date: string, 
  data: { mood?: number | null; note?: string | null }
): Promise<void> {
  if (supabase) {
    // Fetch existing feedback to perform a safe merge
    const { data: existing, error: fetchError } = await supabase
      .from('lioness_feedback')
      .select('mood, note')
      .eq('date', date)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    const finalMood = data.mood !== undefined ? data.mood : (existing?.mood ?? null);
    const finalNote = data.note !== undefined ? data.note : (existing?.note ?? null);

    const { error } = await supabase
      .from('lioness_feedback')
      .upsert({
        date,
        mood: finalMood,
        note: finalNote,
      });

    if (error) {
      throw error;
    }
    return;
  }

  // Fallback to LocalStorage
  if (data.mood !== undefined) {
    if (data.mood === null) {
      localStorage.removeItem(`lioness-mood-${date}`);
    } else {
      localStorage.setItem(`lioness-mood-${date}`, String(data.mood));
    }
  }
  if (data.note !== undefined) {
    if (data.note === null) {
      localStorage.removeItem(`lioness-note-${date}`);
    } else {
      localStorage.setItem(`lioness-note-${date}`, data.note);
    }
  }
}

/**
 * Fetch all logged feedback to display markers on the calendar
 */
export async function fetchAllFeedback(): Promise<Record<string, FeedbackData>> {
  const merged: Record<string, FeedbackData> = {};

  if (supabase) {
    const { data, error } = await supabase
      .from('lioness_feedback')
      .select('date, mood, note');

    if (error) {
      throw error;
    }
    if (data) {
      for (const row of data) {
        merged[row.date] = {
          mood: row.mood ?? null,
          note: row.note ?? null,
        };
      }
    }
    return merged;
  }

  // Fallback to LocalStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      if (key.startsWith('lioness-mood-')) {
        const datePart = key.replace('lioness-mood-', '');
        const val = localStorage.getItem(key);
        if (val) {
          merged[datePart] = {
            mood: Number(val),
            note: merged[datePart]?.note ?? null,
          };
        }
      } else if (key.startsWith('lioness-note-')) {
        const datePart = key.replace('lioness-note-', '');
        const val = localStorage.getItem(key);
        if (val) {
          merged[datePart] = {
            mood: merged[datePart]?.mood ?? null,
            note: val,
          };
        }
      }
    }
  }

  return merged;
}
