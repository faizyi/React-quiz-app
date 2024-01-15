import React from 'react'
import './quiz.css'
import { useEffect } from 'react';
import { useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import pass from './../result logo/pass.gif'
import fail from './../result logo/fail.gif'
function Quiz() {
  const [timer, setTimer] = useState(14);
  const [timerColor, setTimerColor] = useState({
    color : 'blue'
  })
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [optionIndex, setOptionsIndex] = useState();
  const [score, setScore] = useState(0);
  const [restartDisplay, setRestartDisplay] = useState({
    display: 'none'
  })
  const [quizDisplay, setQuizDisplay] = useState({
    display: 'block'
  })

 


  useEffect(() => {
    getDataFromAPI()
  }, [])


  useEffect(()=>{
    const intervalId = setInterval(() => {
      setTimer((timer) => timer - 1)
    }, 1000);
    return () => clearInterval(intervalId);
  })


  function quizTimer(){
    if(timer < 1 && questionIndex < questions.length - 1){
      setQuestionIndex(questionIndex + 1)
      setTimer(14)
    }
    else if(questionIndex >= 9 && timer < 1){
     quizResult()
    }
  }

  quizTimer()


  function getDataFromAPI() {
    fetch('https://the-trivia-api.com/v2/questions')
      .then(res => res.json())
      .then(data => {
        data.map(function (items) {
          items.options = [...items.incorrectAnswers, items.correctAnswer]
          items.options = shuffle(items.options)
        })
        setQuestions(data)
        console.log(data);
      })
  }


  function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  // Used like so
  var arr = [2, 11, 37, 42];
  shuffle(arr);
  if (!questions.length) {
    return <div className='loader'>
      <h1><img src="https://i.stack.imgur.com/ATB3o.gif" alt="" /></h1>
    </div>
  }


  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1)
      setTimer(14)
    } else {
      quizResult()
    }
    setBtnDisabled(true)
    if (optionIndex == questions[questionIndex].correctAnswer) {
      setScore((score)=> score + 1)
      console.log(score);
    }
  }


  function optionClick(e) {
    setBtnDisabled(false)
    setOptionsIndex(e)
  }


  function restartQuiz() {
    window.location.reload()
  }


  function quizResult() {
    if (restartDisplay.display == 'none' && quizDisplay.display == 'block') {
      setRestartDisplay({
        display: 'block'
      })
      setQuizDisplay({
        display: 'none'
      })
    }
  }


  return (
    <div className='container'>

      <div style={quizDisplay} className='quiz'>

      <div className='heading'>
        <h1>Quiz App</h1>
        <h1 style={timerColor}>{timer}</h1>
      </div>

      <div  className='quiz-app'>

        <div  className='questions'>
          <h1><span>{questionIndex + 1}.</span> {questions[questionIndex].question.text}</h1>
        </div>
        {
          questions[questionIndex].options.map((v, i) => {
            return (
              <div  key={i} className='quiz-options'>
                <button className={`${optionIndex === v ? 'checked' : 'unchecked'}`} onClick={() => optionClick(v)}><label >{v}</label></button>
              </div>
            )
          })
        }

        <div className='quiz-btn'>
          <button onClick={nextQuestion} disabled={btnDisabled}>{questionIndex == 9 ? 'Submit' : 'Next'}</button>
        </div>

      </div>

      </div>


{/* quiz-result */}
      <div style={restartDisplay} className='restart-btn'>
        <div className='heading'>
          <h1 style={restartDisplay}>Quiz Result.</h1>
        </div>
        <div className='quiz-result'>
          <div className='gif'>
            {score >= 6 ? <img width={300} src={pass} alt="" /> : <img width={300} src={fail} alt="" />}
          </div>
          <div className='pass-fail'>
            {score >= 6 ? <p className='pass'>You Pass</p> : <p className='fail'>Sorry! You Fail.</p>}
          </div>
          <div className='percentage'>
          <p style={restartDisplay}>Your Percentage: <span>{score}0%</span></p>
          </div>
          <button onClick={restartQuiz} style={restartDisplay}>Restart</button>
        </div>
      </div>

    </div>

  )
}

export default Quiz