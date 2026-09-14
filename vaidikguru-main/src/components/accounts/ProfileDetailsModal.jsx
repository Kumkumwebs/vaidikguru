import { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import AuthService from '../../services/authServices';
import styles from './ProfileDetailsModal.module.css';

const ProfileDetailsModal = ({ isOpen, onClose, userData }) => {
    const { user, setUser } = useStorage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [profile, setProfile] = useState({
			country: '',
			country_code: '91',
			name: '',
			number: '',
			email: '',
			gender: '',
			dob: '',
			tob: '',
			pob: '',
			gotra: '',
			marital_status: '',
			profession: '',
			profile_for: '',
			refer_code_user: '',
		});

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Name validation - required, min 3 characters
        if (!profile.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (profile.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        // Email validation - required, valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!profile.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(profile.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Gender validation - required
        if (!profile.gender) {
            newErrors.gender = 'Please select your gender';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async () => {
        setError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await AuthService.updateProfile(
                { 
                    number: userData?.phone || user?.phone, 
                    country_code: userData?.country_code || user?.country_code || '91' 
                },
                profile
            );

            if (response.success) {
                setSuccessMessage(response.message || 'Profile updated successfully!');
                // Update user context with new name
                if (profile.name) {
                    setUser({ ...user, name: profile.name });
                }
                // Close modal after short delay to show success message
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setError(response.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
			// Modal is mandatory, cannot be closed without saving
		};

		if (!isOpen) return null;

		return (
			<>
				<div className={styles.backdrop} />

				<div className={styles.modalContainer}>
					<div className={styles.modal} onClick={e => e.stopPropagation()}>
						<div className={styles.topBorder}></div>

						<div className={styles.content}>
							<div className={styles.headerSection}>
								<div className={styles.iconContainer}>
									<div className={styles.iconGlow}></div>
									<div className={styles.icon}>
										<svg
											className={styles.iconSvg}
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
											strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
								</div>
								<h2 className={styles.title}>Complete Your Profile</h2>
								<p className={styles.subtitle}>Tell us a bit about yourself</p>
							</div>

							{error && <div className={styles.error}>{error}</div>}
							{successMessage && (
								<div className={styles.success}>{successMessage}</div>
							)}

							<div className={styles.formGrid}>
								{/* Name */}
								<div className={styles.formGroup}>
									<label className={styles.label}>
										Name <span className={styles.required}>*</span>
									</label>
									<input
										type="text"
										name="name"
										value={profile.name}
										onChange={handleInputChange}
										className={`${styles.input} ${
											errors.name ? styles.inputError : ''
										}`}
										placeholder="Enter your name"
										disabled={isLoading}
									/>
									{errors.name && (
										<span className={styles.fieldError}>{errors.name}</span>
									)}
								</div>

								{/* Email */}
								<div className={styles.formGroup}>
									<label className={styles.label}>
										Email <span className={styles.required}>*</span>
									</label>
									<input
										type="email"
										name="email"
										value={profile.email}
										onChange={handleInputChange}
										className={`${styles.input} ${
											errors.email ? styles.inputError : ''
										}`}
										placeholder="Enter your email"
										disabled={isLoading}
									/>
									{errors.email && (
										<span className={styles.fieldError}>{errors.email}</span>
									)}
								</div>

								{/* Gender */}
								<div className={styles.formGroup}>
									<label className={styles.label}>
										Gender <span className={styles.required}>*</span>
									</label>
									<select
										name="gender"
										value={profile.gender}
										onChange={handleInputChange}
										className={`${styles.input} ${styles.select} ${
											errors.gender ? styles.inputError : ''
										}`}
										disabled={isLoading}
									>
										<option value="">Select Gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
									{errors.gender && (
										<span className={styles.fieldError}>{errors.gender}</span>
									)}
								</div>

								{/* Date of Birth */}
								<div className={styles.formGroup}>
									<label className={styles.label}>Date of Birth</label>
									<input
										type="date"
										name="dob"
										value={profile.dob}
										onChange={handleInputChange}
										className={styles.input}
										disabled={isLoading}
									/>
								</div>

								{/* Gotra */}
								<div className={styles.formGroup}>
									<label className={styles.label}>Gotra</label>
									<input
										type="text"
										name="gotra"
										value={profile.gotra}
										onChange={handleInputChange}
										className={styles.input}
										placeholder="Enter your gotra"
										disabled={isLoading}
									/>
								</div>

								{/* Place of Birth */}
								<div className={styles.formGroup}>
									<label className={styles.label}>Place of Birth</label>
									<input
										type="text"
										name="pob"
										value={profile.pob}
										onChange={handleInputChange}
										className={styles.input}
										placeholder="Enter place of birth"
										disabled={isLoading}
									/>
								</div>

								{/* Profession */}
								<div className={styles.formGroupFull}>
									<label className={styles.label}>Profession</label>
									<input
										type="text"
										name="profession"
										value={profile.profession}
										onChange={handleInputChange}
										className={styles.input}
										placeholder="Enter your profession"
										disabled={isLoading}
									/>
								</div>
							</div>

							<div className={styles.actions}>
								<button
									onClick={handleSubmit}
									disabled={isLoading}
									className={styles.button}
								>
									{isLoading ? (
										<>
											<div className={styles.spinner}></div>
											Saving...
										</>
									) : (
										<>
											Save Profile
											<svg
												className={styles.buttonIcon}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</>
		);
};

export default ProfileDetailsModal;
