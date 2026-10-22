export const RAFFLE_CONFIG = {
  title: "¡La Rifa de Lulú! 🎒✨",
  subtitle: "1º de la ESO • Viaje del Cole a Fátima 🚌",
  greeting: "¡Hola a todos! Este curso en 1º de la ESO nos vamos de viaje a Fátima con el cole. Para ayudar a pagar el autobús y la estancia, organizo esta rifa con un premiazo para disfrutar en casa. ¡Muchas gracias por echarme una mano!",
  description: "Ayuda a Lulú (1º de la ESO) a viajar a Fátima con sus compañeros de clase.",
  student: {
    name: "Lulú",
    grade: "1º de la ESO",
    schoolTrip: "Viaje a Fátima",
  },
  prize: {
    title: "Paletilla de Jamón + Queso",
    description: "Una fantástica paletilla de jamón ibérico curado y un queso artesano riquísimo para toda la familia.",
    badge: "🏆 ¡Premio Especial Familias!",
  },
  pricePerNumber: 3, // 3 euros
  currency: "€",
  totalNumbers: 100, // 00 a 99
  organizer: {
    name: "Lulú",
    cause: "Viaje de estudios a Fátima",
    phone: "662357153",
    whatsappPhone: "34662357153",
  },
  payment: {
    bizumPhone: "662357153",
    bizumHolder: "Lulú (1º ESO)",
    conceptPrefix: "Rifa Lulu",
    instructions: "Haz un Bizum de 3€ al número de abajo poniendo en el concepto tu número y tu nombre. Luego pulsa el botón verde para bloquear tu papeleta.",
  },
  draw: {
    rule: "En cuanto completemos los 100 números, el ganador será la papeleta que coincida con las dos últimas cifras del sorteo de la ONCE siguiente.",
    source: "Sorteo de la ONCE",
  },
  admin: {
    defaultPin: "1234",
  }
};
