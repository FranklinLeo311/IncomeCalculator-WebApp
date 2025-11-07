import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    if (field === 'Oldpassword') {
      setOldPasswordVisible(!oldPasswordVisible);
    } else if (field === 'Newpassword') {
      setNewPasswordVisible(!newPasswordVisible);
    } else if (field === 'ConfirmNewpassword') {
      setConfirmNewPasswordVisible(!confirmNewPasswordVisible);
    }
  };

  const updatePassword = () => {
    // Add your password update logic here
    alert('Password updated successfully');
    onClose();  // Close the modal after update
  };

  return (
    <div className="modal fade show" id="change-password" tabIndex={-1} aria-labelledby="change-password" aria-hidden="true" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Change Password</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Please change the password to proceed</p>
            {/* Modal Content Here */}
            <div className="form-group mb-3 input_sec">
              <label htmlFor="Oldpassword">Current Password</label>
              <div className="input-group">
                <input
                  type={oldPasswordVisible ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter Password"
                  id="Oldpassword"
                  autoComplete="off"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text" id="Oldpassword-eye-icon" onClick={() => togglePasswordVisibility('Oldpassword')}>
                    <i className={`fa ${oldPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="form-group mb-3 input_sec">
              <label htmlFor="Newpassword">New Password</label>
              <div className="input-group">
                <input
                  type={newPasswordVisible ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter Password"
                  id="Newpassword"
                  autoComplete="off"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text" id="Newpassword-eye-icon" onClick={() => togglePasswordVisibility('Newpassword')}>
                    <i className={`fa ${newPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="form-group mb-3 input_sec">
              <label htmlFor="ConfirmNewpassword">Confirm New Password</label>
              <div className="input-group">
                <input
                  type={confirmNewPasswordVisible ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter Password"
                  id="ConfirmNewpassword"
                  autoComplete="off"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text" id="ConfirmNewpassword-eye-icon" onClick={() => togglePasswordVisibility('ConfirmNewpassword')}>
                    <i className={`fa ${confirmNewPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={updatePassword}>
              Update
            </button>
            <button type="button" className="btn btn-warning" onClick={onClose}>
              Back To Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
