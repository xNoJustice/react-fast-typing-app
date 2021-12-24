import React, { useEffect, useState, useRef } from 'react'
import logo from './logo.svg'
import './logo.css'
import words from './data/words.json'

function App() {
  const [currentWordList, setCurrentWordList] = useState([])
  const [typedWord, setTypedWord] = useState('')
  const [typedWordCorrect, setTypedWordCorrect] = useState(null)
  const [correctWords, setCorrectWords] = useState([])
  const [wrongWords, setWrongWords] = useState([])
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [intervalId, setIntervalId] = useState('')
  const [keyStrokes, setKeyStrokes] = useState({ correct: 0, wrong: 0 })

  const timeLeftRef = useRef(timeLeft)

  useEffect(() => {
    setCurrentWordList(words.sort(() => Math.random() - 0.5).slice(0, 500))
  }, [])

  const finishGame = (interval) => {
    clearInterval(intervalId || interval)
    setIntervalId('')
    setStarted(false)
    setFinished(true)
  }

  const tick = () => {
    timeLeftRef.current -= 1
    setTimeLeft(timeLeftRef.current)
  }

  useEffect(() => {
    if (!started) return null
    if (finished) return null

    setStarted(true)
    setTimeLeft(60)

    const interval = setInterval(() => {
      if (timeLeftRef.current === 0) {
        return finishGame(interval)
      }
      return tick()
    }, 1000)

    setIntervalId(interval)

    return () => clearInterval(interval || intervalId)
  }, [started])

  const controlCurrentWord = (e) => {
    const val = e.target.value
    const word = currentWordList[0].toString()
    if (val.slice(val.length - 1, val.length) === ' ') {
      if (val.trim() === word) {
        setCorrectWords([...correctWords, word])
      } else {
        setWrongWords([...wrongWords, word])
      }
      setCurrentWordList(currentWordList.filter((w) => w !== word))
      setTypedWord('')
      setTypedWordCorrect(null)
    } else if (word.slice(0, val.length) === val) {
      setTypedWordCorrect(true)
      keyStrokes.correct += 1
      setKeyStrokes(keyStrokes)
    } else {
      setTypedWordCorrect(false)
      keyStrokes.wrong += 1
      setKeyStrokes(keyStrokes)
    }
  }

  const onChange = (e) => {
    if (!started) setStarted(true)
    setTypedWord(e.target.value)
    controlCurrentWord(e)
  }

  const currentClass = (i) => {
    let className = 'rounded-lg p-1 '

    if (typedWordCorrect === null && i === 0)
      className += 'bg-gray-500 text-white'

    if (!typedWordCorrect && i === 0) className += 'bg-red-500 text-white'

    if (typedWordCorrect && i === 0) className += 'bg-green-300'

    return className
  }

  const restartGame = () => {
    clearInterval(intervalId)
    setIntervalId('')
    setKeyStrokes({ correct: 0, wrong: 0 })
    setTimeLeft(60)
    timeLeftRef.current = 60
    setStarted(false)
    setFinished(false)
    setCorrectWords([])
    setWrongWords([])
    setTypedWord('')
    setTypedWordCorrect(null)
    setCurrentWordList(words.sort(() => Math.random() - 0.5).slice(0, 500))
  }

  return (
    <div className="w-full h-screen flex justify-center items-center mx-auto p-6 dark:text-white text-2xl font-bold">
      <div>
        <img src={logo} alt="logo" className="w-32 h-32 mx-auto logo" />
        <div className="text-center font-bold text-3xl">
          Welcome to Fast Typing App
        </div>
        {finished ? (
          <div className="bg-gray-200 p-4 text-center text-gray-800 rounded-lg mt-4">
            <div className="mb-3">Game Finished</div>
            <div className="text-green-500 text-4xl">
              {correctWords.length + wrongWords.length} WPM
            </div>
            <div className="text-sm my-2">WPM (Words Per Minute)</div>
            <div className="p-1">
              Keystrokes : (
              <span className="text-green-500">{keyStrokes.correct}</span>|
              <span className="text-red-500">{keyStrokes.wrong}</span>){' '}
              <span>{keyStrokes.correct + keyStrokes.wrong}</span>
            </div>
            <div className="p-1">
              Accuracy :{' '}
              {parseInt(
                (keyStrokes.correct / (keyStrokes.correct + keyStrokes.wrong)) *
                  100,
                10,
              )}
              %
            </div>
            <div className="p-1">
              Correct Words :{' '}
              <span className="text-green-500">{correctWords.length}</span>
            </div>
            <div className="p-1">
              Wrong Words :{' '}
              <span className="text-red-500">{wrongWords.length}</span>
            </div>
            <button
              className="bg-indigo-700 text-white w-full p-2 mt-4 rounded-lg hover:bg-indigo-500"
              type="button"
              onClick={() => restartGame()}
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="max-w-lg px-6 py-4 my-4 bg-gray-200 text-black font-medium rounded-lg">
              {currentWordList.slice(0, 8).map((w, i) => (
                <span key={w}>
                  <span className={currentClass(i)}>{w}</span>{' '}
                </span>
              ))}
            </div>
            <div className="text-center">
              <input
                className="h-12 p-4 text-black rounded-lg focus:outline-none"
                type="text"
                value={typedWord}
                onChange={(e) => onChange(e)}
                placeholder={`${
                  started
                    ? 'Write the next word...'
                    : 'Press a letter to start...'
                }`}
              />
              <span className="bg-gray-700 text-white p-2 rounded-lg ml-3">
                {timeLeft === 60
                  ? '1:00'
                  : `0:${timeLeft > 9 ? timeLeft : `0${timeLeft}`}`}
              </span>
              <button
                className="bg-indigo-700 text-white p-2 rounded-lg ml-2 hover:bg-indigo-500"
                type="button"
                onClick={() => restartGame()}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
