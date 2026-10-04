export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-salua-navy p-8 text-center text-white">
        <h1 className="text-5xl font-bold">Salua</h1>
        <p className="max-w-xl text-xl text-salua-turquoise">
          Tu historia clínica, bajo tu control.
        </p>
        <p className="max-w-2xl text-white/80">
          Los médicos verificados cargan estudios firmados. Otros médicos solo
          los leen con tu permiso, por tiempo limitado y con registro de cada
          acceso en Solana. Los documentos nunca van a la cadena.
        </p>
      </section>

      {/* Problem */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-salua-navy">El problema</h2>
        <p className="mt-4 max-w-2xl">
          Tu historia clínica está repartida en cada clínica y nadie sabe quién
          la vio. La ley dice que el dueño sos vos, pero en la práctica no lo sos.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 p-8">
        <h2 className="text-3xl font-bold text-salua-navy">Cómo funciona</h2>
        <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-6">
          <li>El paciente decide quién lee cada estudio, y por cuánto tiempo.</li>
          <li>El acceso vence de verdad: el servicio de llaves consulta Solana.</li>
          <li>Cada lectura queda registrada y es verificable en un explorador.</li>
        </ul>
      </section>

      {/* Security */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-salua-navy">Seguridad</h2>
        <p className="mt-4 max-w-2xl">
          Los archivos se cifran en el navegador con AES-256-GCM antes de subir.
          En la cadena solo hay permisos, hashes y auditoría: nunca documentos.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-salua-navy p-8 text-center text-white/70">
        <p>Franco, Misael, Matías, Maximiliano y Rodrigo · Superteam Argentina</p>
      </footer>
    </main>
  );
}
