import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">UIT Kutubxona</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Innovatsion Texnologiyalar Universiteti kutubxonasi. 
              Zamonaviy ta'lim va innovatsion texnologiyalar asosida 
              malakali mutaxassislar tayyorlaymiz.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Bog'lanish</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">
                  Qoraqalpog'iston R., Xo'jayli t., Murtazabiy OFY, 
                  Taxitash ko'chasi, 28-uy
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+998 (61) 225 65 66</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info@nukusii.uz</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tezkor havolalar</h4>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white transition-colors">
                Bosh sahifa
              </a>
              <a href="/books" className="block text-gray-300 hover:text-white transition-colors">
                Kitoblar
              </a>
              <a href="/categories" className="block text-gray-300 hover:text-white transition-colors">
                Kategoriyalar
              </a>
              <a href="/register" className="block text-gray-300 hover:text-white transition-colors">
                Ro'yxatdan o'tish
              </a>
              <a href="/login" className="block text-gray-300 hover:text-white transition-colors">
                Kirish
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 UIT Kutubxona. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
