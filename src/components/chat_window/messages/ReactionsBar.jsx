import React from "react";

const EMOJIS = [
  { emoji: "❤️", label: "love" },
  { emoji: "👍", label: "thumbs_up" },
  { emoji: "😂", label: "laugh" },
  { emoji: "🔥", label: "fire" },
  { emoji: "🎉", label: "celebrate" },
  { emoji: "😮", label: "wow" },
  { emoji: "👏", label: "clap" },
];

const ReactionsBar = ({ reactions = {}, currentUid, onToggleReaction }) => {
  // reactions is an object: { "❤️": ["uid1", "uid2"], "👍": ["uid1"] }
  const activeEmojis = Object.keys(reactions).filter((emoji) => {
    const list = reactions[emoji];
    return Array.isArray(list) && list.length > 0;
  });

  if (activeEmojis.length === 0) return null;

  return (
    <div className="reactions-container">
      {activeEmojis.map((emoji) => {
        const uids = reactions[emoji] || [];
        const isUserReacted = currentUid && uids.includes(currentUid);
        return (
          <button
            key={emoji}
            className={`reaction-pill ${isUserReacted ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleReaction(emoji);
            }}
            title={`${uids.length} reaction${uids.length > 1 ? "s" : ""}`}
          >
            <span>{emoji}</span>
            <span>{uids.length}</span>
          </button>
        );
      })}
    </div>
  );
};

export { EMOJIS };
export default ReactionsBar;
