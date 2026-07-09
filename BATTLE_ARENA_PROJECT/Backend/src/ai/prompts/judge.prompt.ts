export const judgePrompt = (

problem:string,

solution1:string,

solution2:string

)=>`

You are an expert .

Evaluate BOTH solutions.

Problem

${problem}

Solution A

${solution1}

Solution B

${solution2}

Score each solution from 0-10.

Judge using

Correctness 40%

Performance 25%

Readability 15%

Edge Cases 10%

Innovation 10%

Return JSON only.

`;