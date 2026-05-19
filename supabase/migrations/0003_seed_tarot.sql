-- LumZen — Stage 2 / W3 — tarot seed (78 Rider-Waite cards).
-- Idempotent: re-applying overwrites meanings without disturbing readings.

-- Major Arcana (22) ---------------------------------------------------------
insert into public.tarot_cards (id, name, type, suit, value, meaning_upright, meaning_reversed, description, image_url) values
('ar00','The Fool','major',null,0,'A beginning approached with openness. The unmade decision. Step before certainty.','Recklessness, naivete weaponized, refusal to read the room. Look at the cliff edge.','The leap is the practice. Innocence is not the absence of knowing — it is the willingness to begin again.','https://sacred-texts.com/tarot/pkt/img/ar00.jpg'),
('ar01','The Magician','major',null,1,'Will and attention focused. The tools are already in your hand. Action becomes the medium.','Scattered power, performance over substance, illusion mistaken for craft.','The work is not magic. The work is choosing to use what is in front of you.','https://sacred-texts.com/tarot/pkt/img/ar01.jpg'),
('ar02','The High Priestess','major',null,2,'Inner knowing. The threshold of mystery. Listen before speaking.','Ignored intuition, secrets that calcify, a self kept hidden from itself.','She does not explain. She invites you to remember what part of you already knew.','https://sacred-texts.com/tarot/pkt/img/ar02.jpg'),
('ar03','The Empress','major',null,3,'Receivership, creation, fertile attention. What you tend grows.','Smothering, depletion, creation forced rather than allowed.','Abundance is a kind of listening. Notice what asks to be made through you.','https://sacred-texts.com/tarot/pkt/img/ar03.jpg'),
('ar04','The Emperor','major',null,4,'Structure that protects rather than confines. Sovereignty over your own house.','Rigidity, domination, control as a substitute for trust.','Order is not the same as control. The boundary that holds is the one you can soften.','https://sacred-texts.com/tarot/pkt/img/ar04.jpg'),
('ar05','The Hierophant','major',null,5,'Tradition consulted, not obeyed. The wisdom of those who came before.','Dogma, conformity for safety, mistaking the map for the territory.','Lineage offers grammar, not a script. What of the inherited do you keep?','https://sacred-texts.com/tarot/pkt/img/ar05.jpg'),
('ar06','The Lovers','major',null,6,'A choice that integrates head and heart. Union that does not erase the self.','Disharmony, choices made from fear, the wrong yes.','Every union begins with a decision to be seen. What does it cost you to refuse it?','https://sacred-texts.com/tarot/pkt/img/ar06.jpg'),
('ar07','The Chariot','major',null,7,'Direction held against opposing forces. Discipline as devotion.','Forced motion, scattered effort, will without compass.','Two horses pull. The question is whether you are the rider or the reins.','https://sacred-texts.com/tarot/pkt/img/ar07.jpg'),
('ar08','Strength','major',null,8,'Quiet power. The lion is calmed, not slain. Courage measured in tenderness.','Self-doubt, force where patience would have served.','The wildness in you is not the enemy. Meet it slowly.','https://sacred-texts.com/tarot/pkt/img/ar08.jpg'),
('ar09','The Hermit','major',null,9,'Solitude that returns you to yourself. The lantern is for the next step only.','Isolation, withdrawal that becomes a wall, refusal of the village.','You go inward to remember what you already knew. Then you return.','https://sacred-texts.com/tarot/pkt/img/ar09.jpg'),
('ar10','Wheel of Fortune','major',null,10,'Cycles turning. What you do not control may still be working in your favor.','Resistance to change, victim posture, the wheel mistaken for an enemy.','The wheel is neutral. Your posture inside the turning is the practice.','https://sacred-texts.com/tarot/pkt/img/ar10.jpg'),
('ar11','Justice','major',null,11,'Honest accounting. Cause meeting effect. Decision aligned with truth.','Bias, evasion, a story told to avoid the weight of what is real.','The sword is for seeing clearly. Then the scales can rest.','https://sacred-texts.com/tarot/pkt/img/ar11.jpg'),
('ar12','The Hanged Man','major',null,12,'Stillness that reframes. The pause that is not delay but ripening.','Stagnation, sacrifice that nobody asked for, suspended without surrender.','Upside down, the same world looks different. That is not passivity. That is craft.','https://sacred-texts.com/tarot/pkt/img/ar12.jpg'),
('ar13','Death','major',null,13,'Ending that clears the field. Composting the no-longer-true.','Resistance to ending, holding on past the point of nourishment.','Nothing dies that was not already finished. The card asks what you are still holding.','https://sacred-texts.com/tarot/pkt/img/ar13.jpg'),
('ar14','Temperance','major',null,14,'Blending opposites. The patient mixing of what you would not have thought to combine.','Excess, impatience, the recipe abandoned mid-stir.','The work is alchemical. Slow heat does what fire alone cannot.','https://sacred-texts.com/tarot/pkt/img/ar14.jpg'),
('ar15','The Devil','major',null,15,'The chain you put on. The pattern you keep choosing. Look at what binds.','Bondage acknowledged, the first loosening, light at the edge of the cave.','The chains are loose. Look closer. The choice to stay is also a choice.','https://sacred-texts.com/tarot/pkt/img/ar15.jpg'),
('ar16','The Tower','major',null,16,'Sudden revelation. What was false collapses so the true can stand.','Disaster averted at a cost, the collapse postponed, foundations rotting unseen.','Lightning is not punishment. It is the truth arriving without permission.','https://sacred-texts.com/tarot/pkt/img/ar16.jpg'),
('ar17','The Star','major',null,17,'Hope re-emerged. Soft water poured onto dry ground. Faith without naivete.','Hopelessness, the wound left open too long, faith withdrawn.','After the Tower, the Star. The water is still here. You are still here.','https://sacred-texts.com/tarot/pkt/img/ar17.jpg'),
('ar18','The Moon','major',null,18,'The threshold of dream. Things known in the body before they are named.','Confusion, fear allowed to write the story, projection mistaken for sight.','Walk through. The path is real. The fear is information, not instruction.','https://sacred-texts.com/tarot/pkt/img/ar18.jpg'),
('ar19','The Sun','major',null,19,'Clarity. Joy without apology. What was hidden is allowed to shine.','Burnout, performance of joy, the eye unable to receive the light.','You did not earn the sun. You are simply allowed to stand in it.','https://sacred-texts.com/tarot/pkt/img/ar19.jpg'),
('ar20','Judgement','major',null,20,'A calling answered. The self assembled into something larger.','Self-judgment as ritual, the calling refused, the trumpet ignored.','You hear it because it is for you. The question is whether you rise.','https://sacred-texts.com/tarot/pkt/img/ar20.jpg'),
('ar21','The World','major',null,21,'Completion that opens a door. A cycle honored, not held.','Loose ends, premature closure, the lesson half-learned.','You finish the lap. Then you walk on.','https://sacred-texts.com/tarot/pkt/img/ar21.jpg')
on conflict (id) do update set
  name = excluded.name,
  meaning_upright = excluded.meaning_upright,
  meaning_reversed = excluded.meaning_reversed,
  description = excluded.description,
  image_url = excluded.image_url;

