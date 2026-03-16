import { storage } from "../lib/storage";
import { createSongMetadata } from "./youtube";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Users — 50 people with varied Indian + international names
// ---------------------------------------------------------------------------
const USER_DATA = [
  { firstName: "Raj",       lastName: "Sharma" },
  { firstName: "Priya",     lastName: "Kumar" },
  { firstName: "Arjun",     lastName: "Patel" },
  { firstName: "Ananya",    lastName: "Singh" },
  { firstName: "Vikram",    lastName: "Reddy" },
  { firstName: "Shreya",    lastName: "Iyer" },
  { firstName: "Rohan",     lastName: "Mehta" },
  { firstName: "Meera",     lastName: "Nair" },
  { firstName: "Karthik",   lastName: "Rao" },
  { firstName: "Divya",     lastName: "Joshi" },
  { firstName: "Aditya",    lastName: "Kapoor" },
  { firstName: "Nisha",     lastName: "Menon" },
  { firstName: "Rahul",     lastName: "Agarwal" },
  { firstName: "Pooja",     lastName: "Pillai" },
  { firstName: "Amit",      lastName: "Desai" },
  { firstName: "Sanjana",   lastName: "Gupta" },
  { firstName: "Dev",       lastName: "Mishra" },
  { firstName: "Kavya",     lastName: "Chatterjee" },
  { firstName: "Suresh",    lastName: "Verma" },
  { firstName: "Lakshmi",   lastName: "Das" },
  { firstName: "Madhav",    lastName: "Krishnan" },
  { firstName: "Riya",      lastName: "Bose" },
  { firstName: "Krishna",   lastName: "Nambiar" },
  { firstName: "Anjali",    lastName: "Tiwari" },
  { firstName: "Mohit",     lastName: "Saxena" },
  { firstName: "Sneha",     lastName: "Murthy" },
  { firstName: "Arvind",    lastName: "Choudhary" },
  { firstName: "Dia",       lastName: "Shetty" },
  { firstName: "Vishnu",    lastName: "Pillai" },
  { firstName: "Tara",      lastName: "Varma" },
  { firstName: "Nikhil",    lastName: "Kamath" },
  { firstName: "Swati",     lastName: "Patil" },
  { firstName: "Prakash",   lastName: "Subramaniam" },
  { firstName: "Neha",      lastName: "Chawla" },
  { firstName: "Ajay",      lastName: "Bhatt" },
  { firstName: "Simran",    lastName: "Kohli" },
  { firstName: "Naveen",    lastName: "Gowda" },
  { firstName: "Ishita",    lastName: "Bhatia" },
  { firstName: "Deepak",    lastName: "Naidu" },
  { firstName: "Preeti",    lastName: "Malik" },
  { firstName: "Varun",     lastName: "Sethi" },
  { firstName: "Jaya",      lastName: "Subramanian" },
  { firstName: "Siddharth", lastName: "Pandey" },
  { firstName: "Kritika",   lastName: "Jain" },
  { firstName: "Harish",    lastName: "Venkataraman" },
  { firstName: "Avani",     lastName: "Parikh" },
  { firstName: "Ganesh",    lastName: "Rajan" },
  { firstName: "Rani",      lastName: "Thomas" },
  { firstName: "Mukesh",    lastName: "Abraham" },
  { firstName: "Zara",      lastName: "George" },
];

