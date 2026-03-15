import React, { useState } from 'react'
import './auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Calculate password strength
    if (name === 'password') {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[A-Z]/.test(value)) strength++
      if (/[0-9]/.test(value)) strength++
      if (/[!@#$%^&*]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register Data:', formData)
    // Add your register logic here
  }

  const getStrengthLabel = () => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    return labels[passwordStrength - 1] || 'Enter password'
  }

  const getStrengthColor = () => {
    const colors = ['#ff4444', '#ff8844', '#ffbb44', '#88dd44', '#44ff44']
    return colors[passwordStrength - 1] || '#ccc'
  }

  return (
    <div className="auth-container register-bg">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Join Us Today</h1>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <span className="label-icon">👤</span> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="form-input"
              minLength="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-icon">✉️</span> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span className="label-icon">🔒</span> Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="form-input"
                minLength="8"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <p className="strength-label">Strength: <span style={{ color: getStrengthColor() }}>{getStrengthLabel()}</span></p>
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      backgroundColor: getStrengthColor()
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="form-options">
            <label className="terms-checkbox">
              <input type="checkbox" required />
              I agree to the Terms and Conditions
            </label>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login" className="auth-link">Sign in</a></p>
        </div>
      </div>
    </div>
  )
}

export default Register