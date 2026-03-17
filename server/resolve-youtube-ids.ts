/**
 * Resolves correct YouTube video IDs for every song in the seed catalog.
 * Uses YouTube Data API v3 search to find the best match for each song.
 *
 * Run on the server (where YOUTUBE_API_KEY is set):
 *   export $(grep -v '^#' .env | xargs) && npx tsx server/resolve-youtube-ids.ts
 *
 * Outputs: server/resolved-ids.json  (title → youtubeId map)
 * Then patches server/seed.ts in place with the resolved IDs.
 */

import { google } from "googleapis";
import { writeFileSync, readFileSync } from "fs";
import path from "path";

const SONGS: { title: string; artist: string }[] = [
  // R D Burman
  { title: "Dum Maro Dum", artist: "Asha Bhosle" },
  { title: "O Haseena Zulfon Wali", artist: "Mohammed Rafi" },
  { title: "Aaja Aaja Main Hoon Pyar Tera", artist: "Mohammed Rafi" },
  { title: "Yeh Shaam Mastani", artist: "Kishore Kumar" },
  { title: "Musafir Hoon Yaaron", artist: "Kishore Kumar" },
  { title: "Chura Liya Hai Tumne", artist: "Asha Bhosle Mohammed Rafi" },
  { title: "Tere Bina Zindagi Se Koi", artist: "Kishore Kumar Lata Mangeshkar" },
  { title: "Pyaar Deewana Hota Hai", artist: "Kishore Kumar" },
  { title: "Koi Humdum Na Raha", artist: "Kishore Kumar" },
  { title: "Raat Akeli Hai", artist: "Asha Bhosle" },
  // S D Burman
  { title: "Kahin Deep Jale Kahin Dil", artist: "Lata Mangeshkar" },
  { title: "Man Re Tu Kahe Na Dheer Dhare", artist: "Mohammed Rafi" },
  { title: "Tere Mere Sapne", artist: "Mohammed Rafi" },
  { title: "Piya Tose Naina Laage Re", artist: "Lata Mangeshkar" },
  { title: "Gaata Rahe Mera Dil", artist: "Kishore Kumar Lata Mangeshkar" },
  // Chitalkar
  { title: "Abhi Na Jao Chhod Kar", artist: "Mohammed Rafi Asha Bhosle" },
  { title: "Suno Suno Miss Chatterjee", artist: "Kishore Kumar" },
  { title: "Mere Dil Mein Aaj Kya Hai", artist: "Lata Mangeshkar" },
  { title: "Shola Jo Bhadke", artist: "Lata Mangeshkar Chitalkar" },
  { title: "Aana Meri Jaan Meri Jaan Sunday Ke Sunday", artist: "Lata Mangeshkar Chitalkar" },
  // More Lata classics
  { title: "Gore Gore O Banke Chhore", artist: "Lata Mangeshkar" },
  { title: "Yeh Zindagi Usi Ki Hai", artist: "Lata Mangeshkar" },
  // Kishore Kumar
  { title: "Mere Sapno Ki Rani", artist: "Kishore Kumar" },
  { title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar" },
  { title: "Zindagi Ek Safar", artist: "Kishore Kumar" },
  { title: "Roop Tera Mastana", artist: "Kishore Kumar" },
  { title: "Kuch To Log Kahenge", artist: "Kishore Kumar" },
  { title: "Yeh Jo Mohabbat Hai", artist: "Kishore Kumar" },
  { title: "Ek Ladki Bheegi Bhaagi Si", artist: "Kishore Kumar" },
  { title: "Aa Chal Ke Tujhe Main Le Chalun", artist: "Kishore Kumar" },
  { title: "Mere Naina Sawan Bhado", artist: "Kishore Kumar" },
  // Mohammed Rafi
  { title: "Kya Hua Tera Wada", artist: "Mohammed Rafi" },
  { title: "Gulabi Aankhen", artist: "Mohammed Rafi" },
  { title: "Baharon Phool Barsao", artist: "Mohammed Rafi" },
  { title: "Dil Ke Jharoke Mein", artist: "Mohammed Rafi" },
  { title: "Khilona Jaan Kar", artist: "Mohammed Rafi" },
  { title: "Aaj Mausam Bada Beimaan Hai", artist: "Mohammed Rafi" },
  { title: "Jaan Pehechan Ho", artist: "Mohammed Rafi" },
  { title: "Suhani Raat Dhal Chuki", artist: "Mohammed Rafi" },
  { title: "Chaudhvin Ka Chand Ho", artist: "Mohammed Rafi" },
  { title: "Ehsaan Tera Hoga Mujh Par", artist: "Mohammed Rafi" },
  { title: "Teri Galiyon Mein Na Rakhenge Kadam", artist: "Mohammed Rafi" },
  // Lata Mangeshkar
  { title: "Lag Jaa Gale", artist: "Lata Mangeshkar" },
  { title: "Ajeeb Dastan Hai Yeh", artist: "Lata Mangeshkar" },
  { title: "Aaja Re Pardesi", artist: "Lata Mangeshkar" },
  { title: "Inhi Logon Ne Le Liya Dupatta Mera", artist: "Lata Mangeshkar" },
  { title: "Yeh Galiyan Yeh Chaubara", artist: "Lata Mangeshkar" },
  { title: "Do Ghadi Woh Jo Paas Aa Baithe", artist: "Lata Mangeshkar" },
  // Asha Bhosle
  { title: "Piya Tu Ab To Aaja", artist: "Asha Bhosle" },
  { title: "Yeh Mera Dil", artist: "Asha Bhosle" },
  { title: "Dil Cheez Kya Hai", artist: "Asha Bhosle" },
  { title: "In Aankhon Ki Masti Ke", artist: "Asha Bhosle" },
  { title: "Dum Maaro Dum", artist: "Asha Bhosle" },
  { title: "Mera Kuch Samaan", artist: "Asha Bhosle" },
  // A R Rahman Tamil
  { title: "Nenjukkule", artist: "Shakthisree Gopalan AR Rahman" },
  { title: "Vaseegara", artist: "Bombay Jayashri AR Rahman" },
  { title: "Thalli Pogathey", artist: "Sid Sriram AR Rahman" },
  { title: "Kannamma", artist: "Sid Sriram AR Rahman" },
  { title: "Uyire Uyire", artist: "AR Rahman Dil Se" },
  { title: "Kadhal Rojave", artist: "S P Balasubrahmanyam AR Rahman Roja" },
  { title: "Vennilave Vennilave", artist: "SP Balasubrahmanyam Swarnalatha AR Rahman" },
  { title: "Mustafa Mustafa", artist: "Shyam AR Rahman" },
  { title: "Snehithane", artist: "Shweta Shetty AR Rahman" },
  { title: "Chinna Chinna Aasai", artist: "Minmini AR Rahman Roja" },
  { title: "Ennavale Ennavale", artist: "Unni Menon AR Rahman" },
  { title: "Po Indru Neeyaga", artist: "Sid Sriram AR Rahman" },
  // A R Rahman Hindi
  { title: "Kehna Hi Kya", artist: "Hariharan AR Rahman Bombay" },
  { title: "Ye Jo Des Hai Tera Swades", artist: "Udit Narayan AR Rahman" },
  { title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh AR Rahman" },
  { title: "Jai Ho", artist: "AR Rahman Slumdog" },
  { title: "Kun Faya Kun", artist: "AR Rahman Javed Ali Rockstar" },
  { title: "Nadaan Parindey", artist: "AR Rahman Rockstar" },
  { title: "Tere Bina", artist: "Chinmayi AR Rahman Guru" },
  { title: "Kabhi Kabhi Aditi", artist: "Rashid Ali AR Rahman Jaane Tu" },
  { title: "Masakali", artist: "Mohit Chauhan AR Rahman Delhi 6" },
  { title: "Dil Se Re", artist: "AR Rahman Lata Mangeshkar" },
  { title: "Taal Se Taal Mila", artist: "Udit Narayan Alka Yagnik AR Rahman" },
  // Ilaiyaraja / SPB
  { title: "Sundari Kannal Oru Sethi", artist: "S P Balasubrahmanyam Ilaiyaraja" },
  { title: "Kanne Kalaimaane", artist: "Mano Ilaiyaraja" },
  { title: "Kaatril Varum Geetham", artist: "S P Balasubrahmanyam Ilaiyaraja" },
  { title: "En Iniya Pon Nilave", artist: "S P Balasubrahmanyam Vani Jairam Ilaiyaraja" },
  { title: "Nilave Vaa", artist: "S P Balasubrahmanyam S Janaki Ilaiyaraja" },
  { title: "Pookal Pookum Tharunam", artist: "S P Balasubrahmanyam K S Chithra Ilaiyaraja" },
  { title: "Poove Sempoove", artist: "K J Yesudas Ilaiyaraja" },
  { title: "Thendral Vanthu Theendum Pothu", artist: "S P Balasubrahmanyam Ilaiyaraja" },
  { title: "Ilamai Idho Idho", artist: "S P Balasubrahmanyam K J Yesudas" },
  { title: "Ninaivo Oru Paravai", artist: "S P Balasubrahmanyam Ilaiyaraja" },
  { title: "Megam Karukuthu", artist: "K J Yesudas S Janaki Ilaiyaraja" },
  { title: "Roja Janeman", artist: "S P Balasubrahmanyam AR Rahman" },
  { title: "Ye Haseen Wadiyan", artist: "S P Balasubrahmanyam AR Rahman Roja" },
  { title: "Raja Rajathi", artist: "K S Chithra Ilaiyaraja" },
  // Telugu
  { title: "Samajavaragamana", artist: "Sid Sriram" },
  { title: "Inkem Inkem Inkem Kaavaali", artist: "Sid Sriram" },
  { title: "Swathi Kiranam", artist: "S P Balasubrahmanyam" },
  { title: "Andala Chandamama", artist: "S P Balasubrahmanyam" },
  // Malayalam / KJ Yesudas
  { title: "Mazha Kondu Mazhavil Kondu", artist: "K J Yesudas" },
  { title: "Innale En Ullil", artist: "K S Chithra" },
  { title: "Mandaracheppundo", artist: "K J Yesudas" },
  { title: "Kaathirunnu Kaathirunnu", artist: "K J Yesudas" },
  { title: "Thamburan Vaazhuka", artist: "K J Yesudas" },
  { title: "Karukkilinile", artist: "K J Yesudas" },
  { title: "Nilave Mugam Kaatum Neram", artist: "K J Yesudas" },
  { title: "Ente Swarnam", artist: "K J Yesudas" },
  // Harry Belafonte
  { title: "Banana Boat Song Day O", artist: "Harry Belafonte" },
  { title: "Jamaica Farewell", artist: "Harry Belafonte" },
  { title: "Matilda", artist: "Harry Belafonte" },
  { title: "Island in the Sun", artist: "Harry Belafonte" },
  { title: "Mary's Boy Child", artist: "Harry Belafonte" },
  { title: "Jump in the Line", artist: "Harry Belafonte" },
  { title: "Coconut Woman", artist: "Harry Belafonte" },
  { title: "Man Smart Woman Smarter", artist: "Harry Belafonte" },
  // Frank Sinatra
  { title: "My Way", artist: "Frank Sinatra" },
  { title: "Fly Me to the Moon", artist: "Frank Sinatra" },
  { title: "New York New York", artist: "Frank Sinatra" },
  { title: "The Lady Is a Tramp", artist: "Frank Sinatra" },
  { title: "Summer Wind", artist: "Frank Sinatra" },
  { title: "The Best Is Yet to Come", artist: "Frank Sinatra" },
  { title: "Strangers in the Night", artist: "Frank Sinatra" },
  { title: "The Way You Look Tonight", artist: "Frank Sinatra" },
  { title: "Come Fly with Me", artist: "Frank Sinatra" },
  { title: "It Was a Very Good Year", artist: "Frank Sinatra" },
  // Modern Bollywood
  { title: "Tum Hi Ho", artist: "Arijit Singh" },
  { title: "Channa Mereya", artist: "Arijit Singh" },
  { title: "Kabira", artist: "Tochi Raina Rekha Bhardwaj" },
  { title: "Ilahi", artist: "Arijit Singh" },
  { title: "Gerua", artist: "Arijit Singh" },
  { title: "Kuch Kuch Hota Hai", artist: "Udit Narayan Alka Yagnik" },
  { title: "Tujhe Dekha To", artist: "Kumar Sanu Lata Mangeshkar" },
  { title: "Badtameez Dil", artist: "Benny Dayal" },
  { title: "Iktara", artist: "Kavita Seth" },
  { title: "Bulleya", artist: "Amit Mishra" },
  { title: "Allah Ke Bande", artist: "Kailash Kher" },
  { title: "Bhar Do Jholi Meri", artist: "Adnan Sami" },
  // Modern Tamil
  { title: "Why This Kolaveri Di", artist: "Dhanush" },
  { title: "Rowdy Baby", artist: "Dhanush Dhee" },
  { title: "Kannaana Kanney", artist: "Sid Sriram" },
  { title: "Oh Penne", artist: "Haricharan" },
  { title: "Ennodu Nee Irundhaal", artist: "Haricharan Shweta Mohan" },
  // Malayalam modern
  { title: "Malare", artist: "Vijay Yesudas Premam" },
  { title: "Oru Adaar Love Title Track", artist: "Omar Lulu" },
  { title: "Poomaram", artist: "Unni Menon" },
  { title: "Mizhiyoram", artist: "K S Chithra" },
];

async function searchYouTube(query: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not set");

  const youtube = google.youtube({ version: "v3", auth: apiKey });

  try {
    const res = await youtube.search.list({
      part: ["id"],
      q: query,
      type: ["video"],
      maxResults: 1,
      videoCategoryId: "10", // Music
    });
    const items = res.data.items;
    if (items && items.length > 0 && items[0].id?.videoId) {
      return items[0].id.videoId;
    }
    return null;
  } catch (err: any) {
    console.error(`  Search failed for "${query}":`, err.message);
    return null;
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`Resolving YouTube IDs for ${SONGS.length} songs...\n`);

  const resolved: Record<string, string> = {};
  let found = 0;
  let failed = 0;

  for (let i = 0; i < SONGS.length; i++) {
    const { title, artist } = SONGS[i];
    const query = `${title} ${artist}`;
    process.stdout.write(`[${i + 1}/${SONGS.length}] ${title} — `);

    const id = await searchYouTube(query);
    if (id) {
      resolved[title] = id;
      console.log(`✓ ${id}`);
      found++;
    } else {
      resolved[title] = "NOT_FOUND";
      console.log(`✗ not found`);
      failed++;
    }

    // Be gentle with the API: 1 request per second
    await sleep(1100);
  }

  const outPath = path.join(process.cwd(), "server", "resolved-ids.json");
  writeFileSync(outPath, JSON.stringify(resolved, null, 2));
  console.log(`\n✓ ${found} resolved, ✗ ${failed} not found`);
  console.log(`Saved to ${outPath}`);

  // Now patch seed.ts in place
  patchSeed(resolved);
}

function patchSeed(resolved: Record<string, string>) {
  const seedPath = path.join(process.cwd(), "server", "seed.ts");
  let src = readFileSync(seedPath, "utf-8");

  let patched = 0;
  let skipped = 0;

  for (const [title, newId] of Object.entries(resolved)) {
    if (newId === "NOT_FOUND") { skipped++; continue; }

    // Match lines containing this title and replace their youtubeId value
    // Pattern: youtubeId: "OLDID", title: "TITLE"
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `(youtubeId:\\s*")[^"]*(".*?title:\\s*"${escapedTitle}")`,
      "g"
    );
    const before = src;
    src = src.replace(re, `$1${newId}$2`);
    if (src !== before) patched++;
  }

  writeFileSync(seedPath, src);
  console.log(`\nPatched ${patched} IDs in seed.ts (${skipped} skipped — not found)`);
  console.log("Done! Commit seed.ts to deploy the fix.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
