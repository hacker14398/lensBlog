import { FC } from 'react'

import SEO from './utils/SEO'

const Loading: FC = () => {
  return (
    <div className="flex flex-grow justify-center items-center h-screen">
      <SEO />
      <span className="text-5xl gradient-text">🍀</span>
    </div>
  )
}

export default Loading
