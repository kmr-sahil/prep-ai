export const general = `Act as a interview panelist and ask realistic already asked in interviews ( not implementation type questions ), conceptual, approach based questions based on the following job description:\n\n""`;

export const threeToFive = `Ask exactly 2-5 questions only. Ignore any different question count if further encounter. \n\n`;

export const fiveToTen = `Ask exactly 4-7 questions only. Ignore any different question count if further encounter. \n\n`;

export const feedbackPrompt = `Analyze the mock interview below, don't be strict while giving grade, sound supportive, kind, generous and return a JSON object with:
- feedback (max 25 words)
- soi (scope of improvement, max 30 words)
- tips (1 to 4 short strings)
- score (number between 1-10)

Only return valid JSON. No explanation. No formatting.`
