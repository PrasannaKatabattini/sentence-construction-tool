// import React, { useEffect, useState } from "react";

// type Question = {
//   id: number;
//   sentence: string;
//   options: string[];
//   correctAnswers: string[];
// };

// type Result = {
//   question: Question;
//   userAnswers: string[];
//   isCorrect: boolean;
// };

// const TIME_LIMIT = 30;

// const App: React.FC = () => {
//   const [question, setQuestion] = useState<Question | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
//   const [remainingOptions, setRemainingOptions] = useState<string[]>([]);
//   const [results, setResults] = useState<Result[]>([]);
//   const [isFinished, setIsFinished] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
//   const [totalQuestions, setTotalQuestions] = useState(0);

//   const fetchQuestion = async (index: number) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/question/${index}`);
//       const data = await res.json();
//       if (data.success) {
//         setQuestion(data.data);
//         setRemainingOptions(data.data.options);
//         setSelectedAnswers(Array(data.data.correctAnswers.length).fill(""));
//         setTimeLeft(TIME_LIMIT);
//         setTotalQuestions(data.total);
//       }
//     } catch (error) {
//       console.error("Error fetching question:", error);
//     }
//   };

//   useEffect(() => {
//     fetchQuestion(currentIndex);
//   }, [currentIndex]);

//   useEffect(() => {
//     if (isFinished) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev === 1) {
//           handleNext(true); // auto next
//           return TIME_LIMIT;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [currentIndex, isFinished]);

//   const handleOptionClick = (option: string) => {
//     const firstEmptyIndex = selectedAnswers.findIndex((a) => a === "");
//     if (firstEmptyIndex === -1) return;

//     const updatedAnswers = [...selectedAnswers];
//     updatedAnswers[firstEmptyIndex] = option;
//     setSelectedAnswers(updatedAnswers);

//     const updatedOptions = remainingOptions.filter((opt) => opt !== option);
//     setRemainingOptions(updatedOptions);
//   };

//   const handleBlankClick = (index: number) => {
//     const answerToRemove = selectedAnswers[index];
//     if (!answerToRemove) return;

//     const updatedAnswers = [...selectedAnswers];
//     updatedAnswers[index] = "";
//     setSelectedAnswers(updatedAnswers);

//     setRemainingOptions((prev) => [...prev, answerToRemove]);
//   };

//   const allBlanksFilled = selectedAnswers.every((ans) => ans.trim() !== "");

//   const handleNext = (isTimeout = false) => {
//     if (!question) return;

//     const isCorrect =
//       !isTimeout &&
//       selectedAnswers.every((ans, i) => ans === question.correctAnswers[i]);

//     setResults((prev) => [
//       ...prev,
//       {
//         question,
//         userAnswers: [...selectedAnswers],
//         isCorrect,
//       },
//     ]);

//     if (currentIndex < totalQuestions - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     } else {
//       setIsFinished(true);
//     }
//   };

//   const renderSentence = (sentence: string, answers: string[]) => {
//     const parts = sentence.split("_____________");
//     let rendered = "";

//     for (let i = 0; i < parts.length; i++) {
//       rendered += parts[i];
//       if (i < answers.length) {
//         rendered += answers[i] || "______";
//       }
//     }

//     return rendered;
//   };

//   const renderSentenceWithPlaceholders = (
//     sentence: string,
//     answers: string[]
//   ) => {
//     const parts = sentence.split("_____________");
//     let rendered = "";

//     for (let i = 0; i < parts.length; i++) {
//       rendered += parts[i];
//       if (i < parts.length - 1) {
//         rendered += answers[i] && answers[i].trim() !== "" ? answers[i] : "______";
//       }
//     }

//     return rendered;
//   };

//   const calculateScore = () => {
//     return results.filter((r) => r.isCorrect).length;
//   };

//   if (!question && !isFinished) return <div className="p-6">Loading...</div>;

//   if (isFinished) {
//     return (
//       <div className="p-8 max-w-3xl mx-auto font-sans">
//         <h1 className="text-2xl font-bold mb-6">Your Results</h1>
//         {results.map((res, idx) => (
//           <div
//             key={idx}
//             className={`border p-4 mb-4 rounded ${
//               res.isCorrect ? "border-green-500" : "border-red-500"
//             }`}
//           >
//             <p className="mb-2 font-medium">
//               Question {idx + 1}:{" "}
//               {res.isCorrect ? (
//                 <span className="text-green-600">✅ Correct</span>
//               ) : (
//                 <span className="text-red-600">❌ Incorrect</span>
//               )}
//             </p>
//             <p className="mb-1">
//               <strong>Your Answer:</strong>{" "}
//               {renderSentenceWithPlaceholders(res.question.sentence, res.userAnswers)}
//             </p>
//             <p>
//               <strong>Correct Answer:</strong>{" "}
//               {renderSentenceWithPlaceholders(
//                 res.question.sentence,
//                 res.question.correctAnswers
//               )}
//             </p>
//           </div>
//         ))}
//         <div className="text-xl font-semibold mt-6">
//           🎯 Final Score: {calculateScore()} / {results.length}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-xl mx-auto font-sans">
//       <h1 className="text-2xl font-semibold mb-4">Sentence Fill Quiz</h1>

