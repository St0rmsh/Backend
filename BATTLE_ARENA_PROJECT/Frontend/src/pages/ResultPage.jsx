import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import ChatInput from "../components/ChatInput";
import {SolutionCard} from "../components/SolutionCard";
import {JudgeSection} from "../components/JudgeSection";

const API = "http://localhost:3000/chat";

export default function ResultPage() {
  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState(null);
  const [error, setError] = useState("");

  async function handleSend(problem) {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post(API, {
        message: problem,
      });

      setBattle(data.data);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to generate AI battle."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!battle) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-5xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-black mb-5 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Battle Arena
            </h1>

            <p className="text-zinc-400 text-lg">
              Mistral vs Cohere
            </p>

            <p className="text-zinc-500 mt-3">
              Internet Research • AI Judge • Best Solution
            </p>
          </motion.div>

          <ChatInput
            onSend={handleSend}
            isLoading={loading}
          />

          {error && (
            <p className="mt-8 text-center text-red-500">
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }

  const winner =
    battle.judgement.scoreA >= battle.judgement.scoreB
      ? "A"
      : "B";

  return (
    <main className="min-h-screen px-8 py-14">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-14">
          <ChatInput
            onSend={handleSend}
            isLoading={loading}
          />
        </div>

        <AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-8"
          >

            <SolutionCard
              title="Solution Alpha"
              content={battle.solutionA.code}
              score={battle.judgement.scoreA}
              reasoning={battle.judgement.reasoningA}
              isPrimary={winner === "A"}
            />

            <SolutionCard
              title="Solution Beta"
              content={battle.solutionB.code}
              score={battle.judgement.scoreB}
              reasoning={battle.judgement.reasoningB}
              isPrimary={winner === "B"}
            />

          </motion.div>

          <JudgeSection
            judgeData={{
              solution_1_score:
                battle.judgement.scoreA,

              solution_2_score:
                battle.judgement.scoreB,

              solution_1_reasoning:
                battle.judgement.reasoningA,

              solution_2_reasoning:
                battle.judgement.reasoningB,
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-3xl mt-12 p-8"
          >
            <h2 className="text-2xl font-bold mb-6">
              AI Summary
            </h2>

            <div className="prose prose-invert max-w-none">
              <p>{battle.summary.short}</p>

              <hr className="my-6" />

              <p>{battle.summary.detailed}</p>
            </div>
          </motion.div>

        </AnimatePresence>
      </motion.div>

    </main>
  );
}