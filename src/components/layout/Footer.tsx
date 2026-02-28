import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Footer() {
    return (
        <footer className="relative bg-background border-t border-border/40 pt-16 pb-8 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[128px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/DiDoo.png"
                                alt="DiDoo logo"
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-xl"
                                priority
                            />
                            <span className="font-black text-2xl tracking-tighter">DiDoo</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            Khám phá và trải nghiệm những sự kiện tuyệt vời nhất tại thành phố của bạn. Cánh cửa đến những khoảnh khắc đáng nhớ.
                        </p>
                        <div className="space-y-3">
                            <h4 className="font-bold text-sm">Đăng ký nhận tin</h4>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nhập email của bạn"
                                    className="bg-secondary/50 border-white/10 focus-visible:ring-primary/20 rounded-full"
                                />
                                <Button size="icon" className="rounded-full shrink-0">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Về chúng tôi</h3>
                            <ul className="space-y-3 text-muted-foreground text-sm">
                                <li><Link href="#" className="hover:text-primary transition-colors">Câu chuyện</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Tuyển dụng</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Báo chí</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Liên hệ</Link></li>
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Hỗ trợ</h3>
                            <ul className="space-y-3 text-muted-foreground text-sm">
                                <li><Link href="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Chính sách cookie</Link></li>
                            </ul>
                        </div>

                        {/* Column 3 - Contact Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Liên hệ</h3>
                            <ul className="space-y-4 text-muted-foreground text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                                    <span>Tầng 2 Building L1, Long Thạnh Mỹ, Tp Thủ Đức, Tp HCM</span>
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

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DiDoo Inc. All rights reserved.</p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <Link href="#" className="p-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-all duration-300">
                            <Facebook className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-all duration-300">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-white transition-all duration-300">
                            <Instagram className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}