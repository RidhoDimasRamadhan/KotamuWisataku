# KotamuWisataku

Situs statis pencarian destinasi wisata Indonesia. Fitur utamanya **Wisata
Terdekat**: dengan izin lokasi dari peramban, situs mengurutkan 97 destinasi
berdasarkan jarak dari posisimu, menampilkannya di peta bergaya radar, lalu
menghitung estimasi waktu tempuh untuk motor, mobil, jalan kaki, atau sepeda.

Dibuat mahasiswa Universitas Gunadarma Kalimalang untuk keperluan pembelajaran,
bukan tujuan komersial.

## Fitur

- **Wisata Terdekat** — deteksi GPS, peta radar, urutan destinasi terdekat,
  dan tautan petunjuk arah. Menolak izin lokasi tetap bisa dipakai; titik
  acuannya jatuh ke Jakarta.
- **Pencarian** — mencari 97 destinasi berdasarkan nama atau daerah, lengkap
  dengan navigasi papan ketik.
- **Halaman detail destinasi** — satu halaman (`wisata.html`) yang dirender
  dari data untuk ke-97 destinasi, jadi tidak ada berkas HTML per tempat.
- **Dua bahasa** — Indonesia (`index.html`) dan Inggris (`English.html`).
- **Mode gelap** — pilihan pengguna tersimpan di peramban.
- **Berlangganan** — email disimpan di peramban dan, bila diaktifkan, diteruskan
  lewat FormSubmit.

## Menjalankan secara lokal

Tidak ada langkah build maupun dependensi yang perlu dipasang. Cukup jalankan
peladen statis dari folder proyek:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Membuka berkas lewat `file://` juga jalan, tetapi peladen lokal lebih mendekati
kondisi sesungguhnya.

## Struktur

```
index.html            beranda (Indonesia)
English.html          beranda (Inggris)
wisata.html           detail destinasi, dirender dari ?id=
Recomendations.html   halaman Situ Gunung (Inggris)
ComeToRecommend.html  halaman Situ Gunung (Indonesia)
berita1..3.html       artikel
kebijakan.html        kebijakan & ketentuan (Indonesia)
policy.html           kebijakan & ketentuan (Inggris)

css/  style.css      tata letak bersama untuk semua halaman
      nearby.css     bagian Wisata Terdekat
      detail.css     halaman detail destinasi
      page.css       halaman teks statis
      dark.css       tema gelap (dimuat di semua halaman)
      Recommend.css  halaman Situ Gunung
      berita1.css    halaman artikel
      English.css    penyesuaian halaman Inggris

js/   script.js      navbar, pencarian, slider, mode gelap, berlangganan
      nearby.js      GPS, peta radar, estimasi jarak & waktu
      detail.js      merender wisata.html dari data
      recomend.js    peta pada halaman Situ Gunung

data/ destinations.js  97 destinasi: id, nama, daerah, koordinat, deskripsi
                       dua bahasa, dan gambar
```

## Data destinasi

Semua destinasi tinggal di satu berkas, [`data/destinations.js`](data/destinations.js),
yang mengisi `window.KW_DESTINATIONS`. Menambah destinasi cukup menambah satu
objek:

```js
{
  id: 'nama-unik',
  name: 'Nama Destinasi',
  region: 'Kabupaten, Provinsi',
  lat: -6.1754,
  lng: 106.8272,
  image: 'img/berkas.jpg',
  desc: 'Deskripsi Bahasa Indonesia.',
  descEn: 'English description.'
}
```

Destinasi baru langsung muncul di pencarian, di daftar Wisata Terdekat, dan
punya halaman detailnya sendiri di `wisata.html?id=nama-unik` — tanpa perlu
menyentuh HTML.

## Teknologi

HTML, CSS, dan JavaScript tanpa kerangka kerja dan tanpa proses build. Tiga
pustaka dimuat dari CDN:

| Pustaka | Kegunaan |
| --- | --- |
| [Leaflet](https://leafletjs.com) 1.9.3 | peta |
| [Swiper](https://swiperjs.com) 7 | slider beranda |
| [Bootstrap Icons](https://icons.getbootstrap.com) 1.9.1 | ikon |

Peta memakai ubin dari OpenStreetMap dan CARTO. `css/style.css` dikompilasi
sebagian dari `css/style.scss`; bagian di bawah penanda `sourceMappingURL`
ditulis langsung di CSS dan tidak ikut terkompilasi.

## Catatan konfigurasi

- **Formulir berlangganan** — alamat penerima diatur lewat `SUBSCRIBE_EMAIL`
  di [`js/script.js`](js/script.js). Kosongkan untuk menyimpan email di
  peramban saja tanpa mengirim ke mana pun.
- **Lokasi pengguna** — hanya dipakai di perangkat untuk menghitung jarak,
  tidak dikirim ke peladen mana pun dan tidak disimpan.
- **Gambar** — versi WebP disediakan berdampingan dengan JPEG/PNG melalui
  `<picture>`, jadi peramban lama tetap mendapat gambar.

## Lisensi & atribusi

Kode dibuat untuk keperluan pembelajaran. Sebagian foto berasal dari Wikimedia
Commons dan LoremFlickr dan tetap menjadi hak pemiliknya masing-masing. Data
peta © kontributor OpenStreetMap.
