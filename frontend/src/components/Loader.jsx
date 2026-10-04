import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

function Loader() {
  return (
    <Bouncy
      size="45"
      speed="1.75"
      color="black"
    />
  )
}

export default Loader