import React, { useState, useEffect } from 'react';
import { getGraph } from '@/lib/api';
import { motion } from 'framer-motion';

const DocumentGraph = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGraph().then(data => {
      // Improved layout logic to prevent overlap
      // We'll use a circular/grid hybrid approach
      const formattedNodes = data.nodes.map((node: any, idx: number) => {
        const radius = 180;
        const angle = (idx / data.nodes.length) * 2 * Math.PI;
        return {
          ...node,
          x: 400 + Math.cos(angle) * radius,
          y: 280 + Math.sin(angle) * (radius * 0.7),
        };
      });
      setNodes(formattedNodes);
      setEdges(data.edges || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-obsidian-card/30 rounded-[2rem]">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-amber-primary/20 border-t-amber-primary rounded-full animate-spin" />
            <p className="text-[10px] text-amber-primary font-black uppercase tracking-[0.3em] animate-pulse">Mapping Intelligence Nodes...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[580px] relative overflow-hidden bg-obsidian-card/20 rounded-[2.5rem] border border-amber-primary/5">
        <div className="absolute top-0 left-0 p-10 z-10">
            <h3 className="text-xl font-outfit font-bold text-text-luxury amber-text-glow">Knowledge <span className="text-amber-primary font-light italic">Topology</span></h3>
            <p className="text-[10px] text-text-dim uppercase tracking-[0.2em] font-bold mt-2 opacity-60">Neural relationship mapping via semantic overlap</p>
        </div>
        
        <svg className="w-full h-full relative z-0" viewBox="0 0 800 580">
            <defs>
               <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                     <feMergeNode in="coloredBlur"/>
                     <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
               {/* Arrow marker for edges */}
               <marker id="arrow" viewBox="0 -5 10 10" refX="25" refY="0" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,-5L10,0L0,5" fill="#FFBF00" opacity="0.3" />
               </marker>
            </defs>

            {/* Edges with Labels */}
            {edges.map((edge, idx) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const pathId = `path-${idx}`;
              return (
                <g key={idx}>
                  <path 
                    id={pathId}
                    d={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                    stroke="#FFBF00" 
                    strokeWidth="1" 
                    opacity="0.1" 
                    fill="none"
                    markerEnd="url(#arrow)"
                    className="animate-pulse"
                  />
                  <text className="text-[7px] uppercase tracking-widest font-black fill-text-dim/40 italic">
                    <textPath xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle">
                      {edge.label}
                    </textPath>
                  </text>
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodes.map((node, i) => (
               <motion.g 
                 key={node.id || i}
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ type: 'spring', damping: 15, delay: i * 0.1 }}
                 className="cursor-pointer group"
               >
                  {/* Outer Aura */}
                  <circle cx={node.x} cy={node.y} r="25" fill="#FFBF00" className="opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500" />
                  
                  {/* Pulsing ring */}
                  <circle cx={node.x} cy={node.y} r="10" fill="none" stroke="#FFBF00" strokeWidth="1.5" opacity="0.3">
                     <animate attributeName="r" from="10" to="20" dur="4s" repeatCount="indefinite" />
                     <animate attributeName="opacity" from="0.3" to="0" dur="4s" repeatCount="indefinite" />
                  </circle>

                  {/* Core Node */}
                  <circle 
                    cx={node.x} cy={node.y} r="6" 
                    fill="#FFBF00" 
                    filter="url(#glow)"
                    className="amber-glow group-hover:scale-125 transition-transform" 
                  />
                  
                  {/* Label - Positioned strategically to avoid overlap */}
                  <text 
                    x={node.x} y={node.y + 25} 
                    textAnchor="middle"
                    className="text-[8px] fill-text-luxury select-none font-black uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 group-hover:fill-amber-primary transition-all pointer-events-none"
                  >
                    {node.name}
                  </text>
               </motion.g>
            ))}
        </svg>

        {nodes.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-text-dim font-medium italic opacity-40">No intelligence nodes detected. Upload documents to begin mapping.</p>
           </div>
        )}
    </div>
  );
};

export default DocumentGraph;
