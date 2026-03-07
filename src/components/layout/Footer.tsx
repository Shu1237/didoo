import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-zinc-200 pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1 space-y-6">
            <Link href="/home" className="flex items-center gap-3">
              <Image
                src="/DiDoo.png"
                alt="DiDoo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl"
                priority
              />
              <span className="font-bold text-2xl tracking-tight text-zinc-900">
                DiDoo
              </span>
            </Link>
            <p className="text-zinc-600 leading-relaxed text-sm">
              Khám phá và trải nghiệm những sự kiện tuyệt vời. Cổng vào những
              khoảnh khắc đáng nhớ.
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-zinc-900">
                Đăng ký nhận tin
              </h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Email của bạn"
                  className="h-10 rounded-xl bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-500 focus-visible:ring-primary/30 focus-visible:border-primary/30"
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl shrink-0 bg-primary hover:bg-primary/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-zinc-900">Về chúng tôi</h3>
              <ul className="space-y-3 text-zinc-600 text-sm">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Câu chuyện
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-base text-zinc-900">Hỗ trợ</h3>
              <ul className="space-y-3 text-zinc-600 text-sm">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-base text-zinc-900">Liên hệ</h3>
              <ul className="space-y-4 text-zinc-600 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Tầng 2 Building L1, Long Thạnh Mỹ, Tp Thủ Đức, Tp HCM
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span>+84 917 234 XXX</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span>support@didoo.vn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} DiDoo. Bảo lưu mọi quyền.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="p-2.5 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="p-2.5 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="p-2.5 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
