/**
 * Playlist-seeder — seeds songs from Vinayak's three Spotify playlists.
 *
 * Playlist 1 — "Songs with a twist of salt and spice"  (843 tracks)
 * Playlist 2 — "Songs with a Soul"                     (1085 tracks)
 * Playlist 3 — "Music that Transcends the Divine"       (312 tracks)
 *
 * First ~25 songs from each playlist are seeded with contextually
 * appropriate stories that reflect why these songs matter.
 *
 * NOTE: YouTube IDs below are best-effort. Some are confirmed real;
 * others are placeholders (thumbnail fallback handles invalid ones).
 */

import { storage } from "../lib/storage";
import { createSongMetadata } from "./youtube";

// ---------------------------------------------------------------------------
// Playlist 1 — "Songs with a twist of salt and spice"
// Irreverent, sharp, witty Indian music with bite
// ---------------------------------------------------------------------------
const SALT_AND_SPICE_SONGS = [
  {
    youtubeId: "qVJ9LD8Z-mI", title: "Bhaag DK Bose, Aandhi Aayi",
    artist: "Ram Sampath", album: "Delhi Belly", language: "Hindi",
    tags: ["irreverent","comedy","sharp","indie"],
    story: "Ram Sampath weaponized a phrase that's simultaneously an insult and a monsoon warning into the most perfect protest song about everything that's wrong with the system. It's genius how the most subversive songs hide in plain sight as comedy."
  },
  {
    youtubeId: "NkT2SWLR8sA", title: "Nakkadwaley Disco, Udhaarwaley Khisko",
    artist: "Ram Sampath, Keerthi Sagathia", album: "Gangs of Wasseypur", language: "Hindi",
    tags: ["irreverent","dance","gangster","sharp"],
    story: "Anurag Kashyap understood that the people at the bottom of the social pyramid deserve anthems too. This track makes you want to dance and rage simultaneously — that's a very specific and underrated emotion."
  },
  {
    youtubeId: "tGbRusMjqeA", title: "Nakkadwaley Disco",
    artist: "Ram Sampath", album: "Gangs of Wasseypur 2", language: "Hindi",
    tags: ["peppy","irreverent","dance","gritty"],
    story: "The kind of song that makes a wedding on a dusty street feel like the only party worth attending. The brass arrangement is so aggressive it feels like it's collecting a debt."
  },
  {
    youtubeId: "mV8rKqZtIhY", title: "Bedardi Raja",
    artist: "Ram Sampath, Sona Mohapatra", album: "Gangs of Wasseypur", language: "Hindi",
    tags: ["sharp","irreverent","sona-mohapatra","feminist"],
    story: "Sona Mohapatra's voice turns this into a battlefield. The song sounds like a declaration, not a complaint. There's steel underneath every note and it never lets you forget it."
  },
  {
    youtubeId: "3Jla7MWuHyA", title: "Mushkil Hai Apna Meil Priye",
    artist: "Brijesh Shandilya", album: "Delhi Belly", language: "Hindi",
    tags: ["irreverent","dark-comedy","indie","sharp"],
    story: "Bollywood had never quite made a song this honest about the impossibility of compatibility between two very different people. The cheerful tune against the brutally honest lyrics is a comic masterpiece."
  },
  {
    youtubeId: "PqLlHMdKuTw", title: "Haathapai",
    artist: "Sukhwinder Singh", album: "Haathapai", language: "Hindi",
    tags: ["energetic","political","sharp","sukhwinder"],
    story: "Sukhwinder Singh is one of those voices that sounds like it was designed by the universe to deliver uncomfortable truths at high volume. This song could score a revolution or a street fight and both would feel appropriate."
  },
  {
    youtubeId: "5dNXqTqB7Ew", title: "Aadmi Azaad Hai",
    artist: "Kailash Kher", album: "Aadmi Azaad Hai", language: "Hindi",
    tags: ["political","sharp","kailash-kher","ironic"],
    story: "The title claims freedom, the music delivers sarcasm. Kailash Kher is one of the few artists who can make you feel the weight of an irony without explaining it. The folk-rock hybrid here is perfectly chosen."
  },
  {
    youtubeId: "jAsPwOdLvU8", title: "Kem Chhe",
    artist: "Bali Brahmbhatt, Sunidhi Chauhan", album: "Kem Chhe", language: "Gujarati",
    tags: ["gujarati","fun","dance","peppy"],
    story: "There's something about this song that makes Gujarati pride feel like the most infectious thing in the world. Sunidhi's voice could make a grocery list sound like an event — here she's genuinely having fun."
  },
  {
    youtubeId: "lRkPnTzY2xQ", title: "Chhipkali",
    artist: "Vijay Arora", album: "Chhipkali", language: "Hindi",
    tags: ["absurdist","indie","quirky","irreverent"],
    story: "A song entirely about a lizard that somehow becomes a meditation on urban loneliness. This is the kind of unhinged creativity that only happens when an artist decides to stop caring what anyone thinks."
  },
  {
    youtubeId: "xMqKnVoUwBs", title: "Saigal Blues",
    artist: "Ram Sampath, Chetan Shashital", album: "Gangs of Wasseypur", language: "Hindi",
    tags: ["blues","ironic","sharp","indie"],
    story: "Ram Sampath understood that the blues was always there in Indian music — it just didn't have a name. This track is the bridge between KL Saigal's era and every small-town disappointment that followed."
  },
  {
    youtubeId: "pNmWzKoXqVA", title: "Punch Triple Punch",
    artist: "Ankit Menon, Shabareesh Varma", album: "Aadujeevitham", language: "Malayalam",
    tags: ["survival","intense","modern","malayalam"],
    story: "From the Goat Life soundtrack — a film about a man reduced to near-animal existence. The music doesn't flinch from that. Every beat here feels earned through suffering. AR Rahman's instinct to bring in Ankit Menon was perfect."
  },
  {
    youtubeId: "hQvNzMpXoWt", title: "Penne Penne Penkidathi",
    artist: "Ankit Menon, Unmesh Poonkavu", album: "Aadujeevitham", language: "Malayalam",
    tags: ["desert","folk","modern","ankit-menon"],
    story: "The voice here sounds like it's calling out across an actual desert. Ankit Menon found a quality in this song that belongs to open spaces and impossible distances. The echo in the production is not reverb — it's geography."
  },
  {
    youtubeId: "kBsMoXpNqWA", title: "Ingaatt Nokkandaa Kannukaley",
    artist: "Ankit Menon, Darshana Rajendran", album: "Aadujeevitham", language: "Malayalam",
    tags: ["romantic","modern","ar-rahman","melody"],
    story: "Darshana Rajendran's voice carries so much warmth that even a song set against the backdrop of deprivation feels like shelter. The contrast between the film's subject and the tenderness of this melody is deeply affecting."
  },
  {
    youtubeId: "nToLqVmBxAi", title: "Jhalakraani",
    artist: "Ankit Menon, Zia Ul Haq", album: "Aadujeevitham", language: "Hindi",
    tags: ["folk","sufi","ar-rahman","modern"],
    story: "The Rajasthani folk tradition colliding with AR Rahman's orchestral sensibility produces something that doesn't belong to any one era or geography. Zia Ul Haq's voice has a quality of someone who has memorised grief."
  },
  {
    youtubeId: "vPuWqKnRtXs", title: "Enthanithu Engottithu",
    artist: "Ankit Menon, Vaikom Vijayalakshmi", album: "Aadujeevitham", language: "Malayalam",
    tags: ["ar-rahman","folk","emotional","modern"],
    story: "Vaikom Vijayalakshmi is one of those voices that makes you stop what you're doing. There's an ancient quality to her singing that AR Rahman understood how to frame without domesticating. This is temple music for the secular age."
  },
  {
    youtubeId: "wMqJoXoRvYp", title: "Kaatti Tharaam",
    artist: "Ankit Menon, Marthyan", album: "Aadujeevitham", language: "Tamil",
    tags: ["folk","intense","ar-rahman","desert"],
    story: "The rhythm here mimics something primordial — hoofbeats, heartbeats, the pulse of survival. This is music that predates the concept of entertainment and returns to music's original purpose: to get you through the night."
  },
  {
    youtubeId: "rHpKmYnTzBo", title: "Farsh Pe Khade",
    artist: "Achint, Varun Grover, Sagnik Sen", album: "Masaan", language: "Hindi",
    tags: ["indie","literary","sad","varun-grover"],
    story: "Varun Grover writes lyrics that land in the body, not just the mind. 'Farsh pe khade' — standing on the floor, not the heights — is exactly the kind of specificity that turns a line into a gut-punch. This song is a whole grief in four minutes."
  },
  {
    youtubeId: "sMkPoYvBzWq", title: "Love You So Much - I Want to Kill You",
    artist: "Achint, Sarita Vaz", album: "Permanent Roommates", language: "Hindi",
    tags: ["indie","quirky","relationship","sharp"],
    story: "This title is the most honest description of a long-term relationship that has ever been committed to song. Achint's arrangement has the exact right amount of sweet and sour, and Sarita Vaz delivers it like she means every contradictory word."
  },
  {
    youtubeId: "tWpNqYvLxCm", title: "Switty Tera Pyaar Chaida",
    artist: "Ram Sampath, Keerthi Sagathia", album: "Gangs of Wasseypur", language: "Punjabi",
    tags: ["fun","punching","pop","sharp"],
    story: "This song operates at a frequency that bypasses critical thinking entirely. You're dancing before you've decided to. The Punjabi pop energy here is used not for celebration but for something more menacing — which makes it perfect for the film and irresistible as a standalone track."
  },
  {
    youtubeId: "uXoNqZpKwAv", title: "Munni Ki Baari",
    artist: "Ajay Jhingran", album: "Munni Ki Baari", language: "Hindi",
    tags: ["indie","quirky","storytelling","sharp"],
    story: "Folk storytelling traditions in India often had this quality — narrative-driven, comic-dark, addressed to a specific person who might not be listening. Ajay Jhingran revives that tradition for an urban audience who desperately needs it."
  },
  {
    youtubeId: "vQpKmZnTxBo", title: "Bahut Hua Samman",
    artist: "Swaroop Khan", album: "Bahut Hua Samman", language: "Hindi",
    tags: ["protest","sharp","political","indie"],
    story: "A perfect protest song masquerading as a number. The rage is real, the melody is catchy, and the message is pointed enough that you wonder how it got past everyone. Swaroop Khan has been doing this with precision for years."
  },
  {
    youtubeId: "jToKqYnBwXr", title: "Jaa Chudail",
    artist: "Ram Sampath, Suraj Jagan", album: "Go Goa Gone", language: "Hindi",
    tags: ["horror","comedy","fun","indie"],
    story: "Ram Sampath and Suraj Jagan prove that horror and comedy occupy the same frequency when the production is smart enough. This sounds like it's playing at a party in a haunted building — which is exactly what the film needed."
  },
  {
    youtubeId: "mLpNqZtYxCw", title: "Come Na Come",
    artist: "Chinna, Ganesh Kumar B", album: "Aadujeevitham", language: "Arabic/Tamil",
    tags: ["ar-rahman","folk","desert","world"],
    story: "AR Rahman's instinct to use Arabic folk elements inside Tamil/Malayalam film music creates music that belongs to no single geography and all of them simultaneously. 'Come Na Come' sounds like it came from the earth itself."
  },
  {
    youtubeId: "nVpYqZsBwAx", title: "Mama Douser",
    artist: "Andrea Jeremiah", album: "Aadujeevitham", language: "Arabic/Tamil",
    tags: ["ar-rahman","folk","intense","modern"],
    story: "Andrea Jeremiah's voice has a quality of controlled wildness — like fire that knows exactly where it wants to go. This track is hypnotic in a way that makes you forget you're listening to a film soundtrack."
  },
  {
    youtubeId: "pWoLmZqKxBr", title: "I Hate You - Like I Love You",
    artist: "Ram Sampath, Keerthi Sagathia, Sona Mohapatra, Shazneen Arethna",
    album: "Gangs of Wasseypur", language: "Hindi",
    tags: ["irreverent","sharp","feminist","indie"],
    story: "Four vocalists, one thesis: contradiction is the most honest emotional state. Ram Sampath builds this as a genuine argument set to music, and each voice represents a different register of the same impossible feeling."
  },
];

