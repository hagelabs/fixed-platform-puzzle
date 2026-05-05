# **🕹️ Game Design Document: The Kinetic Puzzle**

**Versi:** 2.0 (Revised)

**Genre:** Hybrid Kinetic Puzzle (Sokoban + Unpuzzle)

**Platform:** Web (Mobile Friendly)

**Engine:** Phaser 4

## **1. Visi Game**

**The Kinetic Puzzle** adalah game puzzle yang menggabungkan logika urutan _Unpuzzle_ dengan mekanik navigasi _Sokoban_. Berbeda dengan game puzzle tradisional yang kaku, game ini menekankan pada **"Game Juice"**—setiap gerakan terasa memuaskan, kenyal, dan dinamis. Game ini bukan tentang efisiensi langkah, melainkan tentang kepuasan memanipulasi objek fisik untuk menyelesaikan masalah.

### **Core Pillars**

- **Tactile Satisfaction:** Setiap tabrakan dan gerakan memberikan umpan balik visual dan audio.

- **Fluid Logic:** Logika yang menantang namun disajikan dengan pergerakan yang mulus.

- **Stress-Free Experience:** Tidak ada hukuman untuk langkah berlebih; fokus pada penyelesaian.

## **2. Mekanik Utama (Core Mechanics)**

### **A. Sliding Momentum (The "Ice" Physics)**

- **Input:** Player melakukan _swipe_ atau _drag_ pada blok.

- **Action:** Blok meluncur secara instan ke arah yang ditentukan dan tidak berhenti sampai menabrak **Dinding (Wall)**, **Obstacle**, atau **Blok Lain**.

- **Juice:** Saat menabrak, terjadi efek _Squash & Stretch_ dan _Screenshake_ mikro.

### **B. Removal Phase (The "Unpuzzle" Logic)**

- **Exit Zones:** Area di pinggiran grid yang ditandai dengan cahaya redup.

- **Removal:** Jika blok berada di posisi yang sejajar dengan _Exit Zone_ yang valid, player bisa men-drag blok tersebut keluar dari papan.

- **Order Dependency:** Beberapa blok tidak bisa bergerak atau dikeluarkan sebelum blok lain (dependensi) dihilangkan terlebih dahulu.

### **C. Dead-End Detection**

- Sistem secara otomatis mendeteksi jika tidak ada lagi langkah yang memungkinkan (semua blok terjepit).

- **Visual Warning:** Layar berdenyut merah redup dan muncul opsi \[Undo] atau \[Restart].

## **3. Sistem Objek & Blok**

|                  |                     |                                                               |
| ---------------- | ------------------- | ------------------------------------------------------------- |
| **Jenis Blok**   | **Visual**          | **Perilaku**                                                  |
| **Simple Block** | Merah Cerah         | Bisa meluncur ke mana saja dan keluar dari exit mana saja.    |
| **Constrained**  | Kuning + Ikon Panah | Hanya bisa keluar melalui exit yang searah dengan ikonnya.    |
| **Dependent**    | Biru + Ikon Rantai  | Terkunci di tempat sampai blok targetnya di-remove.           |
| **Obstacle**     | Abu-abu Tua / Batu  | Statis, tidak bisa dipindah, berfungsi sebagai penahan jalur. |

## **4. Desain Level & Progresi**

### **Filosofi Desain**

Level dirancang untuk mengajarkan mekanik secara organik tanpa tutorial teks yang panjang.

1. **Tutorial (Level 1-5):** Pengenalan _Sliding_ dan _Removal_. Jalur sangat jelas.

2. **Introduction of Obstacles (Level 6-15):** Player belajar menavigasi blok di sekitar hambatan statis.

3. **Complexity & Dependency (Level 16-30):** Memperkenalkan blok biru yang terkunci. Player harus merencanakan urutan removal.

4. **The Dead-End Traps (Level 31+):** Level luas dengan banyak rute, namun hanya beberapa urutan yang tidak menyebabkan jalan buntu.

## **5. Game Juice & Polishing (Vlambeer Principles)**

### **Visual Juice**

- **Squash & Stretch:** Blok memipih saat menabrak (skala 1.2x pada sumbu tabrak, 0.8x pada sumbu lainnya).

- **Dust Particles:** Partikel kecil muncul di titik tabrakan dan di belakang jalur luncur.

- **Removal Bloom:** Efek ledakan partikel warna-warni saat blok berhasil di-remove.

- **Anticipation:** Blok sedikit membesar (_scale up_) saat disentuh atau di-tap.

### **Audio Juice**

- **Collision Sound:** Suara "thud" atau "clack" dengan _pitch_ acak agar tidak monoton.

- **Success Jingle:** Bunyi nada harmonis yang meningkat setiap kali satu blok dikeluarkan.

- **Ambience:** Musik latar minimalis/lo-fi untuk menjaga fokus player.

## **6. Antarmuka Pengguna (UI/UX)**

- **HUD Atas:** Nama Level, Tombol Pause, dan Skor (berdasarkan blok yang keluar).

- **HUD Bawah:** Tombol \[Undo], \[Restart], dan \[Hint].

- **Tanpa Star System:** Menghilangkan bar "Expected Moves" untuk mendukung eksplorasi bebas.

- **FTUE (First Time User Experience):** Menggunakan animasi tangan (_ghost hand_) untuk menunjukkan gerakan pertama di level 1.

## **7. Spesifikasi Teknis (Phaser 3)**

- **Grid System:** Berbasis koordinat array \[row]\[col].

- **Tween Manager:** Menggunakan Phaser.Tweens untuk pergerakan slide dan efek squash.

- **Texture Generation:** Menggunakan Phaser.GameObjects.Graphics untuk generate asset secara prosedural guna meminimalkan ukuran file.

### **Struktur Data Blok (Contoh)**

{\
  id: "block_01",\
  type: "dependent",\
  color: 0x3b82f6,\
  position: { x: 2, y: 3 },\
  isLocked: true,\
  dependsOn: "block_02"\
}

## **8. Ringkasan Identitas Baru**

"The Kinetic Puzzle" bukan lagi sebuah tes logika yang kaku, melainkan sebuah **taman bermain kinetik**. Kemenangan dicapai melalui eksperimen fisik dan manipulasi objek yang terasa hidup, memberikan kepuasan instan pada setiap detiknya.