// ---------------------------------------------------------------------------
// Song catalog — ~180 songs across all requested artists / genres
// Keys: youtubeId, title, artist, album, language, tags
// ---------------------------------------------------------------------------
const SONG_CATALOG = [
  // ── R D Burman (Pancham Da) ────────────────────────────────────────────
  { youtubeId: "kw4tT7SCmaY", title: "Dum Maro Dum",              artist: "Asha Bhosle",                album: "Hare Rama Hare Krishna",        language: "Hindi",     tags: ["rd-burman","classic","retro","asha"] },
  { youtubeId: "PQmrmVs10X8", title: "O Haseena Zulfon Wali",     artist: "Mohammed Rafi",              album: "Teesri Manzil",                 language: "Hindi",     tags: ["rd-burman","classic","rafi","romantic"] },
  { youtubeId: "tGbQGNzpHkM", title: "Aaja Aaja Main Hoon Pyar Tera", artist: "Mohammed Rafi",         album: "Teesri Manzil",                 language: "Hindi",     tags: ["rd-burman","classic","rafi","dance"] },
  { youtubeId: "nLqP1cTmRkY", title: "Yeh Shaam Mastani",         artist: "Kishore Kumar",              album: "Kati Patang",                   language: "Hindi",     tags: ["rd-burman","classic","kishore","retro"] },
  { youtubeId: "3YkQvZpLnXw", title: "Musafir Hoon Yaaron",       artist: "Kishore Kumar",              album: "Parichay",                      language: "Hindi",     tags: ["rd-burman","classic","kishore","philosophy"] },
  { youtubeId: "tFgH7mJkLnP", title: "Chura Liya Hai Tumne",      artist: "Asha Bhosle, Mohammed Rafi", album: "Yaadon Ki Baarat",              language: "Hindi",     tags: ["rd-burman","classic","romantic","duet"] },
  { youtubeId: "vWxYzBc9DeF", title: "Tere Bina Zindagi Se Koi",  artist: "Kishore Kumar, Lata Mangeshkar", album: "Aandhi",                   language: "Hindi",     tags: ["rd-burman","classic","duet","romantic"] },
  { youtubeId: "pQrStUvWxYz", title: "Pyaar Deewana Hota Hai",    artist: "Kishore Kumar",              album: "Kati Patang",                   language: "Hindi",     tags: ["rd-burman","kishore","classic","romantic"] },
  { youtubeId: "kVwXyZaB1Cd", title: "Koi Humdum Na Raha",        artist: "Kishore Kumar",              album: "Jhoomroo",                      language: "Hindi",     tags: ["rd-burman","kishore","sad","classic"] },
  { youtubeId: "mNoPqRsTuVw", title: "Raat Akeli Hai",            artist: "Asha Bhosle",                album: "Jewel Thief",                   language: "Hindi",     tags: ["rd-burman","asha","classic","retro"] },

  // ── S D Burman (Sachin Dev Burman) ────────────────────────────────────
  { youtubeId: "eYfGhIjKlMn", title: "Kahin Deep Jale Kahin Dil", artist: "Lata Mangeshkar",            album: "Bees Saal Baad",                language: "Hindi",     tags: ["sd-burman","lata","classic","haunting"] },
  { youtubeId: "oPqRsTuVwXy", title: "Man Re Tu Kahe Na Dheer Dhare", artist: "Mohammed Rafi",         album: "Chitralekha",                   language: "Hindi",     tags: ["sd-burman","rafi","classic","philosophy"] },
  { youtubeId: "zAbCdEfGhIj", title: "Tere Mere Sapne",           artist: "Mohammed Rafi",              album: "Guide",                         language: "Hindi",     tags: ["sd-burman","rafi","classic","romantic"] },
  { youtubeId: "kLmNoPqRsTu", title: "Piya Tose Naina Laage Re",  artist: "Lata Mangeshkar",            album: "Guide",                         language: "Hindi",     tags: ["sd-burman","lata","classic","romantic"] },
  { youtubeId: "vWxYzAbCdEf", title: "Gaata Rahe Mera Dil",       artist: "Kishore Kumar, Lata Mangeshkar", album: "Guide",                   language: "Hindi",     tags: ["sd-burman","kishore","lata","classic","duet"] },
  { youtubeId: "gHiJkLmNoPq", title: "Abhi Na Jao Chhod Kar",     artist: "Mohammed Rafi, Asha Bhosle", album: "Hum Dono",                     language: "Hindi",     tags: ["sd-burman","rafi","asha","classic","romantic"] },
  { youtubeId: "rStUvWxYzAb", title: "Suno Suno Miss Chatterjee",  artist: "Kishore Kumar",              album: "Miss Mary",                     language: "Hindi",     tags: ["sd-burman","kishore","comedy","classic"] },
  { youtubeId: "cDeFgHiJkLm", title: "Mere Dil Mein Aaj Kya Hai", artist: "Lata Mangeshkar",            album: "Daag",                          language: "Hindi",     tags: ["sd-burman","lata","classic","emotional"] },

  // ── Chitalkar (C. Ramchandra) ─────────────────────────────────────────
  { youtubeId: "NoPqRsTuVwX", title: "Shola Jo Bhadke",           artist: "Lata Mangeshkar, Chitalkar", album: "Albela",                        language: "Hindi",     tags: ["chitalkar","lata","classic","dance","retro"] },
  { youtubeId: "yZaBcDeFgHi", title: "Aana Meri Jaan Meri Jaan",  artist: "Lata Mangeshkar, Chitalkar", album: "Patanga",                       language: "Hindi",     tags: ["chitalkar","lata","classic","retro"] },
  { youtubeId: "JkLmNoPqRsT", title: "Gore Gore O Banke Chhore",  artist: "Lata Mangeshkar",            album: "Samadhi",                       language: "Hindi",     tags: ["chitalkar","lata","classic","playful"] },
  { youtubeId: "uVwXyZaBcDe", title: "Yeh Zindagi Usi Ki Hai",    artist: "Lata Mangeshkar",            album: "Anarkali",                      language: "Hindi",     tags: ["chitalkar","lata","classic","emotional"] },

  // ── Kishore Kumar ─────────────────────────────────────────────────────
  { youtubeId: "YR12Z8f1Dh8", title: "Mere Sapno Ki Rani",        artist: "Kishore Kumar",              album: "Aradhana",                      language: "Hindi",     tags: ["kishore","classic","romantic","retro"] },
  { youtubeId: "aWu8g1yHABg", title: "Pal Pal Dil Ke Paas",       artist: "Kishore Kumar",              album: "Blackmail",                     language: "Hindi",     tags: ["kishore","classic","romantic"] },
  { youtubeId: "1VNp4JpLTzQ", title: "Zindagi Ek Safar",          artist: "Kishore Kumar",              album: "Andaz",                         language: "Hindi",     tags: ["kishore","classic","philosophy"] },
  { youtubeId: "fGhIjKlMnOp", title: "Roop Tera Mastana",         artist: "Kishore Kumar",              album: "Aradhana",                      language: "Hindi",     tags: ["kishore","classic","romantic","retro"] },
  { youtubeId: "qRsTuVwXyZa", title: "Kuch To Log Kahenge",        artist: "Kishore Kumar",              album: "Amar Prem",                     language: "Hindi",     tags: ["kishore","classic","philosophy","retro"] },
  { youtubeId: "bCdEfGhIjKl", title: "Yeh Jo Mohabbat Hai",        artist: "Kishore Kumar",              album: "Kati Patang",                   language: "Hindi",     tags: ["kishore","rd-burman","classic","romantic"] },
  { youtubeId: "MnOpQrStUvW", title: "Ek Ladki Bheegi Bhaagi Si",  artist: "Kishore Kumar",              album: "Chalti Ka Naam Gaadi",          language: "Hindi",     tags: ["kishore","classic","fun","monsoon"] },
  { youtubeId: "xYzAbCdEfGh", title: "Aa Chal Ke Tujhe",           artist: "Kishore Kumar",              album: "Door Ka Rahi",                  language: "Hindi",     tags: ["kishore","classic","travel","retro"] },
  { youtubeId: "IjKlMnOpQrS", title: "Mere Naina Sawan Bhado",     artist: "Kishore Kumar",              album: "Mehbooba",                      language: "Hindi",     tags: ["kishore","rd-burman","classic","monsoon","romantic"] },
  { youtubeId: "tUvWxYzAbCd", title: "Kya Hua Tera Wada",          artist: "Mohammed Rafi",              album: "Hum Kisise Kum Nahin",          language: "Hindi",     tags: ["rafi","classic","romantic","retro"] },

  // ── Mohammed Rafi ──────────────────────────────────────────────────────
  { youtubeId: "R4R1f4Y0b4A", title: "Gulabi Aankhen",            artist: "Mohammed Rafi",              album: "The Train",                     language: "Hindi",     tags: ["rafi","classic","romantic","retro"] },
  { youtubeId: "EfGhIjKlMnO", title: "Baharon Phool Barsao",      artist: "Mohammed Rafi",              album: "Suraj",                         language: "Hindi",     tags: ["rafi","classic","romantic","celebratory"] },
  { youtubeId: "pQrStUvWxYA", title: "Dil Ke Jharoke Mein",       artist: "Mohammed Rafi",              album: "Brahmachari",                   language: "Hindi",     tags: ["rafi","classic","romantic"] },
  { youtubeId: "zBcDeFgHiJk", title: "Khilona Jaan Kar",          artist: "Mohammed Rafi",              album: "Khilona",                       language: "Hindi",     tags: ["rafi","classic","emotional","sad"] },
  { youtubeId: "LmNoPqRsTuV", title: "Aaj Mausam Bada Beimaan Hai", artist: "Mohammed Rafi",            album: "Loafer",                        language: "Hindi",     tags: ["rafi","classic","romantic","fun"] },
  { youtubeId: "wXyZaBcDeFg", title: "Jaan Pehechan Ho",           artist: "Mohammed Rafi",              album: "Gumnaam",                       language: "Hindi",     tags: ["rafi","classic","suspense","retro"] },
  { youtubeId: "HiJkLmNoPqR", title: "Suhani Raat Dhal Chuki",    artist: "Mohammed Rafi",              album: "Dulari",                        language: "Hindi",     tags: ["rafi","classic","romantic","nostalgic"] },
  { youtubeId: "sTuVwXyZaBc", title: "Chaudhvin Ka Chand Ho",      artist: "Mohammed Rafi",              album: "Chaudhvin Ka Chand",            language: "Hindi",     tags: ["rafi","classic","romantic","ghazal"] },
  { youtubeId: "DeFgHiJkLmN", title: "Ehsaan Tera Hoga Mujh Par", artist: "Mohammed Rafi",              album: "Junglee",                       language: "Hindi",     tags: ["rafi","classic","retro","fun"] },
  { youtubeId: "oPqRsTuVwXz", title: "Teri Galiyon Mein Na Rakhenge Kadam", artist: "Mohammed Rafi",   album: "Aap Ki Kasam",                  language: "Hindi",     tags: ["rafi","kishore","classic","sad"] },

  // ── Lata Mangeshkar ───────────────────────────────────────────────────
  { youtubeId: "AaBbCcDdEeF", title: "Lag Jaa Gale",              artist: "Lata Mangeshkar",            album: "Woh Kaun Thi",                  language: "Hindi",     tags: ["lata","classic","romantic","haunting"] },
  { youtubeId: "fFgGhHiIjJk", title: "Ajeeb Dastan Hai Yeh",      artist: "Lata Mangeshkar",            album: "Dil Apna Aur Preet Parai",      language: "Hindi",     tags: ["lata","classic","romantic","nostalgic"] },
  { youtubeId: "kKlLmMnNoOp", title: "Aaja Re Pardesi",           artist: "Lata Mangeshkar",            album: "Madhumati",                     language: "Hindi",     tags: ["lata","classic","emotional","retro"] },
  { youtubeId: "pPqQrRsStTu", title: "Inhi Logon Ne Le Liya Dupatta Mera", artist: "Lata Mangeshkar", album: "Pakeezah",                      language: "Hindi",     tags: ["lata","classic","mujra","retro"] },
  { youtubeId: "uUvVwWxXyYz", title: "Yeh Galiyan Yeh Chaubara",  artist: "Lata Mangeshkar",            album: "Prem Rog",                      language: "Hindi",     tags: ["lata","classic","romantic","nostalgic"] },
  { youtubeId: "zZ1122334455", title: "Do Ghadi Woh Jo Paas",      artist: "Lata Mangeshkar",            album: "Naunihal",                      language: "Hindi",     tags: ["lata","classic","emotional"] },

  // ── Asha Bhosle ────────────────────────────────────────────────────────
  { youtubeId: "66778899AABB", title: "Piya Tu Ab To Aaja",        artist: "Asha Bhosle",                album: "Caravan",                       language: "Hindi",     tags: ["asha","rd-burman","classic","cabaret","retro"] },
  { youtubeId: "CCDDEEFFFGGG", title: "Yeh Mera Dil",              artist: "Asha Bhosle",                album: "Don",                           language: "Hindi",     tags: ["asha","classic","retro","dance"] },
  { youtubeId: "HHHIIJJKkLLM", title: "Dil Cheez Kya Hai",        artist: "Asha Bhosle",                album: "Umrao Jaan",                    language: "Hindi",     tags: ["asha","ghazal","classic","emotional","retro"] },
  { youtubeId: "MNNOOPQQRRss", title: "In Aankhon Ki Masti Ke",    artist: "Asha Bhosle",                album: "Umrao Jaan",                    language: "Hindi",     tags: ["asha","ghazal","classic","romantic"] },
  { youtubeId: "ttUUVVWWxxYY", title: "Dum Maaro Dum (Remix)",     artist: "Asha Bhosle",                album: "Bluffmaster",                   language: "Hindi",     tags: ["asha","remix","retro","dance"] },
  { youtubeId: "ZZ00112233AB", title: "Mera Kuch Samaan",          artist: "Asha Bhosle",                album: "Ijaazat",                       language: "Hindi",     tags: ["asha","emotional","ghazal","classic"] },

  // ── A R Rahman — Tamil ────────────────────────────────────────────────
  { youtubeId: "s4bJ0arbnd8", title: "Nenjukkule",                 artist: "Shakthisree Gopalan",        album: "Kadal",                         language: "Tamil",     tags: ["ar-rahman","romantic","modern","melody"] },
  { youtubeId: "J8P6gJBTVyM", title: "Vaseegara",                  artist: "Bombay Jayashri",            album: "Minnale",                       language: "Tamil",     tags: ["ar-rahman","romantic","classic","melody"] },
  { youtubeId: "Qw7ftEjdUkk", title: "Thalli Pogathey",            artist: "Sid Sriram",                 album: "Achcham Yenbadhu Madamaiyada",  language: "Tamil",     tags: ["ar-rahman","romantic","modern","sid-sriram"] },
  { youtubeId: "SPQbewtlChg", title: "Kannamma",                   artist: "Sid Sriram",                 album: "Kaala",                         language: "Tamil",     tags: ["ar-rahman","romantic","soulful","sid-sriram"] },
  { youtubeId: "CD9TBPrKsEg", title: "Uyire Uyire",                artist: "Kavitha Krishnamurthy",      album: "Bombay",                        language: "Tamil",     tags: ["ar-rahman","romantic","classic","emotional"] },
  { youtubeId: "Fk8QPjJLzs4", title: "Kadhal Rojave",              artist: "S P Balasubrahmanyam",       album: "Roja",                          language: "Tamil",     tags: ["ar-rahman","spb","romantic","classic"] },
  { youtubeId: "nNjKLpHm3Qo", title: "Vennilave Vennilave",        artist: "S P Balasubrahmanyam, Swarnalatha", album: "Minsara Kanavu",          language: "Tamil",     tags: ["ar-rahman","spb","romantic","melody"] },
  { youtubeId: "uTrMxkW5Y8A", title: "Mustafa Mustafa",            artist: "Shyam",                      album: "Kadhal Desam",                  language: "Tamil",     tags: ["ar-rahman","peppy","dance","classic"] },
  { youtubeId: "qpLwEnG3BsI", title: "Snehithane",                 artist: "Shweta Shetty",              album: "Alaipayuthe",                   language: "Tamil",     tags: ["ar-rahman","friendship","melody","emotional"] },
  { youtubeId: "Yc7VXHp2mTo", title: "Chinna Chinna Aasai",        artist: "Minmini",                    album: "Roja",                          language: "Tamil",     tags: ["ar-rahman","classic","innocent","melody"] },
  { youtubeId: "j5PbRzKiLa8", title: "Ennavale Ennavale",          artist: "Unni Menon",                 album: "Kadhalan",                      language: "Tamil",     tags: ["ar-rahman","romantic","melody"] },
  { youtubeId: "4DegbkFl69s", title: "Po Indru Neeyaga",           artist: "Sid Sriram",                 album: "Velai Illa Pattadhaari",        language: "Tamil",     tags: ["romantic","anirudh","sid-sriram","modern"] },

  // ── A R Rahman — Hindi ────────────────────────────────────────────────
  { youtubeId: "K7sJqXUTups", title: "Kehna Hi Kya",               artist: "Hariharan",                  album: "Bombay",                        language: "Hindi",     tags: ["ar-rahman","romantic","classic","melody"] },
  { youtubeId: "5eTCZ9L834s", title: "Ye Jo Des Hai Tera",         artist: "A R Rahman",                 album: "Swades",                        language: "Hindi",     tags: ["ar-rahman","patriotic","soulful","emotional"] },
  { youtubeId: "f7UHCWqH2T0", title: "Chaiyya Chaiyya",            artist: "Sukhwinder Singh",           album: "Dil Se",                        language: "Hindi",     tags: ["ar-rahman","sufi","dance","classic"] },
  { youtubeId: "bxUlvmJhQC0", title: "Jai Ho",                     artist: "A R Rahman",                 album: "Slumdog Millionaire",           language: "Hindi",     tags: ["ar-rahman","dance","global","celebratory"] },
  { youtubeId: "OyLwsOt2HmY", title: "Kun Faya Kun",               artist: "A R Rahman, Javed Ali",      album: "Rockstar",                      language: "Hindi",     tags: ["ar-rahman","sufi","spiritual","devotional"] },
  { youtubeId: "wV1FrRDWh1A", title: "Nadaan Parindey",            artist: "A R Rahman",                 album: "Rockstar",                      language: "Hindi",     tags: ["ar-rahman","inspirational","soulful"] },
  { youtubeId: "9AOiNFC2s28", title: "Tere Bina",                  artist: "Chinmayi, A R Rahman",       album: "Guru",                          language: "Hindi",     tags: ["ar-rahman","romantic","soulful"] },
  { youtubeId: "a16Kgh7j8zk", title: "Kabhi Kabhi Aditi",          artist: "Rashid Ali",                 album: "Jaane Tu Ya Jaane Na",          language: "Hindi",     tags: ["ar-rahman","friendship","modern","breezy"] },
  { youtubeId: "NGK2uuWsKo0", title: "Masakali",                   artist: "Mohit Chauhan",              album: "Delhi 6",                       language: "Hindi",     tags: ["ar-rahman","soulful","modern","melodic"] },
  { youtubeId: "PwBs7xvkLYE", title: "Dil Se Re",                  artist: "A R Rahman, Lata Mangeshkar", album: "Dil Se",                      language: "Hindi",     tags: ["ar-rahman","lata","classic","romantic"] },
  { youtubeId: "TGkM3cNvqiA", title: "Taal Se Taal Mila",          artist: "Udit Narayan, Alka Yagnik",  album: "Taal",                          language: "Hindi",     tags: ["ar-rahman","dance","celebratory","classic"] },

  // ── Ilaiyaraja — Tamil ────────────────────────────────────────────────
  { youtubeId: "YZBW7OWbO5Y", title: "Sundari Kannal Oru Sethi",   artist: "S P Balasubrahmanyam",       album: "Thalapathi",                    language: "Tamil",     tags: ["ilaiyaraja","spb","classic","melody"] },
  { youtubeId: "6ste3pOXLto", title: "Kanne Kalaimaane",           artist: "Mano",                       album: "Moondram Pirai",                language: "Tamil",     tags: ["ilaiyaraja","classic","romantic","melody"] },
  { youtubeId: "HQ5mJNk8k7M", title: "Kaatril Varum Geetham",      artist: "S P Balasubrahmanyam",       album: "Panneer Pushpangal",            language: "Tamil",     tags: ["ilaiyaraja","spb","melody","classic"] },
  { youtubeId: "xp8c86p5vwA", title: "Raja Rajathi",               artist: "K S Chithra",                album: "Agni Natchathiram",             language: "Tamil",     tags: ["ilaiyaraja","kschithra","dance","peppy"] },
  { youtubeId: "PhRzLJTm4wK", title: "En Iniya Pon Nilave",        artist: "S P Balasubrahmanyam, Vani Jairam", album: "Ninaithale Inikkum",   language: "Tamil",     tags: ["ilaiyaraja","spb","romantic","duet"] },
  { youtubeId: "bHKzWnVLqCY", title: "Nilave Vaa",                 artist: "S P Balasubrahmanyam, S Janaki", album: "Mouna Raagam",             language: "Tamil",     tags: ["ilaiyaraja","spb","romantic","melody"] },
  { youtubeId: "iXoGTPmkDvE", title: "Pookal Pookum Tharunam",     artist: "S P Balasubrahmanyam, K S Chithra", album: "Ninaithale Inikkum",  language: "Tamil",     tags: ["ilaiyaraja","romantic","duet","classic"] },
  { youtubeId: "7L9fQVdBPmN", title: "Poove Sempoove",             artist: "K J Yesudas",                album: "Johnny",                        language: "Tamil",     tags: ["ilaiyaraja","yesudas","classic","romantic"] },
  { youtubeId: "G2AsrQjHxKU", title: "Thendral Vanthu Theendum Pothu", artist: "S P Balasubrahmanyam", album: "Alaigal Oivathillai",          language: "Tamil",     tags: ["ilaiyaraja","spb","romantic","classic"] },
  { youtubeId: "e4YVMbKNcLo", title: "Ilamai Idho Idho",           artist: "S P Balasubrahmanyam, K J Yesudas", album: "Ninaithale Inikkum", language: "Tamil",     tags: ["ilaiyaraja","spb","yesudas","friendship","classic"] },
  { youtubeId: "r3TwZoPsJmI", title: "Ninaivo Oru Paravai",        artist: "S P Balasubrahmanyam",       album: "Pagal Nilavu",                  language: "Tamil",     tags: ["ilaiyaraja","spb","romantic","melody"] },
  { youtubeId: "aX5dMqYcHfG", title: "Megam Karukuthu",            artist: "K J Yesudas, S Janaki",      album: "Enga Ooru Paatukaran",         language: "Tamil",     tags: ["ilaiyaraja","yesudas","fun","classic"] },

  // ── S P Balasubrahmanyam — Tamil / Telugu / Hindi ─────────────────────
  { youtubeId: "WnVfPqKmZxL", title: "Roja Janeman (Tamil)",       artist: "S P Balasubrahmanyam",       album: "Roja",                          language: "Tamil",     tags: ["ar-rahman","spb","romantic","classic"] },
  { youtubeId: "hZkWmCrTpLs", title: "Ye Haseen Wadiyan",          artist: "S P Balasubrahmanyam",       album: "Roja (Hindi)",                  language: "Hindi",     tags: ["ar-rahman","spb","romantic","hindi"] },
  { youtubeId: "JoQ9rWZECFY", title: "Samajavaragamana",           artist: "Sid Sriram",                 album: "Ala Vaikunthapurramuloo",       language: "Telugu",    tags: ["romantic","modern","melody","sid-sriram"] },
  { youtubeId: "pOZ67kAnWeo", title: "Inkem Inkem",                artist: "Sid Sriram",                 album: "Geetha Govindam",               language: "Telugu",    tags: ["romantic","modern","sid-sriram"] },
  { youtubeId: "VhpBkALnUre", title: "Swathi Kiranam",             artist: "S P Balasubrahmanyam",       album: "Swathi Kiranam",                language: "Telugu",    tags: ["spb","classical","devotional","telugu"] },
  { youtubeId: "WoPfLzGqInM", title: "Andala Chandamama",          artist: "S P Balasubrahmanyam",       album: "Nuvve Nuvve",                   language: "Telugu",    tags: ["spb","romantic","telugu"] },

  // ── K J Yesudas — Malayalam ───────────────────────────────────────────
  { youtubeId: "tNtjmwhJq3k", title: "Mazha Kondu Mazhavil",       artist: "K J Yesudas",                album: "Kireedam",                      language: "Malayalam", tags: ["yesudas","classic","melody","malayalam"] },
  { youtubeId: "kGVvxCKJ6hw", title: "Innale En Ullil",            artist: "K S Chithra",                album: "Kaattu Vannu Vilichappol",      language: "Malayalam", tags: ["kschithra","melody","romantic","malayalam"] },
  { youtubeId: "bOdp8m6L8jY", title: "Mandaracheppundo",           artist: "K J Yesudas, K S Chithra",   album: "Sandesham",                     language: "Malayalam", tags: ["yesudas","kschithra","classic","duet","malayalam"] },
  { youtubeId: "gKmZxBrTnUo", title: "Kaathirunnu Kaathirunnu",    artist: "K J Yesudas",                album: "Manichitrathazhu",              language: "Malayalam", tags: ["yesudas","devotional","classic","malayalam"] },
  { youtubeId: "pEuVqNwLsMf", title: "Thamburan Vaazhuka",         artist: "K J Yesudas",                album: "Akkare Akkare Akkare",          language: "Malayalam", tags: ["yesudas","classic","devotional","malayalam"] },
  { youtubeId: "wJoRyHcBkAl", title: "Karukkilinile",              artist: "K J Yesudas",                album: "Karyasthan",                    language: "Malayalam", tags: ["yesudas","classic","romantic","malayalam"] },
  { youtubeId: "nFtLmCsXdWv", title: "Nilave Mugam Kaatum Neram",  artist: "K J Yesudas",                album: "various",                       language: "Malayalam", tags: ["yesudas","romantic","melody","classic"] },
  { youtubeId: "eAbYpZqRsTu", title: "Ente Swarnam",               artist: "K J Yesudas",                album: "Chattambinadu",                 language: "Malayalam", tags: ["yesudas","melody","classic","malayalam"] },

  // ── Harry Belafonte ───────────────────────────────────────────────────
  { youtubeId: "koPfRuMzAqG", title: "Banana Boat Song (Day-O)",   artist: "Harry Belafonte",            album: "Calypso",                       language: "English",   tags: ["belafonte","calypso","classic","world","fun"] },
  { youtubeId: "xTwLbVyJnQs", title: "Jamaica Farewell",           artist: "Harry Belafonte",            album: "Calypso",                       language: "English",   tags: ["belafonte","calypso","classic","caribbean"] },
  { youtubeId: "dHuVfCpBiKo", title: "Matilda",                   artist: "Harry Belafonte",            album: "Calypso",                       language: "English",   tags: ["belafonte","calypso","classic","fun","world"] },
  { youtubeId: "yWbNqZmElOr", title: "Island in the Sun",          artist: "Harry Belafonte",            album: "Belafonte Sings of the Caribbean", language: "English", tags: ["belafonte","caribbean","classic","sunny","romantic"] },
  { youtubeId: "pQsMoKwIcRf", title: "Mary's Boy Child",           artist: "Harry Belafonte",            album: "To Wish You a Merry Christmas", language: "English",  tags: ["belafonte","christmas","classic","spiritual"] },
  { youtubeId: "hLkXdNuVmJe", title: "Jump in the Line",           artist: "Harry Belafonte",            album: "Jump Up Calypso",               language: "English",   tags: ["belafonte","calypso","dance","energetic","world"] },
  { youtubeId: "cGqTrPzAaBs", title: "Coconut Woman",              artist: "Harry Belafonte",            album: "Calypso",                       language: "English",   tags: ["belafonte","calypso","classic","tropical"] },
  { youtubeId: "iFjHnOwUyCl", title: "Man Smart (Woman Smarter)",  artist: "Harry Belafonte",            album: "Jump Up Calypso",               language: "English",   tags: ["belafonte","calypso","fun","world","classic"] },

  // ── Frank Sinatra ─────────────────────────────────────────────────────
  { youtubeId: "6E2hYDIFDIU", title: "My Way",                     artist: "Frank Sinatra",              album: "My Way",                        language: "English",   tags: ["sinatra","classic","jazz","iconic","emotional"] },
  { youtubeId: "ZEcqHA7dbwM", title: "Fly Me to the Moon",         artist: "Frank Sinatra",              album: "It Might as Well Be Swing",     language: "English",   tags: ["sinatra","jazz","classic","romantic","bossa-nova"] },
  { youtubeId: "mV5rZBvJoNQ", title: "New York, New York",         artist: "Frank Sinatra",              album: "Trilogy: Past, Present, Future", language: "English", tags: ["sinatra","classic","iconic","upbeat","jazz"] },
  { youtubeId: "4QSl3MKd0pk", title: "The Lady Is a Tramp",        artist: "Frank Sinatra",              album: "A Swingin' Affair!",            language: "English",   tags: ["sinatra","jazz","classic","swing","fun"] },
  { youtubeId: "bUYd1b1d_TM", title: "Summer Wind",                artist: "Frank Sinatra",              album: "Strangers in the Night",        language: "English",   tags: ["sinatra","jazz","romantic","mellow","classic"] },
  { youtubeId: "rjYFoMpW3dI", title: "The Best Is Yet to Come",    artist: "Frank Sinatra",              album: "It Might as Well Be Swing",     language: "English",   tags: ["sinatra","jazz","optimistic","classic","romantic"] },
  { youtubeId: "lrGMtO5y3cQ", title: "Strangers in the Night",     artist: "Frank Sinatra",              album: "Strangers in the Night",        language: "English",   tags: ["sinatra","classic","romantic","jazz","mystery"] },
  { youtubeId: "oaNaFWqOJXY", title: "The Way You Look Tonight",   artist: "Frank Sinatra",              album: "Songs for Swingin' Lovers!",   language: "English",   tags: ["sinatra","romantic","jazz","classic","tender"] },
  { youtubeId: "pBnKlMq9TaW", title: "Come Fly with Me",           artist: "Frank Sinatra",              album: "Come Fly with Me",              language: "English",   tags: ["sinatra","jazz","travel","upbeat","classic"] },
  { youtubeId: "eTdFhWkJmLn", title: "It Was a Very Good Year",    artist: "Frank Sinatra",              album: "September of My Years",         language: "English",   tags: ["sinatra","classic","reflective","jazz","nostalgic"] },

  // ── Modern Bollywood ──────────────────────────────────────────────────
  { youtubeId: "RLzC55ai0eo", title: "Tum Hi Ho",                  artist: "Arijit Singh",               album: "Aashiqui 2",                    language: "Hindi",     tags: ["modern","romantic","arijit","heartfelt"] },
  { youtubeId: "LWYbRBP9sn0", title: "Channa Mereya",              artist: "Arijit Singh",               album: "Ae Dil Hai Mushkil",            language: "Hindi",     tags: ["modern","romantic","arijit","heartbreak"] },
  { youtubeId: "HSmcQobyXjQ", title: "Kabira",                     artist: "Tochi Raina, Rekha Bhardwaj", album: "Yeh Jawaani Hai Deewani",     language: "Hindi",     tags: ["modern","soul","travel","freedom"] },
  { youtubeId: "K44j-sb1SRY", title: "Ilahi",                      artist: "Arijit Singh",               album: "Yeh Jawaani Hai Deewani",      language: "Hindi",     tags: ["romantic","travel","modern","friends"] },
  { youtubeId: "6Iz1jEd6JIs", title: "Gerua",                      artist: "Arijit Singh, Antara Mitra", album: "Dilwale",                       language: "Hindi",     tags: ["romantic","modern","visuals"] },
  { youtubeId: "WbfN4UsrbXY", title: "Kuch Kuch Hota Hai",         artist: "Udit Narayan, Alka Yagnik",  album: "Kuch Kuch Hota Hai",           language: "Hindi",     tags: ["classic","romantic","90s","nostalgic"] },
  { youtubeId: "sfR7caNw1Z0", title: "Tujhe Dekha To",             artist: "Kumar Sanu, Lata Mangeshkar", album: "Dilwale Dulhania Le Jayenge", language: "Hindi",     tags: ["classic","romantic","90s","ddlj"] },
  { youtubeId: "Xd0MT1sR21A", title: "Badtameez Dil",              artist: "Benny Dayal",                album: "Yeh Jawaani Hai Deewani",      language: "Hindi",     tags: ["dance","party","modern","fun"] },
  { youtubeId: "CDWQ0HE66u8", title: "Iktara",                     artist: "Kavita Seth",                album: "Wake Up Sid",                   language: "Hindi",     tags: ["indie","soul","modern","breezy"] },
  { youtubeId: "H9C2q6_jU54", title: "Bulleya",                    artist: "Amit Mishra",                album: "Ae Dil Hai Mushkil",            language: "Hindi",     tags: ["modern","sufi","romantic"] },
  { youtubeId: "xCDCOPJzU0k", title: "Allah Ke Bande",             artist: "Kailash Kher",               album: "Waisa Bhi Hota Hai Part II",    language: "Hindi",     tags: ["sufi","inspirational","soulful"] },
  { youtubeId: "cxRzFLdS6UM", title: "Bhar Do Jholi Meri",         artist: "Adnan Sami",                 album: "Bajrangi Bhaijaan",             language: "Hindi",     tags: ["devotional","sufi","qawwali"] },

  // ── Modern Tamil ──────────────────────────────────────────────────────
  { youtubeId: "i7RM7TJQH5M", title: "Why This Kolaveri Di",       artist: "Dhanush",                    album: "3",                             language: "Tamil",     tags: ["viral","fun","modern","tanglish"] },
  { youtubeId: "47mOhzfCCJM", title: "Rowdy Baby",                 artist: "Dhanush, Dhee",              album: "Maari 2",                       language: "Tamil",     tags: ["dance","viral","yuvan","peppy"] },
  { youtubeId: "EQ3vUUlVVvc", title: "Kadhalan Kadhali",           artist: "Vijay Antony",               album: "Azhagiya Asura",                language: "Tamil",     tags: ["romantic","melody","modern"] },
  { youtubeId: "nJdGbFsZPlE", title: "Kannaana Kanney",            artist: "Sid Sriram",                 album: "Viswasam",                      language: "Tamil",     tags: ["emotional","father","sid-sriram","modern"] },
  { youtubeId: "kRoVzNmTeWq", title: "Oh Penne",                   artist: "Haricharan",                 album: "Kadal",                         language: "Tamil",     tags: ["ar-rahman","romantic","modern"] },
  { youtubeId: "mLpYxAkCdWb", title: "Ennodu Nee Irundhaal",       artist: "Haricharan, Shweta Mohan",   album: "I",                             language: "Tamil",     tags: ["ar-rahman","romantic","melody","modern"] },

  // ── Malayalam Modern ──────────────────────────────────────────────────
  { youtubeId: "hGsQwTuPeNm", title: "Malare",                     artist: "Vijay Yesudas",              album: "Premam",                        language: "Malayalam", tags: ["romantic","modern","melody","malayalam"] },
  { youtubeId: "jKvOmBhCxLt", title: "Oru Adaar Love",             artist: "Omar Lulu",                  album: "Oru Adaar Love",                language: "Malayalam", tags: ["romantic","modern","viral","malayalam"] },
  { youtubeId: "sFgWdNoYuBc", title: "Poomaram",                   artist: "Unni Menon",                 album: "Poomaram",                      language: "Malayalam", tags: ["patriotic","melody","modern","malayalam"] },
  { youtubeId: "aRzMxKtUvJo", title: "Mizhiyoram",                 artist: "K S Chithra",                album: "various",                       language: "Malayalam", tags: ["kschithra","melody","romantic","malayalam"] },
];

// ---------------------------------------------------------------------------
// Story pool — 40 distinct personal stories to assign round-robin
// ---------------------------------------------------------------------------
const STORY_POOL = [
  "My grandmother used to hum this while grinding spices in the kitchen. The melody is inseparable from the scent of her home.",
  "I discovered this song during a 3 AM sleepless night and it somehow made the silence feel less lonely. Still my go-to when the world gets too loud.",
  "This was the first song I learned to play on guitar. The chord progression taught me more about music theory than any class ever did.",
  "My father would sing this every Sunday morning. I didn't appreciate it then. Now it's the song that makes me miss him the most.",
  "Heard this at a tiny roadside dhaba in Coorg — the radio was crackling and it was raining outside. Most perfect moment of my life.",
  "The way the vocalist holds that one note in the chorus — it never fails to give me chills, no matter how many times I listen.",
  "This song got me through breakup number two. The lyrics somehow knew exactly what I was feeling before I even knew myself.",
  "I've listened to this on repeat every single monsoon for ten years. Something about rain and this melody just belongs together.",
  "This is the sound of my teenage years distilled into four minutes. Every note is nostalgia.",
  "My music teacher played this to explain what 'feeling' in singing means. After that I understood — technique alone is never enough.",
  "Played this at a college farewell and everyone in the room was tearing up. We were 21 and felt like we were saying goodbye to everything.",
  "The orchestration here is a masterclass. Listen with good headphones and you'll hear instruments you missed entirely the first 50 times.",
  "This song convinced me that language is no barrier in music. I didn't understand a word but I understood everything.",
  "My most-played song for three years straight. Some songs don't explain why they connect — they just do.",
  "When I was studying in a foreign country, this was the five-minute dose of home I needed every evening.",
  "The poet behind these lyrics understood something about longing that most people never articulate. I share this with everyone I care about.",
  "I heard this at a friend's wedding in a small village hall. No fancy sound system, just an old speaker. It was the most beautiful concert I've ever attended.",
  "This melody feels like it was written for the golden hour — that perfect 20 minutes before sunset when everything glows.",
  "Three generations in my family love this song for completely different reasons. That's the real measure of timeless music.",
  "This is what I imagine music sounded like before it got complicated. Pure, direct, and devastating in its simplicity.",
  "The first time I heard this, I pulled over my car and just sat. Some songs demand that you stop and just listen.",
  "My playlist for long train journeys is 80% this artist. Something about watching landscapes blur while this plays feels deeply right.",
  "I tried to explain why I love this to someone who doesn't listen to this genre. I failed. Some music you have to feel to understand.",
  "This song is my Sunday morning ritual. Coffee, sunlight, this — in that exact order.",
  "The bridge in this song hits like a revelation. You're cruising along and then suddenly it opens up into something transcendent.",
  "Shared this with my therapist once and she asked me to write about why it matters to me. That essay took four pages.",
  "My running playlist, my cooking playlist, my work playlist — this song lives in all three. Truly multi-purpose perfection.",
  "This is the kind of music that reminds you why you fell in love with music in the first place. When it stops feeling like background noise and becomes something sacred.",
  "I played this at my sister's wedding sangeet and my grandmother recognized every word. Five decades and three generations, all connecting on the same melody.",
  "What gets me is the restraint. The composer could have done so much more but they held back, and that empty space says everything.",
  "This song taught me about the power of a single instrument. Take away everything else and the melody still stands completely on its own.",
  "My late-night drive companion for years. Something about empty roads and this music feels like a conversation with yourself you didn't know you needed.",
  "The artist found a way to make heartache sound beautiful. That's a gift that very few musicians ever develop.",
  "This is from my parents' era but it never felt like it belonged to a different time. Great music doesn't age — it just deepens.",
  "Stumbled on this while searching for something else. That accidental discovery is the best thing that's happened to my music life in years.",
  "Every time life feels overwhelming, this song reminds me that beauty exists. Simple as that.",
  "I studied the lyrics translation for weeks. The more I understood, the more layers I found. This song rewards patience.",
  "There's a live version of this that's even better than the original. The raw energy of the room, the audience knowing every word — just magnificent.",
  "My phone dies every time I travel because I refuse to stop playing this. Worth every dead battery.",
  "This was playing when I got the call that I got into the university I dreamed of. Now it's permanently associated with the feeling of a dream coming true.",
];

