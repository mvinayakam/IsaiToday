import { storage } from "../lib/storage";
import { createSongMetadata } from "./youtube";
import { randomUUID } from "crypto";

// Generate sample users
const generateUsers = () => {
  const firstNames = ["Raj", "Priya", "Arjun", "Ananya", "Vikram", "Shreya", "Rohan", "Meera", "Karthik", "Divya", "Aditya", "Nisha", "Rahul", "Pooja", "Amit", "Sanjana", "Dev", "Kavya", "Suresh", "Lakshmi", "Madhav", "Riya", "Krishna", "Anjali", "Mohit", "Sneha", "Arvind", "Dia", "Vishnu", "Tara", "Nikhil", "Swati", "Prakash", "Neha", "Ajay", "Simran", "Naveen", "Ishita", "Deepak", "Preeti", "Varun", "Jaya", "Siddharth", "Kritika", "Harish", "Avani", "Ganesh", "Rani", "Mukesh", "Zara"];
  const lastNames = ["Sharma", "Kumar", "Patel", "Singh", "Reddy", "Iyer", "Mehta", "Nair", "Rao", "Joshi", "Kapoor", "Menon", "Agarwal", "Pillai", "Desai", "Gupta", "Mishra", "Chatterjee", "Verma", "Das"];
  
  return firstNames.map((firstName, idx) => {
    const lastName = lastNames[idx % lastNames.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    return {
      id: randomUUID(),
      email,
      firstName,
      lastName,
      profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`
    };
  });
};

// Expanded song collection with diverse Indian music
const seedSongs = [
  // R D Burman classics
  { youtubeId: "CDNJbIeKFGQ", title: "Piya Tu Ab To Aaja", artist: "Asha Bhonsle", album: "Caravan", language: "Hindi", tags: ["classic", "retro", "bollywood"] },
  { youtubeId: "kw4tT7SCmaY", title: "Dum Maro Dum", artist: "Asha Bhonsle", album: "Hare Rama Hare Krishna", language: "Hindi", tags: ["classic", "bollywood", "dance"] },
  { youtubeId: "PQmrmVs10X8", title: "O Haseena Zulfon Wali", artist: "Kishore Kumar", album: "Teesri Manzil", language: "Hindi", tags: ["classic", "romantic"] },
  
  // Kishore Kumar
  { youtubeId: "YR12Z8f1Dh8", title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", album: "Aradhana", language: "Hindi", tags: ["classic", "romantic", "retro"] },
  { youtubeId: "aWu8g1yHABg", title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar", album: "Blackmail", language: "Hindi", tags: ["classic", "romantic"] },
  { youtubeId: "1VNp4JpLTzQ", title: "Zindagi Ek Safar", artist: "Kishore Kumar", album: "Andaz", language: "Hindi", tags: ["classic", "philosophy"] },
  
  // A R Rahman Tamil
  { youtubeId: "3Tqjf6teI-Q", title: "Roja Janeman", artist: "S P Balasubrahmanyam", album: "Roja", language: "Tamil", tags: ["ar-rahman", "melody", "romantic"] },
  { youtubeId: "s4bJ0arbnd8", title: "Nenjukkule", artist: "Shakthisree Gopalan", album: "Kadal", language: "Tamil", tags: ["ar-rahman", "romantic", "modern"] },
  { youtubeId: "vrmVVE9j2aU", title: "Munbe Vaa", artist: "Naresh Iyer", album: "Sillunu Oru Kaadhal", language: "Tamil", tags: ["ar-rahman", "romantic"] },
  { youtubeId: "J8P6gJBTVyM", title: "Vaseegara", artist: "Bombay Jayashri", album: "Minnale", language: "Tamil", tags: ["ar-rahman", "melody"] },
  
  // A R Rahman Hindi
  { youtubeId: "K7sJqXUTups", title: "Kehna Hi Kya", artist: "Hariharan", album: "Bombay", language: "Hindi", tags: ["ar-rahman", "romantic"] },
  { youtubeId: "5eTCZ9L834s", title: "Ye Jo Des Hai Tera", artist: "A R Rahman", album: "Swades", language: "Hindi", tags: ["ar-rahman", "patriotic"] },
  { youtubeId: "f7UHCWqH2T0", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", album: "Dil Se", language: "Hindi", tags: ["ar-rahman", "dance", "sufi"] },
  { youtubeId: "bxUlvmJhQC0", title: "Jai Ho", artist: "A R Rahman", album: "Slumdog Millionaire", language: "Hindi", tags: ["ar-rahman", "dance", "global"] },
  
  // Ilaiyaraja classics
  { youtubeId: "YZBW7OWbO5Y", title: "Sundari Kannal", artist: "S P Balasubrahmanyam", album: "Thalapathi", language: "Tamil", tags: ["ilaiyaraja", "classic", "melody"] },
  { youtubeId: "6ste3pOXLto", title: "Kanne Kalaimaane", artist: "Mano", album: "Moondram Pirai", language: "Tamil", tags: ["ilaiyaraja", "melody"] },
  { youtubeId: "HQ5mJNk8k7M", title: "Kaatril Varum Geetham", artist: "S P Balasubrahmanyam", album: "Panneer Pushpangal", language: "Tamil", tags: ["ilaiyaraja", "melody"] },
  { youtubeId: "xp8c86p5vwA", title: "Raja Rajathi", artist: "K S Chithra", album: "Agni Natchathiram", language: "Tamil", tags: ["ilaiyaraja", "dance"] },
  
  // Modern Bollywood
  { youtubeId: "RLzC55ai0eo", title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", language: "Hindi", tags: ["modern", "romantic", "arijit"] },
  { youtubeId: "LWYbRBP9sn0", title: "Channa Mereya", artist: "Arijit Singh", album: "Ae Dil Hai Mushkil", language: "Hindi", tags: ["modern", "romantic", "sad"] },
  { youtubeId: "9AOiNFC2s28", title: "Tere Bina", artist: "Chinmayi", album: "Guru", language: "Hindi", tags: ["ar-rahman", "romantic"] },
  { youtubeId: "HSmcQobyXjQ", title: "Kabira", artist: "Tochi Raina", album: "Yeh Jawaani Hai Deewani", language: "Hindi", tags: ["modern", "soul", "travel"] },
  
  // Tamil modern
  { youtubeId: "i7RM7TJQH5M", title: "Why This Kolaveri Di", artist: "Dhanush", album: "3", language: "Tamil", tags: ["viral", "modern", "humor"] },
  { youtubeId: "Qw7ftEjdUkk", title: "Thalli Pogathey", artist: "Sid Sriram", album: "Achcham Yenbadhu Madamaiyada", language: "Tamil", tags: ["ar-rahman", "romantic", "modern"] },
  { youtubeId: "SPQbewtlChg", title: "Kannamma", artist: "Sid Sriram", album: "Kaala", language: "Tamil", tags: ["romantic", "soulful"] },
  { youtubeId: "47mOhzfCCJM", title: "Rowdy Baby", artist: "Dhanush, Dhee", album: "Maari 2", language: "Tamil", tags: ["dance", "viral", "yuvan"] },
  
  // Malayalam
  { youtubeId: "tNtjmwhJq3k", title: "Mazha Kondu", artist: "K J Yesudas", album: "Kireedam", language: "Malayalam", tags: ["classic", "melody", "malayalam"] },
  { youtubeId: "kGVvxCKJ6hw", title: "Innale En Ullil", artist: "K S Chithra", album: "Kaattu Vannu Vilichappol", language: "Malayalam", tags: ["melody", "romantic"] },
  { youtubeId: "bOdp8m6L8jY", title: "Mandaracheppundo", artist: "Yesudas, Chithra", album: "Sandesham", language: "Malayalam", tags: ["classic", "melody"] },
  
  // Telugu
  { youtubeId: "JoQ9rWZECFY", title: "Samajavaragamana", artist: "Sid Sriram", album: "Ala Vaikunthapurramuloo", language: "Telugu", tags: ["modern", "romantic", "melody"] },
  { youtubeId: "pOZ67kAnWeo", title: "Inkem Inkem", artist: "Sid Sriram", album: "Geetha Govindam", language: "Telugu", tags: ["romantic", "modern"] },
  { youtubeId: "JQ7vTH-mRUg", title: "Ninne Ninne", artist: "Shreya Ghoshal", album: "Nachavule", language: "Telugu", tags: ["romantic", "melody"] },
  
  // Sufi & Devotional
  { youtubeId: "OyLwsOt2HmY", title: "Kun Faya Kun", artist: "A R Rahman, Javed Ali", album: "Rockstar", language: "Hindi", tags: ["sufi", "spiritual", "ar-rahman"] },
  { youtubeId: "xCDCOPJzU0k", title: "Allah Ke Bande", artist: "Kailash Kher", album: "Waisa Bhi Hota Hai Part II", language: "Hindi", tags: ["sufi", "inspirational"] },
  { youtubeId: "cxRzFLdS6UM", title: "Bhar Do Jholi Meri", artist: "Adnan Sami", album: "Bajrangi Bhaijaan", language: "Hindi", tags: ["devotional", "sufi"] },
  
  // Indie & Alternative
  { youtubeId: "H9C2q6_jU54", title: "Bulleya", artist: "Amit Mishra", album: "Ae Dil Hai Mushkil", language: "Hindi", tags: ["modern", "sufi", "romantic"] },
  { youtubeId: "CDWQ0HE66u8", title: "Iktara", artist: "Kavita Seth", album: "Wake Up Sid", language: "Hindi", tags: ["indie", "soul", "modern"] },
  { youtubeId: "wV1FrRDWh1A", title: "Nadaan Parindey", artist: "A R Rahman", album: "Rockstar", language: "Hindi", tags: ["ar-rahman", "inspirational"] },
  
  // Regional Gems
  { youtubeId: "nHoN57GWkzE", title: "Jeene Ke Ishaare", artist: "Clinton Cerejo", album: "Phata Poster Nikhla Hero", language: "Hindi", tags: ["modern", "dance"] },
  { youtubeId: "4DegbkFl69s", title: "Po Indru Neeyaga", artist: "Sid Sriram", album: "Velai Illa Pattadhaari", language: "Tamil", tags: ["romantic", "anirudh"] },
  { youtubeId: "EQ3vUUlVVvc", title: "Kadhalan Kadhali", artist: "Vijay Antony", album: "Azhagiya Asura", language: "Tamil", tags: ["romantic", "melody"] },
  
  // Party & Dance
  { youtubeId: "Xd0MT1sR21A", title: "Badtameez Dil", artist: "Benny Dayal", album: "Yeh Jawaani Hai Deewani", language: "Hindi", tags: ["dance", "party", "modern"] },
  { youtubeId: "vjhq6dQULf0", title: "Lungi Dance", artist: "Yo Yo Honey Singh", album: "Chennai Express", language: "Hindi", tags: ["dance", "party", "viral"] },
  { youtubeId: "R4R1f4Y0b4A", title: "Gulabi Aankhen", artist: "Mohammed Rafi", album: "The Train", language: "Hindi", tags: ["classic", "romantic"] },
  
  // More contemporary
  { youtubeId: "a16Kgh7j8zk", title: "Kabhi Kabhi Aditi", artist: "Rashid Ali", album: "Jaane Tu Ya Jaane Na", language: "Hindi", tags: ["modern", "friendship", "ar-rahman"] },
  { youtubeId: "NGK2uuWsKo0", title: "Masakali", artist: "Mohit Chauhan", album: "Delhi 6", language: "Hindi", tags: ["ar-rahman", "soulful"] },
  { youtubeId: "K44j-sb1SRY", title: "Ilahi", artist: "Arijit Singh", album: "Yeh Jawaani Hai Deewani", language: "Hindi", tags: ["romantic", "travel", "modern"] },
  { youtubeId: "6Iz1jEd6JIs", title: "Gerua", artist: "Arijit Singh, Antara Mitra", album: "Dilwale", language: "Hindi", tags: ["romantic", "modern"] },
  
  // Nostalgic classics
  { youtubeId: "WbfN4UsrbXY", title: "Kuch Kuch Hota Hai", artist: "Udit Narayan, Alka Yagnik", album: "Kuch Kuch Hota Hai", language: "Hindi", tags: ["classic", "romantic", "90s"] },
  { youtubeId: "sfR7caNw1Z0", title: "Tujhe Dekha To", artist: "Kumar Sanu", album: "Dilwale Dulhania Le Jayenge", language: "Hindi", tags: ["classic", "romantic", "90s"] },
];

const stories = [
  "This song reminds me of my grandmother's old radio. The melody never gets old!",
  "My father used to hum this while cooking. Pure nostalgia in every note.",
  "The orchestration is simply divine. This melody stays with you forever.",
  "This changed Tamil cinema music forever. Still gives me goosebumps!",
  "Perfect song for late night drives. The melodies hit different!",
  "Every time I hear this, I'm transported to a simpler time filled with love and warmth.",
  "The lyrics are so profound. I discover new meanings every time I listen.",
  "This was playing when I first met my best friend. Special memories attached!",
  "The instrumentation on this track is absolutely phenomenal. A masterpiece!",
  "Heard this at a wedding and couldn't stop dancing. Such infectious energy!",
  "This song got me through some tough times. Music truly heals the soul.",
  "The vocalist's range and emotion on this track is simply unmatched.",
  "Discovered this gem while traveling. Now it's my go-to feel-good song!",
  "The fusion of traditional and modern elements is done so beautifully here.",
  "This song captures the essence of monsoons perfectly. Love listening during rains!",
  "My mom's favorite song. Reminds me of simpler childhood days.",
  "The poetry in these lyrics is next level. True art!",
  "Can't help but smile every single time this plays. Pure joy!",
  "This track never fails to give me chills. Absolutely timeless!",
  "The musical arrangement is so layered. Discovering new sounds on every listen!",
];

export async function seedDatabase(defaultUserId: string) {
  try {
    console.log("Starting comprehensive database seeding...");
    
    // Generate additional users (for assigning songs)
    const users = generateUsers();
    console.log(`Using ${users.length} sample users for song attribution`);
    
    // Note: Users are created through authentication, not directly in the database
    // We'll use the provided defaultUserId for all songs in this seed
    
    // Create all albums
    const albumNames = Array.from(new Set(seedSongs.map(s => s.album).filter(Boolean)));
    const albumMap = new Map<string, string>();
    for (const albumName of albumNames) {
      const existing = await storage.getAlbumByName(albumName);
      if (existing) {
        albumMap.set(albumName, existing.id);
      } else {
        const album = await storage.createAlbum({ name: albumName });
        albumMap.set(albumName, album.id);
      }
    }
    console.log(`Created/verified ${albumMap.size} albums`);
    
    // Create all languages
    const languageNames = Array.from(new Set(seedSongs.map(s => s.language).filter(Boolean)));
    const languageMap = new Map<string, string>();
    for (const languageName of languageNames) {
      const existing = await storage.getLanguageByName(languageName);
      if (existing) {
        languageMap.set(languageName, existing.id);
      } else {
        const language = await storage.createLanguage({ name: languageName });
        languageMap.set(languageName, language.id);
      }
    }
    console.log(`Created/verified ${languageMap.size} languages`);
    
    // Create all artists
    const artistNames = new Set<string>();
    seedSongs.forEach(s => s.artist.split(',').forEach(a => artistNames.add(a.trim())));
    const artistMap = new Map<string, string>();
    for (const artistName of Array.from(artistNames)) {
      const existing = await storage.getArtistByName(artistName);
      if (existing) {
        artistMap.set(artistName, existing.id);
      } else {
        const artist = await storage.createArtist({ name: artistName });
        artistMap.set(artistName, artist.id);
      }
    }
    console.log(`Created/verified ${artistMap.size} artists`);
    
    // Create tags
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
    
    // Create songs with metadata
    let songsCreated = 0;
    for (let i = 0; i < seedSongs.length; i++) {
      const seedSong = seedSongs[i];
      const existingSong = await storage.getSongByYoutubeId(seedSong.youtubeId);
      if (existingSong) {
        console.log(`Song already exists: ${seedSong.title}`);
        continue;
      }
      
      // For now, assign all songs to the default user
      // In the future, when we have real users, we can distribute across them
      const metadata = createSongMetadata(seedSong.youtubeId, seedSong.title, seedSong.artist);
      
      const song = await storage.createSong({
        youtubeId: seedSong.youtubeId,
        title: metadata.title,
        artist: metadata.artist,
        thumbnail: metadata.thumbnail,
        album: seedSong.album || null,
        language: seedSong.language || null,
        addedBy: defaultUserId,
      });
      
      // Add artists to song
      const artistsList = seedSong.artist.split(',').map(a => a.trim());
      for (const artistName of artistsList) {
        const artistId = artistMap.get(artistName);
        if (artistId) {
          try {
            await storage.addArtistToSong({ songId: song.id, artistId });
          } catch (error) {
            // Artist might already be linked
          }
        }
      }
      
      // Add tags to song
      for (const tagName of seedSong.tags) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          try {
            await storage.addTagToSong({ songId: song.id, tagId });
          } catch (error) {
            // Tag might already be added
          }
        }
      }
      
      // Add story from the default user
      const randomStory = stories[Math.floor(Math.random() * stories.length)];
      try {
        await storage.createSongStory({
          songId: song.id,
          userId: defaultUserId,
          story: randomStory,
        });
      } catch (error) {
        // Story might already exist
      }
      
      songsCreated++;
    }
    
    console.log(`Seeding complete! Created ${songsCreated} songs with metadata and stories`);
    console.log(`Total: ${albumMap.size} albums, ${languageMap.size} languages, ${artistMap.size} artists, ${tagMap.size} tags`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
