import { EIncomeTypeSourceName } from "../enums/income.enum";

export const listIncomeSourceName = [
  {
    label: "Salary",
    sourceName: EIncomeTypeSourceName.SALARY,
    icon: "💼", // Công việc, lương
    color: "#ef4444",
  },
  {
    label: "Bonus",
    sourceName: EIncomeTypeSourceName.BONUS,
    icon: "🎁", // Thưởng, quà
    color: "#10b981",
  },
  {
    label: "Freelance",
    sourceName: EIncomeTypeSourceName.FREELANCE,
    icon: "🧑‍💻", // Làm việc tự do
    color: "#6366f1",
  },
  {
    label: "Business",
    sourceName: EIncomeTypeSourceName.BUSINESS,
    icon: "🏢", // Kinh doanh
    color: "#f97316",
  },
  {
    label: "Investment",
    sourceName: EIncomeTypeSourceName.INVESTMENT,
    icon: "📈", // Đầu tư, chứng khoán
    color: "#0ea5e9",
  },
  {
    label: "Loan Return",
    sourceName: EIncomeTypeSourceName.LOAN_RETURN,
    icon: "💸", // Tiền được trả lại
    color: "#f59e0b",
  },
  {
    label: "Gift",
    sourceName: EIncomeTypeSourceName.GIFT,
    icon: "🎉", // Quà tặng
    color: "#a855f7",
  },
  {
    label: "Rental",
    sourceName: EIncomeTypeSourceName.RENTAL,
    icon: "🏠", // Cho thuê nhà
    color: "#22c55e",
  },
  {
    label: "Scholarship",
    sourceName: EIncomeTypeSourceName.SCHOLARSHIP,
    icon: "🎓", // Học bổng
    color: "#3b82f6",
  },
  {
    label: "Other",
    sourceName: EIncomeTypeSourceName.OTHER,
    icon: "🧾", // Khác
    color: "#6b7280",
  },
];

export type TIncomeSourceItem = (typeof listIncomeSourceName)[number];

// export const listIncomeSourceName = [
//   {
//     label: "Salary",
//     sourceName: EIncomeTypeSourceName.SALARY,
//     icon: "💼",
//     color: "#ef4444",
//   },
//   ...
// ] as const;

// type TIncomeSourceItem = {
//   label: string;
//   sourceName: EIncomeTypeSourceName;
//   icon: string;
//   color: string;
// }
