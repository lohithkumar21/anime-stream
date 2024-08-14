import React from "react";
import styled from "styled-components";
import CardSlider from "./CardSlider";

export default function Slider({ movies }) {
  const numOfSections = 4; // Number of partitions
  const length = movies.length;
  
  // Calculate the size of each partition
  const partitionSize = Math.ceil(length / numOfSections);

  // Function to get movies from a range
  const getMoviesFromRange = (from, to) => {
    return movies.slice(from, to);
  };

  return (
    <Container>
      {Array.from({ length: numOfSections }).map((_, index) => {
        const from = index * partitionSize;
        const to = Math.min(from + partitionSize, length);
        const title = getTitleForIndex(index);
        return (
          <CardSlider key={index} data={getMoviesFromRange(from, to)} title={title} />
        );
      })}
    </Container>
  );
}

// Function to generate a title based on the index
const getTitleForIndex = (index) => {
  switch (index) {
    case 0:
      return "Trending Now";
    case 1:
      return "New Releases";
    case 2:
      return "Blockbuster";
    case 3:
      return "Popular on Aniflix";
    default:
      return "";
  }
};

const Container = styled.div``;
