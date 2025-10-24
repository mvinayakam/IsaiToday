import { storage } from "./storage";
import { createSongMetadata } from "./youtube";

// Seed data for Indian music focused on the user's favorite musicians
const seedSongs = [
  // R D Burman songs
  { youtubeId: "CDNJbIeKFGQ", title: "Piya Tu Ab To Aaja", artist: "R D Burman, Asha Bhonsle", tags: ["classic", "retro", "rd-burman", "asha-bhonsle", "bollywood"] },
  { youtubeId: "kw4tT7SCmaY", title: "Dum Maro Dum", artist: "R D Burman, Asha Bhonsle", tags: ["rd-burman", "classic", "bollywood", "asha-bhonsle"] },
  { youtubeId: "PQmrmVs10X8", title: "O Haseena Zulfon Wali", artist: "Kishore Kumar, R D Burman", tags: ["kishore", "rd-burman", "classic", "romantic"] },
  
  // Kishore Kumar songs
  { youtubeId: "YR12Z8f1Dh8", title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", tags: ["classic", "romantic", "kishore", "retro", "bollywood"] },
  { youtubeId: "aWu8g1yHABg", title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar, S D Burman", tags: ["classic", "romantic", "kishore", "sd-burman", "retro"] },
  
  // A R Rahman songs
  { youtubeId: "3Tqjf6teI-Q", title: "Roja Janeman", artist: "A R Rahman, S P Balasubrahmanyam", tags: ["ar-rahman", "tamil", "melody", "sp-balu"] },
  { youtubeId: "s4bJ0arbnd8", title: "Nenjukkule", artist: "A R Rahman", tags: ["ar-rahman", "tamil", "romantic", "melody"] },
  { youtubeId: "K7sJqXUTups", title: "Kehna Hi Kya", artist: "A R Rahman", tags: ["ar-rahman", "romantic", "bollywood", "melody"] },
  { youtubeId: "5eTCZ9L834s", title: "Ye Jo Des Hai Tera", artist: "A R Rahman", tags: ["ar-rahman", "patriotic", "bollywood"] },
  
  // Ilaiyaraja songs
  { youtubeId: "YZBW7OWbO5Y", title: "Sundari Kannal", artist: "Ilaiyaraja, S P Balasubrahmanyam", tags: ["ilaiyaraja", "tamil", "classic", "sp-balu", "melody"] },
  { youtubeId: "6ste3pOXLto", title: "Kanne Kalaimaane", artist: "Ilaiyaraja", tags: ["ilaiyaraja", "tamil", "melody", "classic"] },
  { youtubeId: "HQ5mJNk8k7M", title: "Kaatril Varum Geetham", artist: "Ilaiyaraja, S P Balasubrahmanyam", tags: ["ilaiyaraja", "tamil", "melody", "sp-balu"] },
];

const defaultStories = [
  "This song reminds me of my grandmother's old radio. The melody never gets old!",
  "My father used to hum this while cooking. Pure nostalgia in every note.",
  "The orchestration is simply divine. This melody stays with you forever.",
  "This changed Tamil cinema music forever. Still gives me goosebumps!",
  "Perfect song for late night drives. The melodies hit different!",
  "Every time I hear this, I'm transported to a simpler time filled with love and warmth.",
];

export async function seedDatabase(defaultUserId: string) {
  try {
    console.log("Starting database seeding...");
    
    // Create tags first
    const tagNames = new Set<string>();
    seedSongs.forEach(song => song.tags.forEach(tag => tagNames.add(tag)));
    
    const tagMap = new Map<string, string>();
    for (const tagName of Array.from(tagNames)) {
      const existingTag = await storage.getTagByName(tagName);
      if (existingTag) {
        tagMap.set(tagName, existingTag.id);
      } else {
        const tag = await storage.createTag({ name: tagName });
        tagMap.set(tagName, tag.id);
      }
    }
    
    console.log(`Created/verified ${tagMap.size} tags`);
    
    // Create songs
    let songsCreated = 0;
    for (const seedSong of seedSongs) {
      const existingSong = await storage.getSongByYoutubeId(seedSong.youtubeId);
      if (existingSong) {
        console.log(`Song already exists: ${seedSong.title}`);
        continue;
      }
      
      const metadata = createSongMetadata(seedSong.youtubeId, seedSong.title, seedSong.artist);
      
      const song = await storage.createSong({
        youtubeId: seedSong.youtubeId,
        title: metadata.title,
        artist: metadata.artist,
        thumbnail: metadata.thumbnail,
        addedBy: defaultUserId,
      });
      
      // Add tags to song
      for (const tagName of seedSong.tags) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          try {
            await storage.addTagToSong({ songId: song.id, tagId });
          } catch (error) {
            // Tag might already be added
            console.log(`Tag ${tagName} already added to song ${song.title}`);
          }
        }
      }
      
      // Add a default story for the seed user
      const randomStory = defaultStories[Math.floor(Math.random() * defaultStories.length)];
      try {
        await storage.createSongStory({
          songId: song.id,
          userId: defaultUserId,
          story: randomStory,
        });
      } catch (error) {
        console.log(`Story already exists for song ${song.title}`);
      }
      
      songsCreated++;
    }
    
    console.log(`Seeding complete! Created ${songsCreated} songs`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