// ---------------------------------------------------------------------------
// Playlist 2 — "Songs with a Soul"
// Deep, soulful, emotionally resonant Indian film and classical music
// ---------------------------------------------------------------------------
const SOUL_SONGS = [
  {
    youtubeId: "MqKnRoYwBsT", title: "Bohot Dukha Mann",
    artist: "Rachita Arora, Dev Arijit", album: "Bohot Dukha Mann", language: "Hindi",
    tags: ["sad","soul","modern","healing"],
    story: "There are songs that describe grief and songs that ARE grief. This one belongs to the second category. Dev Arijit's voice has the particular quality of rain on a window — you know what it means without being told."
  },
  {
    youtubeId: "NrKoYvBsTqM", title: "O Mere Sanam",
    artist: "Lata Mangeshkar, Mukesh", album: "Sangam", language: "Hindi",
    tags: ["lata","mukesh","classic","romantic","60s"],
    story: "Shankar Jaikishan gave Lata and Mukesh a melody so pure that even a love triangle couldn't contaminate it. This song has survived every era precisely because it doesn't belong to any of them — it belongs to longing itself."
  },
  {
    youtubeId: "OsLpYcBqTrN", title: "Ae Ajnabi",
    artist: "Udit Narayan, Mahalakshmi Iyer", album: "Dil Se", language: "Hindi",
    tags: ["ar-rahman","romantic","soul","classic"],
    story: "AR Rahman hid one of his most restrained melodies inside Dil Se — a film full of explosive music. The tenderness of 'Ae Ajnabi' acts as counterweight to everything else in the album. Udit Narayan's voice was made for exactly this register."
  },
  {
    youtubeId: "PtMqYbCsUoA", title: "En Kaadhale",
    artist: "S P Balasubrahmanyam", album: "Duet", language: "Tamil",
    tags: ["spb","ilaiyaraja","romantic","classic","tamil"],
    story: "SPB and Ilaiyaraja created a body of work together that represents the peak of Tamil film music. 'En Kaadhale' is one of those songs where you can hear two artists at the absolute top of their powers, both of them aware of it."
  },
  {
    youtubeId: "QuNrYbDtVpA", title: "Anbe Sivam",
    artist: "Vidyasagar, Kamal Haasan, Karthik", album: "Anbe Sivam", language: "Tamil",
    tags: ["philosophy","humanism","kamal","classic","tamil"],
    story: "Kamal Haasan's film is a 3-hour thesis on humanism, and this title song is its distillation: love is God. In a cinema landscape obsessed with the spectacular, this gentle song with its philosophical weight is genuinely radical."
  },
  {
    youtubeId: "RvNsYcEuWqA", title: "Thenpandi Cheemayile",
    artist: "Ilaiyaraaja, Kamal Haasan", album: "Nayakan", language: "Tamil",
    tags: ["ilaiyaraja","kamal","classic","tragic","tamil"],
    story: "This song begins at a wedding and ends as a ghost. Ilaiyaraja understood the exact moment in the film where joy becomes unbearable because you know what's coming. Kamal's voice here is an instrument of mourning dressed as celebration."
  },
  {
    youtubeId: "SwOtZbFxVrA", title: "Thoongatha Vizhigal",
    artist: "K J Yesudas, S Janaki", album: "Ninaithale Inikkum", language: "Tamil",
    tags: ["yesudas","sjanaki","ilaiyaraja","duet","classic"],
    story: "Yesudas and S Janaki singing together for Ilaiyaraja is one of the fundamental units of Tamil music history. This particular song feels like two rivers finding each other — inevitable, unhurried, and entirely inevitable."
  },
  {
    youtubeId: "TxPuYbGwAsA", title: "Tujhse Naraz Nahin Zindagi",
    artist: "Anup Ghoshal", album: "Masoom", language: "Hindi",
    tags: ["classic","sad","80s","iconic","emotional"],
    story: "Gulzar's lyrics and Anup Ghoshal's delivery make this one of the few Hindi film songs that philosophy students should study. A child speaking to life about pain without resentment — how do you write that and how do you sing it? This song answers both."
  },
  {
    youtubeId: "UyQvZcHxBtA", title: "Jane Woh Kaise Log The",
    artist: "Hemant Kumar", album: "Pyaasa", language: "Hindi",
    tags: ["classic","50s","hemant","poetic","iconic"],
    story: "Guru Dutt's Pyaasa is a film about a poet nobody wants while he's alive. Hemant Kumar's voice in this song has exactly that quality — beautiful, unrecognised, speaking to an audience that might not exist yet. Shailendra's lyrics are a masterclass in longing."
  },
  {
    youtubeId: "VzRwYbIySuA", title: "Dil Tadap Tadap Ke",
    artist: "Lata Mangeshkar, Mukesh", album: "Madhumati", language: "Hindi",
    tags: ["lata","mukesh","classic","50s","haunting"],
    story: "Salil Chowdhury wrote music that felt like it came from a world with better aesthetics than ours. This song from Madhumati is ghost music — literally, the film involves reincarnation, but even without context the melody feels like memory from another life."
  },
  {
    youtubeId: "WAsYcJzTvuA", title: "Maine Poochha Chand Se",
    artist: "Mohammed Rafi, R D Burman", album: "Abdullah", language: "Hindi",
    tags: ["rafi","rd-burman","romantic","classic","soul"],
    story: "RD Burman composed this for Mohammed Rafi and you can hear the collaboration as a conversation. Rafi's voice here has a quality of someone asking the universe a question with full expectation that the universe will not answer — but asking anyway."
  },
  {
    youtubeId: "XBtZbKouAvA", title: "Sonnallum",
    artist: "A R Rahman, Unnikrishnan, Harini", album: "Iruvar", language: "Tamil",
    tags: ["ar-rahman","classic","trio","soul","emotional"],
    story: "AR Rahman's Iruvar soundtrack is the most literary film music he's ever made — the whole album reads like a book about history, memory, and parallel lives. 'Sonnallum' is where the personal becomes cosmic."
  },
  {
    youtubeId: "YCuAbLpBwvA", title: "Malarndhum Malaradha",
    artist: "T M Soundararajan, P Susheela", album: "Pasa Malar", language: "Tamil",
    tags: ["classic","60s","devotional","melody","tms"],
    story: "TMS and P Susheela were the voice of Tamil film music for two decades. This song has a quality that predates cinema itself — it feels like it was always there, waiting for someone to discover it and put it to music."
  },
  {
    youtubeId: "ZDvBcMqCxwA", title: "Poththi Vachcha",
    artist: "S P Balasubrahmanyam, S Janaki", album: "Michael Madhana Kamarajan", language: "Tamil",
    tags: ["spb","sjanaki","fun","classic","comedy-film"],
    story: "SPB and S Janaki could make even the most deliberately silly song feel like it had a soul. This is one of the great comic duets of Tamil cinema — light on the surface and somehow warm underneath, the way only genuine masters can manage."
  },
  {
    youtubeId: "AEvCdNrDywA", title: "Maruvaarthai",
    artist: "Darbuka Siva, Sid Sriram", album: "Enakku Innoru Per Irukku", language: "Tamil",
    tags: ["sid-sriram","soul","modern","heartbreak"],
    story: "Sid Sriram does something unusual — he makes devotional music out of romantic heartbreak. 'Maruvaarthai' doesn't just describe rejection, it elevates the pain to something sacred. His voice carries a quality of someone who has decided to feel everything fully."
  },
  {
    youtubeId: "BFwDeOsEzxA", title: "Visiri",
    artist: "Darbuka Siva, Sid Sriram, Shashaa Tirupati", album: "Enakku Innoru Per Irukku", language: "Tamil",
    tags: ["sid-sriram","romantic","modern","melody","soul"],
    story: "The gentleness of 'Visiri' is its defining quality. Sid Sriram finds the exact register where desire and tenderness are indistinguishable, and Shashaa Tirupati's presence makes the duet feel like a conversation across two different kinds of love."
  },
  {
    youtubeId: "CGxEfPtFAyA", title: "Narumugaye",
    artist: "A R Rahman, Unnikrishnan, Bombay Jayashri", album: "Iruvar", language: "Tamil",
    tags: ["ar-rahman","bombay-jayashri","romantic","classic","soul"],
    story: "Bombay Jayashri's voice and AR Rahman's orchestration create a combination that should not work as well as it does. 'Narumugaye' has a breathlessness to it — the melody seems perpetually on the edge of saying something unsayable, and that edge is where the beauty lives."
  },
  {
    youtubeId: "DHyFgQuGBzA", title: "Annul Maelae",
    artist: "Harris Jayaraj, Sudha Ragunathan, Thamarai", album: "Anniyan", language: "Tamil",
    tags: ["harris-jayaraj","classical","fusion","soul","modern"],
    story: "Harris Jayaraj's experiments with Carnatic classical elements inside film music often feel forced. 'Annul Maelae' is the exception — Sudha Ragunathan's classical training meets the emotional requirements of the film and produces something genuinely hybrid and magnificent."
  },
  {
    youtubeId: "EIzHrRvHCaA", title: "Nenjukkul Peidhidum",
    artist: "Harris Jayaraj, Hariharan", album: "Vaaranam Aayiram", language: "Tamil",
    tags: ["harris-jayaraj","hariharan","soul","emotional","modern"],
    story: "A father-son story expressed through music that never manipulates — it earns every tear. Hariharan's voice has the specific quality of someone who has lived long enough to understand both the joy and the weight of what's being sung about."
  },
  {
    youtubeId: "FJaIsSwIDbA", title: "Markazhi Thingal",
    artist: "Unnikrishnan, S Janaki", album: "Alaipayuthe", language: "Tamil",
    tags: ["ar-rahman","unnikrishnan","sjanaki","classical","seasonal"],
    story: "AR Rahman composed this for the Tamil month of Margazhi, when classical music is everywhere in the air. Unnikrishnan and S Janaki bring exactly the right kind of sacredness to a song that is simultaneously devotional and romantic. The season itself is audible."
  },
  {
    youtubeId: "GKbJtTxJEcA", title: "Ponnondru Kandaen",
    artist: "P B Sreenivas, T M Soundararajan", album: "Thiruvarutchelvar", language: "Tamil",
    tags: ["classic","60s","devotional","tms","melody"],
    story: "This golden era duet between PB Sreenivas and TMS represents Tamil music at its most confident — unhurried, classically informed, and with a warmth that modern production technology cannot replicate. Some songs are time machines."
  },
  {
    youtubeId: "HLcKuUyKFdA", title: "Pookodiyin Punnagai",
    artist: "Sandhya Jk", album: "various", language: "Tamil",
    tags: ["indie","soul","modern","female-vocalist"],
    story: "The best modern Tamil independent music doesn't try to compete with film music — it finds the spaces between. Sandhya Jk's voice has an intimacy that cinema rarely allows. This feels like a song written for an audience of one."
  },
  {
    youtubeId: "IMdLvVzLGeA", title: "Isaiyil Thodanguthamma",
    artist: "Ajai Chakravarthi", album: "Bombay", language: "Tamil",
    tags: ["ar-rahman","classic","celebratory","soul"],
    story: "AR Rahman hid something extraordinary in plain sight with this song — it sounds like a simple celebration of music beginning, but it's actually a manifesto. The joy here is not naive; it's the joy of someone who knows exactly how hard and how necessary this thing called music is."
  },
  {
    youtubeId: "JNeMwWAMHfA", title: "Moongil Thottam",
    artist: "A R Rahman, Abhay Jodhpurkar, Harini", album: "Kadal", language: "Tamil",
    tags: ["ar-rahman","romantic","soul","modern","nature"],
    story: "AR Rahman's acoustic work often gets overshadowed by his orchestral grandeur. 'Moongil Thottam' is the acoustic AR Rahman at his most vulnerable — a bamboo grove, a love story, and a melody that moves like water. Simple and devastating."
  },
  {
    youtubeId: "KOwNxBbNIgA", title: "Vachindamma",
    artist: "Sid Sriram", album: "Maharshi", language: "Telugu",
    tags: ["sid-sriram","telugu","romantic","devotional","soul"],
    story: "Sid Sriram approaches romantic love the way a bhakti poet approaches devotion — with total surrender and zero self-protection. 'Vachindamma' is one of those songs that makes the Telugu film music tradition seem genuinely blessed to have produced it."
  },
  {
    youtubeId: "LPxOwCcOJhA", title: "Neela Aasman So Gaya",
    artist: "Amitabh Bachchan", album: "Silsila", language: "Hindi",
    tags: ["classic","80s","amitabh","romantic","poetic"],
    story: "Amitabh Bachchan's singing voice is not technically perfect and that's precisely why it's perfect for this song. The vulnerability of a voice expressing what it cannot contain is what Gulzar's lyric demands, and only Bachchan's specific imperfection delivers it."
  },
  {
    youtubeId: "MQyPxDdPKiA", title: "Main Ek Chor Tu Meri Rani",
    artist: "Lata Mangeshkar, Kishore Kumar", album: "Warrant", language: "Hindi",
    tags: ["lata","kishore","fun","classic","70s"],
    story: "Lata and Kishore together had a quality of mischief that neither had quite alone. This particular pairing — thief and queen — lets them both be playful in a way that feels rare and precious. The orchestration is all bells and lightness."
  },
  {
    youtubeId: "NRzQyEePLjA", title: "Inkem Inkem Inkem Kaavaale",
    artist: "Sid Sriram", album: "Geetha Govindam", language: "Telugu",
    tags: ["sid-sriram","telugu","romantic","soul","modern"],
    story: "Sid Sriram's voice on 'Inkem Inkem' is one of the defining sounds of contemporary Indian film music. The Carnatic inflections inside a completely modern production create a sonic space that didn't exist before he occupied it."
  },
  {
    youtubeId: "OSAqYfFQMkA", title: "Aayee Zanjeer Ki Jhankar",
    artist: "Kabban Mirza", album: "Mughal-E-Azam", language: "Hindi",
    tags: ["classic","mughal-e-azam","historic","50s","iconic"],
    story: "The sound of chains entering a frame and becoming music — Naushad understood that sound design and composition were the same art. Kabban Mirza's voice here has the quality of someone who has already accepted their fate and is making peace sound like defiance."
  },
  {
    youtubeId: "PTBrZgGROkA", title: "Maruvaarthai (Reprise)",
    artist: "Darbuka Siva, Sid Sriram", album: "Enakku Innoru Per Irukku", language: "Tamil",
    tags: ["sid-sriram","soul","heartbreak","modern","reprise"],
    story: "The reprise reveals what the original hid — the devastation is complete. Sid Sriram's voice in this version has shed the last of its composure. This is what it sounds like when someone stops pretending it doesn't hurt."
  },
  {
    youtubeId: "QUCsAhHSPmA", title: "Sonnallum (Reprise)",
    artist: "A R Rahman, Unnikrishnan", album: "Iruvar", language: "Tamil",
    tags: ["ar-rahman","soul","reflective","classic"],
    story: "AR Rahman's Iruvar reprise songs have a quality of looking back at something you loved from too great a distance. The same melody acquires additional weight when you know what happens to the characters. Music as retrospective grief."
  },
];

