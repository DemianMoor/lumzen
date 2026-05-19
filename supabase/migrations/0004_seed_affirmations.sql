-- LumZen — Stage 2 / W3 — affirmation seed (~200 across 15 categories).
-- Affirmations are present-tense ("I am", "I have", "I choose"), in
-- LumZen voice: no exclamation marks, no banned vocabulary.
-- Idempotent: text is the natural key; re-running upserts on conflict.

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'affirmations_text_unique'
  ) then
    alter table public.affirmations
      add constraint affirmations_text_unique unique (text);
  end if;
end $$;

-- Abundance (receivership) -------------------------------------------------
insert into public.affirmations (text, category, tags) values
('I am open to what wants to come to me.', 'abundance', '{}'),
('I have enough for this moment, and the next.', 'abundance', '{}'),
('I choose to receive without apology.', 'abundance', '{}'),
('I am worthy of what I have asked for.', 'abundance', '{}'),
('I trust the slower kinds of growth.', 'abundance', '{}'),
('I have what I need to begin.', 'abundance', '{}'),
('I am willing to be supported.', 'abundance', '{}'),
('I choose generosity that does not deplete me.', 'abundance', '{}'),
('I have time. I have space. I have the breath in my chest.', 'abundance', '{}'),
('I am building a life that holds me back.', 'abundance', '{}'),
('I choose practices over wishes.', 'abundance', '{}'),
('I have all the time the work asks for.', 'abundance', '{}'),
('I am steward of what I have been given.', 'abundance', '{}'),
('I choose to be present for what is already mine.', 'abundance', '{}')
on conflict (text) do nothing;

-- Love ---------------------------------------------------------------------
insert into public.affirmations (text, category, tags) values
('I am loved in ways I have not yet noticed.', 'love', '{}'),
('I choose tenderness with the part of me that is afraid.', 'love', '{}'),
('I have love that does not require performance.', 'love', '{}'),
('I am loving without losing myself.', 'love', '{}'),
('I choose people who choose me back.', 'love', '{}'),
('I am worthy of patient love.', 'love', '{}'),
('I have boundaries because I have love.', 'love', '{}'),
('I am safe to be seen.', 'love', '{}'),
('I choose to mean what I say.', 'love', '{}'),
('I am building the kind of love I have wanted to receive.', 'love', '{}'),
('I have the right to ask for what I need.', 'love', '{}'),
('I am the home I have been searching for.', 'love', '{}'),
('I choose intimacy that includes my whole self.', 'love', '{}'),
('I have love that survives my honest no.', 'love', '{}')
on conflict (text) do nothing;

-- Health -------------------------------------------------------------------
insert into public.affirmations (text, category, tags) values
('I am here, in this body, in this room.', 'health', '{}'),
('I choose to listen to my body before I argue with it.', 'health', '{}'),
('I have the right to rest before I am exhausted.', 'health', '{}'),
('I am tending what asks to be tended.', 'health', '{}'),
('I choose nourishment over numbing.', 'health', '{}'),
('I have permission to move slowly.', 'health', '{}'),
('I am healing on a timeline that is mine.', 'health', '{}'),
('I choose breath when the mind speeds up.', 'health', '{}'),
('I have a body that has carried me through everything.', 'health', '{}'),
('I am allowed to need help.', 'health', '{}'),
('I choose strength that does not require armoring.', 'health', '{}'),
('I have nothing to prove with my body.', 'health', '{}'),
('I am soft where I was told to be hard.', 'health', '{}'),
('I choose rest as a practice, not a reward.', 'health', '{}')
on conflict (text) do nothing;

-- Identity -----------------------------------------------------------------
insert into public.affirmations (text, category, tags) values
('I am the one I have been waiting for.', 'identity', '{}'),
('I have the right to change my mind.', 'identity', '{}'),
('I choose to be a beginner again.', 'identity', '{}'),
('I am more than my last decision.', 'identity', '{}'),
('I have permission to outgrow what no longer fits.', 'identity', '{}'),
('I am made of every season I have walked through.', 'identity', '{}'),
('I choose to introduce myself by what I am becoming.', 'identity', '{}'),
('I am allowed to take up space.', 'identity', '{}'),
('I have a self that exists without anyone watching.', 'identity', '{}'),
('I choose to be honest before I am liked.', 'identity', '{}'),
('I am at home in my own life.', 'identity', '{}'),
('I have the right to be inconsistent while I learn.', 'identity', '{}'),
('I choose myself when no one else has yet.', 'identity', '{}'),
('I am whole even on the days I am tired.', 'identity', '{}')
on conflict (text) do nothing;

