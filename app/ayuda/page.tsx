import Link from "next/link";

export default function AyudaPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Ayuda</h1>
      <p className="mb-6 text-gray-700">Encuentra respuestas a las preguntas más frecuentes sobre tu experiencia de compra.</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Cómo pagar</h2>
        <p className="text-gray-700">Aceptamos tarjeta de crédito/débito, PayPal y transferencia bancaria. Completa el formulario de pago con tus datos y confirma el pedido.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Qué pasa si no llega el pago</h2>
        <p className="text-gray-700">Si tu pago no se procesa, revisa tu método de pago. Puedes intentar nuevamente, o comunicarte con el soporte para asistencia personalizada.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Reembolso</h2>
        <p className="text-gray-700">Los reembolsos se procesan en hasta 14 días hábiles después de aprobada la devolución. Recibirás un correo de confirmación cuando el monto esté acreditado.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Envío y seguimiento</h2>
        <p className="text-gray-700">Una vez enviado el pedido, te enviaremos el número de seguimiento. Puedes consultarlo en tu cuenta o en el correo de confirmación.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contacto</h2>
        <p className="text-gray-700">Si no encuentras lo que buscas, envía un correo a <a href="mailto:soporte@mi-store.com" className="text-blue-600 underline">soporte@mi-store.com</a>.</p>
      </section>

      <Link href="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </main>
  );
}
