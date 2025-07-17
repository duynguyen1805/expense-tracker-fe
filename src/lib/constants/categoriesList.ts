import { ECategoriesType } from "../enums/category.enum";

// export const defaultListCategories = [
//   {
//     id: 0,
//     cateroryName: "Ăn uống",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "🍽️",
//     categoryColor: "#f97316", // cam
//   },
//   {
//     id: 1,
//     cateroryName: "Đi lại (xăng xe, xe buýt, Grab)",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "🛵",
//     categoryColor: "#10b981", // xanh lá
//   },
//   {
//     cateroryName: "Thuê nhà",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "🏠",
//     categoryColor: "#6366f1", // xanh tím
//   },
//   {
//     cateroryName: "Điện nước",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "💡",
//     categoryColor: "#facc15", // vàng
//   },
//   {
//     id: 2,
//     cateroryName: "Internet",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "🌐",
//     categoryColor: "#3b82f6", // xanh dương
//   },
//   {
//     id: 3,
//     cateroryName: "Y tế & thuốc men",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "💊",
//     categoryColor: "#ef4444", // đỏ
//   },
//   {
//     id: 4,
//     cateroryName: "Học phí / Khóa học bắt buộc",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "📚",
//     categoryColor: "#8b5cf6", // tím
//   },
//   {
//     id: 5,
//     cateroryName: "Phí sinh hoạt (rác, điện thoại...)",
//     typeCategory: ECategoriesType.ESSENTIAL_NEED,
//     categoryIcon: "🧾",
//     categoryColor: "#eab308", // vàng đậm
//   },
//   {
//     id: 6,
//     cateroryName: "Giải trí (phim, Netflix, game)",
//     typeCategory: ECategoriesType.PERSONAL_WANTS,
//     categoryIcon: "🎮",
//     categoryColor: "#ec4899", // hồng
//   },
//   {
//     id: 7,
//     cateroryName: "Mua sắm cá nhân (quần áo, mỹ phẩm...)",
//     typeCategory: ECategoriesType.PERSONAL_WANTS,
//     categoryIcon: "🛍️",
//     categoryColor: "#d946ef", // hồng tím
//   },
//   {
//     id: 8,
//     cateroryName: "Du lịch / Dã ngoại",
//     typeCategory: ECategoriesType.PERSONAL_WANTS,
//     categoryIcon: "🌴",
//     categoryColor: "#22d3ee", // xanh cyan
//   },
//   {
//     id: 9,
//     cateroryName: "Đồ công nghệ (tai nghe, phụ kiện...)",
//     typeCategory: ECategoriesType.PERSONAL_WANTS,
//     categoryIcon: "🎧",
//     categoryColor: "#0ea5e9", // xanh dương nhạt
//   },
//   {
//     id: 10,
//     cateroryName: "Cafe / Ăn chơi với bạn bè",
//     typeCategory: ECategoriesType.PERSONAL_WANTS,
//     categoryIcon: "☕",
//     categoryColor: "#c084fc", // tím nhạt
//   },
//   {
//     id: 11,
//     cateroryName: "Gửi tiết kiệm",
//     typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
//     categoryIcon: "💰",
//     categoryColor: "#16a34a", // xanh lá đậm
//   },
//   {
//     id: 12,
//     cateroryName: "Đầu tư (cổ phiếu, crypto...)",
//     typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
//     categoryIcon: "📈",
//     categoryColor: "#0f766e", // teal
//   },
//   {
//     id: 13,
//     cateroryName: "Hỗ trợ người thân",
//     typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
//     categoryIcon: "🤝",
//     categoryColor: "#10b981", // xanh lá trung
//   },
//   {
//     id: 14,
//     cateroryName: "Dự phòng khẩn cấp",
//     typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
//     categoryIcon: "🧯",
//     categoryColor: "#f87171", // đỏ nhạt
//   },
//   {
//     id: 15,
//     cateroryName: "Quà tặng / Mừng cưới / Sinh nhật",
//     typeCategory: ECategoriesType.FAMILY_AND_GIVING,
//     categoryIcon: "🎁",
//     categoryColor: "#f59e0b", // cam vàng
//   },
//   {
//     id: 16,
//     cateroryName: "Từ thiện",
//     typeCategory: ECategoriesType.FAMILY_AND_GIVING,
//     categoryIcon: "❤️",
//     categoryColor: "#ef4444", // đỏ
//   },
//   {
//     id: 17,
//     categoryName: "Khác",
//     typeCategory: ECategoriesType.OTHER,
//     categoryIcon: "📦",
//     categoryColor: "#9ca3af", // xám
//   },
// ];

