export interface Bot {
  name: string;
  bio: string;
  type: "supporter" | "troller";
  role: "influencer" | "reply" | "voyeur";
  ie: "introvert" | "extrovert";
  sn: "sensor" | "intuitive";
  tf: "thinker" | "feeler";
  jp: "judger" | "perceiver";
}

export interface StoredBot extends Bot {
  id: string;
  createdAt: string;
} 