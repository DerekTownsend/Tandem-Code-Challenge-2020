// if hosting without internet
// const QUESTIONS_URL = "../Apprentice_TandemFor400_Data.json";
// if hosting with internet
const QUESTIONS_URL = "https://derektownsend.github.io/Tandem-Code-Challenge-2020/Apprentice_TandemFor400_Data.json";
const questionForm = document.querySelector("#question-form");
let currentQuestion
let userScore
let isNext
let questions

// Fisher–Yates Shuffle
function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function generateRandomTen(fetchedQuestions) {
  let arrayOfRanNum = [];
  for (i = 0; i < fetchedQuestions.length; i++) {
    arrayOfRanNum.push(i)
  }
  arrayOfRanNum = shuffle(arrayOfRanNum);
  let tenQuestions = arrayOfRanNum.map(number => fetchedQuestions[number]).slice(0,10)
  return tenQuestions
}

function getQuestions() {
  fetch(QUESTIONS_URL)
  .then(response => response.json())
  .then(json => setQuestions(json))
}

function setQuestions(fetchedQuestions){
  questions = generateRandomTen(fetchedQuestions)
  displayQuestionsForm();
}

function displayQuestionsForm(){
  const radioBtnCount = questionForm.length-1
  const correctAnswerLocation = Math.floor(Math.random() * Math.floor(radioBtnCount))
  const tempQuestionsArray = questions[currentQuestion].incorrect.slice(); tempQuestionsArray.splice(correctAnswerLocation,0,questions[currentQuestion].correct)
  questionForm.querySelector("p").innerHTML =`${currentQuestion+1}. ${questions[currentQuestion].question}`
  // Might want to make this auto gen depending on number of possible answer choices
  for(i = 0; i < radioBtnCount; i++){
    questionForm[i].value = tempQuestionsArray[i]
    questionForm.querySelectorAll("label")[i].innerHTML = tempQuestionsArray[i]
  }
  if(questions.length-1 === currentQuestion){
    isNext = false;
    questionForm[radioBtnCount].value = "Submit"
  }
  questionForm.addEventListener("submit", submitForm)
}

function isCorrect(form) {
  let userAnswer;
  for(input of form){
    if (input.checked) {
      userAnswer = input.value
    }
  }
  if (userAnswer === questions[currentQuestion].correct) {
    userScore++
    // Make these not alerts
    alert(`Correct the answer was "${questions[currentQuestion].correct}"`)
  } else {
    alert(`Incorrect the answer was "${questions[currentQuestion].correct}"`)
  }
}

function submitForm(e) {
  e.preventDefault()
  if (isNext) {
    isCorrect(e.target)
    currentQuestion++
    displayQuestionsForm()
    questionForm.reset()
  } else {
    isCorrect(e.target)
    document.querySelector("#quiz").style.display = "none";
    document.querySelector("#endScreen").style.display = "block";
    document.querySelector("#endScreen span").innerHTML = userScore;
    questionForm.reset()
  }
}

function startQuiz(e) {
  document.querySelector(".landing").style.display = "none";
  document.querySelector("#quiz").style.display = "block";
}

function playAgain(e) {
  document.querySelector(".end-screen").style.display = "none";
  document.querySelector("#quiz").style.display = "block";
  runApp()
}

document.querySelector(".landing").addEventListener("click",startQuiz)
document.querySelector(".end-screen").addEventListener("click",playAgain)

function intialize() {
  currentQuestion = 0;
  userScore = 0
  isNext = true;
  questions = [];
}

function runApp() {
  intialize()
  getQuestions()
}

runApp()
