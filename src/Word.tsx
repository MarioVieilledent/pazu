import { useState } from "react";
import type { WordType } from "./App";

export const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString("fr", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const Word = ({ word }: { word: WordType }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return (
      <div
        style={{
          gridColumnStart: 1,
          gridColumnEnd: 3,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingBottom: "24px",
        }}
        onClick={() => setShowDetails((prev) => !prev)}
      >
        <span className={word.partOfSpeech}>{word.dibi}</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            columnGap: "24px",
            rowGap: "12px",
            marginLeft: "6px",
            paddingLeft: "24px",
            borderLeft: "1px solid white",
          }}
        >
          <span style={{ fontSize: "12px", color: "gray" }}>
            Classe grammaticale
          </span>
          <span className={word.partOfSpeech}>{word.partOfSpeech}</span>
          <span style={{ fontSize: "12px", color: "gray" }}>Français</span>
          <span>{word.french}</span>
          <span style={{ fontSize: "12px", color: "gray" }}>Anglais</span>
          <span>{word.english}</span>
          <span style={{ fontSize: "12px", color: "gray" }}>Description</span>
          <span>{word.description}</span>
          <span style={{ fontSize: "12px", color: "gray" }}>Date d'ajout</span>
          <span>{formatDate(word.date)}</span>
          <span style={{ fontSize: "12px", color: "gray" }}>Auteur</span>
          <span>{word.author}</span>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <span
          className={word.partOfSpeech}
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {word.dibi}
        </span>
        <span onClick={() => setShowDetails((prev) => !prev)}>
          {word.french}
        </span>
      </>
    );
  }
};
