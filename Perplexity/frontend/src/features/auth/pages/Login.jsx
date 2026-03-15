import React, { useState } from 'react'
import './auth.css'
import { useNavigate,Link } from 'react-router-dom'
import { useAuth } from '../hook/useAuth.js'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const {handleLoginUser} = useAuth()

  const user = useSelector((state)=> state.auth.user)
  const loading = useSelector((state)=> state.auth.loading)

 

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log('Login Data:', formData)

    await handleLoginUser(formData)
    navigate("/")
    
  }
   if (!loading && user) {
    return <Navigate to="/"/>
  }

  return (
    <div className="auth-container login-bg">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
                className="form-input"
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
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="/register" className="auth-link">Create one</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login