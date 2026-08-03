import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <div
      className="about-area position-relative overflow-hidden space"
      id="about-sec"
      style={{ background: "#ffffff" }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6">
            <div className="img-box1 elite-image-effect">
              <div className="img1">
                <img
                  src="/assets/img/diviniq_puja.png"
                  alt="Sacred Ritual"
                  className="rounded-20 shadow-xl"
                />
              </div>
              <div className="img2">
                <img
                  src="/assets/img/1.png"
                  alt="Ancient Temple"
                  className="rounded-20 shadow-lg"
                />
              </div>
              <div className="img3">
                <img
                  src="/assets/img/about_diviniq.png"
                  alt="Vedic Altar"
                  className="rounded-20 shadow-lg"
                />
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="ps-xl-4 ms-xl-2">
              <div className="title-area mb-25 pe-xl-5 me-xl-5">
                <h2 className="sec-title mb-20 text-gradient">
                  Bridging the Gap Between You and the Divine
                </h2>
                <p className="sec-text mb-30 leading-relaxed">
                  At DivinIQ, we believe every ritual is a conversation with the
                  cosmos. We curate spiritually immersive pilgrimages and
                  authentic Vedic Puja services that synchronize your life with
                  ancient temple energies and sacred lineages. Our mission is to
                  bring peace, protection, and profound transformation into your
                  modern life through the precision of tradition.
                </p>
              </div>
              <div className="about-item-wrap">
                <div className="about-item elite-card-shadow">
                  <div className="about-item_img">
                    <img src="/assets/img/icon/map3.svg" alt="Sankalpa" />
                  </div>
                  <div className="about-item_centent">
                    <h5 className="box-title">Personalized Sankalpa</h5>
                    <p className="about-item_text">
                      Every ritual is performed in your name and Gotra, ensuring
                      the karmic energy reaches you directly.
                    </p>
                  </div>
                </div>
                <div className="about-item elite-card-shadow">
                  <div className="about-item_img">
                    <img src="/assets/img/icon/guide.svg" alt="Masters" />
                  </div>
                  <div className="about-item_centent">
                    <h5 className="box-title">Vedic Masters</h5>
                    <p className="about-item_text">
                      Guided by master priests and scholars with generations of
                      devotional expertise.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-40">
                <Link
                  to="/about_us"
                  className="th-btn style3 py-3 px-5 rounded-inner border-0 shadow-lg"
                >
                  Discover Our Lineage
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Shape Decorations */}
        <div
          className="shape-mockup shape1 d-none d-xl-block"
          data-top="12%"
          data-left="-16%"
        >
          <img src="/assets/img/shape/shape_1.png" alt="sacred geometry" />
        </div>
        <div
          className="shape-mockup shape2 d-none d-xl-block"
          data-top="20%"
          data-left="-16%"
        >
          <img src="/assets/img/shape/shape_2.png" alt="sacred geometry" />
        </div>
        <div
          className="shape-mockup about-rating d-none d-xxl-block"
          data-bottom="50%"
          data-right="-20%"
        >
          <i className="fa-sharp fa-solid fa-star text-theme"></i>
          <span className="fw-bold">4.9k Trusted Seekers</span>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
