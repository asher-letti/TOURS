// Mock operational data for the SafariFlow console.

export const tours = [
  {
    id: 'SF-2024-884', status: 'Ongoing', statusNote: 'Day 4 of 7', circuit: 'Serengeti',
    title: '7-Day Serengeti Great Migration & Ngorongoro Explorer',
    region: 'Serengeti Central & Ndutu', dates: 'Aug 14 – Aug 21',
    party: { name: 'The Henderson Group', origin: 'United States · Private Luxury', pax: 6 },
    details: [
      ['Sector Status', 'En Route to Ndutu Plains'],
      ['Telemetry', 'Live GPS Lock · 11.4 km/h', true],
    ],
    guide: { name: 'Joseph Tarimo', tier: 'KPSGA Gold Guide' },
    vehicle: { plate: 'KBZ 719X', type: 'Cruiser 4x4 Extended' },
    progressLabel: 'Trip Completed', progress: 57,
  },
  {
    id: 'SF-2024-902', status: 'Upcoming', statusNote: 'Departs in 3h', circuit: 'Mara',
    title: '4-Day Maasai Mara Luxury Fly-in Safari',
    region: 'Mara North Concession', dates: 'Today – Aug 21',
    party: { name: 'Dr. Claire Dubois', origin: 'France · VIP Fly-in Lodge', pax: 4 },
    details: [
      ['Flight Stage', 'Briefing @ Wilson Airport', false, 'gold'],
      ['Charter Manifest', 'Cessna Grand Caravan 208B'],
    ],
    guide: { name: 'Faith Mutua', tier: 'KPSGA Silver · EN/FR' },
    vehicle: { plate: 'KCP 102A', type: 'Customized Safari Cruiser' },
    progressLabel: 'Check-in Status', progressText: 'Ready for Boarding', progress: 15, tone: 'gold',
  },
  {
    id: 'SF-2024-811', status: 'Ongoing', statusNote: 'Day 8 of 10', circuit: 'Amboseli',
    title: '10-Day Ultimate East Africa Grand Circuit',
    region: 'Amboseli & Kilimanjaro View', dates: 'Aug 10 – Aug 20',
    party: { name: 'Nordic Wildlife Syndicate', origin: 'Sweden / Norway · Multi-park', pax: 8 },
    details: [
      ['Current Waypoint', 'Amboseli Observation Hill'],
      ['Telemetry', 'Radio Ch. 4 Active · Fuel 68%', true],
    ],
    guide: { name: 'Samuel Ondiek', tier: 'Senior Expedition Leader' },
    vehicle: { plate: 'KDG 311P', type: 'Cruiser Pop-Roof (Dual)' },
    progressLabel: 'Expedition Progress', progress: 80,
  },
  {
    id: 'SF-2024-790', status: 'Completed', statusNote: 'Closed', circuit: 'Amboseli',
    title: '3-Day Amboseli Elephant Sanctuary Discovery',
    region: 'Amboseli Eco-Corridor', dates: 'Aug 12 – Aug 15',
    party: { name: 'Tanaka & Lynn', origin: 'Japan · Photography Safari', pax: 2 },
    details: [
      ['Financial Closure', 'All Vouchers Reconciled'],
      ['Client Rating', '★ 5.0 (NPS +94)'],
    ],
    guide: { name: 'Daniel Lerionka', tier: 'Silver Guide · Wildlife Tracker' },
    vehicle: { plate: 'KCH 409R', type: 'Post-Tour Sanitized' },
    progressLabel: 'Status', progressText: '100% Completed', progress: 100, tone: 'mint',
  },
  {
    id: 'SF-2024-919', status: 'Upcoming', statusNote: 'Tomorrow, 06:00', circuit: 'Bwindi',
    title: '5-Day Bwindi Gorilla Trekking & Queen Elizabeth Park',
    region: 'Ruhija & Ishasha Sector', dates: 'Aug 18 – Aug 23',
    party: { name: 'Bespoke Monash Family', origin: 'Australia · Primate Permits', pax: 4 },
    details: [
      ['UWA Permits', 'All 4 Verified (Mubare Group)'],
      ['Overnight Base', 'Clouds Mountain Gorilla Lodge'],
    ],
    guide: { name: 'Emmanuel Kato', tier: 'Uganda Primate Specialist' },
    vehicle: { plate: 'UAU 622F', type: 'Heavy-duty Winch 4x4' },
    progressLabel: 'Readiness Checklist', progressText: '100% Prepared', progress: 100, tone: 'mint',
  },
  {
    id: 'SF-2024-871', status: 'Ongoing', statusNote: 'Day 2 of 6', circuit: 'Tsavo',
    title: '6-Day Tsavo East & West Big Tuskers Expedition',
    region: 'Tsavo Hills & Mzima Springs', dates: 'Aug 16 – Aug 22',
    party: { name: 'Von Geusau Duo', origin: 'Germany · Big Tusker Focus', pax: 5 },
    details: [
      ['Current Lodge', 'Salt Lick Safari Lodge'],
      ['Telemetry', 'Stationary @ Waterhole Blind', true],
    ],
    guide: { name: 'Anthony Wambua', tier: 'KPSGA Silver · DE Certified' },
    vehicle: { plate: 'KDA 882E', type: 'Cruiser Open-Sided Spec' },
    progressLabel: 'Trip Completed', progress: 33,
  },
  {
    id: 'SF-2024-777', status: 'Cancelled', statusNote: 'Refund issued', circuit: 'Serengeti',
    title: '5-Day Northern Serengeti Kogatende Crossings',
    region: 'Kogatende & Lamai Wedge', dates: 'Aug 09 – Aug 14',
    party: { name: 'Okafor Family', origin: 'Nigeria · Family Safari', pax: 5 },
    details: [
      ['Reason', 'Client medical deferral'],
      ['Credit Note', 'Rebooked for Q1 2025'],
    ],
    guide: { name: 'Juma Bakari', tier: 'KPSGA Gold' },
    vehicle: { plate: 'KBZ 119Q', type: 'Released to pool' },
    progressLabel: 'Status', progressText: 'Cancelled', progress: 0,
  },
]

