import React, { FC, ReactNode } from 'react';

interface IButton {
  onClick?: () => void
  children?: ReactNode
}

const Button: FC<IButton> = ({
  onClick,
  children,
}) => {
  return (
    <button onClick={onClick}>{children}</button>
  );
}

export default Button;