-- Manifestation (aligned action, not wish thinking) ------------------------
insert into public.affirmations (text, category, tags) values
('I am taking the next honest step.', 'manifestation', '{}'),
('I have a clearer picture than I had a month ago.', 'manifestation', '{}'),
('I choose to align with what calls me.', 'manifestation', '{}'),
('I am moving toward what is mine.', 'manifestation', '{}'),
('I have permission to want what I want.', 'manifestation', '{}'),
('I choose action over rumination.', 'manifestation', '{}'),
('I am gathering the materials for a different life.', 'manifestation', '{}'),
('I have the right to start before I am ready.', 'manifestation', '{}'),
('I choose courage one decision at a time.', 'manifestation', '{}'),
('I am open to receive in unfamiliar forms.', 'manifestation', '{}'),
('I have a vision I can refine as I walk.', 'manifestation', '{}'),
('I choose to bet on the version of me that is becoming.', 'manifestation', '{}'),
('I am answering the door when opportunity knocks.', 'manifestation', '{}'),
('I have done harder things than this.', 'manifestation', '{}')
on conflict (text) do nothing;

-- Morning ------------------------------------------------------------------
insert into public.affirmations (text, category, tags) values
('I am here. The day has not yet been written.', 'morning', '{}'),
('I have this hour. I have this breath.', 'morning', '{}'),
('I choose to begin gently.', 'morning', '{}'),
('I am the first audience my day will have.', 'morning', '{}'),
('I have a body waking with me.', 'morning', '{}'),
('I choose what gets my attention first.', 'morning', '{}'),
('I am ready to meet what arrives.', 'morning', '{}'),
('I have permission to take the first hour slowly.', 'morning', '{}'),
('I choose intention before input.', 'morning', '{}'),
('I am writing the tone of this day.', 'morning', '{}'),
('I have all the time I need to begin.', 'morning', '{}'),
('I choose to feed my morning instead of feeding off it.', 'morning', '{}'),
('I am awake. That is already enough.', 'morning', '{}'),
('I have today, and that is a complete gift.', 'morning', '{}')
on conflict (text) do nothing;

-- Sleep --------------------------------------------------------------------
insert into public.affirmations (text, category, tags) values
('I am safe to rest now.', 'sleep', '{}'),
('I have done enough for one day.', 'sleep', '{}'),
('I choose to let the day end where it ended.', 'sleep', '{}'),
('I am held by the dark.', 'sleep', '{}'),
('I have nothing left to solve tonight.', 'sleep', '{}'),
('I choose to set tomorrow down until morning.', 'sleep', '{}'),
('I am allowed to release the day.', 'sleep', '{}'),
('I have the right to drift.', 'sleep', '{}'),
('I choose breath that is slower than my thoughts.', 'sleep', '{}'),
('I am soft, and I am tired, and that is honest.', 'sleep', '{}'),
('I have a body that knows how to rest.', 'sleep', '{}'),
('I choose to trust the body to find sleep.', 'sleep', '{}'),
('I am loved while I sleep.', 'sleep', '{}'),
('I have the night ahead. Nothing of me has to perform now.', 'sleep', '{}')
on conflict (text) do nothing;

-- Shadow work -------------------------------------------------------------
insert into public.affirmations (text, category, tags) values
('I am willing to meet the part of me that I have been avoiding.', 'shadow_work', '{}'),
('I have a body that has stored what the mind did not finish.', 'shadow_work', '{}'),
('I choose to look at what I have been looking away from.', 'shadow_work', '{}'),
('I am safe enough to feel this now.', 'shadow_work', '{}'),
('I have the right to be angry without being cruel.', 'shadow_work', '{}'),
('I choose to befriend what frightens me about myself.', 'shadow_work', '{}'),
('I am the parent I am becoming for the child I was.', 'shadow_work', '{}'),
('I have nothing in me that does not deserve hearing.', 'shadow_work', '{}'),
('I choose presence over performance with my pain.', 'shadow_work', '{}'),
('I am allowed to be a work in progress in public.', 'shadow_work', '{}'),
('I have grieved well. I am still here.', 'shadow_work', '{}'),
('I choose to tell the truth to myself first.', 'shadow_work', '{}'),
('I am not the worst story I have told about myself.', 'shadow_work', '{}'),
('I have the right to come home to myself slowly.', 'shadow_work', '{}')
on conflict (text) do nothing;

