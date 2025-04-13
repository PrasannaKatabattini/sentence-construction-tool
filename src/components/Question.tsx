import React, { useState } from 'react';

const Question = () => {
  const sentenceTemplate = "The cat ___ on the mat.";
  const options = ["sits", "jumps", "runs", "sleeps"];
  
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleWordSelect = (word: string) => {
    if (selectedWord === word) {
      setSelectedWord(null); // Unselect
    } else {
      setSelectedWord(word);
    }
  };

  const renderSentence = () => {
    return (
      <p className="text-xl mb-4">
        The cat{" "}
        <span
          className={`inline-block px-4 py-1 border rounded cursor-pointer ${
            selectedWord ? "bg-blue-200" : "bg-gray-100"
          }`}
          onClick={() => setSelectedWord(null)}
        >
          {selectedWord || "___"}
        </span>{" "}
        on the mat.
      </p>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-4 text-center">
      {renderSentence()}

      <div className="grid grid-cols-2 gap-4 mt-6">
        {options.map((word) => (
          <button
            key={word}
            className={`py-2 px-4 border rounded transition ${
              selectedWord === word ? "bg-green-300" : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => handleWordSelect(word)}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
