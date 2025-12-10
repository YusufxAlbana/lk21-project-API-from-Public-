function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="about-header">
                    <div className="about-icon">
                        <i className="fas fa-code"></i>
                    </div>
                    <h1>Tentang Website Ini</h1>
                    <p className="about-subtitle">
                        Kenapa saya membuat website streaming film ini?
                    </p>
                </div>

                <div className="about-content">
                    <div className="about-card">
                        <div className="card-icon">
                            <i className="fas fa-rocket"></i>
                        </div>
                        <h3>Tujuan Pembelajaran</h3>
                        <p>
                            Website ini dibuat sebagai bagian dari perjalanan belajar saya dalam
                            pengembangan web. Saya ingin meningkatkan kemampuan dalam menggunakan
                            API eksternal dan membangun aplikasi web yang real-world.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="card-icon">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <h3>Persiapan Karir</h3>
                        <p>
                            Dengan membuat project ini, saya berharap dapat lebih siap untuk terjun
                            ke dunia kerja sebagai web developer. Pengalaman praktis dalam integrasi
                            API dan manajemen data sangat penting untuk karir saya.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="card-icon">
                            <i className="fas fa-laptop-code"></i>
                        </div>
                        <h3>Teknologi yang Digunakan</h3>
                        <p>
                            Proyek ini dibangun menggunakan React JS untuk frontend, Express JS
                            untuk backend API, dan web scraping untuk mengambil data film.
                            Semua untuk tujuan edukasi dan pembelajaran.
                        </p>
                    </div>
                </div>

                <div className="disclaimer-section">
                    <div className="disclaimer-box">
                        <i className="fas fa-exclamation-triangle"></i>
                        <h3>Disclaimer</h3>
                        <p>
                            Website ini dibuat <strong>hanya untuk tujuan edukasi</strong> dalam
                            mempelajari API integration dan web development. Semua konten dan data
                            film berasal dari sumber publik. Tidak ada konten bajakan yang dihosting
                            di website ini.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