-- Chakra: Root (security, ground, body) ----------------------------------
insert into public.affirmations (text, category, chakra, tags) values
('I am safe in this body.', 'chakra_root', 'root', '{}'),
('I have ground beneath me.', 'chakra_root', 'root', '{}'),
('I choose to be here, in this body, now.', 'chakra_root', 'root', '{}'),
('I am held by the earth that holds the trees.', 'chakra_root', 'root', '{}'),
('I have what I need today.', 'chakra_root', 'root', '{}'),
('I am steady even when the world is not.', 'chakra_root', 'root', '{}'),
('I choose to feel my feet.', 'chakra_root', 'root', '{}'),
('I am rooted. I do not have to brace.', 'chakra_root', 'root', '{}'),
('I have a home in my own body.', 'chakra_root', 'root', '{}'),
('I am safe. I am safe. I am safe.', 'chakra_root', 'root', '{}'),
('I choose breath that reaches my belly.', 'chakra_root', 'root', '{}'),
('I have permission to trust this body again.', 'chakra_root', 'root', '{}')
on conflict (text) do nothing;

-- Chakra: Sacral (feeling, creativity, flow) -----------------------------
insert into public.affirmations (text, category, chakra, tags) values
('I am allowed to feel what I feel.', 'chakra_sacral', 'sacral', '{}'),
('I have a creative current that does not need permission.', 'chakra_sacral', 'sacral', '{}'),
('I choose pleasure that is honest.', 'chakra_sacral', 'sacral', '{}'),
('I am open to what wants to move through me.', 'chakra_sacral', 'sacral', '{}'),
('I have a body that knows desire is information.', 'chakra_sacral', 'sacral', '{}'),
('I choose to make things, even small ones.', 'chakra_sacral', 'sacral', '{}'),
('I am soft where I was told to harden.', 'chakra_sacral', 'sacral', '{}'),
('I have feelings that are mine to hold.', 'chakra_sacral', 'sacral', '{}'),
('I choose flow over forcing.', 'chakra_sacral', 'sacral', '{}'),
('I am a river, not a dam.', 'chakra_sacral', 'sacral', '{}'),
('I have access to my own joy.', 'chakra_sacral', 'sacral', '{}'),
('I choose to feel before I decide.', 'chakra_sacral', 'sacral', '{}')
on conflict (text) do nothing;

-- Chakra: Solar plexus (will, power, action) -----------------------------
insert into public.affirmations (text, category, chakra, tags) values
('I am sovereign in my own life.', 'chakra_solar', 'solar_plexus', '{}'),
('I have the right to decide for myself.', 'chakra_solar', 'solar_plexus', '{}'),
('I choose action that is mine.', 'chakra_solar', 'solar_plexus', '{}'),
('I am willing to be the author of my next chapter.', 'chakra_solar', 'solar_plexus', '{}'),
('I have a will that does not need to dominate.', 'chakra_solar', 'solar_plexus', '{}'),
('I choose to keep promises to myself.', 'chakra_solar', 'solar_plexus', '{}'),
('I am strong without being hard.', 'chakra_solar', 'solar_plexus', '{}'),
('I have power that does not cost others to wield.', 'chakra_solar', 'solar_plexus', '{}'),
('I choose to stand by what I have said.', 'chakra_solar', 'solar_plexus', '{}'),
('I am allowed to be in charge of my own day.', 'chakra_solar', 'solar_plexus', '{}'),
('I have agency. I am not the wind.', 'chakra_solar', 'solar_plexus', '{}'),
('I choose to act as if my choices matter.', 'chakra_solar', 'solar_plexus', '{}')
on conflict (text) do nothing;

