'use client'
import dynamic from 'next/dynamic'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { 
    ssr: false,
    loading: () => <p>🚀</p>  // optional fallback
  }
)

export default function Rocket_Animation() {
    return (
        <Player
            autoplay
            loop
            src="/Animation - 1749886549915.json" // path relative to public/
            style={{ height: '100px', width: '100px' }}
           
        />
    );
}
