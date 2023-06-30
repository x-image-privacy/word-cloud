import { CategoryCloud, Word } from "./types";

type Props = {
  wordCloud: CategoryCloud<Word>;
};

const CategoryCloudDisplay = ({ wordCloud }: Props) => {
  const centerRect = wordCloud.words[0].rect;
  const { category } = wordCloud;
  const x = centerRect.x + centerRect.width / 2;
  const y = centerRect.y + centerRect.height / 2;
  return (
    <text
      x={x}
      y={y}
      // useful to have the anchor at the center of the word
      textAnchor="middle"
      // y centering
      dominantBaseline="middle"
    >
      {category}
      <title>Category: {category}; Score: TBA</title>
    </text>
  );
};
export default CategoryCloudDisplay;
