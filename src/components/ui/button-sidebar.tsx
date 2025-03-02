import React from 'react';

interface ButtonSidebarProps {
  text: string;
  bgColor: string;
  textColor: string;
  bWidth: string | number;
  bHeight: string | number;
  borderRadius: string | number;
}

const ButtonSidebar: React.FC<ButtonSidebarProps> = ({
  text,
  bgColor,
  textColor,
  bWidth,
  bHeight,
  borderRadius,
}) => {
  const buttonStyle = {
    backgroundColor: bgColor,
    color: textColor,
    paddingTop: bHeight,
    paddingBottom: bHeight,
    paddingLeft: bWidth,
    paddingRight: bWidth,
    borderRadius: borderRadius,
  };

  return <button style={buttonStyle}>{text}</button>;
};

export default ButtonSidebar;
