export const siteUrl = "https://spiritqosqotravel.com";

export const company = {
  legalName: "SPIRIT QOSQO TRAVEL S.A.C.",
  tradeName: "Spirit Qosqo Travel",
  ruc: "20615956997",
  contactAddress: "Urb. Kennedy A, Calle Los Brillantes B-41, Cusco, Peru",
  city: "Cusco",
  country: "PE",
  email: "reservas@spiritqosqotravel.com",
  phone: "+51 982 214 529",
  whatsapp: "+51 982 214 529",
  whatsappNumber: "51982214529",
  openingHours: "Lunes a domingo de 8:00 a.m. a 8:00 p.m.",
  website: siteUrl,
  facebook: "https://www.facebook.com/spiritqosqotravel",
  instagram: "https://www.instagram.com/spiritqosqotravel",
  classification: "Agencia de Viajes y Turismo - Operador de Turismo",
  digitalChannelOwner: "Canal digital administrado por Spirit Qosqo Travel",
  minceturDirectoryStatus: "Constancia de inscripcion en el Directorio Nacional de Prestadores de Servicios Turisticos Calificados pendiente de publicar",
  esnnaPosterUrl: "https://www.gob.pe/institucion/mincetur/normas-legales/736982-108-2020-mincetur",
  paymentProvider: "Medios de pago disponibles previa confirmacion de disponibilidad: Yape, Plin, transferencia bancaria y transferencia interbancaria a cuentas verificadas de la empresa."
};

export const whatsappReservationUrl = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
  "Hola, deseo informacion sobre sus tours en Cusco."
)}`;
