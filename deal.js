document.addEventListener('DOMContentLoaded', function() {
const specialOfferButton = document.getElementById('specialOfferButton');
const quiz = document.getElementById('quiz');
const questionText = document.getElementById('questionText');
const answers = document.querySelectorAll('input[name="answer"]');
const nextButton = document.getElementById('nextButton');
const skipButton = document.getElementById('skipButton');
const offer = document.getElementById('offer');
const resultText = document.getElementById('resultText');
const timeSpentText = document.getElementById('timeSpentText');
const offerText = document.getElementById('offerText');
let startTime = Date.now();

specialOfferButton.addEventListener('click', () => {
    quiz.style.display = 'block';
    specialOfferButton.style.display = 'none';
    startTime = Date.now();
    startQuiz();
});

let questionIndex = 0;
let answersArray = [];

function startQuiz() {
    displayQuestion();
    nextButton.addEventListener('click', nextQuestion);
    skipButton.addEventListener('click', nextQuestion);
}

function displayQuestion() {
    if (questionIndex < questions.length) {
        questionText.textContent = questions[questionIndex].text;
    } else {
        calculateSpecialOffer();
    }
}

function nextQuestion() {
    const selectedAnswer = Array.from(answers).find(input => input.checked);
    if (selectedAnswer) {
        answersArray.push(selectedAnswer.value);
    } else {
        answersArray.push("skipped");
    }

    questionIndex++;
    clearRadioSelection();
    displayQuestion();
}

function clearRadioSelection() {
    answers.forEach(input => input.checked = false);
}

const questions = [
    { text: "Are you a student?" },
    { text: "Are you a low-income person?" },
    { text: "Do you have a valid coupon code?" }
];

function calculateSpecialOffer() {
    quiz.style.display = 'none';
    offer.style.display = 'block';

    const endTime = Date.now();
    const userTimeSpent = (endTime - startTime)/1000;

    resultText.textContent = "You qualify for the following special offer:";
    timeSpentText.textContent = `Time spent: ${userTimeSpent} seconds`;

    if (answersArray.includes("skipped")) {
        offerText.textContent = "You didn't answer all questions, so no offer is available.";
    } else if (answersArray[0] === "yes" && answersArray[1] === "yes") {
        offerText.textContent = "Because you are a student and a low-income person, you qualify for $100 off your purchase!";
    } else if (answersArray[2] === "yes") {
        offerText.textContent = "Congratulations! You have a valid coupon code, and you qualify for $50 off your purchase!";
    } else {
        offerText.textContent = "Sorry, you don't qualify for any special offer at this time.";
    }
}
})