-- Wands (Fire — will, action, creativity) ----------------------------------
insert into public.tarot_cards (id, name, type, suit, value, meaning_upright, meaning_reversed, description, image_url) values
('waac','Ace of Wands','minor','wands',1,'A spark. The impulse to begin. Creative current arriving unmistakably.','False starts, ideas that flicker and die, energy without anchor.','Light a single flame. Tend it before scaling.','https://sacred-texts.com/tarot/pkt/img/waac.jpg'),
('wa02','Two of Wands','minor','wands',2,'Vision held in the palm. Looking at the wider world from your own ground.','Hesitation, planning that never crosses into action.','You can see far. The next step is still close.','https://sacred-texts.com/tarot/pkt/img/wa02.jpg'),
('wa03','Three of Wands','minor','wands',3,'Ships set sail. Awaiting what your prior action set in motion.','Delays, the harbor watched too long, expectation hardening.','The wave returns. Stay open to what arrives unfamiliar.','https://sacred-texts.com/tarot/pkt/img/wa03.jpg'),
('wa04','Four of Wands','minor','wands',4,'Threshold celebrated. Home as a place that gathered itself around you.','Instability in the foundation, celebration delayed, belonging questioned.','Mark the doorway. Some moments deserve to be witnessed.','https://sacred-texts.com/tarot/pkt/img/wa04.jpg'),
('wa05','Five of Wands','minor','wands',5,'Friction. Competing energies that may, if held well, sharpen each other.','Disagreement that hardens, sparring without a goal, ego at the wheel.','Every fire needs air between the logs. Make space.','https://sacred-texts.com/tarot/pkt/img/wa05.jpg'),
('wa06','Six of Wands','minor','wands',6,'A win acknowledged. Reception, public moment, the rider returned.','Hollow recognition, the crown that does not fit, performance without integrity.','The cheering ends. What you built remains.','https://sacred-texts.com/tarot/pkt/img/wa06.jpg'),
('wa07','Seven of Wands','minor','wands',7,'Standing your ground. Defending what was hard-won.','Defensiveness, walls raised against shadows, fatigue confused with threat.','Some hills are worth it. Choose deliberately.','https://sacred-texts.com/tarot/pkt/img/wa07.jpg'),
('wa08','Eight of Wands','minor','wands',8,'Swift motion. News in transit. Things finally moving.','Scatter, messages crossed, momentum without direction.','Speed is not the same as progress. Aim, then loose.','https://sacred-texts.com/tarot/pkt/img/wa08.jpg'),
('wa09','Nine of Wands','minor','wands',9,'The last watch. Resilience earned through bruises.','Burnout, paranoia, the body refusing one more shift.','You are nearly there. Drink water. Stand again.','https://sacred-texts.com/tarot/pkt/img/wa09.jpg'),
('wa10','Ten of Wands','minor','wands',10,'A heavy load nearly home. The cost of seeing it through.','Burden that no longer serves, refusing to set the bundle down.','You can put some of it down. Most of it was not yours.','https://sacred-texts.com/tarot/pkt/img/wa10.jpg'),
('wapa','Page of Wands','minor','wands',11,'An invitation to play. Curiosity worth following.','Restlessness, energy without form, spark that scorches.','Beginnings are allowed to be awkward.','https://sacred-texts.com/tarot/pkt/img/wapa.jpg'),
('wakn','Knight of Wands','minor','wands',12,'Bold motion. The chase undertaken with full breath.','Recklessness, half-formed plans pursued past the point of usefulness.','Speed has its place. So does the pause to ask why.','https://sacred-texts.com/tarot/pkt/img/wakn.jpg'),
('waqu','Queen of Wands','minor','wands',13,'Warm authority. Presence that makes others bolder.','Performance of fire, jealousy, presence weaponized.','You do not need to dim. The room can hold you.','https://sacred-texts.com/tarot/pkt/img/waqu.jpg'),
('waki','King of Wands','minor','wands',14,'Visionary leadership. The willingness to bet on what you have made.','Tyranny, the king who cannot listen, fire untended.','Lead from what you have actually done, not what you imagine doing.','https://sacred-texts.com/tarot/pkt/img/waki.jpg')
on conflict (id) do update set
  name = excluded.name,
  meaning_upright = excluded.meaning_upright,
  meaning_reversed = excluded.meaning_reversed,
  description = excluded.description,
  image_url = excluded.image_url;

