/* Compact ICAO → city/country lookup for the airports in the Kuwaiti network.
   Used to render friendly route labels across the portal. */
export const AIRPORTS: Record<string, { city: string; country: string; iata: string }> = {
  // --- Hub & Gulf ---
  OKBK: { city: "Kuwait City", country: "Kuwait", iata: "KWI" },
  OMDB: { city: "Dubai", country: "United Arab Emirates", iata: "DXB" },
  OTHH: { city: "Doha", country: "Qatar", iata: "DOH" },
  OBBI: { city: "Manama", country: "Bahrain", iata: "BAH" },
  OOMS: { city: "Muscat", country: "Oman", iata: "MCT" },
  OEJN: { city: "Jeddah", country: "Saudi Arabia", iata: "JED" },
  OERK: { city: "Riyadh", country: "Saudi Arabia", iata: "RUH" },
  OEDF: { city: "Dammam", country: "Saudi Arabia", iata: "DMM" },
  OJAI: { city: "Amman", country: "Jordan", iata: "AMM" },
  OLBA: { city: "Beirut", country: "Lebanon", iata: "BEY" },
  ORBI: { city: "Baghdad", country: "Iraq", iata: "BGW" },
  // --- Indian subcontinent ---
  VIDP: { city: "Delhi", country: "India", iata: "DEL" },
  VABB: { city: "Mumbai", country: "India", iata: "BOM" },
  VCBI: { city: "Colombo", country: "Sri Lanka", iata: "CMB" },
  VGHS: { city: "Dhaka", country: "Bangladesh", iata: "DAC" },
  OPKC: { city: "Karachi", country: "Pakistan", iata: "KHI" },
  OPLA: { city: "Lahore", country: "Pakistan", iata: "LHE" },
  // --- Asia & Far East ---
  WSSS: { city: "Singapore", country: "Singapore", iata: "SIN" },
  VTBS: { city: "Bangkok", country: "Thailand", iata: "BKK" },
  WMKK: { city: "Kuala Lumpur", country: "Malaysia", iata: "KUL" },
  VHHH: { city: "Hong Kong", country: "Hong Kong", iata: "HKG" },
  RJTT: { city: "Tokyo", country: "Japan", iata: "HND" },
  KSFO: { city: "San Francisco", country: "United States", iata: "SFO" },
  // --- Africa ---
  HECA: { city: "Cairo", country: "Egypt", iata: "CAI" },
  HKJK: { city: "Nairobi", country: "Kenya", iata: "NBO" },
  HAAB: { city: "Addis Ababa", country: "Ethiopia", iata: "ADD" },
  // --- Europe ---
  EGLL: { city: "London", country: "United Kingdom", iata: "LHR" },
  LFPG: { city: "Paris", country: "France", iata: "CDG" },
  EDDF: { city: "Frankfurt", country: "Germany", iata: "FRA" },
  LTFM: { city: "Istanbul", country: "Türkiye", iata: "IST" },
  LIRF: { city: "Rome", country: "Italy", iata: "FCO" },
  EHAM: { city: "Amsterdam", country: "Netherlands", iata: "AMS" },
  LGAV: { city: "Athens", country: "Greece", iata: "ATH" },
  // --- North America ---
  KJFK: { city: "New York", country: "United States", iata: "JFK" },
  KIAD: { city: "Washington", country: "United States", iata: "IAD" },
  KORD: { city: "Chicago", country: "United States", iata: "ORD" },
  KDFW: { city: "Dallas", country: "United States", iata: "DFW" },
};

export function airportCity(icao: string): string {
  return AIRPORTS[icao]?.city ?? icao;
}
export function airportLabel(icao: string): string {
  const a = AIRPORTS[icao];
  return a ? `${a.city} (${a.iata})` : icao;
}

/* Approximate [lat, lon] for each network airport — for the live map. */
export const AIRPORT_COORDS: Record<string, [number, number]> = {
  OKBK: [29.23, 47.97], OMDB: [25.25, 55.36], OTHH: [25.27, 51.61], OBBI: [26.27, 50.63],
  OOMS: [23.59, 58.28], OEJN: [21.68, 39.16], OERK: [24.96, 46.70], OEDF: [26.47, 49.80],
  OJAI: [31.72, 36.18], OLBA: [33.82, 35.49], ORBI: [33.26, 44.23],
  VIDP: [28.57, 77.10], VABB: [19.09, 72.87], VCBI: [7.18, 79.88], VGHS: [23.84, 90.40],
  OPKC: [24.91, 67.16], OPLA: [31.52, 74.40],
  WSSS: [1.36, 103.99], VTBS: [13.69, 100.75], WMKK: [2.75, 101.71], VHHH: [22.31, 113.91],
  RJTT: [35.55, 139.78], KSFO: [37.62, -122.38],
  HECA: [30.11, 31.41], HKJK: [-1.32, 36.93], HAAB: [8.98, 38.80],
  EGLL: [51.47, -0.46], LFPG: [49.01, 2.55], EDDF: [50.03, 8.57], LTFM: [41.26, 28.74],
  LIRF: [41.80, 12.25], EHAM: [52.31, 4.76], LGAV: [37.94, 23.95],
  KJFK: [40.64, -73.78], KIAD: [38.95, -77.46], KORD: [41.98, -87.90], KDFW: [32.90, -97.04],
};
