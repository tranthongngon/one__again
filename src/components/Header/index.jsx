import React from 'react';
import Logo from '../../assets/images/one_again.png';
import './style.css'

export default function Header() {
  return (
    <header className='site-header'>
      <div className='container'>
        <div className='site-header-wrap'>
          <div className='site-logo'>
            <img src={Logo} alt="logo-one-again" />
          </div>
        </div>
      </div>
    </header>
  )
}