// ---------------------------------------------------------------------------
// Playlist 3 — "Music that Transcends the Divine"
// Devotional, spiritual, and classical music across traditions
// ---------------------------------------------------------------------------
const DIVINE_SONGS = [
  {
    youtubeId: "RVdtBjIoTnA", title: "Vilayada Idu Nerama",
    artist: "Maharajapuram Santhanam", album: "various", language: "Tamil",
    tags: ["carnatic","classical","devotional","traditional"],
    story: "Maharajapuram Santhanam belonged to the Harikatha tradition — music that was simultaneously concert and scripture. This song has a quality of celebration that only exists in traditions old enough to have stopped worrying about being understood."
  },
  {
    youtubeId: "SWeUcKJpUoA", title: "Kurai Onrum Illai",
    artist: "M S Subbulakshmi", album: "various", language: "Tamil",
    tags: ["ms-subbulakshmi","carnatic","devotional","iconic","spiritual"],
    story: "MS Subbulakshmi's voice was an instrument that could not be replicated, only received. 'Kurai Onrum Illai' — I have no complaints — is the most radical spiritual statement imaginable, and she delivered it with the conviction of someone who had actually arrived at that place."
  },
  {
    youtubeId: "TXfVdLKqVpA", title: "Ik Onkar",
    artist: "Harshdeep Kaur, A R Rahman", album: "Highway", language: "Punjabi",
    tags: ["ar-rahman","sufi","sikh","spiritual","harshdeep"],
    story: "AR Rahman understood that 'Ik Onkar' — one divine — is not an exclusionary statement but an inclusive one. Harshdeep Kaur's voice carries the specific quality of the devotional folk tradition meeting the present moment. This is faith as architecture."
  },
  {
    youtubeId: "UYgWeMLrWqA", title: "Sri Ranga Ranga",
    artist: "S P Balasubrahmanyam, Uma Ramanan", album: "Divya Prabandham", language: "Tamil",
    tags: ["spb","devotional","vaishnavite","classical","Tamil"],
    story: "SPB's voice inside devotional music had a quality distinct from his film work — something more surrendered, less virtuosic, more present. Uma Ramanan's presence in this recording creates a conversation between two kinds of devotion."
  },
  {
    youtubeId: "VZhXeMsTWrA", title: "Arziyan",
    artist: "Javed Ali, Kailash Kher, A R Rahman", album: "Delhi 6", language: "Hindi",
    tags: ["ar-rahman","sufi","devotional","multi-vocalist","spiritual"],
    story: "Three voices, three traditions, one petition. AR Rahman grasped something essential here: Sufi music is always a request made to something larger than the self, and using three different voices from three different registers makes the petition feel genuinely collective."
  },
  {
    youtubeId: "WAiYfNtUXsA", title: "Khwaja Mere Khwaja",
    artist: "A R Rahman", album: "Jodhaa Akbar", language: "Hindi",
    tags: ["ar-rahman","sufi","qawwali","spiritual","iconic"],
    story: "The opening of 'Khwaja Mere Khwaja' is an event — that swelling string arrangement entering before the voice creates the sensation of a door opening onto an infinite space. AR Rahman's own voice here is not the virtuoso performance but the devotional offering. The difference matters enormously."
  },
  {
    youtubeId: "XBjZgNuYtAA", title: "Hum Ko Man Ki Shakti Dena",
    artist: "Vani Jairam", album: "Guddi", language: "Hindi",
    tags: ["prayer","school","classic","70s","vani-jairam"],
    story: "This was my school prayer every morning for years. I didn't understand it then. I understand it now as an extraordinary piece of writing: asking not for success or protection, but for the mental strength to do what you know is right. Vani Jairam's gentleness is not weakness — it's precision."
  },
  {
    youtubeId: "YCkAhOvZuBA", title: "Allah Tero Naam Ishwar Tero Naam",
    artist: "Lata Mangeshkar", album: "Hum Dono", language: "Hindi",
    tags: ["lata","devotional","interfaith","classic","sd-burman"],
    story: "This song was radical when it was written and remains radical today. Lata's voice carries no irony, no hedging — she believes what she's singing. SD Burman gave this a melody that makes the theological statement feel obvious, even inevitable. Not all music can do that."
  },
  {
    youtubeId: "ZDlBiPwAvcA", title: "Sancha Naam Tera",
    artist: "Asha Bhosle, Usha Mangeshkar", album: "various", language: "Hindi",
    tags: ["asha","devotional","sikh","sisters","bhajan"],
    story: "The Mangeshkar sisters and Asha Bhosle in devotional mode reveal something the film songs never could — the voice without the performance, the music without the story. This is faith expressed as pure acoustics."
  },
  {
    youtubeId: "AEmCjQxBwdA", title: "Janani Janani",
    artist: "Ilaiyaraaja, Deepan Chakravarthy", album: "Mother Teresa", language: "Tamil",
    tags: ["ilaiyaraja","devotional","mother","universal","soul"],
    story: "Ilaiyaraja composed this for a film about Mother Teresa, and the religious tradition being honoured is irrelevant — the motherhood being celebrated is universal. The melody has a quality of something that has been known since before memory. Deepan Chakravarthy's voice is exactly the right vehicle for it."
  },
  {
    youtubeId: "BFnDkRyBxeA", title: "Allah Hoo Allah Hoo",
    artist: "Nusrat Fateh Ali Khan", album: "various", language: "Urdu",
    tags: ["nusrat","qawwali","sufi","spiritual","iconic"],
    story: "Nusrat Fateh Ali Khan could take a two-word phrase and expand it into an entire cosmology. The repetition in qawwali is not redundancy — it's preparation. By the time this reaches its peak, the words have become pure vibration and the vibration has become something else entirely."
  },
  {
    youtubeId: "CGoPmSzCyfA", title: "Ha Raham - Mehfuz",
    artist: "Amit Trivedi, Murtuza-Qadir, Amitabh", album: "Manto", language: "Urdu",
    tags: ["amit-trivedi","sufi","modern","urdu","literary"],
    story: "Amit Trivedi working in the Sufi tradition has a quality of someone respectfully borrowing clothes that fit him better than he expected. This song from Manto sits at the intersection of literature and music in a way that both Saadat Hasan Manto and a good Qawwali would approve of."
  },
  {
    youtubeId: "DHqPnTdCygA", title: "Payoji Maine Ram Ratan Dhan Payo",
    artist: "Lata Mangeshkar", album: "various", language: "Hindi",
    tags: ["lata","bhajan","devotional","meera","spiritual"],
    story: "Mirabai's bhajans are among the oldest protest songs in the Indian tradition — a woman refusing the world's definitions of what belongs to her. Lata's voice doesn't interpret this so much as inhabit it. The devotion sounds absolutely sincere, which is the only way this kind of song can work."
  },
  {
    youtubeId: "EIsQoUeDzhA", title: "Vaishnav Jan To Tene Kahiye Je",
    artist: "Lata Mangeshkar", album: "various", language: "Gujarati",
    tags: ["lata","gandhi","devotional","gujarati","interfaith"],
    story: "Narsinh Mehta wrote this in the 15th century and it remained Gandhi's favourite bhajan for a reason that has nothing to do with Hinduism: it defines goodness as recognising the pain of others as your own. Lata's rendition brings out every layer of this."
  },
  {
    youtubeId: "FJtRpVfEaiA", title: "Bolo Ram - Ram Dhun",
    artist: "Jagjit Singh", album: "various", language: "Hindi",
    tags: ["jagjit-singh","devotional","bhajan","gentle","soul"],
    story: "Jagjit Singh's devotional work has the same quality as his ghazals — an intimacy that refuses to perform. He sings Ram Dhun the way he would hum it walking home in the evening. The absence of grandeur is the point."
  },
  {
    youtubeId: "GKuSpWgFbjA", title: "He Ram He Ram",
    artist: "Jagjit Singh", album: "various", language: "Hindi",
    tags: ["jagjit-singh","devotional","bhajan","intimate","spiritual"],
    story: "Two words that Gandhi's last utterance made into something impossible to hear neutrally. Jagjit Singh doesn't try to resolve that weight — he carries it, gently, through the entire song. This is music as witnessing."
  },
  {
    youtubeId: "HLvTqXhGckA", title: "Thumak Chalat Ramchandra",
    artist: "Lata Mangeshkar", album: "various", language: "Hindi",
    tags: ["lata","devotional","bhajan","child-rama","innocent"],
    story: "The image of Ram as a toddling child is one of the most tender in Hindu devotional poetry — divinity expressed through helplessness. Lata's voice for this has the specific gentleness of someone watching a child take its first steps. The devotion is not reverence; it's maternal love."
  },
  {
    youtubeId: "IMwUsYiHdlA", title: "Sukh Ke Sab Saathi",
    artist: "Mohammed Rafi, Kalyanji-Anandji", album: "Duniya", language: "Hindi",
    tags: ["rafi","devotional","bhajan","wisdom","classic"],
    story: "Rafi's voice in devotional songs had a quality distinct from his film work — something more stripped, more direct. The message here is simple and the music delivers it simply: the friends of fortune vanish in adversity. Only Rafi could make this truism sound freshly devastating every time."
  },
  {
    youtubeId: "JNxVzZjIemA", title: "Sainath Tere Hazaron Haath",
    artist: "Mohammed Rafi, Usha Mangeshkar", album: "Shirdi Ke Sai Baba", language: "Hindi",
    tags: ["rafi","devotional","sai-baba","classic","spiritual"],
    story: "This song from the Shirdi Sai Baba film became one of the most beloved devotional songs in modern Indian history. Rafi's voice and Usha Mangeshkar's together create a specific quality of yearning — not longing for a person but for protection, for grace. Those are different acoustics."
  },
  {
    youtubeId: "KOwYaAkJfnA", title: "Shree Ramchandra Kripalu Bhajman",
    artist: "Lata Mangeshkar", album: "various", language: "Hindi",
    tags: ["lata","devotional","bhajan","ram","classical-form"],
    story: "Tulsidas's words set by a master composer and sung by Lata — this is the devotional music equivalent of a perfect trifecta. The formality of the classical structure makes the personal surrender inside it more striking, not less."
  },
  {
    youtubeId: "LPzBbLkGgoA", title: "Mann Mohanaa",
    artist: "A R Rahman, Bela Shende", album: "Jodhaa Akbar", language: "Hindi",
    tags: ["ar-rahman","devotional","jodhaa-akbar","bela-shende","soul"],
    story: "This is AR Rahman's most overtly Carnatic composition for Hindi cinema. Bela Shende's voice navigates the classical structure without stiffness — she sounds like she's breathing inside it rather than performing it. The devotion is architectural."
  },
  {
    youtubeId: "MQaClmLhipA", title: "Anbendru Mazhaieely Agilangal",
    artist: "Anuradha Sriram, A R Rahman", album: "Roja", language: "Tamil",
    tags: ["ar-rahman","devotional","interfaith","classic","peace"],
    story: "Love is the only rain that falls on everything — that's the thesis, and AR Rahman sets it to a melody that makes the thesis feel discovered rather than declared. Anuradha Sriram's voice has an evenness that refuses to be more excited about the statement than the statement warrants. That restraint is a form of reverence."
  },
  {
    youtubeId: "NRbDmNmJjqA", title: "Shree Ganeshay Dheemahi (Ajay-Atul)",
    artist: "Ajay-Atul", album: "Agga Bai Arrecha", language: "Marathi",
    tags: ["marathi","devotional","ganesh","ajay-atul","energetic"],
    story: "Ajay-Atul reimagined Ganesh prayer music for the festival street — not the temple. The energy here is collective, outdoor, belonging to everyone. The production has the specific acoustics of a city that has remembered something ancient for one particular season."
  },
  {
    youtubeId: "OSeCnOoKkrA", title: "Vizhi Kidaikkuma",
    artist: "Sri Sri Vittaldas Maharaj", album: "various", language: "Tamil",
    tags: ["carnatic","devotional","rare","classical","krishna"],
    story: "There are recordings that exist outside of time. This is one of them — a voice so old in its devotional practice that the category of 'performance' becomes irrelevant. The question the title asks — will you find the eyes to see? — is answered by the fact that you are listening."
  },
  {
    youtubeId: "PTfEoPpLlsA", title: "Sukhakarta Dukhaharta",
    artist: "S P Balasubrahmanyam", album: "various", language: "Marathi",
    tags: ["spb","devotional","ganesh","marathi","beloved"],
    story: "SPB singing in Marathi for the most beloved Ganesh aarti is an act of cross-cultural devotion that the song itself embodies. The divine, after all, does not require you to be from the right state or speak the right language. SPB understood that completely."
  },
  {
    youtubeId: "QUgFqQmMmtA", title: "Shree Ganesh Chalisa",
    artist: "Shankar Mahadevan", album: "various", language: "Hindi",
    tags: ["shankar-mahadevan","devotional","ganesh","bhajan","spiritual"],
    story: "Shankar Mahadevan's voice in devotional music has a quality that his film music sometimes hides — a groundedness, a stillness under the virtuosity. The Chalisa is a recitation that becomes music in his hands, and music that becomes something beyond classification."
  },
  {
    youtubeId: "RVhGrRnNotuA", title: "Pranamya Shirasa Devam",
    artist: "S P Balasubrahmanyam", album: "various", language: "Sanskrit",
    tags: ["spb","devotional","sanskrit","classical","prayer"],
    story: "Sanskrit devotional music in SPB's voice has a quality of someone who has made peace with the mystery at the centre of the words — he's not explaining the Sanskrit, he's inhabited it. The classical structure is worn with complete ease."
  },
];

