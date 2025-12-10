function Contact() {
    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <h1>Hubungi Kami</h1>
                    <p className="contact-subtitle">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    </p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <h3>Email</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-phone"></i>
                            </div>
                            <h3>Telepon</h3>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>Alamat</h3>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <form className="contact-form">
                            <h2>Kirim Pesan</h2>
                            <div className="form-group">
                                <label htmlFor="name">Nama</label>
                                <input type="text" id="name" placeholder="Masukkan nama Anda" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Masukkan email Anda" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Pesan</label>
                                <textarea id="message" rows="5" placeholder="Tulis pesan Anda di sini..."></textarea>
                            </div>
                            <button type="submit" className="submit-btn">
                                <i className="fas fa-paper-plane"></i> Kirim Pesan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
