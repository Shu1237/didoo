import Link from "next/link";
import Image from "next/image";
export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/DiDoo.png"
                                    alt="DiDoo logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-md"
                                    priority
                                />
                                <span className="font-bold text-xl">DiDoo</span>
                            </Link>
                        </div>
                        <p className="text-sm">Đi cùng rồi, chơi cùng gì!</p>
                        <div className="space-y-2 text-sm">
                            <p>+0917234</p>
                            <p>support@DiDoo.vn</p>
                            <p>Tầng 2 Building L1, Long Thạnh Mỹ</p>
                            <p>Tp Thủ Đức, Tp HCM, VIỆT NAM</p>
                        </div>
                    </div>

                    {/* Thông tin */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Thông tin</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Quy chế hoạt động
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Chính sách bảo mật thông tin
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Điều khoản và điều kiện giao dịch
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Phương thức thanh toán
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Dịch vụ & Ưu đãi */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Dịch vụ & Ưu đãi</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Điều khoản sử dụng ưu đãi khách hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Điều khoản sử dụng cho Ban tổ chức
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Thông tin */}
                    <div className="space-y-4 ">
                        <h3 className="font-semibold">Thông tin</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Liên hệ và chăm sóc
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Bạn cần liên lạc
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Chatbot
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:opacity-80">
                                    Thường gặp câu hỏi
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                 <div className="mt-4 pt-4 text-sm border-t border-black/10">
                    <p>© {new Date().getFullYear()} Didoo. All right reserved.</p>
                </div>

               
               
            </div>
        </footer>
    );
}