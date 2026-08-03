import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserDetailsModal.css';
import { useStorage } from '../../context/StorageContext';
import AuthService from '../../services/authServices';

/**
 * UserDetailsModal — collect birth details before connecting
 * Props:
 *  - isOpen         boolean
 *  - onClose        fn
 *  - astrologer     { name, profile_img }
 *  - mode           'chat' | 'call'
 *  - onSubmit       fn(details)  -> proceeds to connect
 *  - onRequireLogin fn() -> called if the modal opens while the user
 *                    isn't logged in, so the parent can show the login
 *                    flow (e.g. LoginOTPModal). Birth details are tied
 *                    to the account, so we can't collect them pre-login.
 *  - initial        optional prefilled values (used as a fallback
 *                    while the saved profile is still loading)
 */
const UserDetailsModal = ({
  isOpen, onClose, astrologer = {}, mode = 'chat', onSubmit, onRequireLogin, initial = {},
}) => {
  const { isLoggedIn, user } = useStorage();

  const [form, setForm] = useState({
    name:       initial.name       || '',
    gender:     initial.gender     || '',
    dob:        initial.dob        || '',
    tob:        initial.tob        || '',
    birthPlace: initial.birthPlace || '',
  });
  const [errors, setErrors] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  // When the modal opens for a logged-in user, pull their previously
  // saved birth details from their account so they never have to
  // re-type them after a refresh or on a new device.
  useEffect(() => {
    if (!isOpen) return;

    if (!isLoggedIn) {
      // Not logged in — these details can't be tied to an account, so
      // hand off to the parent's login flow instead of collecting data
      // that would just be thrown away on refresh.
      onClose && onClose();
      onRequireLogin && onRequireLogin();
      return;
    }

    let cancelled = false;
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await AuthService.getProfile({
          number: user?.phone,
          country_code: user?.country_code || '91',
        });
        if (!cancelled && res?.success && res.profile) {
          const p = res.profile;
          setForm((f) => ({
            name:       p.name   || f.name,
            gender:     p.gender || f.gender,
            dob:        p.dob    || f.dob,
            tob:        p.tob    || f.tob,
            // backend field is `pob` (place of birth) — map it to birthPlace
            birthPlace: p.pob    || f.birthPlace,
          }));
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, [isOpen, isLoggedIn]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name = 'Please enter your name';
    if (!form.gender)            e.gender = 'Select gender';
    if (!form.dob)               e.dob = 'Date of birth is required';
    if (!form.birthPlace.trim()) e.birthPlace = 'Birth place is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      // Persist to the user's account — this is what actually solves
      // the "asks again after refresh" problem, since it's re-fetched
      // by the effect above the next time this modal opens, on any
      // device, as long as they're logged in.
      await AuthService.updateProfile(
        { number: user?.phone, country_code: user?.country_code || '91' },
        {
          name:   form.name,
          gender: form.gender,
          dob:    form.dob,
          tob:    form.tob,
          pob:    form.birthPlace, // map birthPlace -> pob for the backend
        }
      );
    } catch (err) {
      console.log(err);
      // Saving failed, but don't block them from continuing this
      // session — they'll just be asked again next time.
    } finally {
      setSaving(false);
    }

    onSubmit && onSubmit(form);
  };

  return (
    <AnimatePresence>
      {isOpen && isLoggedIn && (
        <motion.div className="ud-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div className="ud-box"
            initial={{ opacity: 0, scale: .94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .94, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={e => e.stopPropagation()}>

            <button className="ud-close" onClick={onClose}><i className="fas fa-times" /></button>

            {/* Header */}
            <div className="ud-head">
              <div className="ud-head-ico"><i className="fas fa-user-edit" /></div>
              <div>
                <div className="ud-title">Fill Your Details</div>
                <div className="ud-sub">
                  Share your birth details to start your {mode === 'call' ? 'call' : 'chat'} with{' '}
                  <strong>{astrologer.name || 'the astrologer'}</strong>
                </div>
              </div>
            </div>

            {loadingProfile ? (
              <div className="ud-loading">
                <i className="fas fa-spinner fa-spin" /> Loading your saved details…
              </div>
            ) : (
              <>
                {/* Form */}
                <div className="ud-form">

                  {/* Name */}
                  <div className="ud-field">
                    <label className="ud-label">Full Name <span>*</span></label>
                    <input
                      className={`ud-input${errors.name ? ' err' : ''}`}
                      type="text" placeholder="Enter your full name"
                      value={form.name} onChange={e => set('name', e.target.value)}
                    />
                    {errors.name && <span className="ud-err">{errors.name}</span>}
                  </div>

                  {/* Gender */}
                  <div className="ud-field">
                    <label className="ud-label">Gender <span>*</span></label>
                    <div className="ud-gender">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button key={g} type="button"
                          className={`ud-gender-btn${form.gender === g ? ' active' : ''}`}
                          onClick={() => set('gender', g)}>
                          <i className={`fas fa-${g === 'Male' ? 'mars' : g === 'Female' ? 'venus' : 'genderless'}`} />
                          {g}
                        </button>
                      ))}
                    </div>
                    {errors.gender && <span className="ud-err">{errors.gender}</span>}
                  </div>

                  {/* DOB + TOB */}
                  <div className="ud-row">
                    <div className="ud-field">
                      <label className="ud-label">Date of Birth <span>*</span></label>
                      <input
                        className={`ud-input${errors.dob ? ' err' : ''}`}
                        type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
                      />
                      {errors.dob && <span className="ud-err">{errors.dob}</span>}
                    </div>
                    <div className="ud-field">
                      <label className="ud-label">Time of Birth</label>
                      <input
                        className="ud-input"
                        type="time" value={form.tob} onChange={e => set('tob', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Birth Place */}
                  <div className="ud-field">
                    <label className="ud-label">Birth Place <span>*</span></label>
                    <input
                      className={`ud-input${errors.birthPlace ? ' err' : ''}`}
                      type="text" placeholder="City, State, Country"
                      value={form.birthPlace} onChange={e => set('birthPlace', e.target.value)}
                    />
                    {errors.birthPlace && <span className="ud-err">{errors.birthPlace}</span>}
                  </div>

                </div>

                {/* Submit */}
                <button className="ud-submit" onClick={handleSubmit} disabled={saving}>
                  <i className={`fas fa-${saving ? 'spinner fa-spin' : mode === 'call' ? 'phone' : 'comment-dots'}`} />
                  {saving ? 'Saving…' : `Start ${mode === 'call' ? 'Call' : 'Chat'}`}
                </button>

                <div className="ud-foot">
                  <i className="fas fa-lock" /> Your details are private & secure
                </div>
              </>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;