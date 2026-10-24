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
  },
  huberman: {
    videoId: "nm1TxQj9IsQ",
    videoTitle: "Huberman Lab: Master Your Sleep & Optimize Daily Energy",
    summary: "Neurobiologist Dr. Andrew Huberman explains the neurobiological mechanisms of circadian rhythms, cortisol pulses, adenosine clearance, and evidence-based protocols for peak focus.",
    takeaways: [
      "Viewing natural sunlight within 30-60 minutes of waking sets circadian rhythm and triggers optimal cortisol timing.",
      "Adenosine builds up throughout wakefulness; delaying caffeine intake by 90 minutes prevents the afternoon energy crash.",
      "Core body temperature drop of 1-3 degrees Celsius is physiologically mandatory for entering deep slow-wave sleep."
    ],
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: "Why does Dr. Huberman strongly recommend viewing morning sunlight within 30-60 minutes of waking?",
        options: [
          "It permanently bleaches melatonin receptors in the stomach",
          "It activates intrinsically photosensitive retinal ganglion cells (ipRGCs) to synchronize the suprachiasmatic nucleus (SCN) circadian clock",
          "It provides 100% of the daily required Vitamin D through the retina",
          "It prevents the optic nerve from processing visual shapes"
        ],
        answerIndex: 1,
        explanation: "Morning photons captured by retinal ipRGCs trigger the master circadian clock (SCN) in the hypothalamus, setting daytime cortisol and timed nighttime melatonin release."
      },
      {
        id: 2,
        question: "What neurochemical mechanism explains why delaying caffeine intake by 90-120 minutes upon waking prevents the 'afternoon crash'?",
        options: [
          "It allows the liver to clear all bloodstream glucose",
          "It permits residual adenosine to be cleared naturally rather than being temporarily blocked by caffeine and resurging later",
          "It converts caffeine directly into dopamine in salivary glands",
          "It paralyzes adrenaline receptors for the rest of the day"
        ],
        answerIndex: 1,
        explanation: "Caffeine is an adenosine receptor antagonist. Delaying caffeine allows morning adenosine clearance, preventing intense rebound fatigue when caffeine is metabolized."
      },
      {
        id: 3,
        question: "What core physiological temperature adjustment is required by the human body to transition into restorative deep sleep?",
        options: [
          "A core body temperature increase of 2-4 degrees Celsius",
          "A core body temperature drop of 1-3 degrees Fahrenheit (approx. 1 degree Celsius)",
          "Maintaining an exact skin temperature of 100 degrees Fahrenheit",
          "Complete cessation of peripheral blood flow"
        ],
        answerIndex: 1,
        explanation: "The brain and body must cool down by about 1-3 degrees Fahrenheit to initiate and sustain deep restorative non-REM slow-wave sleep."
      },
      {
        id: 4,
        question: "How does Non-Sleep Deep Rest (NSDR) or Yoga Nidra modulate the autonomic nervous system?",
        options: [
          "It triggers sympathetic fight-or-flight panic responses",
          "It intentionally shifts brain waves from beta down into alpha and theta states, activating parasympathetic recovery",
          "It causes immediate skeletal muscle atrophy",
          "It suppresses all pulmonary oxygen exchange"
        ],
        answerIndex: 1,
        explanation: "NSDR protocols guide the autonomic nervous system into parasympathetic dominance, promoting dopamine restoration and mental recovery."
      },
      {
        id: 5,
        question: "Which type of artificial light exposure between 10 PM and 4 AM is most potent at suppressing nocturnal melatonin secretion?",
        options: [
          "Low-placed amber candle-like illumination",
          "Overhead bright blue and white enriched LED lighting",
          "Complete pitch darkness",
          "Infrared warmth emitters"
        ],
        answerIndex: 1,
        explanation: "Overhead bright blue-wavelength photons stimulate retinal ganglion cells, signaling daytime to the hypothalamus and shutting down melatonin synthesis."
      }
    ]
  },
  cfa: {
    videoId: "2v6E8ZgH9Jk",
    videoTitle: "CFA Exam Prep: Quantitative Methods, Time Value of Money & Valuation",
    summary: "Comprehensive finance review covering Time Value of Money (TVM), discounted cash flows (DCF), Net Present Value (NPV), and internal rate of return (IRR) for professional candidates.",
    takeaways: [
      "Present value (PV) discounts future expected cash flows by the appropriate opportunity cost of capital.",
      "NPV rule states that projects with NPV > 0 add direct enterprise value to shareholders.",
      "Internal Rate of Return (IRR) is the exact discount rate where Net Present Value equals zero."
    ],
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: "Under standard financial corporate finance principles, what is the exact definition of Net Present Value (NPV)?",
        options: [
          "The gross sum of all nominal undiscounted future cash receipts",
          "The present value of expected cash inflows minus the present value of expected cash outflows, discounted at the cost of capital",
          "The accounting net income divided by total enterprise debt",
          "The total tax liability accrued at the end of the fiscal year"
        ],
        answerIndex: 1,
        explanation: "NPV represents the net economic dollar value added to the firm, calculated by discounting all cash inflows and outflows back to time zero at the hurdle rate."
      },
      {
        id: 2,
        question: "When evaluating mutually exclusive capital investment projects with differing scales, which decision rule takes precedence over IRR?",
        options: [
          "Payback Period",
          "Net Present Value (NPV)",
          "Accounting Rate of Return (ARR)",
          "Subjective managerial preference"
        ],
        answerIndex: 1,
        explanation: "NPV always takes priority over IRR for mutually exclusive projects because it directly measures the absolute dollar wealth added to shareholders, avoiding IRR reinvestment rate pitfalls."
      },
      {
        id: 3,
        question: "If a perpetuity pays an annual coupon of $100 forever and the required market discount rate is 5%, what is the Present Value?",
        options: [
          "$500",
          "$1,000",
          "$2,000",
          "$5,000"
        ],
        answerIndex: 2,
        explanation: "The present value of a perpetuity is calculated as PV = Cash Flow / Discount Rate = $100 / 0.05 = $2,000."
      },
      {
        id: 4,
        question: "What does an inverted sovereign yield curve (where short-term yields exceed long-term yields) historically signal?",
        options: [
          "Rapid, uncontrolled hyperinflationary boom in the next 30 days",
          "Heightened probability of an approaching macroeconomic recession and future central bank monetary easing",
          "Permanent elimination of sovereign debt default risk",
          "A mandatory 50% dividend hike across all public equities"
        ],
        answerIndex: 1,
        explanation: "An inverted yield curve reflects market expectations of impending economic contraction, prompting expectations that central banks will cut interest rates in the future."
      },
      {
        id: 5,
        question: "What is the primary conceptual distinction between effective annual rate (EAR) and stated annual percentage rate (APR)?",
        options: [
          "APR accounts for intra-year compounding, while EAR ignores compounding",
          "EAR accurately reflects the true annual return by accounting for the frequency of intra-year compounding periods",
          "EAR is only used for municipal government bonds",
          "There is zero mathematical difference between EAR and APR"
        ],
        answerIndex: 1,
        explanation: "EAR = (1 + r/m)^m - 1. It compounds periodic interest throughout the year, reflecting the true annualized economic return or borrowing cost."
      }
    ]
  }
};
