import { parseSync, stringifySync, NodeList } from 'subtitle';

export const parseSrt = (content: string): NodeList => {
  const cleaned = content.replace(/\n\s*\n/g, '\n\n').trim();
  return parseSync(cleaned);
};

export const shiftTime = (nodes: NodeList, ms: number): NodeList => {
  return nodes.map((node: any) => {
    if (node.type === 'cue') {
      return {
        ...node,
        data: {
          ...node.data,
          start: Math.max(0, node.data.start + ms),
          end: Math.max(0, node.data.end + ms),
        }
      };
    }
    return node;
  });
};

export const formatTimestamp = (ms: number): string => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor(ms % 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
};

export const stringifySrt = (nodes: NodeList): string => {
  return stringifySync(nodes, { format: 'SRT' });
};