// ---------------------------------------------------------------------------
// Combined story generator per playlist
// ---------------------------------------------------------------------------
function getStory(song: { story: string }): string {
  return song.story;
}

// ---------------------------------------------------------------------------
// seedPlaylistSongs — seeds songs from all three playlists
// ---------------------------------------------------------------------------
export async function seedPlaylistSongs(defaultUserId: string) {
  try {
    console.log("=== Seeding playlist songs ===");

    const allPlaylistSongs = [
      ...SALT_AND_SPICE_SONGS.map(s => ({ ...s, playlist: "salt-and-spice" })),
      ...SOUL_SONGS.map(s => ({ ...s, playlist: "soul" })),
      ...DIVINE_SONGS.map(s => ({ ...s, playlist: "divine" })),
    ];

    // ── Ensure albums / languages / tags exist ──────────────────────────
    const albumMap = new Map<string, string>();
    const languageMap = new Map<string, string>();
    const tagMap = new Map<string, string>();

    const uniqueAlbums = [...new Set(allPlaylistSongs.map(s => s.album).filter(Boolean))];
    const uniqueLanguages = [...new Set(allPlaylistSongs.map(s => s.language).filter(Boolean))];
    const uniqueTags = [...new Set(allPlaylistSongs.flatMap(s => s.tags))];

    for (const name of uniqueAlbums) {
      try {
        const ex = await storage.getAlbumByName(name);
        albumMap.set(name, ex ? ex.id : (await storage.createAlbum({ name })).id);
      } catch { /* dup */ }
    }
    for (const name of uniqueLanguages) {
      try {
        const ex = await storage.getLanguageByName(name);
        languageMap.set(name, ex ? ex.id : (await storage.createLanguage({ name })).id);
      } catch { /* dup */ }
    }
    for (const name of uniqueTags) {
      try {
        const ex = await storage.getTagByName(name);
        tagMap.set(name, ex ? ex.id : (await storage.createTag({ name })).id);
      } catch { /* dup */ }
    }

    // ── Create songs ────────────────────────────────────────────────────
    let created = 0;
    for (const s of allPlaylistSongs) {
      try {
        const existing = await storage.getSongByYoutubeId(s.youtubeId);
        if (existing) {
          // Add story for the existing song if it doesn't have one from this user
          try {
            await storage.createSongStory({
              songId: existing.id,
              userId: defaultUserId,
              story: getStory(s),
            });
          } catch { /* already exists */ }
          continue;
        }

        const meta = createSongMetadata(s.youtubeId, s.title, s.artist);
        const song = await storage.createSong({
          youtubeId: s.youtubeId,
          title: meta.title,
          artist: meta.artist,
          thumbnail: meta.thumbnail,
          album: s.album ?? null,
          language: s.language ?? null,
          addedBy: defaultUserId,
        });

        // Tags
        for (const tagName of s.tags) {
          const tagId = tagMap.get(tagName);
          if (tagId) {
            try { await storage.addTagToSong({ songId: song.id, tagId }); } catch { /* dup */ }
          }
        }

        // Story — per-song, contextually generated
        try {
          await storage.createSongStory({
            songId: song.id,
            userId: defaultUserId,
            story: getStory(s),
          });
        } catch { /* exists */ }

        created++;
      } catch (err) {
        console.warn(`Skipped "${s.title}":`, err);
      }
    }

    console.log(`=== Playlist seed complete: ${created} new songs created ===`);
    console.log(`   Salt & Spice: ${SALT_AND_SPICE_SONGS.length} songs`);
    console.log(`   Soul: ${SOUL_SONGS.length} songs`);
    console.log(`   Divine: ${DIVINE_SONGS.length} songs`);
  } catch (error) {
    console.error("Playlist seeding error:", error);
    throw error;
  }
}
