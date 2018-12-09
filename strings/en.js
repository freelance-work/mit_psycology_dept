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
        instruction : 'Set 1, Press space bar when you see a happy face, not angry face'
      },
      {
        instruction : 'Set 2, Press space bar when you see a happy face, not neutral face'
      },
      {
        instruction : 'Set 3, Press space bar when you see a neutal face, not happy face'
      },
      {
        instruction : 'Set 4, Press space bar when you see a neutral face, not angry face'
      },
      {
        instruction : 'Set 5, Press space bar when you see a angry face, not happy face'
      },
      {
        instruction : 'Set 6, Press space bar when you see a angry face, not neutral face'
      }
    ]
  }
}