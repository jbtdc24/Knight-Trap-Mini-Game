export const ShadowKnightIcon = ({ isFrozen }: { isFrozen: boolean }) => (
  <img src={isFrozen ? "/FrozenKnight.png" : "/Blackknight.png"} alt={isFrozen ? "Frozen Shadow Knight" : "Black Knight"} className="w-full h-full object-contain"/>
);
