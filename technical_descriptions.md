# Word cloud

## Input

- A list of words with: an ID, a text and a confidence level  
- A container width and height (if not, use a default value)

## Output

A word cloud

![word_cloud](https://user-images.githubusercontent.com/43374563/230405197-985de0df-5e9b-4c76-9f38-04ba9bb5d6f0.png)

## Implementation

- Set the coordinate of the container
- Sort the words by confidence level. The biggest in first.
- Define each word as a rectangle with the centre coordinate, width and height.
  - The size of the rectangle corresponds to the confidence level. The larger the confidence, the larger the rectangle
  - The front size is define as: $(a - b) (\frac{1}{1 - b})^{2}(max - min) + min$, where $a$ is the confidence level and $b$ the cut off.
- Place the first word of the list in the centre of the container (so the larger word)
