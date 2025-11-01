import { useEffect, useState } from "react";
import { Word } from "./Word";

export interface WordType {
  _id: string;
  dibi: string;
  french: string;
  english: string;
  partOfSpeech: string;
  author: string | null;
  date: string;
  description: string | null;
}

function App() {
  const [dict, setDict] = useState<WordType[]>([]);
  const [filteredWords, setFilteredWords] = useState<WordType[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetch("./dict.json")
      .then((res) => res.json())
      .then((data) => setDict(data));
  }, []);

  useEffect(() => {
    if (dict.length > 0 && search) {
      const s = search.trim().toLowerCase();
      setFilteredWords(
        dict.filter(
          (w) =>
            w.dibi.trim().toLowerCase().includes(s) ||
            w.french.trim().toLowerCase().includes(s) ||
            w.english.trim().toLowerCase().includes(s) ||
            (w.author ? w.author.trim().toLowerCase().includes(s) : false) ||
            (w.description
              ? w.description.trim().toLowerCase().includes(s)
              : false)
        )
      );
    }
  }, [search]);

  return (
    <div className="flexColGap">
      <h1>Dibi Dictionary replacement</h1>
      <a href="https://github.com/MarioVieilledent/pazu" target="_blank">
        Github
      </a>
      <a href="dict.json" target="_blank">
        Liste des mots JSON
      </a>
      <span>Nombre de mots : {dict.length}</span>
      <input
        type="text"
        placeholder="Chercher un mot Français/Dibi"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {search ? (
        <div className="flexColGap">
          <span>{`Résultats pour "${search}" (${filteredWords.length})`}</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content 1fr",
              columnGap: "24px",
              rowGap: "12px",
            }}
          >
            {filteredWords.map((word, index) => (
              <Word key={index} word={word} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flexColGap"></div>
      )}
    </div>
  );
}

export default App;