-- Chakra: Heart (love, connection, compassion) ---------------------------
insert into public.affirmations (text, category, chakra, tags) values
('I am loved as I am right now.', 'chakra_heart', 'heart', '{}'),
('I have a heart that has done well to keep beating.', 'chakra_heart', 'heart', '{}'),
('I choose tenderness without losing my shape.', 'chakra_heart', 'heart', '{}'),
('I am open and protected at the same time.', 'chakra_heart', 'heart', '{}'),
('I have the right to love and be loved.', 'chakra_heart', 'heart', '{}'),
('I choose compassion for the version of me that is learning.', 'chakra_heart', 'heart', '{}'),
('I am safe enough to feel my heart.', 'chakra_heart', 'heart', '{}'),
('I have forgiven what was mine to forgive.', 'chakra_heart', 'heart', '{}'),
('I choose to keep my heart open after it has been hurt.', 'chakra_heart', 'heart', '{}'),
('I am loved in places I have not yet looked.', 'chakra_heart', 'heart', '{}'),
('I have a heart that is allowed to rest.', 'chakra_heart', 'heart', '{}'),
('I choose connection that does not require me to perform.', 'chakra_heart', 'heart', '{}')
on conflict (text) do nothing;

-- Chakra: Throat (voice, truth, expression) ------------------------------
insert into public.affirmations (text, category, chakra, tags) values
('I am allowed to say what is true for me.', 'chakra_throat', 'throat', '{}'),
('I have a voice that is mine to use.', 'chakra_throat', 'throat', '{}'),
('I choose words that honor my reality.', 'chakra_throat', 'throat', '{}'),
('I am willing to speak before I have permission.', 'chakra_throat', 'throat', '{}'),
('I have the right to be heard.', 'chakra_throat', 'throat', '{}'),
('I choose to say less and mean it.', 'chakra_throat', 'throat', '{}'),
('I am honest with care.', 'chakra_throat', 'throat', '{}'),
('I have a no that protects my yes.', 'chakra_throat', 'throat', '{}'),
('I choose to ask for what I need.', 'chakra_throat', 'throat', '{}'),
('I am safe to be heard at my real volume.', 'chakra_throat', 'throat', '{}'),
('I have the right to take up sound.', 'chakra_throat', 'throat', '{}'),
('I choose to tell the truth even when it shakes.', 'chakra_throat', 'throat', '{}')
on conflict (text) do nothing;

-- Chakra: Third eye (insight, intuition) ---------------------------------
insert into public.affirmations (text, category, chakra, tags) values
('I am willing to trust what I already know.', 'chakra_third_eye', 'third_eye', '{}'),
('I have intuition that is mine to listen to.', 'chakra_third_eye', 'third_eye', '{}'),
('I choose insight over noise.', 'chakra_third_eye', 'third_eye', '{}'),
('I am quieter than my fear.', 'chakra_third_eye', 'third_eye', '{}'),
('I have access to a knowing that does not need to be defended.', 'chakra_third_eye', 'third_eye', '{}'),
('I choose to listen to the second thought, the slower one.', 'chakra_third_eye', 'third_eye', '{}'),
('I am willing to see clearly.', 'chakra_third_eye', 'third_eye', '{}'),
('I have eyes that are learning to look without flinching.', 'chakra_third_eye', 'third_eye', '{}'),
('I choose discernment over judgment.', 'chakra_third_eye', 'third_eye', '{}'),
('I am led by a wisdom older than my mind.', 'chakra_third_eye', 'third_eye', '{}'),
('I have the right to act on what I sense.', 'chakra_third_eye', 'third_eye', '{}'),
('I choose to trust the dream as data.', 'chakra_third_eye', 'third_eye', '{}')
on conflict (text) do nothing;

-- Chakra: Crown (connection to the larger) -------------------------------
insert into public.affirmations (text, category, chakra, tags) values
('I am connected to something larger than this hour.', 'chakra_crown', 'crown', '{}'),
('I have a place in the larger weave.', 'chakra_crown', 'crown', '{}'),
('I choose to stay open to mystery.', 'chakra_crown', 'crown', '{}'),
('I am held by what I cannot see.', 'chakra_crown', 'crown', '{}'),
('I have access to wisdom that did not start with me.', 'chakra_crown', 'crown', '{}'),
('I choose reverence in the small moments.', 'chakra_crown', 'crown', '{}'),
('I am willing to be guided.', 'chakra_crown', 'crown', '{}'),
('I have a life that is part of a longer practice.', 'chakra_crown', 'crown', '{}'),
('I choose to let awe be a daily teacher.', 'chakra_crown', 'crown', '{}'),
('I am made of the same patient material as the stars.', 'chakra_crown', 'crown', '{}'),
('I have permission to ask without expecting an answer.', 'chakra_crown', 'crown', '{}'),
('I choose to trust what does not need to be proven.', 'chakra_crown', 'crown', '{}')
on conflict (text) do nothing;
