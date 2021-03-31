import { ReactNode } from 'react'
import { Footer } from '../components/footer'

type Props = {
  children: ReactNode;
}

export const Layout = ({children}: Props) => {
  return (
    <div className="main-layout">
      {children}
      <Footer />
    </div>
  )
}
