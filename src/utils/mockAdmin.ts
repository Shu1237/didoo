
export const adminStats = [
    {
        title: "Tổng doanh thu",
        value: "2.4 tỷ VNĐ",
        change: "+12.5%",
        trend: "up",
        icon: "Wallet",
        description: "Doanh thu tháng này"
    },
    {
        title: "Người dùng mới",
        value: "1,234",
        change: "+8.2%",
        trend: "up",
        icon: "Users",
        description: "Đăng ký trong 30 ngày qua"
    },
    {
        title: "Sự kiện Active",
        value: "456",
        change: "-2.4%",
        trend: "down",
        icon: "Calendar",
        description: "Đang diễn ra hoặc sắp tới"
    },
    {
        title: "Vé đã bán",
        value: "89.2k",
        change: "+15.3%",
        trend: "up",
        icon: "Ticket",
        description: "Tổng vé bán ra toàn hệ thống"
    }
];

export const recentActivities = [
    {
        user: "Nguyễn Văn A",
        action: "đã đặt 2 vé",
        target: "Workshop Làm Gốm",
        time: "2 phút trước",
        avatar: "https://i.pravatar.cc/150?u=1"
    },
    {
        user: "Trần Thị B",
        action: "đã đăng ký tài khoản",
        target: "Organizer",
        time: "15 phút trước",
        avatar: "https://i.pravatar.cc/150?u=2"
    },
    {
        user: "Lê Văn C",
        action: "đã tạo sự kiện mới",
        target: "Đêm Nhạc Acoustic",
        time: "1 giờ trước",
        avatar: "https://i.pravatar.cc/150?u=3"
    },
    {
        user: "Phạm Thị D",
        action: "đã rút tiền",
        target: "5.000.000 VNĐ",
        time: "3 giờ trước",
        avatar: "https://i.pravatar.cc/150?u=4"
    }
];

export const revenueData = [
    { name: 'T1', total: 1500 },
    { name: 'T2', total: 2300 },
    { name: 'T3', total: 3400 },
    { name: 'T4', total: 2900 },
    { name: 'T5', total: 4500 },
    { name: 'T6', total: 5100 },
    { name: 'T7', total: 4800 },
    { name: 'T8', total: 5600 },
    { name: 'T9', total: 6200 },
    { name: 'T10', total: 7800 },
    { name: 'T11', total: 8400 },
    { name: 'T12', total: 9200 },
];

export const mockTransactions = [
    {
        id: 'txn_001',
        description: 'Bán vé – Neon Nights Music Festival',
        date: '15/08/2024',
        amount: 25000000,
    },
    {
        id: 'txn_002',
        description: 'Hoa hồng nền tảng – Tech Startup Summit',
        date: '20/08/2024',
        amount: 12000000,
    },
    {
        id: 'txn_003',
        description: 'Thanh toán cho Organizer – Summer Food Carnival',
        date: '25/08/2024',
        amount: -18000000,
    },
    {
        id: 'txn_004',
        description: 'Bán vé – Marathon for Charity',
        date: '01/09/2024',
        amount: 9000000,
    },
];

export const mockUsers = [
    {
        id: 'user_001',
        name: 'Nguyễn Văn A',
        email: 'a.nguyen@gmail.com',
        role: 'USER',
    },
    {
        id: 'user_002',
        name: 'Trần Thị B',
        email: 'b.tran@gmail.com',
        role: 'ORGANIZER',
    },
    {
        id: 'user_003',
        name: null,
        email: 'admin@eventhub.com',
        role: 'ADMIN',
    },
    {
        id: 'user_004',
        name: 'Lê Minh C',
        email: 'c.le@gmail.com',
        role: 'STAFF',
    },
];