export type TListCategories = (typeof defaultListCategories)[number];

// export const listIncomeSourceName = [
//   {
//     label: "Salary",
//     sourceName: ECategoriesType.SALARY,
//     icon: "💼",
//     color: "#ef4444",
//   },
//   ...
// ] as const;

// type TIncomeSourceItem = {
//   label: string;
//   sourceName: ECategoriesType;
//   icon: string;
//   color: string;
// }

export const defaultListCategories = [
  {
    id: 0,
    categoryName: "Food & Drinks",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "🍽️",
    categoryColor: "#f97316", // orange
  },
  {
    id: 1,
    categoryName: "Transportation (fuel, bus, Grab)",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "🛵",
    categoryColor: "#10b981", // green
  },
  {
    categoryName: "Rent",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "🏠",
    categoryColor: "#6366f1", // indigo
  },
  {
    categoryName: "Utilities (electricity, water)",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "💡",
    categoryColor: "#facc15", // yellow
  },
  {
    id: 2,
    categoryName: "Internet",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "🌐",
    categoryColor: "#3b82f6", // blue
  },
  {
    id: 3,
    categoryName: "Healthcare & Medicine",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "💊",
    categoryColor: "#ef4444", // red
  },
  {
    id: 4,
    categoryName: "Tuition / Mandatory courses",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "📚",
    categoryColor: "#8b5cf6", // purple
  },
  {
    id: 5,
    categoryName: "Living fees (trash, phone, etc.)",
    typeCategory: ECategoriesType.ESSENTIAL_NEED,
    categoryIcon: "🧾",
    categoryColor: "#eab308", // dark yellow
  },
  {
    id: 6,
    categoryName: "Entertainment (movies, Netflix, games)",
    typeCategory: ECategoriesType.PERSONAL_WANTS,
    categoryIcon: "🎮",
    categoryColor: "#ec4899", // pink
  },
  {
    id: 7,
    categoryName: "Personal shopping (clothes, cosmetics...)",
    typeCategory: ECategoriesType.PERSONAL_WANTS,
    categoryIcon: "🛍️",
    categoryColor: "#d946ef", // pink-purple
  },
  {
    id: 8,
    categoryName: "Travel / Picnic",
    typeCategory: ECategoriesType.PERSONAL_WANTS,
    categoryIcon: "🌴",
    categoryColor: "#22d3ee", // cyan
  },
  {
    id: 9,
    categoryName: "Technology gadgets (headphones, accessories...)",
    typeCategory: ECategoriesType.PERSONAL_WANTS,
    categoryIcon: "🎧",
    categoryColor: "#0ea5e9", // light blue
  },
  {
    id: 10,
    categoryName: "Cafe / Hangout with friends",
    typeCategory: ECategoriesType.PERSONAL_WANTS,
    categoryIcon: "☕",
    categoryColor: "#c084fc", // light purple
  },
  {
    id: 11,
    categoryName: "Savings",
    typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
    categoryIcon: "💰",
    categoryColor: "#16a34a", // dark green
  },
  {
    id: 12,
    categoryName: "Investment (stocks, crypto...)",
    typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
    categoryIcon: "📈",
    categoryColor: "#0f766e", // teal
  },
  {
    id: 13,
    categoryName: "Supporting family",
    typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
    categoryIcon: "🤝",
    categoryColor: "#10b981", // medium green
  },
  {
    id: 14,
    categoryName: "Emergency fund",
    typeCategory: ECategoriesType.SAVING_AND_INVESTMENT,
    categoryIcon: "🧯",
    categoryColor: "#f87171", // light red
  },
  {
    id: 15,
    categoryName: "Gifts / Weddings / Birthdays",
    typeCategory: ECategoriesType.FAMILY_AND_GIVING,
    categoryIcon: "🎁",
    categoryColor: "#f59e0b", // amber
  },
  {
    id: 16,
    categoryName: "Charity",
    typeCategory: ECategoriesType.FAMILY_AND_GIVING,
    categoryIcon: "❤️",
    categoryColor: "#ef4444", // red
  },
  {
    id: 17,
    categoryName: "Others",
    typeCategory: ECategoriesType.OTHER,
    categoryIcon: "📦",
    categoryColor: "#9ca3af", // gray
  },
];