export const guides = [
  {
    name: 'Samuel Ondiek', tier: 'KPSGA Gold', status: 'In Field', exp: '14 yrs expedition lead',
    rating: 4.98, reviews: 184, region: 'Mara',
    info: [['Current Assignment', 'Mara Expedition (Day 5/7)'], ['ETA to Base', 'Oct 18, 14:00 EAT'], ['Park Sector', 'Mara North Concession']],
    languages: ['English', 'Swahili', 'French'], skills: ['Big Cat Tracking', 'DSLR Photography'],
    certs: ['Medical Cert (Expires 2026)', 'Wilderness First Aid active'], action: 'Queued Tour Assign',
  },
  {
    name: 'Faith Mutua', tier: 'KPSGA Silver', status: 'Available', exp: '9 yrs lead walking & ornithology',
    rating: 4.96, reviews: 112, region: 'Mara',
    info: [['Staging Hub', 'Nairobi Operations Base (Wilson Air Hub)'], ['Mobilization Time', '< 45 Minutes to Flight'], ['Last Tour Finished', 'Laikipia Walking (2 days rest completed)']],
    languages: ['English', 'German (C1)', 'Swahili'], skills: ['Walking Safaris', 'Raptors & Endemics'], highlight: ['German (C1)'],
    certs: ['Rifle Handling Level 2 Valid', 'Wilderness First Responder'], action: 'Instant Assign',
  },
  {
    name: 'Joseph Tarimo', tier: 'TANAPA Senior', status: 'Dispatched', exp: '16 yrs Serengeti & Crater',
    rating: 4.95, reviews: 240, region: 'Serengeti',
    info: [['Current Active Run', 'Serengeti Wilderness (Day 4/6)'], ['Next Availability', 'Oct 21 at Arusha Hub'], ['Vehicle Link', 'Land Cruiser TZ-409 (Telemetry OK)']],
    languages: ['English', 'Italian (Fluent)', 'Swahili'], skills: ['Migration Tracking', 'Volcanic Geology'], highlight: ['Italian (Fluent)'],
    certs: ['Tanzania Park Guide Lic. 2025', 'Red Cross Wilderness'], action: 'Schedule Post-Return',
  },
  {
    name: 'Daniel Lerionka', tier: 'KPSGA Silver', status: 'Available', exp: '7 yrs Mara native tracker',
    rating: 4.99, reviews: 97, region: 'Mara',
    info: [['Field Station', 'Mara Bush Camp / Sector 2'], ['Readiness', 'Vehicle paired & fueled'], ['Last 30-Day Tally', '4 tours completed · 100% 5-star']],
    languages: ['English', 'Maa (Native)', 'Swahili', 'Spanish'], skills: ['Maasai Ethnobotany', 'Lion Pride Spoor', 'Walking Safaris'], highlight: ['Spanish'],
    certs: ['Narok County Ranger Permit', 'Wilderness First Aid Active'], action: 'Instant Assign',
  },
  {
    name: 'Emmanuel Kato', tier: 'UWA Certified', status: 'Dispatched', exp: '11 yrs primate & gorilla tracking',
    rating: 4.97, reviews: 143, region: 'Bwindi',
    info: [['Current Forest Sector', 'Bwindi Impenetrable (Nkuringo)'], ['Habituation Group', 'Habinyanja Gorilla Family'], ['Field Comms Status', 'Garmin InReach Active']],
    languages: ['English', 'French (B2)', 'Luganda'], skills: ['Primate Habituation', 'Montane Trekking'],
    certs: ['UWA Lead Guide Badge 2025', 'Advanced Altitude Med Cert'], action: 'Next Leg Assignment',
  },
  {
    name: 'Beatrice Kemunto', tier: 'KPSGA Silver', status: 'On Standby', exp: '6 yrs luxury guest logistics & fauna',
    rating: 4.92, reviews: 86, region: 'Amboseli',
    info: [['Standby Station', 'Amboseli Hub (Tortilis Airstrip)'], ['VIP Accreditation', 'Private Jet & Diplomatic VIP'], ['Recent Dispatch', 'Returned from Tsavo East (Yesterday)']],
    languages: ['English', 'Mandarin (HSK 5)', 'Swahili'], skills: ['Luxury Hospitality', 'Elephant Herd Ethology', 'Birding'], highlight: ['Mandarin (HSK 5)'],
    certs: ['Medical Valid thru 2026', 'Aviation Security Ramp Pass'], action: 'Activate Dispatch',
  },
  {
    name: 'Juma Bakari', tier: 'KPSGA Gold', status: 'In Field', exp: '18 yrs Amboseli & Kilimanjaro circuits',
    rating: 4.96, reviews: 211, region: 'Amboseli',
    info: [['Current Assignment', 'Amboseli Giants (Day 1/4)'], ['ETA to Base', 'Oct 19, 17:30 EAT'], ['Park Sector', 'Amboseli Enkushani']],
    languages: ['English', 'French', 'Swahili'], skills: ['Big Cat Tracking', 'Walking Safaris'],
    certs: ['KWS Professional Guide 2025', 'Wilderness First Aid active'], action: 'Queued Tour Assign',
  },
  {
    name: 'Amina Ndiaye', tier: 'KPSGA Silver', status: 'Available', exp: '8 yrs ornithology & botanical lead',
    rating: 4.94, reviews: 76, region: 'Amboseli',
    info: [['Staging Hub', 'Amboseli HQ'], ['Mobilization Time', '< 30 Minutes'], ['Last Tour Finished', 'Tsavo Birding (3 days rest)']],
    languages: ['English', 'French', 'Wolof'], skills: ['Birding', 'Botanical Survey'],
    certs: ['Bird Ringing Licence', 'Wilderness First Responder'], action: 'Instant Assign',
  },
]

