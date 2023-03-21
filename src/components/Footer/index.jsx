import React from 'react';
import Logo from '../../assets/images/logo.png';
import './style.css'

export default function Footer() {
  return (
    <footer className='site-footer'>
      <div className='container'>
        <div className='site-footer-wrap'>
          <div className='site-logo'>
            <img src={Logo} alt="logo-footer" />
          </div>
          <h3>One__again © 2023. Made with ☕ by Ngoontt</h3>
        </div>
      </div>
    </footer>
  )
}
