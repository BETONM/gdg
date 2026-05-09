'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Trophy, Sparkles, Navigation, Handshake, CheckCircle2 } from 'lucide-react';
import { Mission, Activity } from '@/types/mission';
import { cn } from '@/components/ui/utils';
import { useAuth } from '@/hooks/useAuth';
import { fetchNearbyActivities, saveActivity, sendCollaborationRequest } from '@/lib/missionStore';

interface MapSpotProps {
  mission?: Mission;
  onComplete?: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initMap: () => void;
  }
}

const DEFAULT_LOCATION = { lat: 37.5665, lng: 126.978 };

export function MapSpot({ mission, onComplete }: MapSpotProps) {
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activityMarkersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);

  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [mapReady, setMapReady] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [requestingIds, setRequestingIds] = useState<Set<string>>(new Set());

  // 1. Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Location denied, using default')
      );
    }
  }, []);

  // 2. Load Google Maps Script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || window.google?.maps) {
        setMapReady(true);
        return;
    }

    if (document.getElementById('google-maps-script')) {
      return;
    }

    window.initMap = () => setMapReady(true);

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=marker`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // 3. Initialize Map
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps || mapInstance.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      mapId: 'DEMO_MAP_ID', // Advanced markers require a mapId
      disableDefaultUI: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      ],
    });

    // Add user marker using DOM element for circle
    const dot = document.createElement('div');
    dot.style.minWidth = '24px';
    dot.style.height = '20px';
    dot.style.padding = '0 6px';
    dot.style.backgroundColor = '#4285f4';
    dot.style.borderRadius = '12px';
    dot.style.border = '2px solid white';
    dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    dot.style.display = 'flex';
    dot.style.alignItems = 'center';
    dot.style.justifyContent = 'center';
    dot.style.color = 'white';
    dot.style.fontSize = '10px';
    dot.style.fontWeight = 'bold';
    dot.innerText = '1/5';

    userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        position: userLocation,
        map: mapInstance.current,
        content: dot,
    });
  }, [mapReady]);

  // 3.5. Update map center and user marker when GPS resolves
  useEffect(() => {
    if (mapInstance.current && userMarkerRef.current && userLocation !== DEFAULT_LOCATION) {
      userMarkerRef.current.position = userLocation;
      mapInstance.current.panTo(userLocation);
    }
  }, [userLocation]);

  // 4. Fetch Activities (Other users' footprints)
  useEffect(() => {
    if (!mapReady || !userLocation) return;
    const loadActivities = async () => {
      setLoading(true);
      try {
        const data = await fetchNearbyActivities(userLocation);
        setActivities(data);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, [mapReady, userLocation]);

  // 5. Update Activity Markers
  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps?.marker) return;

    activityMarkersRef.current.forEach(m => { m.map = null; });
    activityMarkersRef.current = [];

    const infoWindow = new window.google.maps.InfoWindow();

    activities.forEach((activity, index) => {
      const displayId = activity.id || String(index);
      const isSelected = selectedActivityId === displayId;
      const isMine = activity.userId === user?.uid;
      const color = isMine ? '#34a853' : '#8b5cf6';
      const scale = isSelected ? 12 : 8;

      const dot = document.createElement('div');
      dot.style.minWidth = `${scale * 2.5}px`;
      dot.style.height = `${scale * 2}px`;
      dot.style.padding = '0 6px';
      dot.style.backgroundColor = color;
      dot.style.borderRadius = '12px';
      dot.style.border = '2px solid white';
      dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      dot.style.opacity = '0.9';
      dot.style.display = 'flex';
      dot.style.alignItems = 'center';
      dot.style.justifyContent = 'center';
      dot.style.color = 'white';
      dot.style.fontSize = isSelected ? '12px' : '10px';
      dot.style.fontWeight = 'bold';
      dot.innerText = `${activity.participantCount}/${activity.maxParticipants}`;

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat: activity.lat, lng: activity.lng },
        map: mapInstance.current,
        content: dot,
        zIndex: isSelected ? 100 : 5,
      });

      marker.addListener('click', () => {
        const displayId = activity.id || String(index);
        setSelectedActivityId(displayId);
        mapInstance.current?.panTo({ lat: activity.lat, lng: activity.lng });

        infoWindow.setContent(`
          <div style="padding: 4px; color: #333;">
            <p style="font-size: 10px; font-weight: bold; color: ${activity.userId === user?.uid ? '#34a853' : '#8b5cf6'}; margin-bottom: 2px;">
              ${activity.userId === user?.uid ? '나의 발자국 👣' : '누군가의 발자국 👣'}
            </p>
            <p style="font-size: 12px; margin: 0; font-weight: 600;">${activity.missionTitle}</p>
            <p style="font-size: 10px; margin-top: 4px; color: #666;">👥 참여 ${activity.participantCount}/${activity.maxParticipants}명</p>
          </div>
        `);
        infoWindow.open(mapInstance.current, marker);
      });

      activityMarkersRef.current.push(marker);
    });
  }, [activities, selectedActivityId, user?.uid]);

  const toggleStep = (stepId: number) => {
    setCheckedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleRegisterMyFootprint = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!mission) {
      alert('체크인을 통해 미션을 먼저 받아주세요!');
      return;
    }
    setIsRegistering(true);
    await saveActivity(user.uid, mission, userLocation);
    
    setActivities(prev => [{
      userId: user.uid,
      missionTitle: mission.title,
      lifeArea: mission.lifeArea,
      lat: userLocation.lat,
      lng: userLocation.lng,
      participantCount: 1,
      maxParticipants: 5,
      createdAt: new Date(),
    }, ...prev]);
    
    setIsRegistering(false);
    alert('현재 위치에 내 미션 발자국을 남겼습니다! 👣');
  };

  const handlePoke = async (e: React.MouseEvent, activity: Activity) => {
    e.stopPropagation();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!activity.id) return;

    setRequestingIds(prev => new Set(prev).add(activity.id!));
    await sendCollaborationRequest(user.uid, activity.userId, activity.id);

    // 로컬 state에서 해당 activity의 participantCount를 즉시 +1 반영
    setActivities(prev => prev.map(a =>
      a.id === activity.id
        ? { ...a, participantCount: Math.min(a.participantCount + 1, a.maxParticipants) }
        : a
    ));

    alert('같이 미션하자는 요청을 보냈습니다! 🤝');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spot-yellow)]/10 via-white to-[var(--spot-green-light)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--spot-green)] via-[var(--spot-blue)] to-[var(--spot-yellow)] px-5 pt-safe pb-4 sticky top-0 z-10 flex justify-between items-end">
        <div>
          <h1 className="text-lg font-semibold text-white drop-shadow">소셜 매핑</h1>
          <p className="text-xs text-white/90 mt-0.5">주변 사람들은 어떤 미션을 하고 있을까요?</p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4 pb-24">
        
        {/* Register My Footprint Button */}
        <button
          onClick={handleRegisterMyFootprint}
          disabled={isRegistering}
          className="w-full py-4 bg-white border-2 border-[var(--spot-blue)] text-[var(--spot-blue)] rounded-xl text-sm font-bold shadow-md hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isRegistering ? (
            <div className="w-5 h-5 border-2 border-[var(--spot-blue)] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              내 위치에 발자국 남기기
            </>
          )}
        </button>

        {/* Map Area */}
        <div className="bg-white rounded-2xl border-l-4 border-[var(--spot-blue)] shadow-md overflow-hidden relative">
          <div className="p-3 border-b border-[var(--spot-gray-200)] bg-[var(--spot-blue-light)] flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[var(--spot-blue)]" />
                <span className="text-sm font-bold text-[var(--spot-gray-900)]">
                    {loading ? '불러오는 중...' : `주변 발자국 ${activities.length}개 발견`}
                </span>
            </div>
            <span className="text-[10px] font-bold text-[var(--spot-blue)] uppercase tracking-wider">2km Radius</span>
          </div>

          <div ref={mapRef} className="h-64 w-full bg-[var(--spot-gray-100)]" />
          
          {loading && (
            <div className="absolute inset-0 top-11 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-[var(--spot-blue)] border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-[10px] font-bold text-[var(--spot-gray-600)]">주변 발자국 찾는 중</p>
            </div>
          )}
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const displayId = activity.id || String(index);
            const isSelected = selectedActivityId === displayId;
            const isMine = activity.userId === user?.uid;
            const isRequesting = activity.id ? requestingIds.has(activity.id) : false;

            return (
              <div
                key={displayId}
                className={cn(
                  "bg-white rounded-xl border-l-4 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group",
                  isSelected ? "border-[var(--spot-blue)] bg-blue-50/50" : (isMine ? "border-[var(--spot-green)]" : "border-purple-400")
                )}
              >
                <div 
                  onClick={() => {
                    setSelectedActivityId(isSelected ? null : displayId);
                    mapInstance.current?.panTo({ lat: activity.lat, lng: activity.lng });
                    mapInstance.current?.setZoom(16);
                  }}
                  className="flex items-start gap-3"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border-2 group-hover:scale-105 transition-transform",
                    isMine 
                      ? "bg-gradient-to-br from-[var(--spot-green-light)] to-white border-[var(--spot-green)]"
                      : "bg-gradient-to-br from-purple-100 to-white border-purple-400"
                  )}>
                    <span className={cn(
                      "text-sm font-bold",
                      isMine ? "text-[var(--spot-green)]" : "text-purple-600"
                    )}>
                      {isMine ? '나' : <Handshake className="w-5 h-5" />}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[var(--spot-gray-900)] truncate">
                        {activity.missionTitle}
                      </h4>
                      <span className="text-[10px] text-[var(--spot-gray-500)] whitespace-nowrap">
                        {activity.createdAt ? new Date(activity.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '방금 전'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--spot-gray-600)] truncate">
                      {isMine ? '내가 등록한 미션이에요' : '누군가 이 미션을 하고 있어요!'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex -space-x-1">
                        {Array.from({ length: activity.participantCount }).map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 border border-white" />
                        ))}
                        {Array.from({ length: activity.maxParticipants - activity.participantCount }).map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-full bg-gray-200 border border-white" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--spot-gray-500)]">
                        {activity.participantCount}/{activity.maxParticipants}
                      </span>
                      {activity.participantCount >= activity.maxParticipants && (
                        <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">FULL</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collaboration Request Button */}
                {isSelected && !isMine && activity.id && (
                  <div className="mt-4 pt-3 border-t border-[var(--spot-gray-200)] animate-in slide-in-from-top-2 duration-200">
                    <button
                      disabled={isRequesting || activity.participantCount >= activity.maxParticipants}
                      onClick={(e) => handlePoke(e, activity)}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {activity.participantCount >= activity.maxParticipants ? '모집 완료 ✅' : isRequesting ? '요청 완료됨' : (
                        <>
                          <Handshake className="w-4 h-4" />
                          이 유저에게 같이 하자고 찌르기 ({activity.participantCount}/{activity.maxParticipants})
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-[var(--spot-gray-500)] text-center mt-2">
                      {activity.participantCount >= activity.maxParticipants
                        ? '이 미션은 인원이 가득 찼습니다.'
                        : '상대방에게 미션 함께하기 요청을 보냅니다.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {activities.length === 0 && !loading && (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-[var(--spot-gray-200)]">
              <Sparkles className="w-8 h-8 text-[var(--spot-gray-400)] mx-auto mb-2" />
              <p className="text-sm font-bold text-[var(--spot-gray-700)]">아직 주변에 발자국이 없어요</p>
              <p className="text-xs text-[var(--spot-gray-500)] mt-1">가장 먼저 미션 발자국을 남겨보세요!</p>
            </div>
          )}
        </div>

        {/* Mission Checklist */}
        {!isCompleted && mission && (
          <div className="bg-white rounded-2xl border-l-4 border-[var(--spot-yellow)] shadow-lg p-5">
            <h3 className="text-sm font-bold text-[var(--spot-gray-900)] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--spot-yellow)]" />
              내 미션 체크리스트
            </h3>
            <div className="space-y-3 mb-5">
              {mission.steps.map((step, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkedSteps.includes(idx)}
                    onChange={() => toggleStep(idx)}
                    className="w-5 h-5 rounded-md border-2 border-[var(--spot-gray-300)] text-[var(--spot-green)] focus:ring-[var(--spot-green)] cursor-pointer mt-0.5"
                  />
                  <span className={cn(
                      "text-sm transition-all",
                      checkedSteps.includes(idx) ? "text-[var(--spot-gray-400)] line-through" : "text-[var(--spot-gray-900)] font-medium"
                  )}>
                    {step}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleComplete}
              disabled={checkedSteps.length < mission.steps.length}
              className="w-full py-4 bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] text-white rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              미션 완료하고 포인트 받기
            </button>
          </div>
        )}

        {/* Completion UI */}
        {isCompleted && mission && (
          <div className="bg-white rounded-2xl border-l-4 border-[var(--spot-green)] shadow-xl p-6 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--spot-green)] to-[var(--spot-blue)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-black text-[var(--spot-gray-900)] mb-2">Excellent!</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[var(--spot-green)]" />
                <span className="text-4xl font-black text-[var(--spot-green)]">+{mission.points}pt</span>
            </div>
            <p className="text-sm text-[var(--spot-gray-600)] mb-6 leading-relaxed px-4">
                "{mission.title}"<br />미션을 완벽하게 성공하셨습니다!
            </p>
            <button
              onClick={onComplete}
              className="w-full py-4 bg-[var(--spot-gray-900)] text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all"
            >
              포인트 적립 완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
