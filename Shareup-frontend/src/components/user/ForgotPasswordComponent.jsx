import React, { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import settings from '../../services/Settings';

function ForgotPasswordComponent(props){

    const history = useHistory();
   
    const [mailSent, setMailSent] = useState(0)
    const [newPass, setNewPass] = useState('')
    const [email, setEmail] = useState('')
    const [verifiyCodeInput, setVerifiyCodeInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
  
      

    // email input listener
    const emailInputListener = (event) => {
        setEmail(event.target.value)
    }

    // new password input listener
    const newPassInputListener = (event) => {
        setNewPass(event.target.value)
    }

    // Step 1: request reset token
    const sendResetPasswordMailFunc = async () => {
        setError('');
        if(!email){
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${settings.apiUrl}/api/v1/users/forgot-password`, { email });
            const token = res?.data?.data?.resetToken;
            if (token) {
                alert(`Dev reset code: ${token}`);
            } else {
                alert('If the account exists, reset instructions have been sent.');
            }
            setMailSent(1);
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || 'An error has occurred';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

        const goBackToLogin = () => {
            if (typeof props?.stateChanger === 'function') {
                props.stateChanger();
                return;
            }
            history.push('/', { showComponent: 'login' });
        };

    // verification code input listener
    const verifiyCodeInputListener = (event) => {
        setVerifiyCodeInput(event.target.value)
    }

    // Step 2: submit token + new password
    const resetPasswordFunction = async () => {
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }
        if (!verifiyCodeInput) {
            setError('Reset code is required');
            return;
        }
        if (!newPass || newPass.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${settings.apiUrl}/api/v1/users/reset-password`, {
                email,
                token: verifiyCodeInput,
                newPassword: newPass,
            });
            alert('Password updated successfully. Please login.');
            goBackToLogin();
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || 'An error has occurred';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

   
        if(mailSent===0){
            return (
                <div className="frgtPwd">
                    <h2>Forgot Your Password?</h2>
                    <div className="optionText">Please enter your email and get your account right back</div>
                    {error ? <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div> : null}
                    <div className="form-group">
                       
                        <input className="form-input" type="text" placeholder="Enter your email" onChange= {emailInputListener}/>
                    </div>
                    <div className="optionText" onClick={goBackToLogin}>Remembered your password?</div>
                    <div className="submit-btns-log">
                        <button className="mtr-btn" onClick={sendResetPasswordMailFunc} disabled={loading}>
                            <span>{loading ? 'Sending…' : 'Send mail'}</span>
                        </button>
                    </div>
                   
                </div>
            )
        }else{
            return(
                <div>
                    <h2>Please enter the code to reset your password.</h2>
                    {error ? <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div> : null}
                    <div className="inputWrapperDiv">
                        <i className="fas fa-lock" style={{color:"#4fb5ff", marginTop:"6px", marginLeft:"8px"}}></i>
                        <input className="inputClass" type="password" placeholder="Enter your new password" onChange= {newPassInputListener}/>
                    </div>
                    <div className="inputWrapperDiv">
                        <i className="fas fa-lock" style={{color:"#4fb5ff", marginTop:"6px", marginLeft:"8px"}}></i>
                        <input className="inputClass" type="text" placeholder="Enter the code" onChange= {verifiyCodeInputListener}/>
                    </div>
                    <button className="loginButton" onClick={resetPasswordFunction} disabled={loading} style={{width:"220px"}}>
                        {loading ? 'Updating…' : 'Reset password'}
                    </button>
                    <div className="optionText" onClick={goBackToLogin} style={{ marginTop: '10px' }}>Back to login</div>
                </div>
            )
        }
    }

export default ForgotPasswordComponent;
