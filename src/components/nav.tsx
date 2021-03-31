import React from 'react'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode;
}

export const Nav = ({ children }: Props) => {
  return (
    <nav className="lg:container lg:mx-auto pt-2">
      { children }
    </nav>
  )
}
