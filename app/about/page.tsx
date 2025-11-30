'use client';

import { GraduationCap, Users, Globe, Award, Target, BookOpen, TrendingUp, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-[#0056b3] selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0056b3]/5 to-[#00a8ff]/5 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#0056b3] hover:text-[#004494] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Asosiy sahifaga qaytish</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <span className="text-[#0056b3] font-bold text-xl tracking-widest uppercase">UIT Kutubxona</span>
          </motion.div>
        </div>
      </div>

      {/* About University Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0056b3] to-[#00a8ff]">
                University of Innovation Technologies
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Qoraqalpog'iston Respublikasida o'z faoliyatini boshlagan birinchi nodavlat oliy ta'lim muassasalaridan biri
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#0056b3] to-[#00a8ff] p-6 rounded-2xl text-white shadow-lg"
            >
              <Users className="w-10 h-10 mb-3" />
              <div className="text-3xl font-bold mb-1">8000+</div>
              <div className="text-sm opacity-90">Talabalar</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#004494] to-[#0056b3] p-6 rounded-2xl text-white shadow-lg"
            >
              <GraduationCap className="w-10 h-10 mb-3" />
              <div className="text-3xl font-bold mb-1">200+</div>
              <div className="text-sm opacity-90">Professor-o'qituvchilar</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#00a8ff] to-[#0088cc] p-6 rounded-2xl text-white shadow-lg"
            >
              <Globe className="w-10 h-10 mb-3" />
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-sm opacity-90">Davlatlar</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#0056b3] to-[#004494] p-6 rounded-2xl text-white shadow-lg"
            >
              <Award className="w-10 h-10 mb-3" />
              <div className="text-3xl font-bold mb-1">21</div>
              <div className="text-sm opacity-90">Hamkor Universitetlar</div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - About */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-[#0056b3] mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Biz haqimizda
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  University of Innovation Technologies Qoraqalpog'iston Respublikasida o'z faoliyatini boshlagan birinchi nodavlat oliy ta'lim muassasalaridan biridir. Universitet oʻz faoliyatini 2022-yil noyabr oyida litsenziya asosida boshlagan.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ayni paytda 200 dan ortiq professor-o'qituvchilar 8 ming nafardan ortiq talaba va yoshlarga ta'lim va tarbiya bermoqda. Universitet oliy ta'lim muassasasi sifatida litsenziyalangan va dunyoning yetakchi universitetlari bilan hamkorlik qiladi.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  O'quv jarayoni xorijiy professor-o'qituvchilarni jalb qilgan holda olib boriladi. Universitet oliy ta'lim tizimida o'z yo'nalishini yo'lga qo'ygan bo'lib, innovatsion ta'limga asoslangan zamonaviy bilimlarga ega yuqori malakali yetakchi mutaxassislarni tayyorlash va ularni jamiyatga integratsiya qilishni maqsad qilgan.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#0056b3]/10 to-[#00a8ff]/10 p-8 rounded-2xl border border-[#0056b3]/20">
                <h3 className="text-2xl font-bold text-[#0056b3] mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Maqsadimiz
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Bizning maqsadimiz - talabalarga nafaqat nazariy bilimlar, balki amaliy ko'nikmalar ham berib, ularni mehnat bozoriga to'liq tayyor qilib yetkazishdir. Universitet o'sib kelayotgan yosh avlodga g'amxo'rlik ko'rsatish, sog'lom, barkamol shaxsni tarbiyalashga intilish, ayni paytda ilg'or ta'lim texnologiyalari asosida yuqori malakali pedagog kadrlar tayyorlashni maqsad qilgan.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white border-2 border-[#0056b3] p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#0056b3] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Reytinglar va Yutuqlar
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-[#0056b3] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Times Higher Education</p>
                      <p className="text-sm text-gray-600">2024-yil oktabr oyida "Jahon universitetlari reytingi - 2025" reytingida "Reportyor" maqomini oldi</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-[#0056b3] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">UI Green Metric World University Rankings</p>
                      <p className="text-sm text-gray-600">2024-yil yakuni bo'yicha dunyoning 30 mingdan ortiq oliy ta'lim muassasalari orasida <strong>1364-o'rin</strong>, O'zbekistondagi 200 dan ortiq oliy ta'lim muassasalari orasida <strong>50-o'rin</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-[#0056b3] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Davlat Stipendiyasi</p>
                      <p className="text-sm text-gray-600">2024-yil 11-dekabrda to'rt nafar talaba davlat stipendiyasiga sazovor bo'ldi</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#0056b3] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Texno Ways Marafon</p>
                      <p className="text-sm text-gray-600">Uch nafar iqtidorli o'quvchilarimiz innovatsion loyihalarini taqdim etib, faol ishtirok etdilar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-[#0056b3] mb-4">Ta'lim Jarayoni</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Universitetda o'quv jarayoni ham kunduzgi, ham sirtqi ta'lim shakllarida zamonaviy usullardan foydalangan holda eng qulay sharoitlarda olib boriladi. O'quv jarayoni ta'lim yo'nalishlariga mos keladigan "Ta'lim to'g'risida"gi qonun, "Davlat ta'lim standarti" va "Malakaviy talablar" asosida olib boriladi.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Ma'ruza va auditoriyalar eng ilg'or axborot texnologiyalari, multimedia proyektorlari, video va audio tizimlari, masofaviy o'qitish vositalari bilan jihozlangan. Elektron va kredit-modulli o'qitish tizimidan foydalangan holda o'quv jarayoni zamonaviy axborot-kommunikatsiya internet texnologiyalari orqali amalga oshirilmoqda.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-[#0056b3] to-[#00a8ff] p-8 rounded-2xl text-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Ilmiy Faoliyat</h4>
                <p className="text-sm opacity-90">
                  2024-yil yanvar oyidan boshlab O'zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Oliy attestatsiya komissiyasi tomonidan ilmiy unvonlar berish tartibi joriy etilmoqda.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Konferensiyalar</h4>
                <p className="text-sm opacity-90">
                  2024-yilda 1 ta respublika miqyosida (Nukus shahrida) va bitta xalqaro konferensiya (Samarqandda) tashkil etildi.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Xalqaro Hamkorlik</h4>
                <p className="text-sm opacity-90">
                  Dunyoning 12 davlatidagi 21 ta oliy ta'lim muassasasi bilan hamkorlik aloqalarini o'rnatgan.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


