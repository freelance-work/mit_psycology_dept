module.exports = {
  commons: {
    modalCloseButton: 'Close',
    modalContent: 'You are done with the game. Do you want to export the result to CSV?',
    modalExitButton: 'Exit',
    exportButton : 'Export to CSV',
    backButton : 'Back',
    startButton : "Start",
    continueButton : 'Continue',
    exported: 'Exported',
    inGameExit: 'Are you sure you want to exit? The game cannot be resumed.'
  },
  landingPage: {
    title: 'Enter patient ID',
    placeholder: 'Patient ID',
    buttonText: 'Start'
  },  
  gamePage: {
    game1: 'Emotion Recognition',
    game2: 'Affective Go-No-Go',
    game3: 'Word Affective Go–No-Go',
    game4: 'IOWA Gambling',
    game5: 'Trial Adjusting Delay Discounting Task',
    game6: 'Prisoner\'s Dilemma'
  },
  game1: {
    instructionTitle: 'Emotion recognition',
    instruction: 'Look at the faces and choose the emotion the face is expressing.',
    joy: 'JOY',
    sadness: 'SADNESS',
    anger: 'ANGER',
    neutral: 'NEUTRAL',
    disgust: 'DISGUST',
    fear: 'FEAR',
    surprise: 'SURPRISE',
  },
  game2: {
    instructionTitle: 'Affective Go-No-Go',
    instructions : [
      {
        instruction :  'Trial, Press space bar when you see a happy face, do nothing when you see a angry face.'
      },
      {
        instruction : 'Set 1, Press space bar when you see a happy face, do nothing when you see a angry face.'
      },
      {
        instruction : 'Set 2, Press space bar when you see a happy face, do nothing when you see a neutral face'
      },
      {
        instruction : 'Set 3, Press space bar when you see a neutral face, do nothing when you see a happy face'
      },
      {
        instruction : 'Set 4, Press space bar when you see a neutral face, do nothing when you see an angry face'
      },
      {
        instruction : 'Set 5, Press space bar when you see a angry face, do nothing when you see a happy face'
      },
      {
        instruction : 'Set 6, Press space bar when you see a angry face, do nothing when you see a neutral face'
      }
    ]
  },
  game3: {
    instructionTitle: 'Word Affective Go-No-Go',
    instructions : [
      {
        instruction :  'Trial, Press space bar when you see a happy word, do nothing when you see a sad word.'
      },
      {
        instruction : 'Set 1, Press space bar when you see a happy word, do nothing when you see a sad word.'
      },
      {
        instruction : 'Set 2, Press space bar when you see a happy word, do nothing when you see a neutral word'
      },
      {
        instruction : 'Set 3, Press space bar when you see a neutral word, do nothing when you see a happy word'
      },
      {
        instruction : 'Set 4, Press space bar when you see a neutral word, do nothing when you see an sad word'
      },
      {
        instruction : 'Set 5, Press space bar when you see a sad word, do nothing when you see a happy word'
      },
      {
        instruction : 'Set 6, Press space bar when you see a sad word, do nothing when you see a neutral word'
      }
    ]
  },
  game4: {
    instructionTitle: 'IOWA Gambling',
    instruction: 'In front of you, on the screen, there will be 4 decks of cards: A, B, C, D. When we begin the game, I want you to select one card at a time by clicking on a card from any deck you choose. Each time you select a card, the computer will tell you that you won some money, but then it will say that you lost some money as well. You will start with Rs 2000 initially. The aim of the task is to win as much money as you can.',
    cashLeft: '₹'
  },
  game5: {
    instructionTitle: '5-Trial Adjusting Delay Discounting Task',
    instruction: 'In this game, you will be asked to make choices between having Rs 500 right now or getting Rs 1000 sometime in the future. Select the option you would prefer. This game takes about 1 minute to play. There is no right or wrong answers.',
    question: 'Would you rather have?',
    buttonNow: '₹500 now',
    or: 'or',
    buttonLater: '₹1000 in 3 weeks',
    subText: 'Click on the answer of your choice'
  },
  game6: {
    instructionTitle: 'Prisoner\'s Dilemma',
    instruction: 'In this game, you will be playing against 3 different opponents. With each of these opponents you have won some money. You can choose either to share or steal the money. You and your opponent have to choose without knowing what the other person is choosing.',
    or: 'or',
    question: 'What do you choose?',
    buttonShare: 'Share',
    buttonSteal: 'Steal',
    subText: 'Click on the answer of your choice',
    you : 'You: ',
    oponent: 'Oponent',
    youEarned : 'You earned',
    andYourOponent : 'and your oponent earned',
    wait: 'Please wait, your oponent is playing his Turn.'
  }
}