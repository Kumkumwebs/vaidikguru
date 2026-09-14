import React, { useState, useEffect } from 'react';
import ChadhavaService from '../../services/chadhavaServices';
import PujaService from '../../services/pujaServices';
import apiService from '../../services/apiServices';
import { useNavigate,Link } from "react-router-dom";
function PujaList({puja}) {
    if(!puja) return null;
   
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
    

    return (
        <section className="space">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-12 col-lg-12">
                        <div className="row gy-24 gx-24">

                            {/* LIST */}
                            {puja.map((item, index) => (
                                <div className="col-md-3" key={index}>
                                    <div className="tour-box th-ani">

                                        <div className="tour-box_img global-img" style={{ height: '155px', overflow: 'hidden' }}>
                                            <img
                                                src={item.pujaImage || 'assets/img/tour/tour_5_1.jpg'}
                                                alt={item.title || 'chadhava'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.src = 'assets/img/tour/tour_5_1.jpg';
                                                }}
                                            />

                                        </div>

                                        <div className="tour-content">
                                            <h3 className="box-title line-clamp-2">
                                               <Link to={`/puja/${slugify(item.title)}/${item._id}`}>
                                                    {item.title || 'Puja'}
                                                </Link>
                                            </h3>

                                            <p className="line-clamp-2">  {item.purposeOfPooja || 'Chadhava'}</p>



                                            <div className="tour-action">
                                                {item.pujaDatetime && (
                                                    <span>
                                                        <i className="fa-light fa-clock"></i>
                                                        {apiService.formatDate(item.pujaDatetime)}
                                                    </span>
                                                )}

                                                <Link to={`/puja/${slugify(item.title)}/${item._id}`}
                                                    className="th-btn style4">
                                                
                                                    Book Now
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}

                           

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PujaList;