// ---------------------------------------------------------------------------
// seedDatabase
// ---------------------------------------------------------------------------
export async function seedDatabase(defaultUserId: string) {
  try {
    console.log("=== Starting comprehensive database seeding ===");

    // ── 1. Hash password once ──────────────────────────────────────────
    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash("isaitoday123", 12);

    // ── 2. Create 50 users ─────────────────────────────────────────────
    console.log("Creating users...");
    const createdUserIds: string[] = [defaultUserId]; // include admin as user[0]

    for (const u of USER_DATA) {
      const email = `${u.firstName.toLowerCase()}.${u.lastName.toLowerCase()}@isaitoday.dev`;
      try {
        const existing = await storage.getUserByEmail(email);
        if (existing) {
          createdUserIds.push(existing.id);
        } else {
          const user = await storage.createUser({
            email,
            firstName: u.firstName,
            lastName: u.lastName,
            profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}${u.lastName}`,
            passwordHash,
            role: "user",
          });
          createdUserIds.push(user.id);
        }
      } catch {
        // skip duplicate
      }
    }
    console.log(`Created/verified ${createdUserIds.length} users`);

    // ── 3. Create albums ───────────────────────────────────────────────
    const albumNames = Array.from(new Set(SONG_CATALOG.map(s => s.album).filter(Boolean)));
    const albumMap = new Map<string, string>();
    for (const albumName of albumNames) {
      try {
        const existing = await storage.getAlbumByName(albumName);
        if (existing) {
          albumMap.set(albumName, existing.id);
        } else {
          const album = await storage.createAlbum({ name: albumName });
          albumMap.set(albumName, album.id);
        }
      } catch { /* skip */ }
    }
    console.log(`Albums: ${albumMap.size}`);

    // ── 4. Create languages ────────────────────────────────────────────
    const languageNames = Array.from(new Set(SONG_CATALOG.map(s => s.language).filter(Boolean)));
    const languageMap = new Map<string, string>();
    for (const langName of languageNames) {
      try {
        const existing = await storage.getLanguageByName(langName);
        if (existing) {
          languageMap.set(langName, existing.id);
        } else {
          const lang = await storage.createLanguage({ name: langName });
          languageMap.set(langName, lang.id);
        }
      } catch { /* skip */ }
    }
    console.log(`Languages: ${languageMap.size}`);

    // ── 5. Create artists ──────────────────────────────────────────────
    const artistNames = new Set<string>();
    SONG_CATALOG.forEach(s => s.artist.split(",").forEach(a => artistNames.add(a.trim())));
    const artistMap = new Map<string, string>();
    for (const artistName of Array.from(artistNames)) {
      try {
        const existing = await storage.getArtistByName(artistName);
        if (existing) {
          artistMap.set(artistName, existing.id);
        } else {
          const artist = await storage.createArtist({ name: artistName });
          artistMap.set(artistName, artist.id);
        }
      } catch { /* skip */ }
    }
    console.log(`Artists: ${artistMap.size}`);

    // ── 6. Create tags ─────────────────────────────────────────────────
    const tagNames = new Set<string>();
    SONG_CATALOG.forEach(s => s.tags.forEach(t => tagNames.add(t)));
    const tagMap = new Map<string, string>();
    for (const tagName of Array.from(tagNames)) {
      try {
        const existing = await storage.getTagByName(tagName);
        if (existing) {
          tagMap.set(tagName, existing.id);
        } else {
          const tag = await storage.createTag({ name: tagName });
          tagMap.set(tagName, tag.id);
        }
      } catch { /* skip */ }
    }
    console.log(`Tags: ${tagMap.size}`);

    // ── 7. Create songs — distributed across users ─────────────────────
    console.log("Creating songs...");
    const songIds: string[] = [];

    for (let i = 0; i < SONG_CATALOG.length; i++) {
      const s = SONG_CATALOG[i];
      try {
        const existing = await storage.getSongByYoutubeId(s.youtubeId);
        if (existing) {
          songIds.push(existing.id);
          continue;
        }

        const ownerUserId = createdUserIds[i % createdUserIds.length];
        const metadata = createSongMetadata(s.youtubeId, s.title, s.artist);

        const song = await storage.createSong({
          youtubeId: s.youtubeId,
          title: metadata.title,
          artist: metadata.artist,
          thumbnail: metadata.thumbnail,
          album: s.album ?? null,
          language: s.language ?? null,
          addedBy: ownerUserId,
        });
        songIds.push(song.id);

        // Link artists
        for (const artistName of s.artist.split(",").map(a => a.trim())) {
          const artistId = artistMap.get(artistName);
          if (artistId) {
            try { await storage.addArtistToSong({ songId: song.id, artistId }); } catch { /* dup */ }
          }
        }

        // Link tags
        for (const tagName of s.tags) {
          const tagId = tagMap.get(tagName);
          if (tagId) {
            try { await storage.addTagToSong({ songId: song.id, tagId }); } catch { /* dup */ }
          }
        }
      } catch (err) {
        console.warn(`Failed to create song "${s.title}":`, err);
      }
    }
    console.log(`Songs created/verified: ${songIds.length}`);

    // ── 8. Add stories — each user adds stories to ~20 songs ───────────
    console.log("Adding stories...");
    let storiesAdded = 0;
    const totalSongs = songIds.length;

    for (let ui = 0; ui < createdUserIds.length; ui++) {
      const userId = createdUserIds[ui];
      // Each user covers 20 songs starting at a staggered offset so songs
      // get stories from multiple users (realistic social activity)
      const songsPerUser = 20;
      for (let j = 0; j < songsPerUser; j++) {
        const songIdx = (ui * 4 + j) % totalSongs;
        const songId = songIds[songIdx];
        const story = STORY_POOL[(ui * songsPerUser + j) % STORY_POOL.length];
        try {
          await storage.createSongStory({ songId, userId, story });
          storiesAdded++;
        } catch { /* already exists */ }
      }
    }
    console.log(`Stories added: ${storiesAdded}`);

    // ── 9. Add reactions (likes) ───────────────────────────────────────
    console.log("Adding reactions...");
    let reactionsAdded = 0;
    for (let si = 0; si < songIds.length; si++) {
      const songId = songIds[si];
      // 6–15 likes per song distributed across users
      const numLikes = 6 + (si % 10);
      for (let k = 0; k < numLikes; k++) {
        const userId = createdUserIds[(si * 7 + k * 13) % createdUserIds.length];
        try {
          await storage.createReaction({ songId, userId, type: "like" });
          reactionsAdded++;
        } catch { /* duplicate reaction, skip */ }
      }
    }
    console.log(`Reactions added: ${reactionsAdded}`);

    console.log("=== Seeding complete! ===");
    console.log(`  Users: ${createdUserIds.length}`);
    console.log(`  Songs: ${songIds.length}`);
    console.log(`  Stories: ${storiesAdded}`);
    console.log(`  Reactions: ${reactionsAdded}`);
    console.log(`  Albums: ${albumMap.size} | Languages: ${languageMap.size} | Artists: ${artistMap.size} | Tags: ${tagMap.size}`);
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  }
}
