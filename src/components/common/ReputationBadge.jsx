import React from "react";
import { Tag } from "rsuite";

const BADGE_CONFIG = {
  "Verified Faculty": { color: "orange", icon: "👨‍🏫" },
  "Verified TA": { color: "cyan", icon: "📘" },
  "Verified Club Lead": { color: "violet", icon: "🎯" },
  "Campus Admin": { color: "red", icon: "🛡️" },
  "Top Contributor": { color: "green", icon: "🏆" },
  "Study Helper": { color: "blue", icon: "📚" },
  "Coding Expert": { color: "violet", icon: "💻" },
  "Mentor": { color: "yellow", icon: "🌟" },
  "Resource Provider": { color: "cyan", icon: "📦" },
};

const ReputationBadge = ({ badge, size = "sm" }) => {
  const config = BADGE_CONFIG[badge] || { color: "blue", icon: "🏅" };

  return (
    <Tag color={config.color} size={size} style={{ fontWeight: 600 }}>
      {config.icon} {badge}
    </Tag>
  );
};

export const AVAILABLE_BADGES = Object.keys(BADGE_CONFIG);
export default ReputationBadge;
