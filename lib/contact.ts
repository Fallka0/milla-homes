export const motherPhoneNumber = "+34652679443";
export const motherPhoneDisplay = "+34 652 679 443";

export const officeAddressStreet = "C. Canónigo Torres, 8";
export const officeAddressCity = "Torrevieja, Alicante";
export const officeAddressDisplay = `${officeAddressStreet} · Torrevieja`;
// Calle Canónigo Torres in the Torrevieja old town.
export const officeMapCenter: [number, number] = [37.9764, -0.6823];

export function getOfficeMapsHref() {
  const query = encodeURIComponent(`Milla Homes, ${officeAddressStreet}, Torrevieja`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getPhoneHref() {
  return `tel:${motherPhoneNumber}`;
}

export function getWhatsAppHref(message: string) {
  const digitsOnly = motherPhoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
