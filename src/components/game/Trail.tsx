'use client';

import { motion } from 'framer-motion';
import type { Position } from '@/lib/types';

type TrailProps = {
  path: Position[]; // Should be [start, end]
};

const Trail = ({ path }: TrailProps) => {
  if (path.length < 2) return null;

  const [start, end] = path;
  
  const points: Position[] = [];
  const r1 = start[0];
  const c1 = start[1];
  const r2 = end[0];
  const c2 = end[1];

  const dr = r2 - r1;
  const dc = c2 - c1;

  points.push(start);

  if (Math.abs(dr) > Math.abs(dc)) { // Move is primarily vertical
      points.push([r1 + Math.sign(dr), c1]);
      points.push([r2, c1]); // Corner
  } else { // Move is primarily horizontal
      points.push([r1, c1 + Math.sign(dc)]);
      points.push([r1, c2]); // Corner
  }
  
  points.push(end);
  
  // Use a Set to easily handle unique points, converting to/from JSON to use objects in the Set
  const uniquePoints = Array.from(new Set(points.map(p => JSON.stringify(p)))).map(s => JSON.parse(s));

  return (
    <>
      {uniquePoints.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-[12.5%] w-[12.5%] bg-black/20"
          style={{ top: `${p[0] * 12.5}%`, left: `${p[1] * 12.5}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        />
      ))}
    </>
  );
};

export default Trail;
