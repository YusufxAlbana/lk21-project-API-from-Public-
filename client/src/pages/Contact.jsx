import React from 'react';

function Contact() {
    const socialLinks = [
        {
            name: 'GitHub',
            icon: 'fab fa-github',
            link: 'https://github.com/YusufxAlbana',
            description: 'Check out my code repositories and open source contributions'
        },
        {
            name: 'Instagram',
            icon: 'fab fa-instagram',
            link: 'https://www.instagram.com/yusuf_nawaf_alacehi',
            description: 'Follow my daily activities and tech journey'
        },
        {
            name: 'Facebook',
            icon: 'fab fa-facebook',
            link: 'https://www.facebook.com/profile.php?id=100090587091557',
            description: 'Connect with me on Facebook'
        },
        {
            name: 'LinkedIn',
            icon: 'fab fa-linkedin',
            link: 'https://www.linkedin.com/in/yusuf-nawaf-albana-1b493931b/',
            description: 'View my professional profile and experience'
        },
        {
            name: 'Email',
            icon: 'fas fa-envelope',
            link: 'mailto:your.yusufnawafalbana2009@gmail.com',
            description: 'Send me an email directly'
        }
    ];

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <div className="profile-section">
                        <div className="profile-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <h1>Get In Touch</h1>
                        <p className="contact-subtitle">
                            Mari terhubung! Silakan hubungi saya melalui platform berikut
                        </p>
                    </div>
                </div>

                <div className="social-grid">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-card"
                        >
                            <div className="social-icon">
                                <i className={social.icon}></i>
                            </div>
                            <h3>{social.name}</h3>
                            <p>{social.description}</p>
                            <div className="card-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="portfolio-info">
                    <h2>About Me</h2>
                    <p>
                        Saya adalah seorang web developer yang passionate dalam menciptakan
                        aplikasi web yang menarik dan fungsional. Proyek ini adalah salah satu
                        dari banyak eksperimen yang saya lakukan untuk terus belajar dan berkembang
                        di bidang web development.
                    </p>
                    <div className="skills-section">
                        <h3>Tech Stack</h3>
                        <div className="skills-tags">
                            <span className="skill-tag"><i className="fab fa-react"></i> React JS</span>
                            <span className="skill-tag"><i className="fab fa-node-js"></i> Node.js</span>
                            <span className="skill-tag"><i className="fab fa-js"></i> JavaScript</span>
                            <span className="skill-tag"><i className="fab fa-html5"></i> HTML</span>
                            <span className="skill-tag"><i className="fab fa-css3-alt"></i> CSS</span>
                            <span className="skill-tag"><i className="fas fa-database"></i> API Integration</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
