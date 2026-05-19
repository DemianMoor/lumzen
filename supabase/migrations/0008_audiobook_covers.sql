-- LumZen — refresh audiobook cover_image_url with verified, on-brand,
-- public-domain artwork hosted on Wikimedia Commons. The previous
-- archive.org/services/img/...librivox URLs 302 to /images/notfound.png
-- (LibriVox cover service is not exposed at that path), so every cover
-- on the audiobooks library was a broken placeholder.
--
-- Each replacement is portrait or near-square, painterly/classical, and
-- a fit for the cosmic/mystical visual language of the site. Licenses
-- are PD-old or CC0; no attribution display is required.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Assistants_and_George_Frederic_Watts_-_Hope_-_Google_Art_Project.jpg' where librivox_id = '132';
-- G. F. Watts, "Hope" (1886). Solitary blindfolded figure on a globe —
-- the inner life of thought that Allen writes about.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Utamaro_%28c._1792%E2%80%9393%29_Fumi_Yomu_Onna_%28MFA%29.jpg' where librivox_id = '1052';
-- Kitagawa Utamaro, "Woman Reading a Letter" (c. 1792–93). Ukiyo-e
-- woodblock; the quiet contemplation Okakura describes.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Dat_boek_van_der_navolghinge_ihesu_Christi_MET_MM3007.jpg' where librivox_id = '196';
-- 1489 German woodcut edition of "The Imitation of Christ"
-- (Metropolitan Museum). The text in its early printed form.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Asher_Brown_Durand_-_Woodland_Interior_-_63.269_-_Museum_of_Fine_Arts.jpg' where librivox_id = '56';
-- Asher B. Durand, "Woodland Interior" (c. 1850s). Hudson River School
-- contemporary of Thoreau — the solitude in nature of Walden.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/The_Equestrian_Statue_of_Marcus_Aurelius_on_the_Capitol_MET_DP874177.jpg' where librivox_id = '564';
-- Engraving of the equestrian statue of Marcus Aurelius (Capitoline
-- Hill), Metropolitan Museum.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Zhang_Lu-Laozi_Riding_an_Ox.jpg' where librivox_id = '48';
-- Zhang Lu (1464–1538), "Laozi Riding an Ox." The sage departing
-- westward to write the Tao Te Ching.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Falero%2C_Luis_Ricardo_-_L%27%C3%A9toile_double_-_1881.jpg' where librivox_id = '1019';
-- Luis Ricardo Falero, "Twin Stars" (1881). Two figures amid stars
-- and nebulae — focused celestial attention.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/f/f9/3_Krishna_Dancing_Page_from_the_Dispersed_Boston_Rasikapriya_%28Lover%27s_Breviary%29Amber%2C_ca._1610%2C_Metmuseum.jpg' where librivox_id = '113';
-- "Krishna Dancing," Amber school miniature, ca. 1610 (Metropolitan
-- Museum). Cosmic blue deity, jeweled gold ground.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Frederic_Edwin_Church_-_Twilight_in_the_Wilderness.jpg' where librivox_id = '3104';
-- Frederic Edwin Church, "Twilight in the Wilderness" (1860, same year
-- Emerson published "The Conduct of Life"). Transcendentalist sublime.

update public.audiobooks set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Kahlil_Gibran_-_The_Prophet_01.png' where librivox_id = '9396';
-- Gibran's own frontispiece for "The Prophet" (1923) — the prophet
-- Almustafa as Gibran painted him.
