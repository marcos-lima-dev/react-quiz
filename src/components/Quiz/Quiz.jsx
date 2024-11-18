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
    
    if (correct) {
      setScore(score + 1);
      setFeedback('Correto! ' + questions[currentQuestion].fact);
    } else {
      setFeedback(`Incorreto. A capital é ${questions[currentQuestion].capital}`);
    }

    setTimeout(() => {
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
  };

  const progressBarStyle = {
    background: `linear-gradient(to right, #ffffff, #22c55e ${(score / questions.length) * 100}%)`,
    transition: 'all 0.3s ease'
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/background-pattern.svg')] bg-repeat bg-[length:800px_800px] p-4">
        <div className="p-6 bg-white/90 backdrop-blur-sm rounded shadow-lg max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Resultado Final</h2>
          <p className="text-xl mb-4">Você acertou {score} de {questions.length} questões!</p>
          <div className="w-full rounded-full h-2 mb-4 border border-gray-200">
            <div 
              className="h-2 rounded-full"
              style={progressBarStyle}
            />
          </div>
          <button 
            onClick={resetQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background-pattern.svg')] bg-repeat bg-[length:800px_800px] p-4">
      <div className="p-6 bg-white/90 backdrop-blur-sm rounded shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Quiz Estados e Capitais</h1>
        
        <div className="mb-6">
          <div className="w-full rounded-full h-2 border border-gray-200">
            <div 
              className="h-2 rounded-full"
              style={progressBarStyle}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Questão {currentQuestion + 1} de {questions.length} | Acertos: {score}
          </p>
        </div>

        <p className="text-lg mb-4">Qual é a capital de {questions[currentQuestion].state}?</p>

        <div className="space-y-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`
                w-full p-3 text-left rounded border-2 transition-all duration-200
                ${selectedAnswer 
                  ? option === questions[currentQuestion].capital
                    ? 'bg-green-100 border-green-500'
                    : option === selectedAnswer
                      ? 'bg-red-100 border-red-500'
                      : 'bg-gray-50 border-gray-200'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`mt-4 p-3 rounded ${
            selectedAnswer === questions[currentQuestion].capital 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;