export const calculateMBTI = (bot: Bot): string => {
  const i_e = bot.ie === "introvert" ? "I" : "E";
  const s_n = bot.sn === "sensor" ? "S" : "N";
  const t_f = bot.tf === "thinker" ? "T" : "F";
  const j_p = bot.jp === "judger" ? "J" : "P";
  return `${i_e}${s_n}${t_f}${j_p}`;
};

export const getMBTIDescription = (type: string): string => {
  const descriptions: { [key: string]: string } = {
    ISTJ: "The Logistician - Practical and fact-minded individuals, whose reliability cannot be doubted.",
    ISFJ: "The Defender - Very dedicated and warm protectors, always ready to defend their loved ones.",
    INFJ: "The Advocate - Quiet and mystical, yet very inspiring and tireless idealists.",
    INTJ: "The Architect - Imaginative and strategic thinkers, with a plan for everything.",
    ISTP: "The Virtuoso - Bold and practical experimenters, masters of all kinds of tools.",
    ISFP: "The Adventurer - Flexible and charming artists, always ready to explore and experience something new.",
    INFP: "The Mediator - Poetic, kind and altruistic people, always eager to help a good cause.",
    INTP: "The Logician - Innovative inventors with an unquenchable thirst for knowledge.",
    ESTP: "The Entrepreneur - Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
    ESFP: "The Entertainer - Spontaneous, energetic and enthusiastic entertainers who love life.",
    ENFP: "The Campaigner - Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
    ENTP: "The Debater - Smart and curious thinkers who cannot resist an intellectual challenge.",
    ESTJ: "The Executive - Excellent administrators, unsurpassed at managing things or people.",
    ESFJ: "The Consul - Extraordinarily caring, social and popular people, always eager to help.",
    ENFJ: "The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners.",
    ENTJ: "The Commander - Bold, imaginative and strong-willed leaders, always finding a way or making one.",
  };
  return descriptions[type] || "Personality type description not found";
};
