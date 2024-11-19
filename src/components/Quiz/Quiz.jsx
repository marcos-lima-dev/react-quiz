import React, { useState, useEffect } from 'react';

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

  // Estados básicos do quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Novos estados para estatísticas
  const [highScore, setHighScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);

  // Carregar estatísticas ao iniciar
  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem('quizStats') || '{}');
    setHighScore(savedStats.highScore || 0);
    setGamesPlayed(savedStats.gamesPlayed || 0);
    setGameHistory(savedStats.gameHistory || []);
  }, []);

  const saveStats = (finalScore) => {
    const newStats = {
      highScore: Math.max(highScore, finalScore),
      gamesPlayed: gamesPlayed + 1,
      gameHistory: [
        {
          date: new Date().toLocaleDateString(),
          score: finalScore,
          totalQuestions: questions.length,
          timeStamp: new Date().getTime()
        },
        ...gameHistory
      ].slice(0, 5) // Mantém apenas os últimos 5 jogos
    };

    localStorage.setItem('quizStats', JSON.stringify(newStats));
    setHighScore(newStats.highScore);
    setGamesPlayed(newStats.gamesPlayed);
    setGameHistory(newStats.gameHistory);
  };

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
        const finalScore = score + (correct ? 1 : 0);
        saveStats(finalScore);
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
    setShowStats(false);
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
            {showStats ? "Estatísticas" : "Resultado Final"}
          </h2>

          {!showStats ? (
            <>
              <div className="mb-8">
                <p className="text-2xl mb-2">
                  Você acertou {score} de {questions.length} questões!
                </p>
                {score > highScore && (
                  <div className="text-yellow-400 text-sm animate-bounce">
                    🏆 Novo Recorde!
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Recorde</p>
                  <p className="text-xl font-bold">{highScore}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total de Jogos</p>
                  <p className="text-xl font-bold">{gamesPlayed}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setShowStats(true)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold 
                           transition-all duration-300 hover:bg-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Ver Histórico
                </button>
                <button 
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold 
                           transition-all duration-300 hover:scale-105 hover:shadow-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  Jogar Novamente
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Últimas Partidas</h3>
                <div className="space-y-3">
                  {gameHistory.map((game, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center bg-gray-900/30 p-3 rounded-lg"
                    >
                      <span className="text-sm text-gray-400">{game.date}</span>
                      <div className="flex items-center">
                        <span className="font-medium">{game.score}/{game.totalQuestions}</span>
                        {game.score === game.totalQuestions && (
                          <span className="ml-2">🌟</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setShowStats(false)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold 
                           transition-all duration-300 hover:bg-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Voltar
                </button>
                <button 
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold 
                           transition-all duration-300 hover:scale-105 hover:shadow-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  Jogar Novamente
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background-pattern.svg')] bg-repeat bg-[length:800px_800px] p-4">
      <div className="p-8 bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl max-w-lg w-full text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Quiz Estados e Capitais
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-400">Recorde</p>
            <p className="font-bold">{highScore}</p>
          </div>
        </div>
        
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
          Qual é a Capital de {questions[currentQuestion].state}?
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