-- Cups (Water — feeling, relationship, intuition) --------------------------
insert into public.tarot_cards (id, name, type, suit, value, meaning_upright, meaning_reversed, description, image_url) values
('cuac','Ace of Cups','minor','cups',1,'The heart opens. Feeling arriving freely. A cup overflowing.','Numbness, the channel closed, love withheld even from yourself.','Receivership is also a skill. Practice taking the offered.','https://sacred-texts.com/tarot/pkt/img/cuac.jpg'),
('cu02','Two of Cups','minor','cups',2,'A meeting. Mutual recognition. Trust as a small first sip.','Mismatched chemistry, ledger-keeping in place of love.','You can be met without losing yourself.','https://sacred-texts.com/tarot/pkt/img/cu02.jpg'),
('cu03','Three of Cups','minor','cups',3,'Friendship. The communion that asks nothing of performance.','Excess, indulgence as substitute for intimacy, gossip dressed as care.','Joy shared is doubled. Note who is at the table.','https://sacred-texts.com/tarot/pkt/img/cu03.jpg'),
('cu04','Four of Cups','minor','cups',4,'Discontent. The offered cup unnoticed.','Stagnation lifted, attention turned toward what is given.','Look up. Some good is already at your shoulder.','https://sacred-texts.com/tarot/pkt/img/cu04.jpg'),
('cu05','Five of Cups','minor','cups',5,'Grief. Three cups spilled, two still standing.','Acceptance beginning, the body turning toward what remains.','You may mourn and still pick up what was not lost.','https://sacred-texts.com/tarot/pkt/img/cu05.jpg'),
('cu06','Six of Cups','minor','cups',6,'Memory, nostalgia, the past visiting kindly.','Sentimentality used as escape, return to a place that no longer is.','The past is welcome to dinner. It does not get to drive.','https://sacred-texts.com/tarot/pkt/img/cu06.jpg'),
('cu07','Seven of Cups','minor','cups',7,'Many options, some of them mirage. Imagination at its loosest.','Indecision, fantasy mistaken for plan, eyes too wide.','Dream wide. Choose narrow.','https://sacred-texts.com/tarot/pkt/img/cu07.jpg'),
('cu08','Eight of Cups','minor','cups',8,'Walking away. Honoring that what was good is finished.','Avoidance, leaving prematurely, the same departure replayed.','You can grieve and still take the next step. Both.','https://sacred-texts.com/tarot/pkt/img/cu08.jpg'),
('cu09','Nine of Cups','minor','cups',9,'A wish satisfied. Pleasure rightly held.','Self-satisfaction that closes the door, longing dressed as fulfillment.','Joy is allowed. Notice if you can stay with it.','https://sacred-texts.com/tarot/pkt/img/cu09.jpg'),
('cu10','Ten of Cups','minor','cups',10,'Harmony. The chosen family arrayed under one rainbow.','Image of harmony performed, fissures hidden, the rainbow painted on.','Tend the actual people. The picture takes care of itself.','https://sacred-texts.com/tarot/pkt/img/cu10.jpg'),
('cupa','Page of Cups','minor','cups',11,'Tender curiosity. Feeling that arrives in surprising clothing.','Moodiness, melodrama, the inner child given the steering wheel.','Stay soft. Stay observant.','https://sacred-texts.com/tarot/pkt/img/cupa.jpg'),
('cukn','Knight of Cups','minor','cups',12,'Romantic motion. The offer made with both hands.','Charm without follow-through, the gesture larger than the heart behind it.','Make the move. Then keep showing up.','https://sacred-texts.com/tarot/pkt/img/cukn.jpg'),
('cuqu','Queen of Cups','minor','cups',13,'Emotional sovereignty. The heart that holds without flooding.','Over-attunement to others, the self submerged in care.','You may feel everything and still be the still water.','https://sacred-texts.com/tarot/pkt/img/cuqu.jpg'),
('cuki','King of Cups','minor','cups',14,'Mastery of feeling under pressure. Compassion that does not capsize.','Suppression, calm performed while the tide rises underneath.','Calm is not absence. It is presence with feeling.','https://sacred-texts.com/tarot/pkt/img/cuki.jpg')
on conflict (id) do update set
  name = excluded.name,
  meaning_upright = excluded.meaning_upright,
  meaning_reversed = excluded.meaning_reversed,
  description = excluded.description,
  image_url = excluded.image_url;

