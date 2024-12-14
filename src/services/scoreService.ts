import { supabase, handleSupabaseError, type Score } from './supabaseClient';

export const saveScore = async (score: number, userId: string, username: string): Promise<void> => {
  try {
    // Check if user already has a score
    const { data: existingScore, error: fetchError } = await supabase
      .from('highscores')
      .select('score')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      handleSupabaseError(fetchError);
    }

    if (!existingScore) {
      // Insert new score
      const { data: insertData, error: insertError } = await supabase
        .from('highscores')
        .insert([
          { 
            user_id: userId, 
            score, 
            username,
            timestamp: new Date().toISOString()
          }
        ]);
      
      if (insertError) handleSupabaseError(insertError);
    } else if (score > existingScore.score) {
      // Update existing score if new score is higher
      const { data: updateData, error: updateError } = await supabase
        .from('highscores')
        .update({ 
          score,
          timestamp: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (updateError) handleSupabaseError(updateError);
    }
  } catch (error) {
    handleSupabaseError(error);
  }
};

export const getTopScores = async (limit: number = 10): Promise<Score[]> => {
  try {
    const { data, error } = await supabase
      .from('highscores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) handleSupabaseError(error);
    return data || [];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
};

export type { Score };