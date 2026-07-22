import React from 'react';
import Navbar from '@/components/Navbar';
import FooterCTA from '@/components/FooterCTA';
import { ShieldCheck, Mail, Database, EyeOff, Cookie, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">Kebijakan Privasi</h1>
            <p className="text-on-surface-variant font-medium">Terakhir Diperbarui: {lastUpdated}</p>
          </div>

          <div className="glass-panel p-8 md:p-12 rounded-3xl space-y-12">
            
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">1. Informasi yang Dikumpulkan</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Kami merinci data apa saja yang kami kumpulkan dari pengunjung untuk menjaga transparansi, yang terbagi menjadi dua kategori utama:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li><strong>Data Pribadi yang Diberikan Sukarela:</strong> Meliputi nama, alamat email, nomor telepon, atau data akun yang Anda isi saat menggunakan formulir kontak, mendaftar *newsletter*, atau mendaftar ke layanan kami.</li>
                <li><strong>Data yang Dikumpulkan Otomatis:</strong> Meliputi alamat IP, jenis *browser*, sistem operasi, halaman yang dikunjungi, dan durasi kunjungan (biasanya dikumpulkan melalui layanan analitik standar untuk meningkatkan pengalaman pengguna).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">2. Bagaimana Data Digunakan</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Tujuan kami mengumpulkan data tersebut adalah semata-mata untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li>Memproses layanan, pendaftaran modul SaaS, atau transaksi yang Anda minta.</li>
                <li>Mengirimkan pemberitahuan penting, informasi pembaruan layanan, atau komunikasi pemasaran (dengan opsi untuk berhenti berlangganan kapan saja).</li>
                <li>Menganalisis performa website dan meningkatkan kualitas serta pengalaman pengguna platform Luvion.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">3. Penggunaan Cookies</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Luvion menggunakan <em>cookies</em> untuk mengingat preferensi Anda dan melacak aktivitas kunjungan demi mempersonalisasi pengalaman Anda. Anda memiliki kendali penuh dan dapat mematikan <em>cookies</em> melalui pengaturan <em>browser</em> Anda masing-masing kapan saja tanpa kehilangan akses utama ke situs kami.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <EyeOff className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">4. Pengungkapan kepada Pihak Ketiga</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Kami menyatakan secara tegas bahwa Luvion <strong>tidak akan menjual, memperdagangkan, atau membocorkan</strong> data pribadi Anda kepada pihak luar yang tidak berkepentingan.
              </p>
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-on-surface-variant text-sm mt-4">
                <strong>Catatan Penting:</strong> Data hanya mungkin dibagikan kepada mitra operasional terpercaya kami (seperti penyedia <em>payment gateway</em> atau layanan <em>email hosting</em>) semata-mata untuk mengoperasikan platform, dan mereka terikat oleh perjanjian kerahasiaan data yang ketat.
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">5. Keamanan Data</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Luvion menerapkan langkah-langkah ketat untuk melindungi data Anda dari akses yang tidak sah. Ini mencakup penggunaan enkripsi SSL (HTTPS) untuk semua komunikasi web, lapisan <em>firewall</em> yang andal, serta pembatasan akses data internal hanya kepada personel yang berwenang.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface mb-4">6. Hak-Hak Pengguna</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Anda memegang kendali penuh atas data Anda. Hak Anda meliputi:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li>Hak untuk melihat data apa saja yang kami simpan.</li>
                <li>Hak untuk meminta koreksi jika terdapat kesalahan data.</li>
                <li>Hak untuk meminta data Anda dihapus secara permanen dari <em>database</em> kami (<em>right to be forgotten</em>).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface mb-4">7. Perubahan Kebijakan Privasi</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Kebijakan privasi ini dapat diperbarui sewaktu-waktu sejalan dengan pengembangan fitur baru atau perubahan regulasi. Setiap perubahan signifikan akan kami perbarui dengan mengubah tanggal "Terakhir Diperbarui" di bagian atas halaman ini.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-border/40">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-on-surface">8. Hubungi Kami</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Jika Anda memiliki pertanyaan, komplain, atau permintaan terkait privasi data Anda, silakan hubungi tim dukungan kami:
              </p>
              <div className="mt-4 inline-block bg-surface-variant/50 p-4 rounded-xl border border-border/50">
                <p className="text-on-surface font-semibold">Email Admin: <a href="mailto:admin@luvion.my.id" className="text-primary hover:underline">admin@luvion.my.id</a></p>
                <p className="text-on-surface font-semibold">Email CS: <a href="mailto:cs@luvion.my.id" className="text-primary hover:underline">cs@luvion.my.id</a></p>
                <p className="text-on-surface font-semibold">WhatsApp: <a href="https://wa.me/628197965599" className="text-primary hover:underline">+62 819 7965 599</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <FooterCTA />
    </div>
  );
}
