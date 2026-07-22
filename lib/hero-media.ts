/**
 * Optional homepage hero video.
 *
 * When `heroVideoUrl` is set, the homepage billboard plays it muted/looped
 * behind the headline, using the featured listing's photo as poster and
 * fallback (so a broken URL can never blank the hero). Leave it "" to keep
 * the image hero.
 *
 * Where to get a clip (free, licensed for commercial use):
 *   - https://www.pexels.com/search/videos/mediterranean/
 *   - https://www.pexels.com/search/videos/drone%20footage%20beach/
 *   - https://coverr.co  ·  https://mixkit.co
 *
 * Best results: 10–25s aerial coastal loop, no people close-up, calm motion.
 * Download the 1920×1080 version (UHD is unnecessary weight), upload it to
 * the Supabase `property-images` bucket (or `/public/hero/`), and paste the
 * public URL here. Keep it under ~8 MB — trim/re-encode if needed:
 *   ffmpeg -i in.mp4 -vf scale=1920:-2 -an -t 20 -crf 28 hero.mp4
 */
export const heroVideoUrl = "";
