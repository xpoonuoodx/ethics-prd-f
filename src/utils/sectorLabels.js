// กลุ่มอุตสาหกรรมของหน่วยงาน ใช้ร่วมกันระหว่างหน้าจัดการหน่วยงานกับหน้า Dashboard
export const SECTOR_OPTIONS = [
  { value: "government", label: "ภาครัฐ" },
  { value: "finance", label: "การเงินและการธนาคาร" },
  { value: "healthcare", label: "สาธารณสุข" },
  { value: "education", label: "การศึกษา" },
  { value: "industry", label: "อุตสาหกรรม" },
  { value: "commerce", label: "พาณิชย์และบริการ" },
  { value: "other", label: "อื่นๆ" },
];

export const SECTOR_LABELS = SECTOR_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.label;
  return acc;
}, {});
