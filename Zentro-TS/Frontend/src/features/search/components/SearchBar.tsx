import { useState, FormEvent } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setSearchQuery, addRecentSearch } from "../state/searchSlice";
import { Input } from "@/shared/ui/input";

export const SearchBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentQuery = useAppSelector((state) => state.search.query);
  const [localQuery, setLocalQuery] = useState(currentQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      dispatch(setSearchQuery(localQuery));
      dispatch(addRecentSearch(localQuery));
      navigate(`/search?q=${encodeURIComponent(localQuery)}`);
    }
  };

  const handleClear = () => {
    setLocalQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search className="h-5 w-5" />
      </div>
      <Input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search for posts, users, or tags..."
        className="w-full pl-10 pr-10 h-12 rounded-full border-border bg-card/50 hover:bg-card focus:bg-card focus-visible:ring-1 focus-visible:ring-primary shadow-sm transition-all"
      />
      {localQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};
