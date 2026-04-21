/**
 * Database destinasi wisata Indonesia.
 * Tiap entri: id, name, region, lat, lng, image, desc (ID), descEn.
 * Dipakai oleh js/nearby.js untuk hitung jarak via Haversine.
 */
window.KW_DESTINATIONS = [
  // --- DKI Jakarta ---------------------------------------------------------
  {
    id: 'monas',
    name: 'Monumen Nasional',
    region: 'Jakarta Pusat, DKI Jakarta',
    lat: -6.1754,
    lng: 106.8272,
    image: 'img/monas.jpg',
    desc: 'Tugu setinggi 132 meter berlidah api emas 14,5 kg — ikon kemerdekaan Indonesia. Pengunjung bisa naik lift ke puncak untuk melihat Jakarta 360°, sambil menikmati Taman Medan Merdeka yang hijau di sekeliling.',
    descEn: 'A 132-meter tower crowned with a 14.5 kg gold flame — the icon of Indonesian independence. Visitors can take the lift to the top for a 360° view of Jakarta, set within the lush Merdeka Square park.'
  },
  {
    id: 'kota-tua',
    name: 'Kota Tua Jakarta',
    region: 'Jakarta Barat, DKI Jakarta',
    lat: -6.1352,
    lng: 106.8133,
    image: 'img/kota.jpg',
    desc: 'Kawasan heritage Batavia abad ke-17 dengan bangunan bergaya kolonial Belanda, museum sejarah, dan sepeda ontel berwarna-warni. Pusat foto instagramable sekaligus pusat kuliner legendaris seperti Café Batavia.',
    descEn: '17th-century Batavia heritage area featuring Dutch colonial buildings, history museums, and colorful bicycles for rent. A popular photo spot and home to legendary eateries like Café Batavia.'
  },
  {
    id: 'istiqlal',
    name: 'Masjid Istiqlal',
    region: 'Jakarta Pusat, DKI Jakarta',
    lat: -6.1701,
    lng: 106.8314,
    image: 'img/Istiqlal.jpg',
    desc: 'Masjid terbesar di Asia Tenggara berdaya tampung 200.000 jamaah, berdiri tepat di seberang Gereja Katedral sebagai simbol toleransi. Arsitektur modernnya memakai marmer Italia dengan kubah diameter 45 meter.',
    descEn: 'The largest mosque in Southeast Asia with 200,000 worshipper capacity, standing opposite the Catholic Cathedral as a symbol of tolerance. Its modern architecture uses Italian marble with a 45-meter dome.'
  },
  {
    id: 'katedral',
    name: 'Gereja Katedral Jakarta',
    region: 'Jakarta Pusat, DKI Jakarta',
    lat: -6.1693,
    lng: 106.8313,
    image: 'img/gereja.png',
    desc: 'Gereja Santa Maria Diangkat ke Surga — cagar budaya bergaya neo-gotik dengan tiga menara tinggi menjulang. Dibangun 1901, memiliki organ pipa langka dan museum kecil di lantai atas.',
    descEn: 'Cathedral of Our Lady of the Assumption — a neo-Gothic heritage with three soaring spires. Built in 1901, it features a rare pipe organ and a small museum on its upper floor.'
  },
  {
    id: 'lapangan-banteng',
    name: 'Lapangan Banteng',
    region: 'Jakarta Pusat, DKI Jakarta',
    lat: -6.1709,
    lng: 106.8337,
    image: 'img/lapangan.jpg',
    desc: 'Ruang terbuka hijau favorit warga dengan Patung Pembebasan Irian Barat di tengahnya, air mancur menari, dan jalur jogging. Sering menjadi lokasi festival kuliner dan pameran seni.',
    descEn: 'A beloved green plaza featuring the West Irian Liberation statue, a dancing fountain, and a jogging track. Often hosts food festivals and art exhibitions.'
  },
  {
    id: 'tim',
    name: 'Taman Ismail Marzuki',
    region: 'Jakarta Pusat, DKI Jakarta',
    lat: -6.1893,
    lng: 106.8390,
    image: 'img/tim.jpeg',
    desc: 'Pusat kesenian nasional berisi gedung teater, planetarium, bioskop seni, dan Perpustakaan Jakarta yang ikonis. Destinasi wajib untuk pencinta sastra, pertunjukan panggung, dan arsitektur kontemporer.',
    descEn: 'National arts complex housing theaters, a planetarium, an arthouse cinema, and the iconic Jakarta Library. A must-visit for lovers of literature, stage performance, and contemporary architecture.'
  },
  {
    id: 'gbk',
    name: 'Komplek Gelora Bung Karno',
    region: 'Jakarta Pusat, DKI Jakarta',
    lat: -6.2188,
    lng: 106.8020,
    image: 'img/gbk.jpg',
    desc: 'Kompleks olahraga terbesar di Indonesia sejak 1962, tuan rumah Asian Games 2018. Memiliki stadion utama berkapasitas 77.000 penonton, jogging track 4 km, dan area kuliner Senayan yang ramai akhir pekan.',
    descEn: 'Indonesia’s largest sports complex since 1962, host of the 2018 Asian Games. Home to a 77,000-seat main stadium, a 4 km jogging track, and the vibrant Senayan food area on weekends.'
  },
  {
    id: 'ragunan',
    name: 'Kebun Binatang Ragunan',
    region: 'Jakarta Selatan, DKI Jakarta',
    lat: -6.3103,
    lng: 106.8203,
    image: 'Image/situgj.jpg',
    desc: 'Kebun binatang tertua di Indonesia (1864) seluas 140 hektar dengan 2.000+ satwa termasuk orangutan, harimau sumatera, dan komodo. Destinasi keluarga paling ramai di akhir pekan.',
    descEn: 'Indonesia’s oldest zoo (1864), 140 hectares home to 2,000+ animals including orangutans, Sumatran tigers, and Komodo dragons. The busiest family destination on weekends.'
  },
  {
    id: 'tidung',
    name: 'Pulau Tidung',
    region: 'Kepulauan Seribu, DKI Jakarta',
    lat: -5.8042,
    lng: 106.5083,
    image: 'img/beach.jpg',
    desc: 'Pulau terdekat dari Jakarta (2 jam naik speedboat) dengan Jembatan Cinta ikonis, spot snorkeling, dan air laut biru kehijauan. Cocok untuk weekend escape.',
    descEn: 'The closest island escape from Jakarta (2-hour speedboat) featuring the iconic Love Bridge, snorkeling spots, and turquoise water. Perfect for a weekend getaway.'
  },

  // --- Jawa Barat ----------------------------------------------------------
  {
    id: 'situ-gunung',
    name: 'Situ Gunung',
    region: 'Sukabumi, Jawa Barat',
    lat: -6.8319,
    lng: 106.9186,
    image: 'img/situ.jpg',
    desc: 'Danau alami di Taman Nasional Gunung Gede Pangrango dengan jembatan gantung sepanjang 243 meter — terpanjang di Asia Tenggara. Kunjungi saat sunrise untuk kabut mistis di atas air.',
    descEn: 'Natural lake within Gede-Pangrango National Park featuring a 243-meter suspension bridge — the longest in Southeast Asia. Visit at sunrise for mystical mist over the water.'
  },
  {
    id: 'tangkuban',
    name: 'Gunung Tangkuban Perahu',
    region: 'Bandung Barat, Jawa Barat',
    lat: -6.7586,
    lng: 107.6098,
    image: 'img/kayaanya.jpg',
    desc: 'Gunung aktif dengan tiga kawah utama (Ratu, Upas, Domas) yang bisa didekati hingga bibirnya. Legenda Sangkuriang yang menendang perahu menjadikan nama "Tangkuban" (tertelungkup).',
    descEn: 'Active volcano with three accessible craters (Ratu, Upas, Domas) viewable from their rims. Named from the Sangkuriang legend — “tangkuban” means “upside-down boat”.'
  },
  {
    id: 'gedung-sate',
    name: 'Gedung Sate',
    region: 'Kota Bandung, Jawa Barat',
    lat: -6.9025,
    lng: 107.6187,
    image: 'img/krt.jpg',
    desc: 'Landmark art-deco 1920 yang puncaknya dihiasi ornamen enam tusuk sate. Kantor Gubernur Jabar sekaligus museum sejarah pembangunan; rooftop-nya menawarkan panorama Kota Bandung.',
    descEn: 'A 1920 art-deco landmark topped with an ornamental six-satay-skewer spire. Houses the West Java Governor’s office and a history museum, with a rooftop overlooking Bandung.'
  },
  {
    id: 'kawah-putih',
    name: 'Kawah Putih',
    region: 'Ciwidey, Jawa Barat',
    lat: -7.1661,
    lng: 107.4021,
    image: 'img/kayadanau.jpg',
    desc: 'Danau kawah hijau tosca di ketinggian 2.430 mdpl dengan kabut belerang tipis yang membuat atmosfer surreal. Suhu 8-22°C — bawa jaket dan masker.',
    descEn: 'A turquoise-green crater lake at 2,430 m elevation, enveloped in thin sulfur mist for a surreal atmosphere. Temperature 8-22°C — bring a jacket and mask.'
  },
  {
    id: 'pangandaran',
    name: 'Pantai Pangandaran',
    region: 'Pangandaran, Jawa Barat',
    lat: -7.6891,
    lng: 108.6511,
    image: 'img/beach.jpg',
    desc: 'Pantai semenanjung dengan dua sisi (Timur & Barat), cagar alam penuh monyet, dan spot surfing pemula. Tempat terbaik di Jabar untuk nonton sunset sekaligus sunrise dalam satu lokasi.',
    descEn: 'Peninsular beach with east and west coasts, a monkey-filled nature reserve, and beginner surf spots. The best place in West Java to catch both sunrise and sunset in one location.'
  },
  {
    id: 'green-canyon',
    name: 'Green Canyon (Cukang Taneuh)',
    region: 'Pangandaran, Jawa Barat',
    lat: -7.7358,
    lng: 108.4853,
    image: 'Image/situgj.jpg',
    desc: 'Ngarai tersembunyi dengan air hijau zamrud diapit tebing karst dan stalaktit. Dijelajahi dengan perahu ketinting, bisa lanjut body rafting dan berenang di gua alami.',
    descEn: 'A hidden canyon with emerald-green water flanked by karst cliffs and stalactites. Explored by traditional boat, with body rafting and natural cave swimming options.'
  },
  {
    id: 'kebun-raya-bogor',
    name: 'Kebun Raya Bogor',
    region: 'Kota Bogor, Jawa Barat',
    lat: -6.5983,
    lng: 106.7993,
    image: 'Image/situgj.jpg',
    desc: 'Kebun raya tertua di Asia Tenggara (1817) seluas 87 hektar dengan 15.000+ spesies tumbuhan. Berisi Istana Bogor, makam Belanda kuno, dan rafflesia yang mekar musiman.',
    descEn: 'Southeast Asia’s oldest botanical garden (1817) spanning 87 hectares with 15,000+ plant species. Home to Bogor Palace, old Dutch graves, and seasonal rafflesia blooms.'
  },
  {
    id: 'taman-safari',
    name: 'Taman Safari Indonesia',
    region: 'Bogor, Jawa Barat',
    lat: -6.7250,
    lng: 106.9495,
    image: 'Image/situgj.jpg',
    desc: 'Safari park di Puncak dengan jalur kendaraan menembus habitat terbuka singa, jerapah, gajah, hingga harimau putih. Ada pertunjukan satwa, wahana bermain, dan penginapan safari.',
    descEn: 'Puncak safari park with a drive-through route through open habitats of lions, giraffes, elephants, and white tigers. Features animal shows, rides, and safari lodges.'
  },
  {
    id: 'puncak',
    name: 'Puncak Pass',
    region: 'Cianjur, Jawa Barat',
    lat: -6.7000,
    lng: 107.0000,
    image: 'img/kayadanau.jpg',
    desc: 'Kawasan pegunungan 1.500 mdpl populer untuk weekend getaway dari Jabodetabek, penuh vila dan kafe dengan view hamparan kebun teh Gunung Mas. Sejuk sepanjang tahun.',
    descEn: 'A 1,500 m mountain area beloved for weekend getaways from Jakarta, dotted with villas and cafés overlooking Gunung Mas tea plantations. Cool year-round.'
  },

  // --- DI Yogyakarta & Jawa Tengah ----------------------------------------
  {
    id: 'borobudur',
    name: 'Candi Borobudur',
    region: 'Magelang, Jawa Tengah',
    lat: -7.6079,
    lng: 110.2038,
    image: 'img/borobudur.jpg',
    desc: 'Candi Buddha Mahayana terbesar di dunia (abad ke-8), UNESCO World Heritage berhiaskan 2.672 panel relief dan 504 arca Buddha. Best view saat sunrise dari Bukit Dagi atau Punthuk Setumbu.',
    descEn: 'The world’s largest Mahayana Buddhist temple (8th century), a UNESCO Heritage Site adorned with 2,672 relief panels and 504 Buddha statues. Best viewed at sunrise from Bukit Dagi or Punthuk Setumbu.'
  },
  {
    id: 'prambanan',
    name: 'Candi Prambanan',
    region: 'Sleman, DI Yogyakarta',
    lat: -7.7520,
    lng: 110.4915,
    image: 'img/prambanan.jpg',
    desc: 'Kompleks candi Hindu abad ke-9 yang didedikasikan untuk Trimurti — Brahma, Wisnu, Siwa. Malam hari sering digelar Sendratari Ramayana dengan latar candi menyala keemasan.',
    descEn: 'A 9th-century Hindu temple complex dedicated to the Trimurti — Brahma, Vishnu, Shiva. Evenings often feature the Ramayana Ballet against the golden-lit temples.'
  },
  {
    id: 'malioboro',
    name: 'Malioboro',
    region: 'Kota Yogyakarta, DI Yogyakarta',
    lat: -7.7929,
    lng: 110.3656,
    image: 'img/kotu.jpg',
    desc: 'Jalan legendaris sepanjang 2,5 km yang menghubungkan Tugu Pal Putih ke Kraton Yogyakarta. Surga batik, bakpia, angkringan kopi joss, dan pertunjukan seniman jalanan.',
    descEn: 'A legendary 2.5 km street linking the White Pal Monument to the Yogyakarta Palace. A haven for batik, bakpia pastries, kopi-joss coffee stalls, and street performers.'
  },
  {
    id: 'merapi',
    name: 'Gunung Merapi',
    region: 'Sleman, DI Yogyakarta',
    lat: -7.5407,
    lng: 110.4457,
    image: 'img/merapi.jpg',
    desc: 'Gunung berapi paling aktif di Indonesia (2.930 mdpl). Lava tour naik jip melewati bekas letusan 2010, melihat bunker Kaliadem dan kampung Cangkringan yang tertimbun.',
    descEn: 'Indonesia’s most active volcano (2,930 m). Lava jeep tours cross the 2010 eruption path, visiting the Kaliadem bunker and the buried Cangkringan village.'
  },
  {
    id: 'dieng',
    name: 'Dataran Tinggi Dieng',
    region: 'Wonosobo, Jawa Tengah',
    lat: -7.2058,
    lng: 109.9079,
    image: 'img/kayadanau.jpg',
    desc: 'Dataran tinggi 2.000 mdpl berjuluk "Negeri di Atas Awan" dengan Telaga Warna yang berubah warna, kawah belerang Sikidang, dan candi Arjuna abad ke-8. Suhu bisa minus saat kemarau.',
    descEn: 'A 2,000 m plateau nicknamed the “Land Above the Clouds”, home to the color-shifting Warna Lake, the Sikidang sulfur crater, and 8th-century Arjuna temples. Dry-season temperatures can drop below zero.'
  },
  {
    id: 'parangtritis',
    name: 'Pantai Parangtritis',
    region: 'Bantul, DI Yogyakarta',
    lat: -8.0268,
    lng: 110.3308,
    image: 'img/beach.jpg',
    desc: 'Pantai mistis selatan Yogya yang dikaitkan dengan legenda Nyi Roro Kidul. Gumuk pasir di sampingnya unik — mirip gurun dan digunakan untuk sandboarding.',
    descEn: 'A mystical south-Yogya beach linked to the Nyi Roro Kidul legend. Its adjacent dune is unique — desert-like and used for sandboarding.'
  },
  {
    id: 'tebing-breksi',
    name: 'Tebing Breksi',
    region: 'Sleman, DI Yogyakarta',
    lat: -7.8314,
    lng: 110.5158,
    image: 'img/tinggilancip.jpg',
    desc: 'Bekas tambang batu kapur yang disulap jadi ikon seni relief raksasa. Saat sore berubah keemasan — spot favorit foto pre-wedding dengan panorama Merapi dan Prambanan.',
    descEn: 'A former limestone quarry transformed into a giant relief-art icon. Turns golden at dusk — a favorite pre-wedding photo spot with Merapi and Prambanan in the backdrop.'
  },
  {
    id: 'hutan-pinus',
    name: 'Hutan Pinus Mangunan',
    region: 'Bantul, DI Yogyakarta',
    lat: -7.9306,
    lng: 110.4303,
    image: 'Image/situgj.jpg',
    desc: 'Hutan pinus dengan panggung alam dan ayunan langit menghadap lembah. Kabut pagi membuatnya sangat sinematik — sering dipakai shooting film dan prewed.',
    descEn: 'A pine forest featuring a nature stage and sky swings over the valley. Morning mist makes it cinematic — a frequent filming and pre-wedding location.'
  },
  {
    id: 'goa-jomblang',
    name: 'Goa Jomblang',
    region: 'Gunungkidul, DI Yogyakarta',
    lat: -8.0436,
    lng: 110.6383,
    image: 'Image/situgj.jpg',
    desc: 'Goa vertikal 60 meter dengan "Cahaya Surga" yang menerobos dari lubang atas tepat pukul 10-12 siang. Turun pakai single rope technique, petualangan kelas dunia.',
    descEn: 'A 60-meter vertical cave where a "Light of Heaven" beams through the ceiling hole from 10 am to noon. Accessed by single-rope technique — a world-class adventure.'
  },
  {
    id: 'lawang-sewu',
    name: 'Lawang Sewu',
    region: 'Kota Semarang, Jawa Tengah',
    lat: -6.9839,
    lng: 110.4098,
    image: 'img/kota.jpg',
    desc: 'Bekas kantor kereta api Belanda (1904) dengan ratusan pintu, kaca patri, dan cerita misteri yang membuatnya ikonis. Tur malam mengungkap sejarah kolonial yang dramatis.',
    descEn: 'A former Dutch railway office (1904) with hundreds of doors, stained glass, and legendary ghost stories. Night tours unveil its dramatic colonial past.'
  },
  {
    id: 'karimunjawa',
    name: 'Taman Nasional Karimunjawa',
    region: 'Jepara, Jawa Tengah',
    lat: -5.8472,
    lng: 110.4561,
    image: 'Image/Raja Ampat.jpg',
    desc: 'Kepulauan 27 pulau di Laut Jawa dengan snorkeling, island hopping, dan penangkaran hiu. Akses kapal 4 jam dari Jepara atau 2 jam speedboat dari Semarang.',
    descEn: 'A 27-island archipelago in the Java Sea offering snorkeling, island hopping, and shark sanctuaries. Reached by 4-hour ferry from Jepara or 2-hour speedboat from Semarang.'
  },

  // --- Jawa Timur ----------------------------------------------------------
  {
    id: 'bromo',
    name: 'Gunung Bromo',
    region: 'Probolinggo, Jawa Timur',
    lat: -7.9425,
    lng: 112.9530,
    image: 'img/bromo.jpg',
    desc: 'Kaldera vulkanik aktif di ketinggian 2.329 mdpl dengan lautan pasir 10 km² dan sunrise ikonis dari Penanjakan. Upacara Yadnya Kasada suku Tengger setiap tahun melempar sesaji ke kawah.',
    descEn: 'An active volcanic caldera at 2,329 m with a 10 km² sand sea and the iconic Penanjakan sunrise. The Tengger people hold the annual Yadnya Kasada ceremony, tossing offerings into the crater.'
  },
  {
    id: 'ijen',
    name: 'Kawah Ijen',
    region: 'Banyuwangi, Jawa Timur',
    lat: -8.0581,
    lng: 114.2421,
    image: 'img/tinggilancip.jpg',
    desc: 'Danau kawah asam berwarna toska ditemani fenomena Api Biru — satu dari dua di dunia. Pendakian mulai tengah malam untuk melihat nyala api sulfur sebelum matahari terbit.',
    descEn: 'A turquoise acidic crater lake plus the rare Blue Fire — one of only two in the world. Hikes start at midnight to witness the sulfur flames before sunrise.'
  },
  {
    id: 'semeru',
    name: 'Gunung Semeru',
    region: 'Lumajang, Jawa Timur',
    lat: -8.1077,
    lng: 112.9224,
    image: 'img/merapi.jpg',
    desc: 'Gunung tertinggi di Jawa (3.676 mdpl) dengan Ranu Kumbolo — danau berair jernih tempat favorit para pendaki berkemah. Puncak Mahameru meletuskan abu setiap ~20 menit.',
    descEn: 'Java’s highest peak (3,676 m) featuring Ranu Kumbolo — a pristine lake loved by climbers for camping. Mahameru summit erupts ash every ~20 minutes.'
  },
  {
    id: 'madakaripura',
    name: 'Air Terjun Madakaripura',
    region: 'Probolinggo, Jawa Timur',
    lat: -7.8600,
    lng: 112.9800,
    image: 'Image/situgj.jpg',
    desc: 'Air terjun abadi 200 meter yang konon tempat semedi terakhir Gajah Mada. Dikelilingi tebing hijau penuh tirai air yang jatuh dari segala arah.',
    descEn: 'A perpetual 200-meter waterfall said to be Gajah Mada’s last meditation site. Surrounded by green cliffs with water curtains cascading from every direction.'
  },
  {
    id: 'baluran',
    name: 'Taman Nasional Baluran',
    region: 'Situbondo, Jawa Timur',
    lat: -7.8447,
    lng: 114.3794,
    image: 'img/tinggilancip.jpg',
    desc: 'Savana mirip Afrika ("Little Africa") dengan populasi banteng jawa, rusa, dan merak hijau. Pohon bekol yang meranggas musim kemarau jadi latar foto ikonis.',
    descEn: 'African-like savanna ("Little Africa") home to Javan banteng, deer, and green peacocks. The leafless bekol trees in dry season create an iconic backdrop.'
  },
  {
    id: 'tugu-pahlawan',
    name: 'Tugu Pahlawan',
    region: 'Kota Surabaya, Jawa Timur',
    lat: -7.2458,
    lng: 112.7378,
    image: 'img/kota.jpg',
    desc: 'Monumen 41,15 meter penghormatan pahlawan Pertempuran 10 November 1945. Di bawahnya terdapat Museum Sepuluh Nopember yang menyimpan benda-benda bersejarah arek Suroboyo.',
    descEn: 'A 41.15-meter monument honoring the heroes of the 10 November 1945 Battle. Below it lies the Museum Sepuluh Nopember, housing artifacts of the Surabaya resistance.'
  },
  {
    id: 'bangsring',
    name: 'Bangsring Underwater',
    region: 'Banyuwangi, Jawa Timur',
    lat: -8.1589,
    lng: 114.3886,
    image: 'img/ampat.jpg',
    desc: 'Wisata snorkeling dan konservasi terumbu karang dengan rumah apung. Bisa berenang bareng hiu, mengadopsi karang, atau naik kapal tradisional ke Pulau Tabuhan.',
    descEn: 'Snorkeling and coral conservation center with floating houses. Swim with sharks, adopt corals, or sail traditional boats to Tabuhan Island.'
  },

  // --- Bali ----------------------------------------------------------------
  {
    id: 'ulun-danu',
    name: 'Pura Ulun Danu Beratan',
    region: 'Tabanan, Bali',
    lat: -8.2751,
    lng: 115.1687,
    image: 'img/ulun.jpg',
    desc: 'Pura abad ke-17 yang berdiri di atas air Danau Beratan — tampak mengapung saat air pasang. Latar Gunung Bratan membuatnya salah satu pura paling difoto di Bali.',
    descEn: 'A 17th-century temple standing on Lake Beratan — appearing to float at high water. With Mount Bratan as its backdrop, it’s one of Bali’s most photographed temples.'
  },
  {
    id: 'ubud',
    name: 'Ubud',
    region: 'Gianyar, Bali',
    lat: -8.5069,
    lng: 115.2625,
    image: 'img/beach.jpg',
    desc: 'Jantung budaya Bali dengan sawah terasering Tegalalang, Monkey Forest, dan galeri seni. Pusat meditasi, yoga, dan kuliner sehat ala "Eat Pray Love".',
    descEn: 'The cultural heart of Bali with the Tegalalang rice terraces, Monkey Forest, and art galleries. A hub for meditation, yoga, and "Eat Pray Love"-style healthy cuisine.'
  },
  {
    id: 'kelingking',
    name: 'Kelingking Beach',
    region: 'Nusa Penida, Bali',
    lat: -8.7517,
    lng: 115.4680,
    image: 'Image/Kelingking Beach.jpg',
    desc: 'Tebing ikonis berbentuk kepala T-Rex dengan pantai pasir putih di bawahnya. Jalur turun sangat curam — butuh 30 menit, tapi pemandangannya layak dikagumi dari atas.',
    descEn: 'An iconic T-Rex shaped cliff with a white sand beach below. The descent is steep (30 minutes), but the view alone from the top is worth it.'
  },
  {
    id: 'tanah-lot',
    name: 'Tanah Lot',
    region: 'Tabanan, Bali',
    lat: -8.6212,
    lng: 115.0868,
    image: 'img/ulun.jpg',
    desc: 'Pura di atas batu karang tengah laut — saat pasang terlihat terisolasi di tengah ombak. Sunset-nya adalah salah satu yang paling ikonik di Indonesia.',
    descEn: 'A temple atop an offshore rock — at high tide it appears isolated amid crashing waves. Its sunset is one of Indonesia’s most iconic.'
  },
  {
    id: 'kuta',
    name: 'Pantai Kuta',
    region: 'Badung, Bali',
    lat: -8.7234,
    lng: 115.1686,
    image: 'img/beach.jpg',
    desc: 'Pantai ombak moderat paling legendaris di Bali — favorit surfer pemula dan lokasi sunset ramai turis internasional. Sepanjang jalan berjajar butik, bar, dan toko surf.',
    descEn: 'Bali’s most legendary moderate-wave beach — a favorite of beginner surfers and a sunset hotspot packed with international tourists. The strip is lined with boutiques, bars, and surf shops.'
  },
  {
    id: 'besakih',
    name: 'Pura Besakih',
    region: 'Karangasem, Bali',
    lat: -8.3740,
    lng: 115.4522,
    image: 'img/ulun.jpg',
    desc: 'Pura terbesar dan tersuci di Bali di lereng Gunung Agung — "Mother Temple" Hindu Bali. Kompleks 23 pura dengan upacara Betara Turun Kabeh setahun sekali.',
    descEn: 'Bali’s largest and holiest temple on Mount Agung’s slope — the Balinese Hindu "Mother Temple". A complex of 23 shrines hosting the annual Betara Turun Kabeh ceremony.'
  },

  // --- NTB / Lombok --------------------------------------------------------
  {
    id: 'mandalika',
    name: 'Mandalika',
    region: 'Lombok Tengah, NTB',
    lat: -8.8943,
    lng: 116.2982,
    image: 'img/mandalika.jpg',
    desc: 'Kawasan Ekonomi Khusus dengan Sirkuit MotoGP International (Pertamina Mandalika Circuit), Pantai Kuta pasir merica, dan resort mewah. Tuan rumah MotoGP Indonesia sejak 2022.',
    descEn: 'A Special Economic Zone featuring the International MotoGP Circuit (Pertamina Mandalika), the peppercorn-sand Kuta Beach, and luxury resorts. Host of Indonesian MotoGP since 2022.'
  },
  {
    id: 'rinjani',
    name: 'Gunung Rinjani',
    region: 'Lombok Utara, NTB',
    lat: -8.4115,
    lng: 116.4577,
    image: 'img/lombok.jpg',
    desc: 'Gunung tertinggi kedua di Indonesia (3.726 mdpl) dengan Danau Segara Anak di kaldera dan Gunung Baru Jari yang menyembul di tengah. Pendakian 3 hari 2 malam kelas dunia.',
    descEn: 'Indonesia’s second-highest peak (3,726 m) with Lake Segara Anak inside the caldera and the Baru Jari cone rising at its center. A world-class 3-day/2-night climb.'
  },
  {
    id: 'gili-trawangan',
    name: 'Gili Trawangan',
    region: 'Lombok Utara, NTB',
    lat: -8.3500,
    lng: 116.0333,
    image: 'img/beach.jpg',
    desc: 'Pulau kecil tanpa kendaraan bermotor — hanya sepeda dan cidomo. Spot diving bertemu penyu, sunset dari Ayu Bar, dan kehidupan malam paling hidup di antara tiga Gili.',
    descEn: 'A small island with no motorized vehicles — only bicycles and horse carts. Diving spots with sea turtles, sunset views from Ayu Bar, and the liveliest nightlife among the three Gilis.'
  },
  {
    id: 'pink-beach-lombok',
    name: 'Pantai Pink Lombok (Tangsi)',
    region: 'Lombok Timur, NTB',
    lat: -8.8833,
    lng: 116.6167,
    image: 'img/beach.jpg',
    desc: 'Pantai dengan pasir merah jambu alami dari serpihan karang merah yang tergerus ombak. Lebih sepi dibanding pink beach di Komodo, cocok untuk relaksasi.',
    descEn: 'Naturally pink-sand beach colored by red coral fragments ground by waves. Quieter than the Komodo Pink Beach — perfect for relaxation.'
  },

  // --- NTT -----------------------------------------------------------------
  {
    id: 'komodo',
    name: 'Pulau Komodo',
    region: 'Manggarai Barat, NTT',
    lat: -8.5566,
    lng: 119.4891,
    image: 'img/komodo.jpg',
    desc: 'Habitat asli komodo (Varanus komodoensis), kadal purba terbesar di dunia. Taman Nasional UNESCO ini punya Pink Beach dan snorkeling kelas dunia di sekitarnya.',
    descEn: 'Natural habitat of the Komodo dragon (Varanus komodoensis), the world’s largest lizard. This UNESCO National Park also features Pink Beach and world-class snorkeling.'
  },
  {
    id: 'padar',
    name: 'Pulau Padar',
    region: 'Manggarai Barat, NTT',
    lat: -8.6471,
    lng: 119.5725,
    image: 'img/padar.jpg',
    desc: 'Pulau ikonis dengan tiga teluk berwarna berbeda (putih, hitam, merah muda) yang terlihat bersamaan dari puncak trekking 500 anak tangga. View legendaris di uang Rp 50.000.',
    descEn: 'The iconic island with three differently-colored bays (white, black, pink) visible together from the 500-step summit trek. A view featured on the Rp 50,000 banknote.'
  },
  {
    id: 'labuan-bajo',
    name: 'Labuan Bajo',
    region: 'Manggarai Barat, NTT',
    lat: -8.4846,
    lng: 119.8775,
    image: 'img/dermaga.jpg',
    desc: 'Gerbang wisata menuju Taman Nasional Komodo dengan phinisi trip 3D2N yang hits. Bandara internasional baru dan resort mewah membuatnya jadi wisata super-premium pemerintah.',
    descEn: 'Gateway to Komodo National Park, famed for its 3D2N phinisi boat trips. A new international airport and luxury resorts make it a government super-premium destination.'
  },
  {
    id: 'kelimutu',
    name: 'Danau Kelimutu',
    region: 'Ende, NTT',
    lat: -8.7667,
    lng: 121.8189,
    image: 'Image/Pulo Uran.jpg',
    desc: 'Tiga danau kawah di satu gunung, masing-masing berubah warna secara misterius (biru, hijau, hitam/merah). Masyarakat Lio percaya tempat arwah leluhur — didaki subuh untuk sunrise.',
    descEn: 'Three crater lakes on one mountain, each mysteriously changing color (blue, green, black/red). The Lio people believe it’s where ancestral spirits rest — hike at dawn for sunrise.'
  },
  {
    id: 'pink-beach-komodo',
    name: 'Pink Beach Komodo',
    region: 'Manggarai Barat, NTT',
    lat: -8.5506,
    lng: 119.4944,
    image: 'img/beach.jpg',
    desc: 'Salah satu dari 7 pink beach di dunia. Warna pasir terang saat basah karena serpihan karang merah bercampur pasir putih. Snorkeling di sini bertemu ikan badut.',
    descEn: 'One of only 7 pink beaches on Earth. Sand becomes vivid when wet as red coral fragments mix with white sand. Snorkeling reveals clownfish schools.'
  },

  // --- Papua ---------------------------------------------------------------
  {
    id: 'raja-ampat',
    name: 'Raja Ampat',
    region: 'Papua Barat Daya',
    lat: -0.5897,
    lng: 130.1041,
    image: 'img/raja.jpg',
    desc: 'Surga bawah laut dengan biodiversitas tertinggi di dunia — 1.500+ spesies ikan dan 75% spesies karang. View Wayag dari puncak karst adalah salah satu yang paling ikonik di planet.',
    descEn: 'Underwater paradise with the highest marine biodiversity on Earth — 1,500+ fish species and 75% of coral species. The Wayag view from the karst summit is one of the planet’s most iconic.'
  },
  {
    id: 'piaynemo',
    name: 'Piaynemo',
    region: 'Raja Ampat, Papua Barat Daya',
    lat: -0.5697,
    lng: 130.2608,
    image: 'img/ampat.jpg',
    desc: 'Gugusan karst mini-Wayag dengan trekking tangga kayu 15 menit ke viewpoint. Perahu melintas di sela-sela pulau menghasilkan foto paling dicari di Raja Ampat.',
    descEn: 'A mini-Wayag karst formation with a 15-minute wooden-stair trek to the viewpoint. Boats weaving between islands produce the most sought-after photos in Raja Ampat.'
  },

  // --- Sulawesi ------------------------------------------------------------
  {
    id: 'bunaken',
    name: 'Taman Laut Bunaken',
    region: 'Manado, Sulawesi Utara',
    lat: 1.6228,
    lng: 124.7594,
    image: 'img/pswt.jpg',
    desc: 'Taman laut dengan dinding karang vertikal sedalam 1.000+ meter — home bagi 70+ genera koral dan penyu hijau. Visibility hingga 40 meter sepanjang tahun.',
    descEn: 'Marine park with a 1,000+ meter vertical reef wall — home to 70+ coral genera and green sea turtles. Visibility up to 40 meters year-round.'
  },
  {
    id: 'wakatobi',
    name: 'Wakatobi',
    region: 'Wakatobi, Sulawesi Tenggara',
    lat: -5.3138,
    lng: 123.5809,
    image: 'Image/Raja Ampat.jpg',
    desc: 'Singkatan dari Wangi-Wangi, Kaledupa, Tomia, Binongko — empat pulau utama dengan karang warna-warni kelas dunia. Jacques Cousteau menyebutnya "underwater nirvana".',
    descEn: 'Named after Wangi-Wangi, Kaledupa, Tomia, Binongko — four main islands with world-class colorful reefs. Jacques Cousteau called it "underwater nirvana".'
  },
  {
    id: 'toraja',
    name: 'Tana Toraja',
    region: 'Tana Toraja, Sulawesi Selatan',
    lat: -3.0700,
    lng: 119.8850,
    image: 'img/kayadanau.jpg',
    desc: 'Dataran tinggi dengan rumah adat Tongkonan beratap perahu terbalik dan tradisi pemakaman Rambu Solo yang unik — kubur batu dan patung Tau-Tau di tebing.',
    descEn: 'Highland known for boat-shaped Tongkonan traditional houses and the unique Rambu Solo funeral tradition — stone tombs and Tau-Tau effigies carved into cliffs.'
  },
  {
    id: 'karampuang',
    name: 'Pulau Karampuang',
    region: 'Mamuju, Sulawesi Barat',
    lat: -2.6333,
    lng: 118.8333,
    image: 'Image/Dermaga-karampuang.jpg',
    desc: 'Pulau berair jernih kaca dengan Sumur Jodoh di tebing — konon yang minum bersama pasangan akan langgeng. Rumah adat panggung dan snorkeling karang di sekelilingnya.',
    descEn: 'Crystal-clear island with the famous Love Well — legend says couples drinking here will stay together forever. Features stilt-house villages and coral snorkeling around.'
  },
  {
    id: 'togean',
    name: 'Kepulauan Togean',
    region: 'Tojo Una-Una, Sulawesi Tengah',
    lat: -0.3833,
    lng: 121.9833,
    image: 'Image/Raja Ampat.jpg',
    desc: 'Kepulauan tropis dengan 3 jenis terumbu karang (atoll, barrier, fringing) dalam satu lokasi — langka di dunia. Desa suku Bajo hidup di atas air.',
    descEn: 'Tropical archipelago with all three reef types (atoll, barrier, fringing) in one area — a global rarity. The Bajo sea-nomads live in stilt villages on the water.'
  },

  // --- Sumatera ------------------------------------------------------------
  {
    id: 'toba',
    name: 'Danau Toba',
    region: 'Sumatera Utara',
    lat: 2.6540,
    lng: 98.8311,
    image: 'img/toba.jpg',
    desc: 'Danau vulkanik terbesar di dunia (1.145 km², dalam 505 m) dengan Pulau Samosir di tengahnya — pulau dalam pulau dalam danau. Pusat budaya Batak dengan rumah bolon dan tor-tor.',
    descEn: 'The world’s largest volcanic lake (1,145 km², 505 m deep) with Samosir Island at its center — an island within an island within a lake. The heart of Batak culture with bolon houses and tor-tor dance.'
  },
  {
    id: 'samosir',
    name: 'Pulau Samosir',
    region: 'Samosir, Sumatera Utara',
    lat: 2.6000,
    lng: 98.8333,
    image: 'img/toba.jpg',
    desc: 'Pulau seluas Singapura di tengah Danau Toba, pusat budaya Batak dengan Museum Huta Bolon, makam kuno Raja Sidabutar, dan desa Tomok. Akses ferry dari Parapat 45 menit.',
    descEn: 'Singapore-sized island at the heart of Lake Toba, the cultural center of the Batak people with Huta Bolon Museum, King Sidabutar’s ancient tomb, and Tomok village. 45-minute ferry from Parapat.'
  },
  {
    id: 'sipiso',
    name: 'Air Terjun Sipiso-piso',
    region: 'Karo, Sumatera Utara',
    lat: 2.9833,
    lng: 98.5166,
    image: 'Image/situgj.jpg',
    desc: 'Air terjun 120 meter jatuh dari tebing kaldera Toba — salah satu tertinggi di Indonesia. Pemandangan ke Danau Toba dari atasnya adalah komposisi foto wajib.',
    descEn: 'A 120-meter waterfall plunging from the Toba caldera — one of the highest in Indonesia. The view of Lake Toba from above makes an essential photo composition.'
  },
  {
    id: 'jam-gadang',
    name: 'Jam Gadang',
    region: 'Bukittinggi, Sumatera Barat',
    lat: -0.3046,
    lng: 100.3695,
    image: 'img/kota.jpg',
    desc: 'Menara jam 26 meter dari 1926 yang jadi ikon Sumatera Barat. Keunikan: angka empat ditulis "IIII" (bukan IV) — teori bervariasi dari kesalahan hingga penghormatan ke Jupiter.',
    descEn: 'A 26-meter clock tower from 1926, the icon of West Sumatra. Unique: the number four is written "IIII" (not IV) — theories range from error to homage to Jupiter.'
  },
  {
    id: 'maninjau',
    name: 'Danau Maninjau',
    region: 'Agam, Sumatera Barat',
    lat: -0.3167,
    lng: 100.2000,
    image: 'img/toba.jpg',
    desc: 'Danau kaldera dengan 44 kelokan (Kelok 44) ikonis di jalan turun ke tepinya. Kampung halaman penulis Buya Hamka — terdapat museum di pinggir danau.',
    descEn: 'A caldera lake with the iconic 44 hairpin bends (Kelok 44) descending to its shore. Birthplace of author Buya Hamka — a museum sits on the lakeshore.'
  },
  {
    id: 'harau',
    name: 'Lembah Harau',
    region: 'Payakumbuh, Sumatera Barat',
    lat: -0.0894,
    lng: 100.6814,
    image: 'Image/situgj.jpg',
    desc: 'Ngarai tebing granit 80-300 meter vertikal dengan air terjun di sela-sela dan sawah terasering — julukannya "Little Yosemite" Indonesia. Penginapan homestay ala kampung Jepang.',
    descEn: 'A vertical granite canyon 80-300 m tall with waterfalls and terraced rice paddies in between — nicknamed Indonesia’s "Little Yosemite". Features homestays styled after a Japanese village.'
  },
  {
    id: 'singkarak',
    name: 'Danau Singkarak',
    region: 'Solok, Sumatera Barat',
    lat: -0.6167,
    lng: 100.5333,
    image: 'img/toba.jpg',
    desc: 'Danau terbesar kedua di Sumatera (107 km²), habitat ikan Bilih endemik. Tuan rumah etape Tour de Singkarak — balap sepeda internasional tahunan.',
    descEn: 'Sumatra’s second-largest lake (107 km²), home to the endemic Bilih fish. Hosts the annual international Tour de Singkarak cycling race.'
  },
  {
    id: 'weh',
    name: 'Pulau Weh',
    region: 'Sabang, Aceh',
    lat: 5.8754,
    lng: 95.2867,
    image: 'Image/Situ Gunung.jpg',
    desc: 'Titik Nol Kilometer Indonesia di ujung barat. Pulau vulkanik dengan Pantai Iboih, Tugu Kilometer Nol, dan snorkeling Pulau Rubiah yang jernih.',
    descEn: 'Indonesia’s Zero Kilometer Point at the western tip. A volcanic island featuring Iboih Beach, the Zero KM Monument, and crystal-clear snorkeling at Rubiah Island.'
  },
  {
    id: 'iboih',
    name: 'Pantai Iboih',
    region: 'Sabang, Aceh',
    lat: 5.8742,
    lng: 95.2731,
    image: 'img/beach.jpg',
    desc: 'Pantai paling populer di Pulau Weh dengan laut hijau toska dan bungalow kayu di pinggir laut. Base snorkeling ke Pulau Rubiah yang penuh ikan warna-warni.',
    descEn: 'The most popular beach on Weh Island with turquoise water and wooden beachfront bungalows. The base for snorkeling trips to fish-rich Rubiah Island.'
  },
  {
    id: 'belitung',
    name: 'Pantai Tanjung Tinggi',
    region: 'Belitung, Kep. Bangka Belitung',
    lat: -2.5494,
    lng: 107.6844,
    image: 'img/beach.jpg',
    desc: 'Pantai "Laskar Pelangi" dengan granit raksasa unik di tepi laut. Lokasi syuting film Laskar Pelangi 2008 yang mempopulerkan Belitung ke dunia.',
    descEn: 'The "Rainbow Troops" beach with unique giant granite boulders at the shore. Shooting location of the 2008 Laskar Pelangi film that put Belitung on the world map.'
  },
  {
    id: 'ampera',
    name: 'Jembatan Ampera',
    region: 'Kota Palembang, Sumatera Selatan',
    lat: -2.9925,
    lng: 104.7637,
    image: 'img/kota.jpg',
    desc: 'Jembatan ikonis 1.177 meter yang membelah Sungai Musi, dibangun 1962. Saat malam berkilau merah — background wajib foto bersama pempek dan kapal getek.',
    descEn: 'An iconic 1,177-meter bridge straddling the Musi River, built in 1962. Glows red at night — the essential backdrop for photos with pempek and river boats.'
  },

  // --- Kalimantan ----------------------------------------------------------
  {
    id: 'derawan',
    name: 'Kepulauan Derawan',
    region: 'Berau, Kalimantan Timur',
    lat: 2.2833,
    lng: 118.2500,
    image: 'Image/Raja Ampat.jpg',
    desc: 'Kepulauan tropis dengan Pulau Kakaban (danau ubur-ubur tidak menyengat), Maratua (diving manta), dan Sangalaki (habitat penyu hijau). Saingan Raja Ampat di utara.',
    descEn: 'Tropical archipelago featuring Kakaban Island (stingless jellyfish lake), Maratua (manta diving), and Sangalaki (green turtle habitat). A northern rival to Raja Ampat.'
  },
  {
    id: 'sebangau',
    name: 'Taman Nasional Sebangau',
    region: 'Palangka Raya, Kalimantan Tengah',
    lat: -2.5833,
    lng: 113.6667,
    image: 'Image/situgj.jpg',
    desc: 'Habitat orangutan Kalimantan terbesar (6.000+ individu) di hutan gambut seluas 568.700 hektar. Tur klotok menyusuri sungai Sebangau untuk melihat satwa liar.',
    descEn: 'The largest Bornean orangutan habitat (6,000+ individuals) in a 568,700-hectare peat forest. Klotok boat tours navigate the Sebangau River for wildlife viewing.'
  }
];
