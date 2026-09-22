// The single pickup point the app serves. Coordinates point at Sichovykh
// Striltsiv street in Lviv, which is the address shown in the header.
export const VENUE = {
  title: 'BrewGo на Січових Стрільців',
  address: 'вул. Січових Стрільців, 12, Львів',
  latitude: 49.8419,
  longitude: 24.0245,
  phone: '+380 32 123 45 67',
  hours: [
    { days: 'Пн – Пт', time: '07:30 – 21:00' },
    { days: 'Сб – Нд', time: '09:00 – 22:00' },
  ],
  highlights: [
    { icon: 'cafe-outline', label: 'Обсмажуємо зерно на місці' },
    { icon: 'wifi-outline', label: 'Безкоштовний Wi-Fi' },
    { icon: 'card-outline', label: 'Оплата карткою і Apple Pay' },
  ],
};
