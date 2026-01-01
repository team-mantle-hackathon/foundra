import type { ReactNode } from "react";

export default function Explore(): ReactNode {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-10">
        <header className="space-y-3">
          <p className="text-xs text-emerald-300 uppercase tracking-[0.16em]">
            Explore
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Why Indonesian real estate RWA?
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-3xl">
            Alih-alih tokenisasi US T-Bills yang sudah mainstream, kami fokus ke
            pembiayaan konstruksi perumahan di Indonesia. Ini pasar yang besar,
            sering macet di sisi pendanaan, dan cocok untuk model cash
            flow-based lending yang ditokenisasi.
          </p>
        </header>

        {/* 3 columns thesis */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <p className="text-xs font-semibold text-emerald-300">
              1 · Real demand
            </p>
            <p className="text-sm text-slate-200">
              Backlog perumahan Indonesia masih tinggi. Developer butuh modal
              konstruksi, tapi akses ke bank sering lama dan rigid.
            </p>
            <p className="text-xs text-slate-500">
              Cash flow dari penjualan rumah adalah sumber pelunasan yang
              jelas dan bisa dimodelkan.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <p className="text-xs font-semibold text-emerald-300">
              2 · Cash flow, not land
            </p>
            <p className="text-sm text-slate-200">
              Kami tidak menokenisasi sertifikat tanah. Yang ditokenisasi adalah
              arus kas proyek: pembiayaan konstruksi yang dibayar kembali ketika
              unit terjual.
            </p>
            <p className="text-xs text-slate-500">
              Ini lebih realistis secara legal dan lebih dekat dengan praktik
              project financing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <p className="text-xs font-semibold text-emerald-300">
              3 · Global capital, local projects
            </p>
            <p className="text-sm text-slate-200">
              Investor global bisa ikut membiayai proyek perumahan lokal via
              stablecoin, dengan struktur note token yang transparan.
            </p>
            <p className="text-xs text-slate-500">
              Layer likuiditas baru di atas real estate Indonesia.
            </p>
          </div>
        </section>

        {/* AI angle */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">AI as credit analyst</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <p className="text-xs font-semibold text-emerald-300">
                Data in
              </p>
              <p className="text-sm text-slate-200">
                Lokasi, harga tanah sekitar, jumlah unit, RAB, harga jual per
                unit, dan durasi proyek.
              </p>
              <p className="text-xs text-slate-500">
                Developer mengisi form terstruktur + deskripsi proyek.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <p className="text-xs font-semibold text-emerald-300">
                Model & scoring
              </p>
              <p className="text-sm text-slate-200">
                Engine AI kami menghitung margin, sensitivitas penjualan, dan
                memberi skor risiko (A–C) dengan penjelasan yang bisa dibaca
                manusia.
              </p>
              <p className="text-xs text-slate-500">
                AI sebagai asisten komite kredit, bukan pengganti manusia.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <p className="text-xs font-semibold text-emerald-300">
                Output ke on-chain
              </p>
              <p className="text-sm text-slate-200">
                Hanya proyek dengan skor memadai yang bisa dibuka menjadi pool
                pendanaan on-chain. Terms dan risk grade muncul di halaman
                Vaults.
              </p>
              <p className="text-xs text-slate-500">
                Investor lihat rating & reasoning sebelum masuk pool.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
