import React, { useState } from 'react';

const Quiz = () => {
  const questions = [
    { state: "São Paulo", capital: "São Paulo", fact: "Maior cidade do Brasil" },
    { state: "Rio de Janeiro", capital: "Rio de Janeiro", fact: "Conhecido pelo Cristo Redentor" },
    { state: "Minas Gerais", capital: "Belo Horizonte", fact: "Famoso pelo pão de queijo" },
    { state: "Bahia", capital: "Salvador", fact: "Primeira capital do Brasil" },
    { state: "Pernambuco", capital: "Recife", fact: "Conhecida como Veneza Brasileira" },
    { state: "Rio Grande do Sul", capital: "Porto Alegre", fact: "Terra do chimarrão" },
    { state: "Paraná", capital: "Curitiba", fact: "Cidade mais fria do sul" },
    { state: "Ceará", capital: "Fortaleza", fact: "Famoso pelas praias" },
    { state: "Amazonas", capital: "Manaus", fact: "Maior estado do Brasil" },
    { state: "Pará", capital: "Belém", fact: "Conhecido pelo açaí" }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const getRandomCapitals = (count, exclude) => {
    return questions
      .map(q => q.capital)
      .filter(capital => capital !== exclude)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };

  const options = [
    questions[currentQuestion].capital,
    ...getRandomCapitals(3, questions[currentQuestion].capital)
  ].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].capital;
    setIsAnswerRevealed(true);
    
    if (correct) {
      setScore(score + 1);
      setFeedback('Correto! ' + questions[currentQuestion].fact);
    } else {
      setFeedback(`Incorreto. A capital é ${questions[currentQuestion].capital}`);
    }

    setTimeout(() => {
      setIsAnswerRevealed(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setFeedback('');
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer('');
    setFeedback('');
    setIsAnswerRevealed(false);
  };

  const progressBarStyle = {
    background: `linear-gradient(to right, #1a1a1a, #22c55e ${(score / questions.length) * 100}%)`,
    transition: 'all 0.5s ease-out'
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/background-pattern.svg')] bg-repeat bg-[length:800px_800px] p-4">
        <div className="p-8 bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl max-w-lg w-full text-center text-white transform transition-all duration-500 hover:scale-[1.02]">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Resultado Final
          </h2>
          <p className="text-2xl mb-6">
            Você acertou {score} de {questions.length} questões!
          </p>
          <div className="w-full rounded-full h-3 mb-6 border border-gray-700 overflow-hidden">
            <div 
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={progressBarStyle}
            />
          </div>
          <button 
            onClick={resetQuiz}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold 
                     transform transition-all duration-300 hover:scale-105 hover:shadow-lg 
                     focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background-pattern.svg')] bg-repeat bg-[length:800px_800px] p-4">
      <div className="p-8 bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl max-w-lg w-full text-white">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Quiz Estados e Capitais
        </h1>
        
        <div className="mb-8">
          <div className="w-full rounded-full h-3 border border-gray-700 overflow-hidden">
            <div 
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={progressBarStyle}
            />
          </div>
          <p className="text-sm text-gray-400 mt-3 flex justify-between items-center">
            <span>Questão {currentQuestion + 1} de {questions.length}</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full">Acertos: {score}</span>
          </p>
        </div>

        <p className="text-xl mb-6 font-medium">
          Qual é a capital de {questions[currentQuestion].state}?
        </p>

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`
                w-full p-4 text-left rounded-lg border-2 transition-all duration-300
                transform hover:scale-[1.02]
                ${selectedAnswer 
                  ? option === questions[currentQuestion].capital
                    ? 'bg-green-900/50 border-green-500 text-white scale-[1.02]'
                    : option === selectedAnswer
                      ? 'bg-red-900/50 border-red-500 text-white'
                      : 'bg-gray-900/50 border-gray-700 text-gray-300'
                  : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-500'
                }
                ${!selectedAnswer && 'hover:shadow-lg hover:bg-gray-800/50'}
                disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
              `}
            >
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-3">{index + 1}</span>
                {option}
              </div>
            </button>
          ))}
        </div>

        {feedback && (
          <div 
            className={`
              mt-6 p-4 rounded-lg transform transition-all duration-300 
              ${isAnswerRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              ${selectedAnswer === questions[currentQuestion].capital 
                ? 'bg-green-900/50 text-green-400 border-l-4 border-green-500' 
                : 'bg-red-900/50 text-red-400 border-l-4 border-red-500'
              }
            `}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;