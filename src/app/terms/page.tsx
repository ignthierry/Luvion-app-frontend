import React from 'react';
import Navbar from '@/components/Navbar';
import FooterCTA from '@/components/FooterCTA';
import { FileText, CheckCircle, AlertTriangle, UserCheck, ShieldAlert, CreditCard, RefreshCw, Scale } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "7 Juli 2026";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 via-tertiary/5 to-transparent -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary/5 to-tertiary/5 rounded-full blur-[120px] -z-15" />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">Ketentuan Layanan</h1>
            <p className="text-on-surface-variant font-medium">Terakhir Diperbarui: {lastUpdated}</p>
          </div>

          <div className="glass-panel p-8 md:p-12 rounded-3xl space-y-12">
            
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">1. Penerimaan Ketentuan</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Dengan mengakses, menjelajahi, atau menggunakan website dan layanan platform Luvion, Anda secara otomatis menyatakan setuju untuk terikat oleh seluruh aturan dan ketentuan yang tertulis di halaman ini. Jika Anda tidak setuju dengan ketentuan ini, harap hentikan penggunaan layanan kami.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">2. Aturan Penggunaan yang Sah</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Pengguna wajib menggunakan platform Luvion secara etis dan sesuai hukum. Tindakan berikut sangat dilarang:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li>Menggunakan website atau layanan untuk tindakan ilegal, penipuan, atau pelanggaran hukum setempat.</li>
                <li>Meretas, mendistribusikan virus, <em>malware</em>, atau mencoba merusak, melumpuhkan, dan membebani server/sistem Luvion.</li>
                <li>Melakukan <em>scraping</em> data secara ilegal atau menggunakan robot otomatis untuk mengumpulkan data tanpa izin tertulis.</li>
                <li>Menyalahgunakan akun milik orang lain atau berpura-pura menjadi perwakilan Luvion.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">3. Hak Kekayaan Intelektual</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Seluruh konten yang terdapat pada platform Luvion, termasuk namun tidak terbatas pada kode pemrograman (<em>source code</em>), desain antarmuka, logo, teks, grafis, ilustrasi, foto, dan algoritma AI adalah milik eksklusif Luvion atau pemberi lisensi kami.
              </p>
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-on-surface-variant text-sm mt-4">
                <strong>Peringatan Hukum:</strong> Anda dilarang keras untuk menyalin, memodifikasi, mendistribusikan, atau menjual kembali aset-aset tersebut baik sebagian maupun seluruhnya tanpa izin tertulis dan resmi dari pihak manajemen Luvion.
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">4. Akun Pengguna</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Sebagai pengguna platform SaaS Luvion, Anda diwajibkan untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li>Memberikan informasi bisnis dan identitas yang akurat serta valid saat mendaftar atau melakukan <em>upgrade</em> paket.</li>
                <li>Menjaga kerahasiaan kata sandi (<em>password</em>) dan kredensial API akun Anda sendiri.</li>
                <li>Bertanggung jawab atas segala aktivitas yang terjadi di bawah akun Anda.</li>
              </ul>
              <p className="text-on-surface-variant leading-relaxed mt-2">
                Luvion berhak penuh untuk menangguhkan (<em>suspend</em>) atau menghapus akun pengguna secara sepihak dan seketika jika kami menemukan adanya indikasi pelanggaran terhadap aturan yang telah ditetapkan.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">5. Pembatasan Tanggung Jawab</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Layanan Luvion disediakan dengan asas <strong>"Apa Adanya" (<em>As Is</em>)</strong> dan <strong>"Sesuai Ketersediaan" (<em>As Available</em>)</strong>. Kami tidak bertanggung jawab secara hukum atas kerugian materiil atau immateriil yang mungkin Anda alami akibat:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li>Gangguan teknis di luar kendali kami, pemeliharaan sistem darurat, atau <em>server down</em>.</li>
                <li>Kehilangan data yang tidak disengaja akibat kesalahan pengguna atau pihak ketiga.</li>
                <li>Penyalahgunaan layanan oleh pihak luar.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">6. Kebijakan Pembayaran & Pengembalian Dana</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Untuk layanan berlangganan (Paid Pro/Enterprise) dan pembelian modul tambahan:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li>Sistem pembayaran ditagihkan di muka pada setiap siklus penagihan.</li>
                <li>Pengguna dapat membatalkan langganan kapan saja melalui Dasbor, dan tidak akan ditagih pada siklus berikutnya.</li>
                <li><strong>Tidak ada pengembalian dana (<em>Refund</em>)</strong> parsial atau penuh untuk bulan layanan yang sedang berjalan, kecuali terjadi kesalahan fatal (<em>billing error</em>) dari sistem kami.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">7. Perubahan Ketentuan</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Luvion berhak penuh untuk memodifikasi fitur layanan, menghentikan sebagian fungsi (<em>deprecate</em>), atau memperbarui dokumen Ketentuan Layanan ini sewaktu-waktu. Kami akan memperbarui tanggal revisi di halaman ini, dan Anda disarankan untuk memeriksanya secara berkala.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-border/40">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">8. Hukum yang Mengatur</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Syarat dan ketentuan ini, serta hubungan hukum antara Anda dan Luvion, diatur berdasarkan dan ditafsirkan sesuai dengan Hukum Negara Kesatuan Republik Indonesia (NKRI). Segala bentuk sengketa yang timbul akan diselesaikan secara musyawarah, atau melalui pengadilan yang memiliki yurisdiksi di wilayah operasional utama kami.
              </p>
            </section>

          </div>
        </div>
      </main>

      <FooterCTA />
    </div>
  );
}
