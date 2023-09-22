import { InputNode } from '../../WordCloud/types';
import { Category, ExplainabilityNode } from '../types';

export const transformGPipelineData = (
  nodes: ExplainabilityNode[],
  categories: Category[],
) =>
  categories?.map((c) => ({
    category: c.name,
    words: c.elements.reduce<InputNode[]>((words, e) => {
      const el = nodes.find((n) => n.id === e);
      if (el) {
        words.push({ id: el.id, text: el.name, coef: el.score });
      }
      return words;
    }, []),
  }));
