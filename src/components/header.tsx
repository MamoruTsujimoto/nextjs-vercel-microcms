import React from 'react'
import Link from 'next/link'

type Props = {
  title?: string;
}

export const Header = ({title}: Props) => {
  return (
    <header className="text-gray-100 bg-gray-900 body-font shadow w-full p-10">
      <Link href={'/'}>
        <a><h1 className="text-lg">{title}</h1></a>
      </Link>
    </header>
  )
}
