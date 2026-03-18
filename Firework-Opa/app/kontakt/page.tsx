export default function KontaktPage() {
  return (
    <div className="min-h-[60vh] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <h1 className="font-heading text-3xl font-bold text-[#f0f4f8] md:text-4xl">
          Kontakt / Über mich
        </h1>
        <div className="mt-8 space-y-4 text-[#94a3b8]">
          <p>
            <strong className="text-[#f0f4f8]">Hartmann UG & Co. KG</strong>
          </p>
          <p>Badergasse 55</p>
          <p>96472 Rödental</p>
          <p className="pt-4">Tel. 09563 4896</p>
          <p>Fax 09563 729 3325</p>
          <p>Mobil 0172 8616347</p>
          <p className="pt-4">Handelsregister Coburg HRA 4727</p>
        </div>
      </div>
    </div>
  );
}
