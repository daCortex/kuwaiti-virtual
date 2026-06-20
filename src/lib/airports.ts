/* Compact ICAO → city/country lookup for the airports in the Kuwaiti network.
   Used to render friendly route labels across the portal. */
export const AIRPORTS: Record<string, { city: string; country: string; iata: string }> = {
  // --- Hub & Gulf ---
  OKKK: { city: "Kuwait City", country: "Kuwait", iata: "KWI" },
  OERK: { city: "Riyadh", country: "Saudi Arabia", iata: "RUH" },
  OEJN: { city: "Jeddah", country: "Saudi Arabia", iata: "JED" },
  OEMA: { city: "Madinah", country: "Saudi Arabia", iata: "MED" },
  OEDF: { city: "Dammam", country: "Saudi Arabia", iata: "DMM" },
  OMDB: { city: "Dubai", country: "United Arab Emirates", iata: "DXB" },
  OMAA: { city: "Abu Dhabi", country: "United Arab Emirates", iata: "AUH" },
  OBBI: { city: "Manama", country: "Bahrain", iata: "BAH" },
  OOMS: { city: "Muscat", country: "Oman", iata: "MCT" },
  OTHH: { city: "Doha", country: "Qatar", iata: "DOH" },
  OJAI: { city: "Amman", country: "Jordan", iata: "AMM" },
  OLBA: { city: "Beirut", country: "Lebanon", iata: "BEY" },
  ORMM: { city: "Basra", country: "Iraq", iata: "BSR" },
  ORBI: { city: "Baghdad", country: "Iraq", iata: "BGW" },
  OIIE: { city: "Tehran", country: "Iran", iata: "IKA" },
  OISS: { city: "Shiraz", country: "Iran", iata: "SYZ" },
  // --- Turkey ---
  LTFM: { city: "Istanbul", country: "Türkiye", iata: "IST" },
  LTAI: { city: "Antalya", country: "Türkiye", iata: "AYT" },
  // --- Africa ---
  HECA: { city: "Cairo", country: "Egypt", iata: "CAI" },
  // --- Indian subcontinent ---
  VIDP: { city: "Delhi", country: "India", iata: "DEL" },
  VABB: { city: "Mumbai", country: "India", iata: "BOM" },
  VAAH: { city: "Ahmedabad", country: "India", iata: "AMD" },
  VOHS: { city: "Hyderabad", country: "India", iata: "HYD" },
  VOMM: { city: "Chennai", country: "India", iata: "MAA" },
  VOCI: { city: "Kochi", country: "India", iata: "COK" },
  VOTV: { city: "Trivandrum", country: "India", iata: "TRV" },
  OPKC: { city: "Karachi", country: "Pakistan", iata: "KHI" },
  OPLA: { city: "Lahore", country: "Pakistan", iata: "LHE" },
  OPIS: { city: "Islamabad", country: "Pakistan", iata: "ISB" },
  VGHS: { city: "Dhaka", country: "Bangladesh", iata: "DAC" },
  VCBI: { city: "Colombo", country: "Sri Lanka", iata: "CMB" },
  // --- Far East & South-East Asia ---
  VTBS: { city: "Bangkok", country: "Thailand", iata: "BKK" },
  RPLL: { city: "Manila", country: "Philippines", iata: "MNL" },
  ZGGG: { city: "Guangzhou", country: "China", iata: "CAN" },
  // --- Europe ---
  EGLL: { city: "London", country: "United Kingdom", iata: "LHR" },
  EDDF: { city: "Frankfurt", country: "Germany", iata: "FRA" },
  LFPG: { city: "Paris", country: "France", iata: "CDG" },
  LIRF: { city: "Rome", country: "Italy", iata: "FCO" },
  LSGG: { city: "Geneva", country: "Switzerland", iata: "GVA" },
  LEMD: { city: "Madrid", country: "Spain", iata: "MAD" },
  // --- North America ---
  KJFK: { city: "New York", country: "United States", iata: "JFK" },
  CYYZ: { city: "Toronto", country: "Canada", iata: "YYZ" },
  // --- Jet Airways network additions ---
  VECC: { city: "Kolkata", country: "India", iata: "CCU" },
  VOBL: { city: "Bangalore", country: "India", iata: "BLR" },
  VHHH: { city: "Hong Kong", country: "Hong Kong", iata: "HKG" },
  WSSS: { city: "Singapore", country: "Singapore", iata: "SIN" },
  WMKK: { city: "Kuala Lumpur", country: "Malaysia", iata: "KUL" },
  ZSPD: { city: "Shanghai", country: "China", iata: "PVG" },
  FIMP: { city: "Port Louis", country: "Mauritius", iata: "MRU" },
  FAOR: { city: "Johannesburg", country: "South Africa", iata: "JNB" },
  EHAM: { city: "Amsterdam", country: "Netherlands", iata: "AMS" },
  EBBR: { city: "Brussels", country: "Belgium", iata: "BRU" },
  LIMC: { city: "Milan", country: "Italy", iata: "MXP" },
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
  OKKK: [29.23, 47.97], OERK: [24.96, 46.70], OEJN: [21.68, 39.16], OEMA: [24.55, 39.70],
  OEDF: [26.47, 49.80], OMDB: [25.25, 55.36], OMAA: [24.43, 54.65], OBBI: [26.27, 50.63],
  OOMS: [23.59, 58.28], OTHH: [25.27, 51.61], OJAI: [31.72, 36.18], OLBA: [33.82, 35.49],
  ORMM: [30.55, 47.66], ORBI: [33.26, 44.23], OIIE: [35.42, 51.15], OISS: [29.54, 52.59],
  LTFM: [41.26, 28.74], LTAI: [36.90, 30.79], HECA: [30.11, 31.41],
  VIDP: [28.57, 77.10], VABB: [19.09, 72.87], VAAH: [23.08, 72.63], VOHS: [17.24, 78.43],
  VOMM: [12.99, 80.17], VOCI: [10.15, 76.40], VOTV: [8.48, 76.92], OPKC: [24.91, 67.16],
  OPLA: [31.52, 74.40], OPIS: [33.61, 73.10], VGHS: [23.84, 90.40], VCBI: [7.18, 79.88],
  VTBS: [13.69, 100.75], RPLL: [14.51, 121.02], ZGGG: [23.39, 113.30],
  EGLL: [51.47, -0.46], EDDF: [50.03, 8.57], LFPG: [49.01, 2.55], LIRF: [41.80, 12.25],
  LSGG: [46.24, 6.11], LEMD: [40.47, -3.57], KJFK: [40.64, -73.78],
  CYYZ: [43.68, -79.63], VECC: [22.65, 88.45], VOBL: [13.20, 77.71], VHHH: [22.31, 113.91],
  WSSS: [1.36, 103.99], WMKK: [2.75, 101.71], ZSPD: [31.14, 121.81], FIMP: [-20.43, 57.68],
  FAOR: [-26.13, 28.24], EHAM: [52.31, 4.76], EBBR: [50.90, 4.48], LIMC: [45.63, 8.72],
};