//       <div className="flex justify-between items-center mb-4">
//         <div className="text-gray-600">
//           Question {currentIndex + 1} of {totalQuestions}
//         </div>
//         <div className="text-red-600 font-semibold text-lg">
//           ⏱️ Time Left: {timeLeft}s
//         </div>
//       </div>

//       <div className="text-lg mb-6">
//         {renderSentence(question.sentence, selectedAnswers)}
//       </div>

//       <div className="text-sm mb-2 text-gray-500">Click on a blank to remove its answer</div>

//       <div className="flex flex-wrap gap-4 mb-6">
//         {remainingOptions.map((option, idx) => (
//           <button
//             key={idx}
//             onClick={() => handleOptionClick(option)}
//             className="px-4 py-2 bg-blue-100 hover:bg-blue-300 rounded"
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       <div className="mb-6">
//         {selectedAnswers.map((ans, idx) => (
//           <span
//             key={idx}
//             onClick={() => handleBlankClick(idx)}
//             className="inline-block border border-gray-400 px-3 py-1 mr-2 mb-2 bg-yellow-100 cursor-pointer rounded"
//           >
//             {ans || "______"}
//           </span>
//         ))}
//       </div>

//       <button
//         onClick={() => handleNext()}
//         disabled={!allBlanksFilled}
//         className={`px-4 py-2 rounded ${
//           allBlanksFilled
//             ? "bg-green-500 hover:bg-green-600 text-white"
//             : "bg-gray-300 cursor-not-allowed text-gray-600"
//         }`}
//       >
//         {currentIndex < totalQuestions - 1 ? "Next" : "Finish"}
//       </button>
//     </div>
//   );
// };

// export default App;


// version 2
import React, { useEffect, useState } from "react";

type Question = {
  id: number;
  sentence: string;
  options: string[];
  correctAnswers: string[];
};

type Result = {
  question: Question;
  userAnswers: string[];
  isCorrect: boolean;
};

const TIME_LIMIT = 30;

