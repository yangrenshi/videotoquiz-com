import { QuizResultData } from './types';

export const SAMPLE_QUIZZES: { [key: string]: QuizResultData } = {
  cs50: {
    videoId: "8mAITcNt710",
    videoTitle: "Harvard CS50: Python Programming & Computational Thinking",
    summary: "This foundational lecture covers the essence of computer science, algorithmic complexity, variables, and procedural logic in modern Python programming.",
    takeaways: [
      "Algorithms are precise, step-by-step sequences of instructions designed to solve computational problems.",
      "Time complexity (Big-O) measures how execution duration scales relative to input size.",
      "Modern programming relies on modular decomposition to ensure maintainability."
    ],
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: "In computational algorithmic analysis, what does Big-O notation primarily represent?",
        options: [
          "The exact number of CPU cycles consumed on a specific hardware configuration",
          "The theoretical upper bound on the growth rate of algorithm execution time as input size increases",
          "The total memory bytes allocated on the physical heap during runtime",
          "The line count of compiled machine code instructions"
        ],
        answerIndex: 1,
        explanation: "Big-O notation describes the limiting behavior and worst-case scaling rate of an algorithm's time or space complexity with respect to input size n."
      },
      {
        id: 2,
        question: "What is the primary difference between a compiled language (e.g. C) and an interpreted language (e.g. Python)?",
        options: [
          "Compiled languages do not execute on physical hardware CPUs",
          "Interpreted code is translated into machine instructions line-by-line during runtime by an interpreter",
          "Compiled languages are strictly prohibited from using data structures",
          "Python requires a physical hardware motherboard reflash prior to execution"
        ],
        answerIndex: 1,
        explanation: "Interpreted languages like Python rely on an interpreter program that parses and executes instructions dynamically on the fly."
      },
      {
        id: 3,
        question: "What will the logical boolean expression (True and False) or not False evaluate to in Python?",
        options: [
          "False",
          "True",
          "None",
          "SyntaxError"
        ],
        answerIndex: 1,
        explanation: "(True and False) evaluates to False. 'not False' evaluates to True. Therefore, False or True evaluates to True."
      },
      {
        id: 4,
        question: "Which of the following data structures in Python provides O(1) average-time complexity for key lookups?",
        options: [
          "Linked List",
          "Sorted Array",
          "Dictionary (Hash Map)",
          "Binary Search Tree"
        ],
        answerIndex: 2,
        explanation: "Python dictionaries use hash tables under the hood, enabling average constant time O(1) insertion, retrieval, and deletion."
      },
      {
        id: 5,
        question: "Why is modular functional decomposition considered a best practice in software engineering?",
        options: [
          "It compresses the final executable to 0 bytes",
          "It isolates logic into testable, reusable units, reducing cognitive load and bug surface",
          "It disables runtime memory garbage collection",
          "It prevents other developers from reading variable names"
        ],
        answerIndex: 1,
        explanation: "Decomposing complex code into small, single-responsibility functions significantly enhances readability, maintainability, and testability."
      }
    ]
  },
  psychology: {
    videoId: "iCvmsMzlF7o",
    videoTitle: "TED Talk: The Power of Vulnerability & Human Connection",
    summary: "Dr. Brené Brown shares deep qualitative research into shame, vulnerability, belonging, and the transformative habits of 'wholehearted' individuals.",
    takeaways: [
      "Vulnerability is not weakness; it is the birthplace of courage, creativity, and authentic empathy.",
      "Shame derives its power from secrecy, silence, and judgment, dissolving when spoken with empathy.",
      "Wholehearted living requires cultivating self-worth and relinquishing the illusion of perfection."
    ],
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: "According to sociological research, what is the fundamental prerequisite for deep human connection?",
        options: [
          "Flawless professional competence and wealth status",
          "The willingness to be vulnerable and authentically seen",
          "Suppressing all negative emotional responses in public",
          "Agreeing with every opinion of your peers"
        ],
        answerIndex: 1,
        explanation: "Connection requires authenticity, which necessitates the courage to expose vulnerability and risk emotional uncertainty."
      },
      {
        id: 2,
        question: "How does the psychological construct of 'Shame' differ critically from 'Guilt'?",
        options: [
          "Guilt focuses on 'I am bad', while Shame focuses on 'I did something bad'",
          "Shame focuses on self-identity ('I am defective'), while Guilt focuses on behavior ('I made a mistake')",
          "There is no psychological difference between the two terms",
          "Guilt is an external legal penalty; Shame is an involuntary facial twitch"
        ],
        answerIndex: 1,
        explanation: "Psychologists define Guilt as a behavioral evaluation ('I did something wrong'), whereas Shame targets core self-worth ('I am bad')."
      },
      {
        id: 3,
        question: "What common trait characterized the individuals categorized as 'Wholehearted' in the research?",
        options: [
          "They possessed a profound sense of self-worth and belief that they are fundamentally worthy of love",
          "They never experienced interpersonal conflict or rejection",
          "They lived in isolated rural monasteries",
          "They achieved 100% emotional stoicism"
        ],
        answerIndex: 0,
        explanation: "Wholehearted individuals believed their worthiness was unconditional, enabling them to navigate vulnerability without defensive terror."
      },
      {
        id: 4,
        question: "What is the unintended psychological consequence of attempting to selectively numb painful emotions (like grief or fear)?",
        options: [
          "You instantly double your cognitive processing speed",
          "You inadvertently numb positive emotions like joy, gratitude, and happiness as well",
          "You become permanently immune to physical inflammation",
          "You eradicate the human amygdala"
        ],
        answerIndex: 1,
        explanation: "Human emotions cannot be selectively suppressed. When we numb discomfort, we inevitably numb our capacity for joy and fulfillment."
      },
      {
        id: 5,
        question: "What is the primary antidote that disarms and neutralizes the toxic grip of shame?",
        options: [
          "Aggressive defensiveness and counter-criticism",
          "Empathy and non-judgmental shared listening",
          "Hiding the perceived flaw until you achieve perfection",
          "Publicly overcompensating with material acquisitions"
        ],
        answerIndex: 1,
        explanation: "Shame cannot survive being spoken and received with genuine empathy; mutual connection dispels isolation."
      }
    ]
  }
};
