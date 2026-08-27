import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { toggleFocusMode } from "../state/readingSlice";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";

export const FocusModeButton = () => {
  const dispatch = useAppDispatch();
  const { focusMode } = useAppSelector((state) => state.reading.preferences);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={focusMode ? "secondary" : "ghost"} 
            size="icon" 
            onClick={() => dispatch(toggleFocusMode())}
            className={`rounded-full transition-all ${focusMode ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {focusMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
