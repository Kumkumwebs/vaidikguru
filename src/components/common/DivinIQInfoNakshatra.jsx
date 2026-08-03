const DiviniqInfoSection = () => {
    return (
        <section className="space-bottom">
            <div className="container">
                {/* SECTION HEADER */}
                <div className="title-area text-center mb-50">
                    <span className="sub-title style1">Wisdom Hub</span>
                    <h2 className="sec-title">Mastering Your Cosmic Identity</h2>
                    <p className="mx-auto" style={{maxWidth: '700px'}}>
                        Explore how DivinIQ merges ancient Vedic sciences with modern precision to 
                        decode the lunar influence on your life's journey.
                    </p>
                </div>

                <div className="row g-4">
                    {/* CARD 1: WHAT IS NAKSHATRA */}
                    <div className="col-lg-6">
                        <div className="bg-white p-40 rounded-25 shadow-sm border-light h-100 transition-all hover-shadow">
                            <div className="d-flex align-items-start gap-4">
                                <div className="bg-indigo-100 p-3 rounded-15">
                                    <img src="assets/img/icon/about_1_1.svg" width="40" alt="icon" />
                                </div>
                                <div>
                                    <h4 className="h5 fw-bold mb-3 text-indigo-900">What is a Nakshatra Finder?</h4>
                                    <p className="small text-muted mb-0 leading-relaxed">
                                        The <strong>DivinIQ Nakshatra Finder</strong> is a high-precision tool that decodes your birth star by mapping the Moon's exact longitude at your time of birth. While the backend utilizes sophisticated astronomical algorithms, the interface remains minimalist—allowing you to discover your 27-fold lunar mansion identity in seconds.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: FIND BY DOB */}
                    <div className="col-lg-6">
                        <div className="bg-white p-40 rounded-25 shadow-sm border-light h-100 transition-all hover-shadow">
                            <div className="d-flex align-items-start gap-4">
                                <div className="bg-amber-100 p-3 rounded-15">
                                    <img src="assets/img/icon/about_1_2.svg" width="40" alt="icon" />
                                </div>
                                <div>
                                    <h4 className="h5 fw-bold mb-3 text-amber-900">Birth Star Finder Mechanics</h4>
                                    <p className="small text-muted mb-0 leading-relaxed">
                                        Relying solely on your <strong>Date of Birth</strong> is only half the story. DivinIQ integrates your <strong>Exact Time</strong> and <strong>Place of Birth</strong> to triangulate your Janma Nakshatra. This pinpoint accuracy is what allows for true insights into your behavioral archetypes and soul's evolutionary path.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: RASHI VS NAKSHATRA */}
                    <div className="col-lg-6">
                        <div className="bg-white p-40 rounded-25 shadow-sm border-light h-100 transition-all hover-shadow border-start border-4 border-title">
                            <h4 className="h5 fw-bold mb-3">Difference: Nakshatra vs. Rashi</h4>
                            <p className="small text-muted mb-3">
                                Think of your <strong>Rashi (Moon Sign)</strong> as the broad landscape of your personality, while your <strong>Nakshatra</strong> is the specific high-definition detail. 
                            </p>
                            <ul className="list-unstyled d-grid gap-2">
                                <li className="small d-flex gap-2 align-items-center">
                                    <div className="pulse-live" style={{width: '6px', height: '6px'}}></div> 
                                    <strong>Rashi:</strong> 12 Zones, 30° each.
                                </li>
                                <li className="small d-flex gap-2 align-items-center">
                                    <div className="pulse-live" style={{width: '6px', height: '6px'}}></div> 
                                    <strong>Nakshatra:</strong> 27 Zones, 13°20' each.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CARD 4: BENEFITS */}
                    <div className="col-lg-6">
                        <div className="bg-title p-40 rounded-25 text-white h-100 position-relative overflow-hidden shadow-xl">
                            <div className="position-relative z-index-1">
                                <h4 className="h5 fw-bold mb-3 text-white">Why Use the DivinIQ Calculator?</h4>
                                <div className="row g-3 mt-1">
                                    <div className="col-6">
                                        <div className="bg-white-10 p-2 rounded-10 small">💎 Gemstone Advice</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="bg-white-10 p-2 rounded-10 small">🤝 Kundli Milan</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="bg-white-10 p-2 rounded-10 small">📅 Shubh Muhurat</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="bg-white-10 p-2 rounded-10 small">✨ Name Syllables</div>
                                    </div>
                                </div>
                            </div>
                            <div className="shape-mockup opacity-10" style={{bottom: '-20px', right: '-20px'}}>
                                <img src="assets/img/logo-white.svg" width="150" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};