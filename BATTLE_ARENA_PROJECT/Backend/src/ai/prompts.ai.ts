/**
 * ============================================================
 * RESEARCH PROMPT
 * ============================================================
 */

export const researchPrompt = (
  problem: string,
  research: string
) => `
You are a Senior Software Research Engineer.

Your job is to understand the user's problem using the research below.

Problem:

${problem}

Research:

${research}

Your task:

• Extract important algorithms
• Mention best practices
• Mention possible edge cases
• Mention recommended data structures
• Ignore unrelated information

Return concise technical notes only.
`;



/**
 * ============================================================
 * SOLUTION PROMPT
 * ============================================================
 */

export const solutionPrompt = (
  problem: string,
  research: string
) => `
You are a Senior Software Engineer.

Solve the following programming problem.

Problem:

${problem}

Research:

${research}

Requirements:

1. Produce production-ready code.

2. Optimize for performance.

3. Handle edge cases.

4. Explain the solution.

5. Mention time complexity.

6. Mention space complexity.

7. Mention possible improvements.

Return Markdown.

Format:

# Explanation

...

# Algorithm

...

# Complexity

Time:

Space:

# Code

\`\`\`
code
\`\`\`
`;



/**
 * ============================================================
 * JUDGE PROMPT
 * ============================================================
 */

export const judgePrompt = (
  problem: string,
  solutionA: string,
  solutionB: string
) => `
You are a Principal Software Architect.

Compare BOTH solutions.

Problem

${problem}

----------------------------

Solution A

${solutionA}

----------------------------

Solution B

${solutionB}

Evaluate both using the following weights.

Correctness .............. 40%

Performance .............. 20%

Readability .............. 10%

Scalability .............. 10%

Security ................. 5%

Memory Usage ............. 5%

Edge Cases ............... 5%

Innovation ............... 5%

Return ONLY JSON.

{
    "winner":"A",

    "scoreA":9.6,

    "scoreB":8.9,

    "reasoningA":"",

    "reasoningB":"",

    "verdict":"",

    "betterFor":""
}
`;



/**
 * ============================================================
 * SUMMARY PROMPT
 * ============================================================
 */

export const summaryPrompt = (
  problem: string,
  judgeResult: string
) => `
You are an AI Technical Writer.

Problem

${problem}

Judge Result

${judgeResult}

Write a concise summary.

Include

• Winner

• Why it won

• When to use Solution A

• When to use Solution B

• Final recommendation

Return Markdown.
`;


/**
 * ============================================================
 * IMPROVEMENT PROMPT
 * ============================================================
 */

export const improvementPrompt = (
  code: string
) => `
You are a Google Staff Engineer.

Improve this code.

${code}

Requirements

• Better naming

• Better performance

• Better readability

• Better architecture

• Remove duplicated logic

• Improve error handling

• Improve scalability

Return

# Improvements

...

# Improved Code

\`\`\`
code
\`\`\`
`;