export const guideFilters = {
  languages: ['Swahili', 'English', 'French', 'German', 'Mandarin', 'Maa', 'Italian', 'Spanish'],
  specializations: ['Big Cat Tracking', 'Primate Habituation', 'Walking Safaris', 'Birding', 'Migration Tracking', 'Luxury Hospitality'],
  tiers: ['KPSGA Gold', 'KPSGA Silver', 'KPSGA Bronze', 'UWA', 'TANAPA'],
  statuses: ['Available', 'On Standby', 'In Field', 'Dispatched'],
}

export const vehicles = [
  {
    id: 'SF-LC-01', plate: 'KDL 482M', state: 'On Safari', statusLabel: 'Active · 34 km/h',
    model: 'Toyota Land Cruiser 79 Series Extended · 8 Pax + Pop-up Roof, Inverter 220V, Safari Fridge',
    guide: 'Samuel Ondiek', tour: 'Tour: Mara Great Migration', location: 'Mara North Conservancy', gps: '-1.2840, 35.1201',
    fuel: 82, fuelNote: 'Odo: 142,300 km', service: 'Good', serviceNote: 'Service in 3,200 km', ping: 'Live Ping', lastPing: 1,
  },
  {
    id: 'SF-LC-04', plate: 'KBZ 719X', state: 'On Safari', statusLabel: 'Active · Sat Connected',
    model: 'Toyota Land Cruiser High-Roof (6 Pax VIP Edition with Starlink Mini)',
    guide: 'Joseph Tarimo', tour: 'Serengeti Luxury Circuit', location: 'Seronera Valley (TZ)', gps: '-2.4419, 34.8231',
    fuel: 64, fuelNote: 'Dual Aux Tanks Active', service: 'Certified Tanapa', serviceNote: 'Service in 4,800 km', ping: 'Sat Comm', lastPing: 3,
  },
  {
    id: 'SF-SV-08', plate: 'KCP 102A', state: 'On Safari', statusLabel: 'Highway Transit · 78 km/h',
    model: 'Nissan Patrol 4×4 Safari Spec (7 Pax Capacity with Heavy Duty Winch)',
    guide: 'Moses Kiprop', tour: 'Amboseli Day Express', location: 'Emali Road (Southbound)', gps: '-2.0722, 37.4589',
    fuel: 91, fuelNote: 'Filled at Shell Sultan Hamud', service: 'Optimal', serviceNote: 'Tyres: 38 PSI (Cold)', ping: 'Telemetry', lastPing: 2,
  },
  {
    id: 'SF-LC-11', plate: 'KDA 339L', state: 'Standby', statusLabel: 'Available for Dispatch',
    model: 'Toyota Land Cruiser Open Game Viewer (Roll-Cage with Removable Canvas)',
    guide: null, tour: 'Ready for assignment', location: 'Arusha Dispatch Hub', gps: 'Bay A-04 (Cleaned & Prepped)',
    fuel: 100, fuelNote: 'Full Tank + 2 Jerricans', service: 'KWS & TANAPA Ready', serviceNote: 'Annual Commercial Decal valid', permits: true, lastPing: 12,
  },
  {
    id: 'SF-LC-14', plate: 'KDE 304L', state: 'Standby', statusLabel: 'Available for Dispatch',
    model: 'Toyota Land Cruiser 76 Wagon · Dual 180L tanks, Pop-up Roof',
    guide: null, tour: 'Ready for assignment', location: 'Nairobi HQ Hangar', gps: '-1.3218, 36.8148',
    fuel: 100, fuelNote: 'Full tank (180L dual)', service: 'KWS Ready', serviceNote: 'Permits on file', permits: true, lastPing: 8,
  },
  {
    id: 'SF-VAN-03', plate: 'KBR 552P', state: 'Maintenance', statusLabel: 'Maintenance Bay', eta: 'ETA Ready: Tomorrow 14:00',
    model: 'Toyota HiAce 4WD Pop-Up Safari Van',
    workOrder: 'Suspension Overhaul & Alignment', workNote: 'Old Man Emu Heavy Duty Springs',
    parts: '4x New BFGoodrich KO2', partsNote: 'Fitted at Nairobi Central Workshop',
    tech: 'Peter Maina (Master Tech)', techNote: 'Quality Inspection scheduled 11:30', lastPing: 60,
  },
  {
    id: 'SF-LC-09', plate: 'KDA 771P', state: 'Maintenance', statusLabel: 'Scheduled Service', eta: 'Bay #3 · 4h left',
    model: 'Toyota Land Cruiser 79 Series Extended',
    workOrder: '50,000km Heavy Bush Overhaul', workNote: 'Brake pads + shocks replacement',
    parts: 'OEM Brake Pad Kit', partsNote: 'Delivered from CMC Motors',
    tech: 'Grace Wanjiru', techNote: 'Road test scheduled 16:00', lastPing: 45,
  },
]

