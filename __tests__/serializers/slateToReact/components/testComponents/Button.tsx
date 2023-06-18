import React, { FC } from 'react';

interface IButton {
  onClick?: () => void
  text: string
}

const Button: FC<IButton> = ({
  onClick,
  text,
}) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
}

export default Button;
