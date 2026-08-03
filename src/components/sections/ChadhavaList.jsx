import React from 'react';
import { Link } from "react-router-dom";

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "chadhava";

function ChadhavaList({ chadhava }) {
  if (!chadhava || chadhava.length === 0) return null;

  return (
    <section className="space">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12 col-lg-12">
            <div className="row gy-24 gx-24">

              {/* LIST */}
              {chadhava.map((item) => {
                const detailUrl = `/chadhava/${slugify(item.title)}/${item._id}`;

                return (
                  <div className="col-md-3" key={item._id}>
                    <div className="tour-box th-ani">

                      <div className="tour-box_img global-img" style={{ height: '155px', overflow: 'hidden' }}>
                        <img
                          src={item.chadhavaImage || 'assets/img/tour/tour_5_1.jpg'}
                          alt={item.title || 'chadhava'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'assets/img/tour/tour_5_1.jpg';
                          }}
                        />
                      </div>

                      <div className="tour-content">
                        <h3 className="box-title line-clamp-2">
                          <Link to={detailUrl}>
                            {item.title || 'Chadhava'}
                          </Link>
                        </h3>

                        <p className="line-clamp-2">{item.description || 'Chadhava'}</p>

                        <div className="tour-action">
                          {item.duration && (
                            <span>
                              <i className="fa-light fa-clock"></i>
                              {item.duration}
                            </span>
                          )}

                          <Link to={detailUrl} className="th-btn style4">
                            Detail View
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChadhavaList;