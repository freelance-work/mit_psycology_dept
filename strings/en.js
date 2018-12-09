module.exports = {
  landingPage: {
    title: 'Enter patient ID',
    placeholder: 'Patient ID',
    buttonText: 'Start'
  },  
  gamePage: {
    game1: 'Emotion Recognition',
    game2: 'Face Reaction',
    game3: 'Word Reaction',
    game4: 'IOWA Gambling'
  },
  game1: {
    instructionTitle: 'Emotion recognition',
    instruction: 'Look at the faces and choose the emotion the face is expressing.',
    startButtonText: 'Start',
    joy: 'JOY',
    sadness: 'SADNESS',
    anger: 'ANGER',
    neutral: 'NEUTRAL',
    disgust: 'DISGUST',
    fear: 'FEAR',
    surprise: 'SURPRISE'
  },
  game2: {
    instructions : [
      {
        instruction : 'Set 1, press the spacebar only when you see a happy face, do not respond when you see angry face.'
      },
      {
        instruction : 'Set 2, press the spacebar only when you see a happy face, do not respond when you see neutral face.'
      },
      {
        instruction : 'Set 3, press the spacebar only when you see a neutral face, do not respond when you see happy face.'
      },
      {
        instruction : 'Set 4, press the spacebar only when you see a neutral face, do not respond when you see angry face.'
      },
      {
        instruction : 'Set 5, press the spacebar only when you see a angry face, do not respond when you see happy face.'
      },
      {
        instruction : 'Set 6, press the spacebar only when you see a angry face, do not respond when you see neutral face.'
      }
    ]
  }
}