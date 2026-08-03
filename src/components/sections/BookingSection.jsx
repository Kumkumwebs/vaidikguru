import { useState } from 'react';

// BookingSection - matching original HTML (lines 959-1040)
const BookingSection = () => {
	const [formData, setFormData] = useState({
		destination: '',
		type: '',
		duration: '',
		category: '',
	});

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = e => {
		e.preventDefault();
		console.log('Booking form submitted:', formData);
	};

	return (
		<div className="booking-sec">
			<div className="container">
				<form onSubmit={handleSubmit} className="booking-form ajax-contact">
					<div className="input-wrap">
						<div className="row align-items-center justify-content-between">
							{/* Destination Field */}
							<div className="form-group col-md-6 col-lg-auto">
								<div className="icon">
									<i className="fa-light fa-route"></i>
								</div>
								<div className="search-input">
									<label>Destination</label>
									<select
										name="destination"
										className="form-select nice-select"
										value={formData.destination}
										onChange={handleChange}
									>
										<option value="" disabled>
											Select Destination
										</option>
										<option value="Australia">Australia</option>
										<option value="Dubai">Dubai</option>
										<option value="England">England</option>
										<option value="Sweden">Sweden</option>
										<option value="Thailand">Thailand</option>
										<option value="Egypt">Egypt</option>
										<option value="Saudi Arab">Saudi Arab</option>
										<option value="Switzerland">Switzerland</option>
										<option value="Scandinavia">Scandinavia</option>
										<option value="Western Europe">Western Europe</option>
										<option value="Indonesia">Indonesia</option>
										<option value="Italy">Italy</option>
									</select>
								</div>
							</div>

							{/* Type Field */}
							<div className="form-group col-md-6 col-lg-auto">
								<div className="icon">
									<i className="fa-regular fa-person-hiking"></i>
								</div>
								<div className="search-input">
									<label>Type</label>
									<select
										name="type"
										className="form-select nice-select"
										value={formData.type}
										onChange={handleChange}
									>
										<option value="" disabled>
											Adventure
										</option>
										<option value="Beach">Beach</option>
										<option value="Group Tour">Group Tour</option>
										<option value="Couple Tour">Couple Tour</option>
										<option value="Family Tour">Family Tour</option>
									</select>
								</div>
							</div>

							{/* Duration Field */}
							<div className="form-group col-md-6 col-lg-auto">
								<div className="icon">
									<i className="fa-light fa-clock"></i>
								</div>
								<div className="search-input">
									<label>Duration</label>
									<select
										name="duration"
										className="form-select nice-select"
										value={formData.duration}
										onChange={handleChange}
									>
										<option value="" disabled>
											Duration
										</option>
										<option value="1 days">1 days</option>
										<option value="2 days">2 days</option>
										<option value="3 days">3 days</option>
										<option value="4 days">4 days</option>
										<option value="5 days">5 days</option>
										<option value="6 days">6 days</option>
										<option value="7 days">7 days</option>
									</select>
								</div>
							</div>

							{/* Category Field */}
							<div className="form-group col-md-6 col-lg-auto">
								<div className="icon">
									<i className="fa-light fa-map-location-dot"></i>
								</div>
								<div className="search-input">
									<label>Tour Category</label>
									<select
										name="category"
										className="form-select nice-select"
										value={formData.category}
										onChange={handleChange}
									>
										<option value="" disabled>
											Luxury
										</option>
										<option value="Delux">Delux</option>
										<option value="Economy">Economy</option>
									</select>
								</div>
							</div>

							{/* Submit Button */}
							<div className="form-btn col-md-12 col-lg-auto">
								<button className="th-btn">
									<img src="/assets/img/icon/search.svg" alt="" />
									Search
								</button>
							</div>
						</div>
						<p className="form-messages mb-0 mt-3"></p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BookingSection;