export const dispatchOptions = {
  tours: ['7D Mara Sky VIP — 6 Pax (Departs 14:00)', '3D Amboseli Express — 4 Pax (Departs Tomorrow)', '5D Serengeti Photo — 2 Pax (Departs Fri)'],
  guides: ['David Lekurru (Silver KPSGA · EN, SW)', 'David Kipkoech (Gold KPSGA · EN, DE, SW)', 'Amina Ndiaye (Silver KPSGA · EN, FR)'],
}

export const liveStream = [
  {
    kind: 'wildlife', title: 'High Value Wildlife Sighting Logged', time: '08:42 AM',
    body: ['Guide ', { b: 'Faith Mutua' }, ' tagged Mara River crossing activity (Sector 4B). 3 partner vehicles re-routed.'],
    meta: ['Geo: -1.3491, 35.1208', 'Push coordinates to group'],
  },
  {
    kind: 'flight', title: 'Flight Schedule Adjustment', time: '08:29 AM',
    body: ['Safarilink #054 (Wilson → Keekorok) delayed 20 min. Pickup dispatch ETA for ', { b: 'Tour #SF-882' }, ' adjusted to 10:45 AM.'],
    resolved: true,
  },
  {
    kind: 'checkpoint', title: 'Airstrip Checkpoint Cleared', time: '08:15 AM',
    body: ['Land Cruiser KDL 482M (SF-09) received Vanderbilt party (4 pax) at Mara Serena Airstrip.'],
    meta: ['Luggage: 8 Bags Verified', 'Permits Validated'],
  },
  {
    kind: 'medical', title: 'Flying Doctors Cover Synchronized', time: '07:50 AM',
    body: ['AMREF Flying Doctors coverage policy pinned for 12 new European arrivals today.'],
  },
]

