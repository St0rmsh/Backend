import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { FeedAuthor } from "../types/feed.types";

interface AuthorCardProps {
  author: FeedAuthor;
  postDate?: string;
  className?: string;
}

export function AuthorCard({ author, postDate, className }: AuthorCardProps) {
  const initials = author.fullname
    ? author.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : author.username.slice(0, 2).toUpperCase();

  const formattedDate = postDate
    ? new Date(postDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Link to={`/app/profile/${author.username}`} className="flex-shrink-0 group">
        <Avatar className="w-10 h-10 border border-border/40 group-hover:border-primary/50 transition-all duration-300">
          {author.avatar && <AvatarImage src={author.avatar} alt={author.fullname} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1">
          <Link
            to={`/app/profile/${author.username}`}
            className="text-sm font-semibold hover:text-primary transition-colors truncate text-foreground leading-none"
          >
            {author.fullname}
          </Link>
          {author.isVerified && (
            <CheckCircle2 className="w-3.5 h-3.5 fill-primary text-primary-foreground flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
          <span>@{author.username}</span>
          {formattedDate && (
            <>
              <span className="text-[8px] opacity-60">•</span>
              <span>{formattedDate}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
