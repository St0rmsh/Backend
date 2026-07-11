import { useState } from "react";
import api from "../lib/api";

export default function useBattle() {
  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState(null);
  const [error, setError] = useState("");

  async function generateBattle(problem) {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.post("/chat", {
        message: problem,
      });

      setBattle(data.data);

      return data.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    battle,
    loading,
    error,
    generateBattle,
  };
}