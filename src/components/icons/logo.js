import React from 'react';
import Image from 'next/image';
import logoWhite from '../../assets/images/logo-white.png';

const Logo = (props) => {
  return (
    <Image
      src={logoWhite}
      alt="Logo"
      width={150}
      height={100}
      {...props}
    />
  );
};

export default Logo;