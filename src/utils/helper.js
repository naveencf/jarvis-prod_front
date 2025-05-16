export const stateAbbreviations = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TG",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "West Bengal": "WB",
  Delhi: "DL",
  "Jammu and Kashmir": "JK",
  Ladakh: "LA",
};

export const spokenLanguageData = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Arabic", label: "Arabic" },
  { value: "Bengali", label: "Bengali" },
  { value: "Russian", label: "Russian" },
  { value: "Urdu", label: "Urdu" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Marathi", label: "Marathi" },
  { value: "Telugu", label: "Telugu" },
  { value: "Tamil", label: "Tamil" },
  { value: "Italian", label: "Italian" },
  { value: "Other", label: "Other" },
];

export const bloodGroupData = [
  "A+ (A Positive)",
  "A- (A Negetive)",
  "B+ (B Positive)",
  "B- (B Negetive)",
  "AB+ (AB Positive)",
  "AB- (AB Negetive)",
  "O+ (O Positive)",
  "O- (O Negetive)",
];
export const nationalityData = ["Indian", "USA", "Uk"];
export const bankTypeData = ["Saving A/C", "Current A/C", "Salary A/C"];
export const castOption = ["General", "OBC", "SC", "ST"];
export const genderData = ["Male", "Female", "Other"];

export const IsApplicableData = [
  { label: "PF & ESIC", value: "pf_and_esic" },
  { label: "IN Hand", value: "in_hand" },
  { label: "ESIC", value: "esic" },
];

export function utcToIst(utcDate) {
  let date = new Date(utcDate);
  date.setHours(date.getHours() + 5, date.getMinutes() + 30); // IST is UTC +5:30

  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  let year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const cleanPageName = (name) =>
  name
    ?.toLowerCase()
    ?.trim()
    ?.replace(/^_+|_+$/g, "");

export function formatPageLabel(name) {
  if (!name) return "";

  if (name[0] === "_") {
    return name;
  }

  return name[0].toUpperCase() + name.slice(1);
}
