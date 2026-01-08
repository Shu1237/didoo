import { date } from "zod";
import { EventCardData } from "./type";


export const MockImage = [
    {
        id: 1,
        imageUrl : '/event1.jpg',
        title: "G-DRAGON 2025 World Tour",
    },
    {
        id: 2,
        imageUrl : '/event2.jpg',
        title: "G-DRAGON 2024 World Tour"
    },
    {
        id: 3,
        imageUrl : '/event3.jpg',
        title: "G-DRAGON 2023 World Tour"
    },
    {
        id: 4,
        imageUrl : '/event4.jpg',
        title: "G-DRAGON 2022 World Tour"
    }
]

export const nowShowingEvents: EventCardData[] = [
  {
    id: 101,
    title: "2025 K-POP SUPER CONCERT",
    subtitle: "IN HO CHI MINH CITY",
    date: "22 tháng 11, 2025",
    time: "18:00 - 22:00",
    location: "Vạn Phúc City",
    priceRange: "1.040.000 đ - 4.550.000 đ",
    imageUrl: "/event1.jpg",
    category: "hòa nhạc",
    lat: 10.842915,
    lng: 106.708161,
  },
  {
    id: 102,
    title: "SƠN TÙNG M-TP SKY TOUR 2025",
    subtitle: "THE FINAL CHAPTER",
    date: "28 tháng 12, 2025",
    time: "19:30",
    location: "Sân vận động Phú Thọ, TP.HCM",
    priceRange: "800.000 đ - 4.800.000 đ",
    imageUrl: "/event2.jpg",
    category: "hòa nhạc",
    lat: 10.776889,
    lng: 106.700806,
  },
  {
    id: 103,
    title: "RAVOLUTION 2025",
    subtitle: "ASIA'S LARGEST EDM FESTIVAL",
    date: "31 tháng 12, 2025",
    time: "16:00 - 04:00",
    location: "Empire City, Thủ Đức",
    priceRange: "1.200.000 đ - 6.800.000 đ",
    imageUrl: "/event3.jpg",
    category: "hòa nhạc",
    lat: 10.823099,
    lng: 106.629664,
  },
  {
    id: 104,
    title: "ĐÊM NHẠC VŨ TRỤ - MONO",
    subtitle: "LIVE CONCERT 2025",
    date: "15 tháng 11, 2025",
    location: "Nhà thi đấu Quân khu 7",
    priceRange: "900.000 đ - 3.500.000 đ",
    imageUrl: "/event4.jpg",
    category: "hòa nhạc",
    lat: 10.800123,
    lng: 106.666456,
  },
  {
    id: 105,
    title: "HOZO MUSIC FESTIVAL 2025",
    subtitle: "HO CHI MINH CITY",
    date: "12 - 14 tháng 12, 2025",
    location: "Phố đi bộ Nguyễn Huệ",
    priceRange: "500.000 đ - 2.800.000 đ",
    imageUrl: "/event4.jpg",
    category: "hòa nhạc",
    lat: 10.777456,
    lng: 106.700789,
  },
];




export const comingSoonEvents: EventCardData[] = [
  {
    id: 201,
    title: "G-DRAGON WORLD TOUR 2025",
    subtitle: "ÜBERMENSCH · HANOI",
    date: "08 tháng 11, 2025",
    time: "20:00",
    location: "8WONDER Ocean City, Hà Nội",
    priceRange: "1.800.000 đ - 8.800.000 đ",
    imageUrl: "/event1.jpg",
    category: "hòa nhạc",
    lat: 21.028511,
    lng: 105.804817,
  },
  {
    id: 202,
    title: "BLACKPINK WORLD TOUR 2025",
    subtitle: "BORN PINK ENCORE · VIETNAM",
    date: "Q1 2026",
    location: "Sân vận động Mỹ Đình, Hà Nội",
    priceRange: "Chưa công bố",
    imageUrl: "/event2.jpg",
    category: "hòa nhạc",
    lat: 21.028511,
    lng: 105.804817,
  },
  {
    id: 203,
    title: "TAYLOR SWIFT | THE ERAS TOUR",
    subtitle: "ASIA LEG 2026",
    date: "Q2 2026",
    location: "Sân vận động Quốc gia Mỹ Đình",
    priceRange: "Chưa công bố",
    imageUrl: "/event3.jpg",
    category: "hòa nhạc",
    lat: 21.028511,
    lng: 105.804817,
  },
  {
    id: 204,
    title: "LẠC TRÔI FESTIVAL 2026",
    subtitle: "SƠN TÙNG M-TP x ĐEN VÂU x BINZ",
    date: "Mùa hè 2026",
    location: "Đà Nẵng",
    priceRange: "Sắp công bố",
    imageUrl: "/event4.jpg",
    category: "hòa nhạc",
    lat: 16.054407,
    lng: 108.202167,
  },
  {
    id: 205,
    title: "COLDPLAY MUSIC OF THE SPHERES",
    subtitle: "WORLD TOUR 2026 · VIETNAM",
    date: "Q3 2026",
    location: "Sân vận động Quốc gia Singapore (chờ VN)",
    priceRange: "Chưa công bố",
    imageUrl: "/event1.jpg",
    category: "hòa nhạc",
    lat: 1.352083,
    lng: 103.819839,
  },
];



export const mapEvents: EventCardData[] = [
  {
    id: 1,
    title: "2025 K-POP SUPER CONCERT IN HO CHI MINH",
    subtitle: "Live music show",
    date: "22/03/2025",
    time: "18:30",
    location: "Vạn Phúc City, TP. Thủ Đức",
    priceRange: "700.000đ – 4.500.000đ",
    imageUrl: "/event1.jpg",
    category: "hòa nhạc",
    lat: 10.842915,
    lng: 106.708161,
  },
  {
    id: 2,
    title: "WaterBomb Ho Chi Minh City 2025",
    subtitle: "Music & Water Festival",
    date: "15/06/2025",
    time: "14:00",
    location: "Khu đô thị Sala, TP. Thủ Đức",
    priceRange: "890.000đ – 4.490.000đ",
    imageUrl: "/event2.jpg",
    category: "triển lãm",
    lat: 10.786693,
    lng: 106.735200,
  },
  {
    id: 3,
    title: "TP.HCM Những Thành Phố Mơ Màng Year End 2025",
    subtitle: "Acoustic & Indie Music",
    date: "29/12/2025",
    time: "17:00",
    location: "Nhà Văn Hóa Thanh Niên, Quận 1",
    priceRange: "520.000đ – 1.080.000đ",
    imageUrl: "/event3.jpg",
    category: "hội thảo",
    lat: 10.776889,
    lng: 106.700806,
  },
];


export const DetailEventMock = {
  id: 101,
  title: "2025 K-POP SUPER CONCERT",
  date: "22 tháng 11, 2025",
  time: "18:00 - 22:00",
  location: "Vạn Phúc City",
  subLocation: "Thủ Đức, TP.HCM",
  price: "1.040.000 đ - 4.550.000 đ",
  imageUrl: "/event1.jpg",
 

}
