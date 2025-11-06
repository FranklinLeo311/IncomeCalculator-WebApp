import React, { useState, useEffect,useRef } from "react";
import "../../styles/Login.css";
import InputField from "../../shared/accessories/InputField";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate,faEye, faEyeSlash,faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { handlepostapi } from "../../service/Loginservice";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
   const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
    const [emailBorder, setEmailBorder] = useState('');
    const [passwordBorder, setPasswordBorder] = useState('');
    const [captchaBorder, setCaptchaBorder] = useState('');
 
    const isValidEmail = (username) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(username);
    };

    
  const handleSubmit = async(e: React.FormEvent) => {
   e.preventDefault();

        // Validation logic
        if (!username) {
            setEmailBorder('1px solid #ff0000');
            return;
        } else if (!isValidEmail(username)) {
            setEmailBorder('1px solid #ff0000');
            setError('Enter a valid email address (e.g., xyz@ca-usa.com)');
            return;
        }

        if (!password) {
            setPasswordBorder('1px solid #ff0000');
            return;
        }

        // Validate captcha
        const captchaCode = sessionStorage.getItem('captchaCode');
        if (captcha !== captchaCode) {
            setError('Invalid captcha code. Please try again.');
            setCaptchaBorder('1px solid #ff0000');
            generateCaptcha(); // Assuming you have a function to regenerate captcha
            setCaptcha('');
            return;
        } else {
            setError('');
            setCaptchaBorder('');
        }
// try {
//   const obj={email:username,password:encrypt(password,7),errorMessage:""}
//     const response = await handlepostapi("/AuthenticatedUser", {
//       obj,
//     });
//     if (response.outStatus === "pass") {
//       const { isExist = false } = JSON.parse(response.outJSON);
//       return isExist;
//     }
//   } catch (error) {
//     console.error("Error in authenticate user ===> ", error);
//     return false;
//   }
        // Reset form and state after successful validation
        
        try {
  const obj={"email":username,"Password":encrypt(password,7),"errorMessage":""}
    const response = await handlepostapi("/AuthenticatedUser", obj
    );
    if (response.Status === "1") {
        navigate("/loans");
    }
  } catch (error) {
    console.error("Error in authenticate user ===> ", error);
    return false;
  }
        setUsername('');
        setPassword('');
        setCaptcha('');
        setEmailBorder('');
        setPasswordBorder('');
        setCaptchaBorder('');
  };

  
 const handleEmailBlur = () => {
        if (!username) {
            setEmailBorder('1px solid #ff0000');
            setError('Email is required');
        } else if (!isValidEmail(username)) {
            setEmailBorder('1px solid #ff0000');
            setError('Enter a valid email address');
        } else {
            setEmailBorder('');
            setError('');
        }
    };

    const handlePasswordBlur = () => {
        if (!password) {
            setPasswordBorder('1px solid #ff0000');
        } else {
            setPasswordBorder('');
        }
    };

    const handleCaptchaBlur = () => {
        if (!captcha) {
            setCaptchaBorder('1px solid #ff0000');
        } else {
            setCaptchaBorder('');
        }
    };
  const captchaCanvasRef = useRef(null);  // Reference to the canvas element
  const [captchaCode, setCaptchaCode] = useState("");  // State to store the generated captcha code

  // Function to generate the captcha
  const generateCaptcha = () => {
    const canvas = captchaCanvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define the string of characters that can be used in the captcha
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captchaString = "";

    // Character generation settings
    const minRotation = -45;
    const maxRotation = 45;
    const charSpacing = 30;
    const minFontSize = 20;
    const maxFontSize = 30;
    const rotationRange = maxRotation - minRotation;

    // Generate 6 random characters
    for (let i = 0; i < 6; i++) {
      const char = charSet.charAt(Math.floor(Math.random() * charSet.length));
      captchaString += char;

      // Set the font size and style
      ctx.font = `${minFontSize + Math.random() * (maxFontSize - minFontSize)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Set the random color
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

      // Apply a random rotation
      const rotation = minRotation + Math.random() * rotationRange;
      ctx.translate(20 + i * charSpacing, canvas.height / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.fillText(char, 0, 0);
      ctx.rotate(-rotation * Math.PI / 180);
      ctx.translate(-(20 + i * charSpacing), -canvas.height / 2);
    }

    // Store the captcha code in state (you can also store in sessionStorage if needed)
    setCaptchaCode(captchaString);
    sessionStorage.setItem("captchaCode", captchaString);  // Optionally store it in sessionStorage
  };

  // Generate captcha on initial render and on refresh
  useEffect(() => {
    generateCaptcha();
  }, []);  // Empty dependency array to run only once on mount
 
    const handleRefreshCaptcha = () => {
    generateCaptcha();
  };

    const encrypt = (text: string | any[], key: any) => {
    let encryptedText = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const encryptedChar = String.fromCharCode(char.charCodeAt(0) + key);
      encryptedText += encryptedChar;
    }
    return encryptedText;
  };

  return (
<div className="login">
  <div className="circle1"></div>
  <div className="circle2"></div>
  <div className="log_bg">
    {/* <img className="img1" src="/src/assets/shape.svg" width="100%" alt="image" /> */}
    {/* <img className="img2" src="/src/assets/shape1.svg" width="100%" alt="image" /> */}
    <div className="login-card">
      <img src="/src/assets/LoanDNA.png" alt="Logo" className="logo" />
      <h2 className="login-title">Log in</h2>
   {error && <div className="alert alert-danger" id="error">   <FontAwesomeIcon icon={faTriangleExclamation} />{error}</div>}
      <form onSubmit={handleSubmit}>
        <InputField
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.value)}
          placeholder="Username"
          size="lg"
           onBlur={handleEmailBlur}
                        style={{ border: emailBorder }}
        />
        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                        style={{ border: passwordBorder }}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
             <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        <a href="#" className="forgot-link">
          Forgot password?
        </a>
        <label className="captcha-label">Captcha</label>
        <div className="captcha-field">
          <div className="col-6 captcha_sec">
             <canvas ref={captchaCanvasRef} width="200" height="60"></canvas>
      <span id="refresh-captcha" onClick={handleRefreshCaptcha}>
                <FontAwesomeIcon icon={faArrowsRotate} />
            </span>
          </div>
          
          <input
            type="text"
            placeholder="Enter Captcha"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
                onBlur={handleCaptchaBlur}
                        style={{ border: captchaBorder }}
          />
        </div>             
        <button type="submit" className="login-btn">
          Login <span className="arrow">→</span>
        </button>
      </form>
    </div>
  </div>
</div>

  );
};
 
export default LoginPage;