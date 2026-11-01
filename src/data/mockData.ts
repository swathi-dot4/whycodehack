import { HealthcareFacility, MedicineDetails, WorkerPatientRecord, FamilyMember, HealthcareActivity } from '../types';

export const MOCK_FACILITIES: HealthcareFacility[] = [
  // District: Ananthapur
  {
    id: 'fac-1',
    name: 'Ananthapur Rural Primary Health Centre (PHC)',
    type: 'PHC',
    district: 'Ananthapur',
    city: 'Ananthapur Rural',
    distanceKm: 2.4,
    addressEn: 'Main Road, Ananthapur Village, AP',
    addressTe: 'ముఖ్య రహదారి, అనంతపూర్ గ్రామం, ఆంధ్రప్రదేశ్',
    contactNumber: '+91 98480 12345',
    servicesEn: ['General Consultation', 'Maternal Care', 'Vaccination', 'Basic Labs'],
    servicesTe: ['సాధారణ వైద్యం', 'మాతృ సంరక్షణ', 'టీకాలు', 'ప్రాథమిక పరీక్షలు'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English', 'Hindi'],
    isOpen24x7: true,
    operatingHours: '24 Hours Emergency • OPD 8:00 AM - 4:00 PM',
    status: 'Open',
    matchScore: 98,
    matchReasons: ['✓ Telugu support available', '✓ Primary care service match', '✓ Close proximity (2.4 km)', '✓ 24x7 Emergency ready'],
    latitude: 14.6819,
    longitude: 77.6006,
  },
  {
    id: 'fac-2',
    name: 'Kalyandurg Community Health Centre (CHC)',
    type: 'CHC',
    district: 'Ananthapur',
    city: 'Kalyandurg',
    distanceKm: 7.2,
    addressEn: 'Near Old Bus Stand, Kalyandurg',
    addressTe: 'పాత బస్ స్టాండ్ వద్ద, కల్యాణదుర్గం',
    contactNumber: '+91 98480 67890',
    servicesEn: ['Pediatrics', 'Obstetrics & Gynecology', 'Emergency Unit', 'Pharmacy', 'X-Ray'],
    servicesTe: ['పిల్లల వైద్యం', 'స్త్రీ రోగ నివారణ', 'అత్యవసర విభాగం', 'మందుల షాపు', 'ఎక్స్-రే'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English'],
    isOpen24x7: true,
    operatingHours: '24 Hours Emergency',
    status: 'Open',
    matchScore: 92,
    matchReasons: ['✓ Pediatrics & Pharmacy available', '✓ Telugu support', '✓ Teleconsultation link available'],
    latitude: 14.5516,
    longitude: 76.9922,
  },
  {
    id: 'fac-3',
    name: 'Government District Headquarters Hospital',
    type: 'District Hospital',
    district: 'Ananthapur',
    city: 'Ananthapur Town',
    distanceKm: 18.5,
    addressEn: 'Hospital Road, Anantapuramu',
    addressTe: 'హాస్పిటల్ రోడ్, అనంతపురము',
    contactNumber: '+91 8554 220100',
    servicesEn: ['Multi-specialty Surgery', 'ICU', 'Blood Bank', 'Tele-Consultation Center', '24x7 Ambulance'],
    servicesTe: ['సర్జరీ', 'ఐసియు (ICU)', 'బ్లడ్ బ్యాంక్', 'టెలి-కన్సల్టేషన్', 'అంబులెన్స్'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English', 'Hindi'],
    isOpen24x7: true,
    operatingHours: '24 Hours Open',
    status: 'Busy',
    matchScore: 85,
    matchReasons: ['✓ Specialist surgical facility', '✓ Blood bank & ICU', '✓ High patient volume'],
    latitude: 14.6830,
    longitude: 77.6010,
  },

  // District: Chittoor
  {
    id: 'fac-4',
    name: 'Sri Venkateswara Government General Hospital',
    type: 'Govt Hospital',
    district: 'Chittoor',
    city: 'Tirupati',
    distanceKm: 12.0,
    addressEn: 'Alipiri Road, Tirupati, Chittoor Dist',
    addressTe: 'అలిపిరి రోడ్, తిరుపతి, చిత్తూరు జిల్లా',
    contactNumber: '+91 877 2286666',
    servicesEn: ['Cardiology', 'Pediatrics', 'Trauma Center', '24x7 Pharmacy', 'Radiology'],
    servicesTe: ['గుండె వైద్యం', 'పిల్లల వైద్యం', 'ట్రామా సెంటర్', '24/7 ఫార్మసీ'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English', 'Tamil'],
    isOpen24x7: true,
    operatingHours: '24 Hours Emergency & Trauma',
    status: 'Open',
    matchScore: 95,
    matchReasons: ['✓ Advanced Trauma Care', '✓ Multilingual (Telugu/Tamil)', '✓ 24x7 Pharmacy'],
    latitude: 13.6288,
    longitude: 79.4192,
  },
  {
    id: 'fac-5',
    name: 'Madanapalle Area Government Hospital',
    type: 'CHC',
    district: 'Chittoor',
    city: 'Madanapalle',
    distanceKm: 25.4,
    addressEn: 'CTM Road, Madanapalle, Chittoor Dist',
    addressTe: 'సిటిఎమ్ రోడ్, మదనపల్లె',
    contactNumber: '+91 8571 222300',
    servicesEn: ['Maternity Care', 'General Medicine', 'Fever Clinic', 'Lab Testing'],
    servicesTe: ['ప్రసూతి వైద్యం', 'సాధారణ చికిత్స', 'జ్వరం క్లినిక్'],
    isEmergencyAvailable: fontEmergencyCheck(true),
    languageSupport: ['Telugu', 'English'],
    isOpen24x7: true,
    operatingHours: '24 Hours Emergency',
    status: 'Open',
    matchScore: 89,
    matchReasons: ['✓ Maternal & Maternity Specialization', '✓ Emergency Unit'],
    latitude: 13.5500,
    longitude: 78.5000,
  },

  // District: Kurnool
  {
    id: 'fac-6',
    name: 'Kurnool Government General Hospital (GGH)',
    type: 'Govt Hospital',
    district: 'Kurnool',
    city: 'Kurnool City',
    distanceKm: 15.8,
    addressEn: 'Budhawarapet, Kurnool, AP',
    addressTe: 'బుధవారపేట, కర్నూలు',
    contactNumber: '+91 8518 255100',
    servicesEn: ['Emergency Surgery', 'Pediatric ICU', 'Dialysis Center', 'Burn Ward'],
    servicesTe: ['అత్యవసర శస్త్రచికిత్స', 'పిల్లల ఐసియు', 'డయాలసిస్'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English', 'Hindi', 'Urdu'],
    isOpen24x7: true,
    operatingHours: '24 Hours Open',
    status: 'Open',
    matchScore: 94,
    matchReasons: ['✓ Pediatric ICU & Dialysis', '✓ Multi-language support'],
    latitude: 15.8281,
    longitude: 78.0373,
  },
  {
    id: 'fac-7',
    name: 'Nandyal Community Health Centre',
    type: 'CHC',
    district: 'Kurnool',
    city: 'Nandyal',
    distanceKm: 32.1,
    addressEn: 'Tekke Road, Nandyal, Kurnool Dist',
    addressTe: 'టెక్కె రోడ్, నంద్యాల',
    contactNumber: '+91 8514 242211',
    servicesEn: ['General OPD', 'Vaccination', 'Antenatal Checkups'],
    servicesTe: ['సాధారణ వైద్యం', 'టీకాలు', 'గర్భిణీ తనిఖీలు'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English'],
    isOpen24x7: true,
    operatingHours: 'OPD 8 AM - 2 PM • 24x7 Emergency',
    status: 'Open',
    matchScore: 88,
    matchReasons: ['✓ Rural antenatal checkups', '✓ Emergency unit'],
    latitude: 15.4783,
    longitude: 78.4836,
  },

  // District: Visakhapatnam
  {
    id: 'fac-8',
    name: 'King George Hospital (KGH Visakhapatnam)',
    type: 'District Hospital',
    district: 'Visakhapatnam',
    city: 'Vizag City',
    distanceKm: 8.5,
    addressEn: 'Maharanipeta, Visakhapatnam, AP',
    addressTe: 'మహారాణిపేట, విశాఖపట్నం',
    contactNumber: '+91 891 2564891',
    servicesEn: ['Super Specialty', 'Cardiology', 'Oncology', 'Trauma Center', 'Blood Bank'],
    servicesTe: ['సూపర్ స్పెషాలిటీ', 'కార్డియాలజీ', 'ట్రామా సెంటర్'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English', 'Hindi'],
    isOpen24x7: true,
    operatingHours: '24 Hours Emergency',
    status: 'Open',
    matchScore: 96,
    matchReasons: ['✓ Apex Govt Referral Hospital', '✓ Advanced Specialty'],
    latitude: 17.7042,
    longitude: 83.3033,
  },
  {
    id: 'fac-9',
    name: 'Gajuwaka Primary Health Centre (PHC)',
    type: 'PHC',
    district: 'Visakhapatnam',
    city: 'Gajuwaka',
    distanceKm: 5.1,
    addressEn: 'High School Road, Gajuwaka, Vizag',
    addressTe: 'హైస్కూల్ రోడ్, గాజువాక',
    contactNumber: '+91 891 2755432',
    servicesEn: ['General OPD', 'Diagnostic Labs', 'Maternal Health'],
    servicesTe: ['సాధారణ OP', 'రక్త పరీక్షలు', 'తల్లి సంరక్షణ'],
    isEmergencyAvailable: false,
    languageSupport: ['Telugu', 'English'],
    isOpen24x7: false,
    operatingHours: '8:00 AM - 5:00 PM',
    status: 'Open',
    matchScore: 90,
    matchReasons: ['✓ Local OPD Clinic', '✓ Fast diagnostic turnaround'],
    latitude: 17.6900,
    longitude: 83.2100,
  },

  // District: Guntur
  {
    id: 'fac-10',
    name: 'Guntur Government General Hospital',
    type: 'Govt Hospital',
    district: 'Guntur',
    city: 'Guntur City',
    distanceKm: 11.2,
    addressEn: 'Sambasivapet, Guntur, AP',
    addressTe: 'సాంబశివపేట, గుంటూరు',
    contactNumber: '+91 863 2220150',
    servicesEn: ['Multi-specialty OPD', 'Burn Intensive Care', 'Pediatric Surgery'],
    servicesTe: ['మల్టీ-స్పెషాలిటీ OP', 'పిల్లల శస్త్రచికిత్స'],
    isEmergencyAvailable: true,
    languageSupport: ['Telugu', 'English', 'Hindi'],
    isOpen24x7: true,
    operatingHours: '24 Hours Emergency',
    status: 'Open',
    matchScore: 93,
    matchReasons: ['✓ Pediatric surgery unit', '✓ Emergency 24x7'],
    latitude: 16.3067,
    longitude: 80.4365,
  }
];

function fontEmergencyCheck(val: boolean) { return val; }

export const MOCK_MEDICINES: MedicineDetails[] = [
  {
    id: 'med-1',
    tradeName: 'Calpol 500mg',
    genericName: 'Paracetamol Tablets IP',
    strength: '500 mg',
    composition: 'Paracetamol IP 500mg per tablet',
    dosageForm: 'Solid Tablet',
    manufacturer: 'GSK Pharmaceuticals Ltd.',
    batchNumber: 'BTL2049A',
    expiryDate: '12 / 2026',
    purposeEn: 'Used for mild to moderate fever and body pain relief.',
    purposeTe: 'జ్వరం మరియు శరీర నొప్పుల తగ్గింపుకు ఉపయోగిస్తారు.',
    whenToTakeVerified: true,
    whenToTakeEn: 'After food with a glass of water',
    whenToTakeTe: 'ఆహారం తిన్న తర్వాత ఒక గ్లాసు నీటితో తీసుకోండి',
    frequencyEn: '1 tablet as advised by doctor (Max 4 in 24h)',
    instructionsEn: 'Take 1 tablet after meals as advised by doctor. Maximum 4 tablets in 24 hours.',
    instructionsTe: 'భోజనం తర్వాత 1 మాత్ర వేసుకోవాలి. రోజుకు 4 మాత్రలకు మించరాదు.',
    warningsEn: ['Do not combine with other Paracetamol products', 'Consult doctor if fever persists > 3 days'],
    warningsTe: ['ఇతర పారాసిటమాల్ మందులతో కలిపి వాడరాదు', '3 రోజుల కంటే ఎక్కువ జ్వరం ఉంటే డాక్టర్‌ను సంప్రదించండి'],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60',
    ageGroupDosage: [
      {
        group: 'Infants',
        guidance: 'Dosage information not available — please consult a doctor or pharmacist.',
        isVerified: false
      },
      {
        group: 'Children',
        guidance: 'Dosage information not available for 500mg adult tablets — pediatric syrup formulation required. Consult doctor.',
        isVerified: false
      },
      {
        group: 'Teenagers',
        guidance: '1 tablet (500mg) after food every 6 to 8 hours as prescribed by doctor (Max 3 tablets/day).',
        isVerified: true
      },
      {
        group: 'Adults',
        guidance: '1 tablet (500mg) after meals every 4 to 6 hours if needed. Do not exceed 4 tablets (2000mg) in 24 hours.',
        isVerified: true
      },
      {
        group: 'Older Adults',
        guidance: '1 tablet (500mg) after food. Consult doctor if liver or kidney impairment is present.',
        isVerified: true
      }
    ]
  },
  {
    id: 'med-2',
    tradeName: 'Amoxil Syrup',
    genericName: 'Amoxicillin Oral Suspension IP',
    strength: '125 mg / 5ml',
    composition: 'Amoxicillin Trihydrate IP equivalent to Amoxicillin 125mg per 5ml',
    dosageForm: 'Oral Liquid Suspension',
    manufacturer: 'Cipla Healthcare Ltd.',
    batchNumber: 'AMX7789',
    expiryDate: '08 / 2025',
    purposeEn: 'Antibiotic for bacterial infections prescribed by doctors.',
    purposeTe: 'డాక్టర్ సూచించిన బ్యాక్టీరియల్ ఇన్ఫెక్షన్ల నివారణకు ఆంటిబయోటిక్.',
    whenToTakeVerified: true,
    whenToTakeEn: 'Take with or after food at regular intervals',
    whenToTakeTe: 'ఆహారంతో పాటు లేదా ఆహారం తర్వాత ప్రతి నిర్ణీత సమయానికి తీసుకోండి',
    frequencyEn: 'As prescribed by registered physician only',
    instructionsEn: 'Shake bottle well before use. Use exact measuring spoon provided.',
    instructionsTe: 'వాడేముందు బాటిల్‌ను బాగా ఊపండి. ఇచ్చిన స్పూన్‌తో మాత్రమే కొలవండి.',
    warningsEn: ['Complete full course prescribed by doctor', 'Must be prescribed by a registered practitioner'],
    warningsTe: ['డాక్టర్ చెప్పిన పూర్తి కోర్సు పూర్తి చేయాలి', 'వైద్యుని సిఫార్సు లేక వాడకూడదు'],
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=60',
    ageGroupDosage: [
      {
        group: 'Infants',
        guidance: 'Dosage depends strictly on body weight and pediatric doctor prescription.',
        isVerified: false
      },
      {
        group: 'Children',
        guidance: '5ml (125mg) every 8 hours after food as prescribed by pediatrician.',
        isVerified: true
      },
      {
        group: 'Teenagers',
        guidance: 'Dosage information not available — adult tablet formulation recommended. Consult doctor.',
        isVerified: false
      },
      {
        group: 'Adults',
        guidance: 'Dosage information not available — adult oral capsules required.',
        isVerified: false
      },
      {
        group: 'Older Adults',
        guidance: 'Dosage information not available — consult physician.',
        isVerified: false
      }
    ]
  },
  {
    id: 'med-3',
    tradeName: 'Electral ORS Powder',
    genericName: 'Oral Rehydration Salts IP',
    strength: '21.8 grams sachet',
    composition: 'Sodium Chloride 2.6g, Potassium Chloride 1.5g, Sodium Citrate 2.9g, Dextrose Anhydrous 13.5g',
    dosageForm: 'Powder for Solution',
    manufacturer: 'FDC Limited',
    batchNumber: 'ORS4401',
    expiryDate: null,
    purposeEn: 'Restores electrolytes and fluids lost during diarrhea or dehydration.',
    purposeTe: 'విరేచనాలు లేదా నీరసంలో శరీరం కోల్పోయిన నీరు మరియు లవణాలను అందిస్తుంది.',
    whenToTakeVerified: false,
    instructionsEn: 'Dissolve entire sachet in 1 liter of clean drinking water. Consume within 24 hours.',
    instructionsTe: 'లీటరు కాచి చల్లార్చిన నీటిలో పూర్తి ప్యాకెట్ కలపండి. 24 గంటల్లో తాగాలి.',
    warningsEn: ['Do not boil the prepared solution', 'Use clean drinking water only'],
    warningsTe: ['కలిపిన నీటిని తిరిగి మరిగించవద్దు', 'సురక్షిత మంచినీటిని మాత్రమే వాడండి'],
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951baa74c?w=600&auto=format&fit=crop&q=60',
    ageGroupDosage: [
      {
        group: 'Infants',
        guidance: 'Sip 50ml to 100ml after each loose stool as advised by doctor/ASHA worker.',
        isVerified: true
      },
      {
        group: 'Children',
        guidance: '100ml to 200ml after each loose stool.',
        isVerified: true
      },
      {
        group: 'Teenagers',
        guidance: 'Sip prepared solution freely according to thirst level.',
        isVerified: true
      },
      {
        group: 'Adults',
        guidance: '200ml to 400ml after each loose stool or as required to maintain hydration.',
        isVerified: true
      },
      {
        group: 'Older Adults',
        guidance: 'Drink prepared ORS solution freely. Consult doctor if severe dehydration or kidney condition exists.',
        isVerified: true
      }
    ]
  }
];

export const MOCK_WORKER_PATIENTS: WorkerPatientRecord[] = [
  {
    id: 'rec-102',
    patientName: 'Ravi Kumar',
    age: 42,
    village: 'Ananthapur Village',
    primaryLanguage: 'te',
    chiefConcern: 'High fever for 2 days, worsening at night with severe headache',
    status: 'Pending Review',
    priority: 'High',
    timestamp: '10 mins ago',
    summaryEn: 'Patient reports high grade fever lasting 2 days, increasing in severity at night, accompanied by frontal headache. No vomiting reported.',
    summaryTe: 'రోగి 2 రోజులుగా తీవ్రమైన జ్వరం ఉన్నట్లు చెప్పారు. రాత్రిపూట జ్వరం ఎక్కువవుతోంది మరియు తలనొప్పి ఉంది. వాంతులు లేవు.',
    phone: '+91 99887 11223'
  },
  {
    id: 'rec-103',
    patientName: 'Lakshmi Devi',
    age: 58,
    village: 'Kalyandurg Rural',
    primaryLanguage: 'te',
    chiefConcern: 'Scanned hypertension medicine packaging — query on missing expiry date',
    status: 'Reviewed',
    priority: 'Medium',
    timestamp: '1 hour ago',
    summaryEn: 'Scanned Amlodipine 5mg blister pack. Expiry date unreadable. Requested ASHA worker verification before consumption.',
    summaryTe: 'అమ్లోడిపిన్ 5mg మందు బిళ్ళ ప్యాక్ స్కాన్ చేశారు. గడువు తేదీ స్పష్టంగా లేదు. వాడేముందు ఆశా వర్కర్ నిర్ధారణ కోరారు.',
    phone: '+91 94412 33445'
  }
];

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Ravi Kumar (Self)',
    relation: 'Self',
    age: 42,
    gender: 'Male',
    bloodGroup: 'O+ positive',
    chronicConditions: ['None'],
    lastConsultation: '2026-08-20 (PHC Ananthapur)',
    pendingReminders: ['Check blood pressure next Monday', 'Complete fever follow-up note']
  },
  {
    id: 'fam-2',
    name: 'Parvathi Devi',
    relation: 'Mother',
    age: 67,
    gender: 'Female',
    bloodGroup: 'B+ positive',
    chronicConditions: ['Hypertension', 'Joint Arthritis'],
    lastConsultation: '2026-07-15 (District Govt Hospital)',
    pendingReminders: ['Amlodipine refill due in 5 days', 'Eye check-up at PHC Teleclinic']
  }
];

export const MOCK_ACTIVITIES: HealthcareActivity[] = [
  {
    id: 'act-1',
    type: 'AI_GUIDANCE',
    title: 'Fever & Headache Symptom Structuring',
    summary: 'Organized 2-day fever history with night spikes for PHC doctor consultation.',
    timestamp: 'Yesterday at 4:30 PM'
  },
  {
    id: 'act-2',
    type: 'MEDICINE_SCAN',
    title: 'Scanned Calpol 500mg Packaging',
    summary: 'Extracted Paracetamol 500mg IP label info. Verified when-to-take: After food.',
    timestamp: '3 days ago'
  }
];
