import { NextRequest } from 'next/server';
import { PlaceResult } from '@/types/mission';

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function demoPlaces(query: string, lat: number, lng: number): PlaceResult[] {
  const offsets = [
    { dlat: 0.002, dlng: 0.001, suffix: 'A' },
    { dlat: -0.001, dlng: 0.003, suffix: 'B' },
    { dlat: 0.003, dlng: -0.002, suffix: 'C' },
  ];

  const nameMap: Record<string, string[]> = {
    'convenience store': ['CU 편의점', 'GS25', '세븐일레븐'],
    supermarket: ['이마트24', 'GS더프레쉬', '홈플러스 익스프레스'],
    restaurant: ['한솥도시락', '맘스터치', '김가네 분식'],
    cafe: ['스타벅스', '이디야', '메가커피'],
    park: ['근린공원', '어린이공원', '도시숲'],
    'walking trail': ['산책로', '둘레길', '하천변 길'],
    laundromat: ['코인세탁소', '크린토피아', '워시엔조이'],
    pharmacy: ['올리브영', '약국', 'GS편의점 의약품'],
    'police station': ['지구대', '파출소', '경찰서'],
    hospital: ['가정의학과', '응급실', '내과'],
    bookstore: ['교보문고', '알라딘', '동네책방'],
    'community center': ['주민센터', '도서관', '청년공간'],
  };

  const labels = nameMap[query] ?? [query + ' 1', query + ' 2', query + ' 3'];

  return offsets.map((o, i) => ({
    name: labels[i] ?? `${query} ${offsets[i].suffix}`,
    vicinity: `도보 ${(i + 1) * 3}분 거리`,
    location: { lat: lat + o.dlat, lng: lng + o.dlng },
    rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1)),
    placeId: `demo_${query}_${i}`,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query') ?? 'convenience store';
  const lat = parseFloat(searchParams.get('lat') ?? '37.5665');
  const lng = parseFloat(searchParams.get('lng') ?? '126.9780');

  if (!MAPS_API_KEY) {
    return Response.json({ places: demoPlaces(query, lat, lng) });
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.set('location', `${lat},${lng}`);
    url.searchParams.set('radius', '1500');
    url.searchParams.set('keyword', query);
    url.searchParams.set('language', 'ko');
    url.searchParams.set('key', MAPS_API_KEY);

    const res = await fetch(url.toString());

    if (!res.ok) {
      return Response.json({ places: demoPlaces(query, lat, lng) });
    }

    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API status:', data.status);
      return Response.json({ places: demoPlaces(query, lat, lng) });
    }

    const places: PlaceResult[] = (data.results ?? []).slice(0, 5).map(
      (r: {
        name: string;
        vicinity: string;
        geometry: { location: { lat: number; lng: number } };
        rating?: number;
        place_id: string;
      }) => ({
        name: r.name,
        vicinity: r.vicinity,
        location: r.geometry.location,
        rating: r.rating,
        placeId: r.place_id,
      })
    );

    return Response.json({ places: places.length > 0 ? places : demoPlaces(query, lat, lng) });
  } catch (err) {
    console.error('Places error, using fallback:', err);
    return Response.json({ places: demoPlaces(query, lat, lng) });
  }
}
