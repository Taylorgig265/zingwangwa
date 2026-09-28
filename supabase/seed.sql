-- ════════════════════════════════════════════════════════════
-- Zingwangwa Street Foods — Seed data (the real menu!)
-- Images referenced from Supabase Storage bucket `menu-images`
-- (upload the files from /public/menu) or swap for your CDN.
-- ════════════════════════════════════════════════════════════

insert into public.categories (name, slug, sort_order, icon) values
  ('Chips & Grilled Chicken', 'chips', 1, '🍟'),
  ('Shawarma', 'shawarma', 2, '🌯'),
  ('Snacks', 'snacks', 3, '🥟'),
  ('Cupcakes', 'cupcakes', 4, '🧁')
on conflict (slug) do nothing;

with c as (select id, slug from public.categories)
insert into public.menu_items (category_id, name, description, price_zmw, image_url, tags, is_available, is_featured, spice_level, prep_time_mins) values
  -- Chips & Grilled Chicken
  ((select id from c where slug='chips'), 'Plain Chips', 'Golden, crispy, fluffy inside. The classic that started it all.', 2000, 'plain-chips.png', '{classic}', true, false, 'none', 10),
  ((select id from c where slug='chips'), 'Grill & Chips', 'Flame-kissed grilled chicken over a mountain of hot chips. The people''s favourite.', 4500, 'grill-chips.png', '{signature,grilled}', true, true, 'medium', 20),
  ((select id from c where slug='chips'), 'Sausage + Chips', 'Smoky grilled sausage snuggling a generous pile of chips.', 4500, 'sausage-chips.png', '{grilled}', true, false, 'mild', 15),
  ((select id from c where slug='chips'), 'Chips + Meatballs', 'Juicy hand-rolled meatballs, saucy and serious, on crispy chips.', 4500, 'chips-meatballs.png', '{signature}', true, true, 'mild', 18),
  ((select id from c where slug='chips'), 'Egg & Chips', 'Fried eggs sunny-side over golden chips. Simple. Perfect.', 3000, 'egg-chips.png', '{breakfast}', true, false, 'none', 12),
  -- Shawarma
  ((select id from c where slug='shawarma'), 'Plain Chapati', 'Soft, warm, buttery chapati — the perfect sidekick.', 1000, null, '{side}', true, false, 'none', 5),
  ((select id from c where slug='shawarma'), 'Made By Wifey', 'The big boss. Loaded shawarma with everything — grilled meat, sauce, crunch. Made with love.', 8000, 'made-by-wifey.png', '{signature,loaded}', true, true, 'hot', 15),
  ((select id from c where slug='shawarma'), 'Chicken Mash', 'Tender chicken chunks mashed into a saucy wrap. Big flavor energy.', 4500, 'chicken-mash.png', '{chicken}', true, false, 'medium', 12),
  ((select id from c where slug='shawarma'), 'Sumthn Mncy', 'Something… money. 💰 Mince-loaded wrap with our secret sauce.', 4500, null, '{signature}', true, false, 'medium', 12),
  ((select id from c where slug='shawarma'), 'Sausage Swirl', 'Grilled sausage swirled into a warm wrap with drippy sauce.', 4500, 'sausage-swirl.png', '{grilled}', true, false, 'mild', 12),
  ((select id from c where slug='shawarma'), 'Jamaica Vibes', 'Jerk-spiced wrap that brings the island heat. Good vibes only. 🌴', 2000, 'jamaica-vibes.png', '{spicy}', true, false, 'zing', 10),
  ((select id from c where slug='shawarma'), 'Egg Shawarma', 'Fluffy egg, fresh veg, saucy wrap. Breakfast of champions.', 3000, null, '{breakfast}', true, false, 'none', 8),
  -- Snacks
  ((select id from c where slug='snacks'), 'Samosa', 'Crispy triangle of joy, spiced filling, dangerously snackable.', 500, null, '{fried}', true, false, 'mild', 3),
  ((select id from c where slug='snacks'), 'Zitumbuwa', 'Malawian banana fritters — golden, sweet, straight off the pan.', 250, null, '{sweet,local}', true, false, 'none', 5),
  ((select id from c where slug='snacks'), 'Crackers', 'Crunchy, salty, fluffy little bites. The K250 legend.', 250, null, '{crunchy}', true, false, 'none', 2),
  -- Cupcakes
  ((select id from c where slug='cupcakes'), 'Cupcake', 'Frosted, fluffy happiness. Chocolate, vanilla or today''s surprise.', 700, null, '{sweet}', true, false, 'none', 2);
