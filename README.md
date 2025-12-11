# 🎬 LK21 Vibe

<div align="center">

![LK21 Vibe](https://img.shields.io/badge/LK21-Vibe-gold?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiI+PHBvbHlnb24gcG9pbnRzPSI1IDMgMTkgMTIgNSAyMSA1IDMiLz48L3N2Zz4=)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Premium Movie Streaming Platform**

*Temukan film favorit Anda dengan kualitas terbaik*

[Live Demo](https://lk21-liard.vercel.app) · [Report Bug](https://github.com/YusufxAlbana/lk21-project-API-from-Public-/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎥 **Browse Movies** | Jelajahi koleksi film terbaru dengan tampilan grid yang menarik |
| 🔍 **Smart Search** | Cari film favorit dengan search bar yang responsif |
| 🏷️ **Genre Filter** | Filter film berdasarkan genre (Action, Comedy, Horror, dll) |
| ⭐ **Top Rated** | Lihat 10 film dengan rating tertinggi |
| 📱 **Responsive** | Tampilan optimal di desktop, tablet, dan mobile |
| 🎨 **Premium UI** | Desain elegan dengan warna emas dan animasi smooth |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YusufxAlbana/lk21-project-API-from-Public-.git

# Masuk ke folder
cd lk21-project-API-from-Public-

# Install dependencies
npm install

# Jalankan server
npm start
```

Buka **http://localhost:5173** di browser Anda.

---

## 📁 Project Structure

```
lk21/
├── 📂 api/              # Vercel Serverless Functions
├── 📂 config/           # API Configuration (axios)
├── 📂 public/           # Static Frontend Files
│   ├── 📂 css/          # Stylesheets
│   ├── 📂 js/           # JavaScript
│   ├── index.html       # Landing Page (Top 10)
│   ├── films.html       # Browse All Movies
│   ├── detail.html      # Movie Details
│   ├── about.html       # About Page
│   └── contact.html     # Contact Page
├── 📂 routes/           # Express API Routes
├── 📂 utils/            # Utility Functions (scraper)
├── server.js            # Express Server
├── vercel.json          # Vercel Configuration
└── package.json         # Project Dependencies
```

---

## 🔗 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/latest` | Film terbaru |
| `GET /api/v1/genre/:genre` | Filter by genre |
| `GET /api/v1/search?q=keyword` | Search film |
| `GET /api/v1/detail?url=...` | Detail film |
| `GET /status` | Server status |

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Scraping:** Axios, JSDOM
- **Deployment:** Vercel

---

## 👨‍💻 Developer

<div align="center">

**Yusuf Nawaf Albana**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YusufxAlbana)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yusuf-nawaf-albana-1b493931b/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/yusuf_nawaf_alacehi)

</div>

---

## ⚠️ Disclaimer

> Website ini dibuat **hanya untuk tujuan edukasi** dalam mempelajari API integration dan web development. Semua konten dan data film berasal dari sumber publik. Tidak ada konten bajakan yang dihosting di website ini.

---

<div align="center">

Made with ❤️ and ☕ by **Yusuf Albana**

⭐ Star this repo if you find it useful!

</div>