-- Swords (Air — thought, truth, conflict) ----------------------------------
insert into public.tarot_cards (id, name, type, suit, value, meaning_upright, meaning_reversed, description, image_url) values
('swac','Ace of Swords','minor','swords',1,'Mental clarity. A truth seen cleanly. The cut that frees.','Confusion, the blade dulled, words used as weapon rather than tool.','Truth liberates. It is also sharp. Hold it carefully.','https://sacred-texts.com/tarot/pkt/img/swac.jpg'),
('sw02','Two of Swords','minor','swords',2,'A blocked decision. Blindfold by choice, scales held steady.','Procrastination, denial, the decision postponed until the body decides for you.','You can take the blindfold off. Looking is the first act.','https://sacred-texts.com/tarot/pkt/img/sw02.jpg'),
('sw03','Three of Swords','minor','swords',3,'Heartbreak. Pain that asks to be named, not narrated past.','Recovery, the wound aired, the body releasing what it held.','You may grieve here. The rain is part of healing.','https://sacred-texts.com/tarot/pkt/img/sw03.jpg'),
('sw04','Four of Swords','minor','swords',4,'Rest. Recovery is the practice. Stillness is not retreat.','Avoiding return to action, isolation past usefulness.','Lay the sword down. Pick it up only when rested.','https://sacred-texts.com/tarot/pkt/img/sw04.jpg'),
('sw05','Five of Swords','minor','swords',5,'A pyrrhic win. Conflict whose price exceeded the prize.','Aftermath, the willingness to set down the fight.','You won. Look at what it cost. Then choose differently.','https://sacred-texts.com/tarot/pkt/img/sw05.jpg'),
('sw06','Six of Swords','minor','swords',6,'Passage. Moving from one shore to a calmer one.','Stuck in the crossing, leaving without the lesson, returning to the same harbor.','You take what you can carry. The rest stays.','https://sacred-texts.com/tarot/pkt/img/sw06.jpg'),
('sw07','Seven of Swords','minor','swords',7,'Strategy. Sometimes the right move is the quiet one.','Deception, half-truths, the part of you you have not told yourself.','Honesty with self is the only ground from which strategy is not theft.','https://sacred-texts.com/tarot/pkt/img/sw07.jpg'),
('sw08','Eight of Swords','minor','swords',8,'A self-built prison. Bound by stories not by the world.','Loosened, the rope tested, the body remembering its motion.','Walk. The fence is shorter than it looks.','https://sacred-texts.com/tarot/pkt/img/sw08.jpg'),
('sw09','Nine of Swords','minor','swords',9,'Sleepless nights. Anxiety louder than the room.','Worry softening, the mind returning to ground.','The thoughts at 3am are not the truth. Make tea. Wait for light.','https://sacred-texts.com/tarot/pkt/img/sw09.jpg'),
('sw10','Ten of Swords','minor','swords',10,'A bottoming-out. The narrative finally exhausted.','Slow rise, the worst behind, the sun beginning at the horizon.','Things ended. Notice how that is also clearing.','https://sacred-texts.com/tarot/pkt/img/sw10.jpg'),
('swpa','Page of Swords','minor','swords',11,'A new way of thinking. Curiosity, vigilance, the bright edge of the mind.','Reactivity, words sent before the thought finishes, gossip dressed as analysis.','Question well. Listen at least as much.','https://sacred-texts.com/tarot/pkt/img/swpa.jpg'),
('swkn','Knight of Swords','minor','swords',12,'Direct action driven by conviction. The charge that cuts through fog.','Aggression, the blade swung before sight, the mind run away with the body.','Move with conviction. Slow long enough to see what you are cutting.','https://sacred-texts.com/tarot/pkt/img/swkn.jpg'),
('swqu','Queen of Swords','minor','swords',13,'Clarity earned through loss. Honest counsel, kind boundary.','Coldness, the cut as default, intellect used to escape feeling.','Truth and tenderness are not opposites. The queen holds both.','https://sacred-texts.com/tarot/pkt/img/swqu.jpg'),
('swki','King of Swords','minor','swords',14,'Wisdom that decides. The mind in service of justice.','Authoritarianism, certainty without humility, mind that has lost the heart.','Decide. Stay open to being wrong.','https://sacred-texts.com/tarot/pkt/img/swki.jpg')
on conflict (id) do update set
  name = excluded.name,
  meaning_upright = excluded.meaning_upright,
  meaning_reversed = excluded.meaning_reversed,
  description = excluded.description,
  image_url = excluded.image_url;

