import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

function MeetWithOurAstrologerScrollable() {
  return (
    <section
      className="team-area3 position-relative bg-top-center space"
      style={{ backgroundImage: "url(assets/img/bg/team_bg_2.jpg)" }}
    >
      <div className="container z-index-common">
        <div className="title-area text-center">
          {/* <span className="sub-title">Meet with Guide</span> */}
          <h2 className="sec-title">Meet with our Astrologers</h2>
        </div>

        <div className="slider-area">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            // pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="teamSlider3"
          >

            {[
              {
                name: 'Michel Smith',
                img1: 'assets/img/team/team_img_1.jpg',
                img2: 'assets/img/team/team_1_1.jpg',
              },
              {
                name: 'Janny Willson',
                img1: 'assets/img/team/team_img_2.jpg',
                img2: 'assets/img/team/team_1_2.jpg',
              },
              {
                name: 'Jacob Jones',
                img1: 'assets/img/team/team_img_3.jpg',
                img2: 'assets/img/team/team_1_3.jpg',
              },
              {
                name: 'Maria Prova',
                img1: 'assets/img/team/team_img_1.jpg',
                img2: 'assets/img/team/team_1_4.jpg',
              },
              {
                name: 'Rebeka Maliha',
                img1: 'assets/img/team/team_img_2.jpg',
                img2: 'assets/img/team/team_1_5.jpg',
              },
              {
                name: 'Alif Mahmud',
                img1: 'assets/img/team/team_img_3.jpg',
                img2: 'assets/img/team/team_1_6.jpg',
              },
              {
                name: 'Guy Hawkins',
                img1: 'assets/img/team/team_img_1.jpg',
                img2: 'assets/img/team/team_1_3.jpg',
              },
              {
                name: 'Jenny Wilson',
                img1: 'assets/img/team/team_img_2.jpg',
                img2: 'assets/img/team/team_1_4.jpg',
              },
            ].map((item, index) => (
              <SwiperSlide key={index}>
                <div className="th-team team-grid">
                  <div className="team-img">
                    <img src={item.img1} alt={item.name} />
                  </div>
                  <div className="team-img2">
                    <img src={item.img2} alt={item.name} />
                  </div>
                  <div className="team-content">
                    <div className="media-body">
                      <h3 className="box-title">
                        <a href="tour-guider-details.html">{item.name}</a>
                      </h3>
                      <span className="team-desig">Tourist Guide</span>

                      <div className="th-social">
                        <a href="https://facebook.com/" target="_blank" rel="noreferrer">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                          <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://youtube.com/" target="_blank" rel="noreferrer">
                          <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://instagram.com/" target="_blank" rel="noreferrer">
                          <i className="fab fa-instagram"></i>
                        </a>
                      </div>

                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default MeetWithOurAstrologerScrollable;