const App: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [remainingOptions, setRemainingOptions] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const fetchQuestion = async (index: number) => {
    try {
      // const res = await fetch(`http://localhost:5000/api/question/${index}`);
      const res=await fetch(`https://sentence-construction-tool-tt5f.onrender.com/api/question/${index}`)
      const data = await res.json();
      if (data.success) {
        setQuestion(data.data);
        setRemainingOptions(data.data.options);
        setSelectedAnswers(Array(data.data.correctAnswers.length).fill(""));
        setTimeLeft(TIME_LIMIT);
        setTotalQuestions(data.total);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuestion(currentIndex);
  }, [currentIndex]);

  // 🕒 Regularly decrement timer
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  // 🚨 React to timer reaching zero
  useEffect(() => {
    if (timeLeft === 0 && !isFinished) {
      handleNext(true); // force skip on timeout
    }
  }, [timeLeft, isFinished]);

  const handleOptionClick = (option: string) => {
    const firstEmptyIndex = selectedAnswers.findIndex((a) => a === "");
    if (firstEmptyIndex === -1) return;

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[firstEmptyIndex] = option;
    setSelectedAnswers(updatedAnswers);

    const updatedOptions = remainingOptions.filter((opt) => opt !== option);
    setRemainingOptions(updatedOptions);
  };

  const handleBlankClick = (index: number) => {
    const answerToRemove = selectedAnswers[index];
    if (!answerToRemove) return;

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = "";

    setSelectedAnswers(updatedAnswers);
    setRemainingOptions((prev) => [...prev, answerToRemove]);
  };

  const allBlanksFilled = selectedAnswers.every((ans) => ans.trim() !== "");

  const handleNext = (isTimeout = false) => {
    if (!question) return;

    const isCorrect =
      !isTimeout &&
      allBlanksFilled &&
      selectedAnswers.every((ans, i) => ans === question.correctAnswers[i]);

    setResults((prev) => [
      ...prev,
      {
        question,
        userAnswers: [...selectedAnswers],
        isCorrect,
      },
    ]);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const renderSentence = (sentence: string, answers: string[]) => {
    const parts = sentence.split("_____________");
    let rendered = "";

    for (let i = 0; i < parts.length; i++) {
      rendered += parts[i];
      if (i < answers.length) {
        rendered += answers[i] || "______";
      }
    }

    return rendered;
  };

  const renderSentenceWithPlaceholders = (
    sentence: string,
    answers: string[]
  ) => {
    const parts = sentence.split("_____________");
    let rendered = "";

    for (let i = 0; i < parts.length; i++) {
      rendered += parts[i];
      if (i < parts.length - 1) {
        rendered += answers[i] && answers[i].trim() !== "" ? answers[i] : "______";
      }
    }

    return rendered;
  };

  const calculateScore = () => {
    return results.filter((r) => r.isCorrect).length;
  };

  if (!question && !isFinished) return <div className="p-6">Loading...</div>;

  // if (isFinished) {
  //   return (
  //     <div className="p-8 max-w-3xl mx-auto font-sans">
  //       <h1 className="text-2xl font-bold mb-6">Your Results</h1>
  //       {results.map((res, idx) => (
  //         <div
  //           key={idx}
  //           className={`border p-4 mb-4 rounded ${
  //             res.isCorrect ? "border-green-500" : "border-red-500"
  //           }`}
  //         >
  //           <p className="mb-2 font-medium">
  //             Question {idx + 1}:{" "}
  //             {res.isCorrect ? (
  //               <span className="text-green-600">✅ Correct</span>
  //             ) : (
  //               <span className="text-red-600">❌ Incorrect or Skipped</span>
  //             )}
  //           </p>
  //           <p className="mb-1">
  //             <strong>Your Answer:</strong>{" "}
  //             {renderSentenceWithPlaceholders(res.question.sentence, res.userAnswers)}
  //           </p>
  //           <p>
  //             <strong>Correct Answer:</strong>{" "}
  //             {renderSentenceWithPlaceholders(
  //               res.question.sentence,
  //               res.question.correctAnswers
  //             )}
  //           </p>
  //         </div>
  //       ))}
  //       <div className="text-xl font-semibold mt-6">
  //         🎯 Final Score: {calculateScore()} / {results.length}
  //       </div>
  //     </div>
  //   );
  // }

  if (isFinished) {
    return (
      <div className="p-8 max-w-3xl mx-auto font-sans">
        <h1 className="text-4xl font-extrabold text-green-600 text-center mb-10">
          🎯 Your Score: {calculateScore()} / {results.length}
        </h1>
  
        <h2 className="text-2xl font-bold mb-6 text-center">Detailed Review</h2>
  
        {results.map((res, idx) => (
          <div
            key={idx}
            className={`border p-4 mb-4 rounded ${
              res.isCorrect ? "border-green-500" : "border-red-500"
            }`}
          >
            <p className="mb-2 font-medium">
              Question {idx + 1}:{" "}
              {res.isCorrect ? (
                <span className="text-green-600">✅ Correct</span>
              ) : (
                <span className="text-red-600">❌ Incorrect or Skipped</span>
              )}
            </p>
            <p className="mb-1">
              <strong>Your Answer:</strong>{" "}
              {renderSentenceWithPlaceholders(res.question.sentence, res.userAnswers)}
            </p>
            <p>
              <strong>Correct Answer:</strong>{" "}
              {renderSentenceWithPlaceholders(
                res.question.sentence,
                res.question.correctAnswers
              )}
            </p>
          </div>
        ))}
      </div>
    );
  }
  

  return (
    <div className="p-8 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-semibold mb-4">Sentence Fill Quiz</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        <div className="text-red-600 font-semibold text-lg">
          ⏱️ Time Left: {timeLeft}s
        </div>
      </div>
      {/* if(question!==null){ */}
      <div className="text-lg mb-6"> 
         {/* {renderSentence(question.sentence, selectedAnswers)}  */}
         {question && renderSentence(question.sentence, selectedAnswers)}
       </div> 
{/* } */}
      <div className="text-sm mb-2 text-gray-500">
        Click on a blank to remove its answer
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {remainingOptions.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(option)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-300 rounded"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mb-6">
        {selectedAnswers.map((ans, idx) => (
          <span
            key={idx}
            onClick={() => handleBlankClick(idx)}
            className="inline-block border border-gray-400 px-3 py-1 mr-2 mb-2 bg-yellow-100 cursor-pointer rounded"
          >
            {ans || "______"}
          </span>
        ))}
      </div>

      <button
        onClick={() => handleNext(false)}
        disabled={!allBlanksFilled}
        className={`px-4 py-2 rounded ${
          allBlanksFilled
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-300 cursor-not-allowed text-gray-600"
        }`}
      >
        {currentIndex < totalQuestions - 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
};

export default App;
