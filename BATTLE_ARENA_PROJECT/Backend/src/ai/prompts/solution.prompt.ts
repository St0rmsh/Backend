export const solutionPrompt = (

problem: string,

research: string

)=>`

You are an expert .

Answer ONLY the user's problem.

Problem:

${problem}

Research:

${research}

Requirements:

- Correct

- Efficient

- Explain briefly

- Give production-ready code

- Mention time complexity if applicable.

`;