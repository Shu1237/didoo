import React from "react";

export default function EventInfor() {
    return (
        <div className="max-w-6xl mx-auto mt-10">
            {/* Wrapper Card */}
            <div className='p-10 text-center'>
                <h1 className='font-semibold text-4xl'> Thông tin sự kiện</h1>
            </div>
            <div className="bg-[#1F1F1F] text-white p-8 md:p-10 rounded-2xl shadow-lg">


                {/* Content Box */}
                <div className="space-y-8 leading-relaxed text-gray-200">

                    {/* Section 1 */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            1. Quy định chung
                        </h3>
                        <ul className="space-y-2 list-disc pl-6">
                            <li>Khán giả có trách nhiệm... (thêm nội dung tại đây)</li>
                            <li>Mỗi tài khoản được phép mua... </li>
                            <li>Vé bị lộ thông tin... </li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            2. Quy định về độ tuổi
                        </h3>
                        <ul className="space-y-2 list-disc pl-6">
                            <li>Sự kiện không phù hợp... </li>
                            <li>Người giám hộ đi cùng... </li>
                            <li>Ban Tổ Chức không chịu... </li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            3. Quy định về sử dụng vé
                        </h3>
                        <ul className="space-y-2 list-disc pl-6">
                            <li>Vé đã mua không hoàn tiền... </li>
                            <li>Người mua không được phép... </li>
                            <li>Khán giả cần giữ vé nguyên vẹn... </li>
                        </ul>
                    </div>

                    {/* Section 4 */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            4. Quy định sử dụng vé cho mục đích thương mại
                        </h3>
                        <ul className="space-y-2 list-disc pl-6">
                            <li>Nghiêm cấm việc bán vé lại... </li>
                            <li>BTC có quyền huỷ vé... </li>
                        </ul>
                    </div>

                    {/* Section 5 */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            5. Quy định khác
                        </h3>
                        <ul className="space-y-2 list-disc pl-6">
                            <li>Việc mua vé đồng nghĩa... </li>
                            <li>BTC có quyền thay đổi... </li>
                            <li>BTC có quyền từ chối... </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
