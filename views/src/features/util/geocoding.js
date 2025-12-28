export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { 'User-Agent': 'LocalLoop/1.0' } }
    );
    if (!res.ok) throw new Error('Failed to reverse-geocode');
    const data = await res.json();
    const addr = data.address || {};
    return {
      city: addr.city || addr.town || addr.village || addr.state || null,
      country: addr.country || null,
    };
  } catch (err) {
    console.warn('Reverse-geocode failed:', err);
    return { city: null, country: null };
  }
}