-- Pentacles (Earth — body, money, craft) -----------------------------------
insert into public.tarot_cards (id, name, type, suit, value, meaning_upright, meaning_reversed, description, image_url) values
('peac','Ace of Pentacles','minor','pentacles',1,'An offering of the material. A new resource. Seed for ground that can hold it.','Missed opportunity, the gift unrecognized, scarcity mindset speaking.','You are allowed to receive. Plant where it will be tended.','https://sacred-texts.com/tarot/pkt/img/peac.jpg'),
('pe02','Two of Pentacles','minor','pentacles',2,'Balance held in motion. Many things juggled, one with grace.','Overcommitment, dropping what you would not have agreed to carry sober.','You may set one down. Choose which.','https://sacred-texts.com/tarot/pkt/img/pe02.jpg'),
('pe03','Three of Pentacles','minor','pentacles',3,'Collaboration. The work made better by other hands.','Solo struggle, isolation from the craft community.','Apprenticeship runs both directions. Listen to the mason and the architect.','https://sacred-texts.com/tarot/pkt/img/pe03.jpg'),
('pe04','Four of Pentacles','minor','pentacles',4,'Conservation. Holding what was earned.','Hoarding, the grip so tight nothing can come in.','You may hold and still keep an open hand.','https://sacred-texts.com/tarot/pkt/img/pe04.jpg'),
('pe05','Five of Pentacles','minor','pentacles',5,'Hard times. The light from inside the window unseen.','Recovery, return to warmth, the help finally accepted.','You can be in lack and still loved. Knock on the door.','https://sacred-texts.com/tarot/pkt/img/pe05.jpg'),
('pe06','Six of Pentacles','minor','pentacles',6,'Giving and receiving in honest proportion.','Strings attached, generosity as control, charity that bypasses dignity.','The scale only balances when both hands are honest.','https://sacred-texts.com/tarot/pkt/img/pe06.jpg'),
('pe07','Seven of Pentacles','minor','pentacles',7,'The patience of the garden. Looking at what has grown so far.','Impatience, harvest before time, work abandoned at the threshold.','Seasons are real. Stay with the practice through the unsexy weeks.','https://sacred-texts.com/tarot/pkt/img/pe07.jpg'),
('pe08','Eight of Pentacles','minor','pentacles',8,'Apprenticeship. The same motion practiced into mastery.','Perfectionism, repetition without learning, craft as escape from feeling.','Mastery is repetition with attention.','https://sacred-texts.com/tarot/pkt/img/pe08.jpg'),
('pe09','Nine of Pentacles','minor','pentacles',9,'Self-made comfort. The garden you built standing on its own.','Loneliness inside the comfort, isolation mistaken for independence.','You built this. Now let someone in.','https://sacred-texts.com/tarot/pkt/img/pe09.jpg'),
('pe10','Ten of Pentacles','minor','pentacles',10,'Legacy. What you tend is bigger than you.','Family entanglements, inheritance with strings, wealth that did not bring belonging.','What you leave is in the doing, not in the deed.','https://sacred-texts.com/tarot/pkt/img/pe10.jpg'),
('pepa','Page of Pentacles','minor','pentacles',11,'A practical curiosity. The student of the body, the land, the craft.','Distraction, beginning many things, finishing few.','Stay with the one practice. The depth is in the second year.','https://sacred-texts.com/tarot/pkt/img/pepa.jpg'),
('pekn','Knight of Pentacles','minor','pentacles',12,'Steady forward motion. The slow horse arrives.','Stuckness, work as escape, ritual without spirit.','Slow is also a speed. Trust the pace that lets you finish.','https://sacred-texts.com/tarot/pkt/img/pekn.jpg'),
('pequ','Queen of Pentacles','minor','pentacles',13,'Embodied care. Wealth as the ability to provide warmth.','Smothering, self-neglect in the act of nurturing, the garden tended at the cost of the gardener.','You are also a place that needs tending.','https://sacred-texts.com/tarot/pkt/img/pequ.jpg'),
('peki','King of Pentacles','minor','pentacles',14,'Stewardship. Resources held in service of those they touch.','Material obsession, security purchased at the cost of presence.','You may be wealthy and still in your body, still in the room.','https://sacred-texts.com/tarot/pkt/img/peki.jpg')
on conflict (id) do update set
  name = excluded.name,
  meaning_upright = excluded.meaning_upright,
  meaning_reversed = excluded.meaning_reversed,
  description = excluded.description,
  image_url = excluded.image_url;