export const circuitTable = [
  {
    id: '#SF-881', name: 'Mara River Migration Crossing', day: 'Day 3 of 7 · Luxury Tented Option', sector: 'Maasai Mara North',
    client: 'Vanderbilt Family', clientNote: '4 Pax · VIP Concierge', guide: 'Samuel Ondiek', guideNote: 'KPSGA Gold · Swahili, EN',
    vehicle: 'KDL 482M', vehicleNote: 'Land Cruiser V8', status: 'En route Lookout 3', statusNote: 'ETA Camp: 18:30 EAT', tone: 'emerald', group: 'active',
  },
  {
    id: '#SF-884', name: 'Serengeti Predator Tracking', day: 'Day 2 of 5 · Photographic Custom', sector: 'Central Seronera [TZ]',
    client: 'Dr. Weiss Wildlife Team', clientNote: '2 Pax · NatGeo Permit', guide: 'Faith Mutua', guideNote: 'KPSGA Silver · German, EN',
    vehicle: 'KCR 910T', vehicleNote: 'Extended Safari Pop-top', status: 'Lion Coalition Watch', statusNote: 'Stationary Sector B', tone: 'gold', group: 'active',
  },
  {
    id: '#SF-887', name: 'Amboseli Giants & Kilimanjaro', day: 'Day 1 of 4 · Walking & Game Drive', sector: 'Amboseli Enkushani',
    client: 'Kowalski Private Group', clientNote: '6 Pax · French Bilingual', guide: 'Juma Bakari', guideNote: 'KPSGA Gold · French, SWA',
    vehicle: 'KBZ 119Q', vehicleNote: 'Land Cruiser Custom', status: 'Departing Ol Tukai Lodge', statusNote: 'Morning drive segment', tone: 'emerald', group: 'active',
  },
  {
    id: '#SF-902', name: 'Maasai Mara Luxury Fly-in', day: 'Day 0 of 4 · Fly-in Lodge', sector: 'Mara North Concession',
    client: 'Dr. Claire Dubois', clientNote: '4 Pax · VIP', guide: 'Faith Mutua', guideNote: 'KPSGA Silver · EN/FR',
    vehicle: 'KCP 102A', vehicleNote: 'Customized Cruiser', status: 'Briefing @ Wilson', statusNote: 'Wheels up 09:30', tone: 'gold', group: 'pending',
  },
  {
    id: '#SF-790', name: 'Amboseli Elephant Sanctuary', day: 'Day 3 of 3 · Photography', sector: 'Amboseli Eco-Corridor',
    client: 'Tanaka & Lynn', clientNote: '2 Pax · Photography', guide: 'Daniel Lerionka', guideNote: 'KPSGA Silver · EN, Maa',
    vehicle: 'KCH 409R', vehicleNote: 'Land Cruiser', status: 'Trip Closed', statusNote: 'NPS +94', tone: 'gray', group: 'completed',
  },
]
