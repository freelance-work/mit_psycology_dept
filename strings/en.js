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
    game4: 'IOWA Gambling'
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
  }
}