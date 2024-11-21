import { useState, useEffect } from 'react'
import { Power } from 'lucide-react'

type ConnectionState = 'connected' | 'connecting' | 'disconnected'

export default function UIButton() {
  const [state, setState] = useState<ConnectionState>('disconnected')
  const [connectedTime, setConnectedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (state === 'connected') {
      interval = setInterval(() => {
        setConnectedTime((prev) => prev + 1)
      }, 1000)
    } else {
      setConnectedTime(0)
    }
    return () => clearInterval(interval)
  }, [state])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleClick = async () => {
    if (state === 'disconnected') {
      setState('connecting')

      try {
        // Trigger the backend function to start Xray
        console.log('Requesting Xray start...');
        // @ts-ignore
        await window.electron.startXray();
        console.log('Xray started successfully.');

        setTimeout(() => setState('connected'), 2000); // Simulate connection delay
        
      } catch (error) {
        console.error('Failed to start Xray:', error);
        setState('disconnected'); // Reset state on failure
      }

    } else if (state === 'connected') {
      setState('disconnected')

      // @ts-ignore
      await window.electron.stopXray();
      console.log('Xray terminate successfully.');

    }
  }

  const getStateColors = () => {
    switch (state) {
      case 'connected':
        return 'text-emerald-500 from-emerald-500/20 to-emerald-500/0'
      case 'connecting':
        return 'text-amber-500 from-amber-500/20 to-amber-500/0'
      default:
        return 'text-gray-400 from-gray-400/20 to-gray-400/0'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
   
      <div className="w-64 flex flex-col items-center gap-6">
        <div className="relative">
          <button
            onClick={handleClick}
            className={`relative z-10 w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center transition-colors ${getStateColors()}`}
          >
            <Power className="w-12 h-12" />
          </button>
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-t ${getStateColors()} animate-[spin_3s_linear_infinite]`}
          >
            <div className="absolute inset-1 rounded-full bg-gray-950" />
          </div>
          <div className="absolute inset-0 rounded-full">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-0.5 h-2 ${getStateColors()} opacity-20`}
                style={{
                  transform: `rotate(${i * 6}deg)`,
                  transformOrigin: '50% 50%',
                  left: 'calc(50% - 1px)',
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className={getStateColors()}>
            {state === 'connected' && 'Connected'}
            {state === 'connecting' && 'Connecting...'}
            {state === 'disconnected' && "Not Connected"}
          </div>
          
          {state === 'connected' && (
            <div className="text-gray-400 font-mono text-sm">{formatTime(connectedTime)}</div>
          )}
         
        </div>
      </div>
    </div>
  )
}