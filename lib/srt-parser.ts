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

export const stringifySrt = (nodes: NodeList): string => {
  return stringifySync(nodes, { format: 'SRT' });
};
