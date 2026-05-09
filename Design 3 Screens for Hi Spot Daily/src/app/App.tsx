import { useState } from 'react';
import { DailyCheckIn } from './components/DailyCheckIn';
import { MapSpot } from './components/MapSpot';
import { CommunityTip } from './components/CommunityTip';
import { Home, MapPin, Users } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'checkin' | 'map' | 'community'>('checkin');

  return (
    <div className="size-full bg-[var(--spot-gray-50)]">
      {/* Mobile Container */}
      <div className="max-w-[390px] mx-auto h-full bg-white shadow-2xl relative flex flex-col">
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentScreen === 'checkin' && (
            <DailyCheckIn onComplete={() => setCurrentScreen('map')} />
          )}
          {currentScreen === 'map' && <MapSpot />}
          {currentScreen === 'community' && <CommunityTip />}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-t-2 border-[var(--spot-gray-200)] px-2 py-2.5 flex items-center justify-around flex-shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => setCurrentScreen('checkin')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              currentScreen === 'checkin'
                ? 'text-[var(--spot-green)]'
                : 'text-[var(--spot-gray-600)] hover:text-[var(--spot-gray-900)]'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentScreen === 'checkin' ? 'bg-[var(--spot-green-light)]' : ''
            }`}>
              <Home className={`w-4.5 h-4.5 flex-shrink-0 ${currentScreen === 'checkin' ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-medium whitespace-nowrap">체크인</span>
          </button>
          <button
            onClick={() => setCurrentScreen('map')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              currentScreen === 'map'
                ? 'text-[var(--spot-blue)]'
                : 'text-[var(--spot-gray-600)] hover:text-[var(--spot-gray-900)]'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentScreen === 'map' ? 'bg-[var(--spot-blue-light)]' : ''
            }`}>
              <MapPin className={`w-4.5 h-4.5 flex-shrink-0 ${currentScreen === 'map' ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-medium whitespace-nowrap">지도</span>
          </button>
          <button
            onClick={() => setCurrentScreen('community')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              currentScreen === 'community'
                ? 'text-[var(--spot-yellow)]'
                : 'text-[var(--spot-gray-600)] hover:text-[var(--spot-gray-900)]'
            }`}
            style={{
              color: currentScreen === 'community' ? '#ea8c00' : undefined
            }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentScreen === 'community' ? 'bg-[var(--spot-yellow)]/20' : ''
            }`}>
              <Users className={`w-4.5 h-4.5 flex-shrink-0 ${currentScreen === 'community' ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-medium whitespace-nowrap">커뮤니티</span>
          </button>
        </div>
      </div>
    </div>
  );
}