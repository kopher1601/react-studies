import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const adjectives = [
  "幸せな",
  "勇敢な",
  "賢い",
  "優しい",
  "穏やかな",
  "賢明な",
  "速い",
  "明るい",
  "親切な",
  "大胆な",
  "可愛い",
  "素敵な",
  "愉快な",
  "活発な",
  "静かな",
  "情熱的な",
  "創造的な",
  "面白い",
  "真面目な",
  "楽観的な",
];

const nouns = [
  "パンダ",
  "虎",
  "鷲",
  "イルカ",
  "狐",
  "狼",
  "熊",
  "ライオン",
  "鷹",
  "クジラ",
  "兎",
  "象",
  "キリン",
  "猿",
  "ペンギン",
  "ハリネズミ",
  "リス",
  "恐竜",
  "オウム",
  "ハムスター",
];

export const getRandomNickname = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);

  return `${adjective}${noun}${number}`;
};
