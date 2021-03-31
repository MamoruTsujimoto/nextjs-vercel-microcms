import React from 'react'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode;
}

export const Main = ({ children }: Props) => {
  return (
    <main className="lg:container lg:mx-auto pt-10">
      { children }
    </main>
  )
}
