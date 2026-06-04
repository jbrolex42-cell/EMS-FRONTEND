export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const EMERGENCY_TYPES = [
  { value: 'cardiac', label: 'Cardiac Arrest', icon: '💔', severity: 'critical', color: '#FF3B30' },
  { value: 'trauma', label: 'Major Trauma', icon: '🩹', severity: 'high', color: '#FF6B35' },
  { value: 'respiratory', label: 'Breathing Difficulty', icon: '🫁', severity: 'high', color: '#FF9500' },
  { value: 'stroke', label: 'Stroke', icon: '🧠', severity: 'critical', color: '#FF3B30' },
  { value: 'obstetric', label: 'Obstetric Emergency', icon: '🤱', severity: 'high', color: '#FF6B35' },
  { value: 'poisoning', label: 'Poisoning/Overdose', icon: '☠️', severity: 'high', color: '#FF6B35' },
  { value: 'accident', label: 'Road Accident', icon: '🚗', severity: 'high', color: '#FF9500' },
  { value: 'general', label: 'General Emergency', icon: '🏥', severity: 'medium', color: '#34C759' }
];

export const MEMBERSHIP_PLANS = [
  { type: 'individual', label: 'Individual', price: 4000, icon: '👤', features: ['1 person covered', 'Unlimited evacuations', '24/7 response', 'SHA integrated'] },
  { type: 'family', label: 'Family', price: 8000, icon: '👨‍👩‍👧‍👦', features: ['Up to 6 members', 'Unlimited evacuations', '24/7 response', 'Priority dispatch'] },
  { type: 'mum_dad', label: 'Mum & Dad', price: 5000, icon: '👴👵', features: ['2 elderly parents', 'Priority elderly care', 'SMS alerts', 'Home visits'] },
  { type: 'corporate', label: 'Corporate', price: 20000, icon: '🏢', features: ['Up to 50 employees', 'On-site EMT', 'SLA response', 'Monthly reports'] },
  { type: 'school', label: 'School', price: 50000, icon: '🏫', features: ['Up to 500 students', 'School EMT on-site', 'First aid training', 'Annual drills'] },
  { type: 'residential', label: 'Residential', price: 15000, icon: '🏘️', features: ['Up to 20 units', 'Estate EMT', '24/7 patrol', 'AED devices'] },
  { type: 'sacco', label: 'SACCO', price: 10000, icon: '🤝', features: ['Up to 100 members', 'Flexible premiums', 'SHA linkage', 'Group cover'] }
];

export const KENYAN_COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Machakos','Meru',
  'Nyeri','Garissa','Turkana','Mandera','Wajir','Marsabit','Isiolo','Samburu',
  'Kwale','Kilifi','Tana River','Lamu','Taita-Taveta','Kajiado','Makueni',
  'Kiambu','Murang\'a','Kirinyaga','Nyandarua','Laikipia','Baringo','Bomet',
  'Bungoma','Busia','Elgeyo-Marakwet','Embu','Homa Bay','Kakamega','Kericho',
  'Kisii','Kitui','Migori','Narok','Nandi','Nyamira','Siaya','Trans-Nzoia',
  'Uasin Gishu','Vihiga','West Pokot'
];

export const STATUS_COLORS = {
  pending: '#F59E0B',
  dispatched: '#3B82F6',
  enroute: '#F97316',
  on_scene: '#8B5CF6',
  transporting: '#06B6D4',
  at_hospital: '#10B981',
  completed: '#22C55E',
  cancelled: '#6B7280'
};

export const AMBULANCE_TYPES = [
  { value: 'ALS', label: 'Advanced Life Support', description: 'Full ICU-grade mobile unit' },
  { value: 'BLS', label: 'Basic Life Support', description: 'Standard ambulance' },
  { value: 'motorcycle', label: 'Motorcycle First Responder', description: 'Rapid terrain response' },
  { value: 'air', label: 'Air Evacuation', description: 'Helicopter/fixed-wing' },
  { value: 'medical_taxi', label: 'Medical Taxi Escort', description: 'Non-emergency transport' }
];
