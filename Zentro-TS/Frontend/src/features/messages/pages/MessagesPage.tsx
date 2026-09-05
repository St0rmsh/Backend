import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  SquarePen,
  UserRound,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useAppSelector } from "@/shared/hooks";
import { socketService } from "@/shared/lib/socket";
import {
  messageService,
  Message,
  ConversationSummary,
  UserSearchResult,
} from "../services/message.service";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();

  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d`;

  return new Date(dateString).toLocaleDateString();
}

function formatMessageTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatConversationDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const difference =
    (today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24);

  if (difference === 0) return "Today";

  if (difference === 1) return "Yesterday";

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

function getInitials(name?: string) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "?";
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function getMessageSenderId(message: Message) {
  return typeof message.sender === "string"
    ? message.sender
    : message.sender?._id;
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

function Avatar({
  src,
  name,
  size = "md",
  online = false,
}: {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}) {
  const sizeClass = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-12 w-12 text-sm",
  }[size];

  return (
    <div className="relative shrink-0">
      {src ? (
        <img
          src={src}
          alt={name || "User"}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-background`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted font-semibold text-primary ring-2 ring-background`}
        >
          {getInitials(name)}
        </div>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Conversation List                                                          */
/* -------------------------------------------------------------------------- */

function ConversationList({
  conversations,
  activeId,
  search,
  onSelect,
}: {
  conversations: ConversationSummary[];
  activeId: string;
  search: string;
  onSelect: (userId: string) => void;
}) {
  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return conversations;

    return conversations.filter(
      (conversation) =>
        conversation.fullname.toLowerCase().includes(value) ||
        conversation.username.toLowerCase().includes(value) ||
        conversation.lastMessage.content
          ?.toLowerCase()
          .includes(value)
    );
  }, [conversations, search]);

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <MessageCircle className="h-7 w-7 text-primary" />
        </div>

        <h3 className="font-semibold">No conversations yet</h3>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Start a conversation with someone using the compose button.
        </p>
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Search className="mb-3 h-7 w-7 text-muted-foreground" />

        <p className="text-sm font-medium">No conversations found</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Try searching for another name.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      {filteredConversations.map((conversation) => {
        const isActive = activeId === conversation.partnerId;

        const preview =
          conversation.lastMessage.content ||
          (conversation.lastMessage.mediaType === "image"
            ? "📷 Image"
            : conversation.lastMessage.mediaType === "video"
              ? "🎥 Video"
              : "Attachment");

        return (
          <button
            key={conversation.partnerId}
            onClick={() => onSelect(conversation.partnerId)}
            className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
              isActive
                ? "bg-primary/10 shadow-sm"
                : "hover:bg-muted/70"
            }`}
          >
            <Avatar
              src={conversation.avatar}
              name={conversation.fullname}
              size="md"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`truncate text-sm ${
                    conversation.unreadCount > 0
                      ? "font-bold text-foreground"
                      : "font-medium"
                  }`}
                >
                  {conversation.fullname}
                </span>

                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {timeAgo(conversation.lastMessage.createdAt)}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between gap-2">
                <span
                  className={`truncate text-xs ${
                    conversation.unreadCount > 0
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {preview}
                </span>

                {conversation.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {conversation.unreadCount > 99
                      ? "99+"
                      : conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* New Message Picker                                                         */
/* -------------------------------------------------------------------------- */

function NewMessagePicker({
  onPick,
  onClose,
}: {
  onPick: (user: UserSearchResult) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      messageService
        .searchUsers(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-4">
        <button
          onClick={onClose}
          className="rounded-lg p-2 transition hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          <h2 className="font-semibold">New message</h2>
          <p className="text-xs text-muted-foreground">
            Search for someone to start a conversation
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-full p-1 hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-2">
        {loading && (
          <div className="space-y-2 px-2 py-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl p-3"
              >
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !query.trim() && (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <UserRound className="h-6 w-6 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">Find someone</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Search by name or username.
            </p>
          </div>
        )}

        {!loading && query.trim() && results.length === 0 && (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <Search className="mb-3 h-7 w-7 text-muted-foreground" />

            <p className="text-sm font-medium">No people found</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try a different name or username.
            </p>
          </div>
        )}

        {!loading &&
          results.map((user) => (
            <button
              key={user._id}
              onClick={() => onPick(user)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-muted"
            >
              <Avatar
                src={user.avatar}
                name={user.fullname}
                size="md"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {user.fullname}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  @{user.username}
                </p>

                {user.bio && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {user.bio}
                  </p>
                )}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Message Bubble                                                             */
/* -------------------------------------------------------------------------- */

function MessageBubble({
  message,
  isMine,
  showDate,
}: {
  message: Message;
  isMine: boolean;
  showDate: boolean;
}) {
  return (
    <>
      {showDate && (
        <div className="my-6 flex items-center justify-center">
          <span className="rounded-full border bg-background px-3 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
            {formatConversationDate(message.createdAt)}
          </span>
        </div>
      )}

      <div
        className={`group flex ${
          isMine ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`relative max-w-[78%] sm:max-w-[65%] ${
            isMine
              ? "items-end"
              : "items-start"
          } flex flex-col`}
        >
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
              isMine
                ? "rounded-br-md bg-primary text-primary-foreground"
                : "rounded-bl-md border bg-card"
            }`}
          >
            {message.mediaUrl && (
              <div className="mb-2 overflow-hidden rounded-xl">
                {message.mediaType === "image" ? (
                  <img
                    src={message.mediaUrl}
                    alt="Attachment"
                    className="max-h-72 max-w-full object-cover"
                  />
                ) : (
                  <video
                    src={message.mediaUrl}
                    controls
                    className="max-h-72 max-w-full"
                  />
                )}
              </div>
            )}

            {message.content && (
              <p className="whitespace-pre-wrap break-words leading-5">
                {message.content}
              </p>
            )}
          </div>

          <div
            className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground ${
              isMine ? "flex-row-reverse" : ""
            }`}
          >
            <span>{formatMessageTime(message.createdAt)}</span>

            {isMine &&
              (message.readAt ? (
                <CheckCheck className="h-3 w-3 text-primary" />
              ) : (
                <Check className="h-3 w-3" />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export function MessagesPage() {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [searchParams, setSearchParams] = useSearchParams();

  const recipientId = searchParams.get("recipient") || "";

  const [conversations, setConversations] = useState<
    ConversationSummary[]
  >([]);

  const [activePartner, setActivePartner] = useState<
    ConversationSummary | UserSearchResult | null
  >(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  const [typing, setTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [conversationSearch, setConversationSearch] =
    useState("");

  const [loadingConversation, setLoadingConversation] =
    useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------------------------------------------------------------------- */
  /* Inbox                                                                   */
  /* ---------------------------------------------------------------------- */

  const loadInbox = () => {
    messageService
      .getInbox()
      .then(setConversations)
      .catch(() => setConversations([]));
  };

  useEffect(() => {
    loadInbox();
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Active partner                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const match = conversations.find(
      (conversation) =>
        conversation.partnerId === recipientId
    );

    if (match) {
      setActivePartner(match);
    }
  }, [conversations, recipientId]);

  /* ---------------------------------------------------------------------- */
  /* Conversation                                                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!recipientId) {
      setMessages([]);
      setActivePartner(null);
      return;
    }

    setLoadingConversation(true);

    messageService
      .getConversation(recipientId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoadingConversation(false));

    void messageService.markRead(recipientId).then(loadInbox);

    const handleMessage = (message: unknown) => {
      const next = message as Message;

      const senderId = getMessageSenderId(next);

      if (
        senderId === recipientId ||
        next.recipient === recipientId
      ) {
        setMessages((current) => {
          if (
            current.some(
              (existing) => existing._id === next._id
            )
          ) {
            return current;
          }

          return [...current, next];
        });

        loadInbox();
      }
    };

    const handleTyping = (userId: unknown) => {
      if (userId === recipientId) {
        setTyping(true);
      }
    };

    const handleTypingStop = (userId: unknown) => {
      if (userId === recipientId) {
        setTyping(false);
      }
    };

    socketService.on("message:new", handleMessage);
    socketService.on("typing:start", handleTyping);
    socketService.on("typing:stop", handleTypingStop);

    return () => {
      socketService.off("message:new", handleMessage);
      socketService.off("typing:start", handleTyping);
      socketService.off("typing:stop", handleTypingStop);
    };
  }, [recipientId]);

  /* ---------------------------------------------------------------------- */
  /* Auto scroll                                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                              */
  /* ---------------------------------------------------------------------- */

  const selectConversation = (userId: string) => {
    setSearchParams({ recipient: userId });
    setShowPicker(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const startNewConversation = (
    user: UserSearchResult
  ) => {
    setActivePartner(user);
    setSearchParams({ recipient: user._id });
    setShowPicker(false);
    setMessages([]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const closeConversation = () => {
    setSearchParams({});
    setMessages([]);
    setActivePartner(null);
  };

  /* ---------------------------------------------------------------------- */
  /* Send                                                                    */
  /* ---------------------------------------------------------------------- */

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const value = content.trim();

    if (!recipientId || !value) return;

    try {
      const message = await messageService.send(
        recipientId,
        value
      );

      setMessages((current) => {
        if (
          current.some(
            (existing) => existing._id === message._id
          )
        ) {
          return current;
        }

        return [...current, message];
      });

      setContent("");
      loadInbox();

      socketService.emit(
        "typing:stop",
        recipientId
      );
    } catch {
      // Keep typed content if sending fails.
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Partner information                                                     */
  /* ---------------------------------------------------------------------- */

  const partnerName = activePartner?.fullname || "";

  const partnerUsername =
    "username" in (activePartner || {})
      ? activePartner?.username
      : undefined;

  const partnerAvatar = activePartner?.avatar;

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden border bg-background shadow-xl md:my-4 md:h-[calc(100vh-6rem)] md:rounded-2xl">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                            */}
      {/* ------------------------------------------------------------------ */}

      <aside
        className={`relative flex w-full flex-col border-r bg-card md:w-[340px] md:shrink-0 ${
          recipientId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar header */}
        <div className="border-b px-4 pb-3 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h1 className="text-lg font-bold tracking-tight">
                    Messages
                  </h1>

                  <p className="text-[11px] text-muted-foreground">
                    Your conversations
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPicker(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md"
              aria-label="New message"
            >
              <SquarePen className="h-4 w-4" />
            </button>
          </div>

          {/* Conversation search */}
          <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <input
              value={conversationSearch}
              onChange={(event) =>
                setConversationSearch(event.target.value)
              }
              placeholder="Search conversations..."
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />

            {conversationSearch && (
              <button
                onClick={() => setConversationSearch("")}
                className="rounded-full p-1 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Conversations */}
        <ConversationList
          conversations={conversations}
          activeId={recipientId}
          search={conversationSearch}
          onSelect={selectConversation}
        />

        {/* New message overlay */}
        {showPicker && (
          <NewMessagePicker
            onPick={startNewConversation}
            onClose={() => setShowPicker(false)}
          />
        )}
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Chat                                                                */}
      {/* ------------------------------------------------------------------ */}

      <section
        className={`flex min-w-0 flex-1 flex-col bg-background ${
          recipientId ? "flex" : "hidden md:flex"
        }`}
      >
        {!recipientId ? (
          /* Empty chat */
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="relative">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border bg-card shadow-lg">
                <MessageCircle className="h-9 w-9 text-primary" />
              </div>

              <h2 className="text-xl font-bold tracking-tight">
                Your messages
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Select a conversation from the sidebar or start a
                new conversation with someone.
              </p>

              <button
                onClick={() => setShowPicker(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md"
              >
                <SquarePen className="h-4 w-4" />
                New message
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------------------ */}
            {/* Chat header                                                   */}
            {/* ------------------------------------------------------------ */}

            <header className="flex items-center gap-3 border-b bg-card px-3 py-3 sm:px-5">
              <button
                onClick={closeConversation}
                className="rounded-xl p-2 hover:bg-muted md:hidden"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <Avatar
                src={partnerAvatar}
                name={partnerName}
                size="md"
                online
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {partnerName || "Conversation"}
                </p>

                {partnerUsername ? (
                  <p className="truncate text-xs text-muted-foreground">
                    @{partnerUsername}
                  </p>
                ) : typing ? (
                  <p className="text-xs font-medium text-primary">
                    Typing...
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Active now
                  </p>
                )}
              </div>

              <button
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </header>

            {/* ------------------------------------------------------------ */}
            {/* Messages                                                      */}
            {/* ------------------------------------------------------------ */}

            <div className="relative flex-1 overflow-y-auto">
              <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-5 sm:px-6">
                {loadingConversation ? (
                  <div className="flex flex-1 flex-col justify-end gap-4">
                    <div className="flex">
                      <div className="h-12 w-48 animate-pulse rounded-2xl bg-muted" />
                    </div>

                    <div className="flex justify-end">
                      <div className="h-12 w-56 animate-pulse rounded-2xl bg-primary/10" />
                    </div>

                    <div className="flex">
                      <div className="h-16 w-64 animate-pulse rounded-2xl bg-muted" />
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <Avatar
                      src={partnerAvatar}
                      name={partnerName}
                      size="lg"
                      online
                    />

                    <h3 className="mt-4 font-semibold">
                      Start a conversation
                    </h3>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                      Send a message to {partnerName || "this person"}.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mt-auto space-y-1">
                      {messages.map((message, index) => {
                        const senderId =
                          getMessageSenderId(message);

                        const isMine =
                          senderId === currentUser?._id;

                        const previousMessage =
                          messages[index - 1];

                        const showDate =
                          !previousMessage ||
                          new Date(
                            previousMessage.createdAt
                          ).toDateString() !==
                            new Date(
                              message.createdAt
                            ).toDateString();

                        return (
                          <MessageBubble
                            key={message._id}
                            message={message}
                            isMine={isMine}
                            showDate={showDate}
                          />
                        );
                      })}

                      {/* Typing */}
                      {typing && (
                        <div className="flex justify-start pt-2">
                          <div className="rounded-2xl rounded-bl-md border bg-card px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                              <span
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                                style={{ animationDelay: "100ms" }}
                              />
                              <span
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                                style={{ animationDelay: "200ms" }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Composer                                                      */}
            {/* ------------------------------------------------------------ */}

            <div className="border-t bg-card px-3 py-3 sm:px-5">
              <form
                onSubmit={submit}
                className="mx-auto flex max-w-4xl items-end gap-2"
              >
                <div className="flex min-w-0 flex-1 items-end rounded-2xl border bg-muted/30 px-2 py-1.5 transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
                  <button
                    type="button"
                    className="mb-0.5 hidden rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:flex"
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    className="mb-0.5 hidden rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:flex"
                    aria-label="Add image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>

                  <input
                    ref={inputRef}
                    value={content}
                    onChange={(event) => {
                      setContent(event.target.value);

                      if (recipientId) {
                        socketService.emit(
                          "typing:start",
                          recipientId
                        );
                      }
                    }}
                    onFocus={() => {
                      if (recipientId && content.trim()) {
                        socketService.emit(
                          "typing:start",
                          recipientId
                        );
                      }
                    }}
                    onBlur={() => {
                      if (recipientId) {
                        socketService.emit(
                          "typing:stop",
                          recipientId
                        );
                      }
                    }}
                    placeholder={`Message ${partnerName || "someone"}...`}
                    className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                  />

                  <button
                    type="button"
                    className="mb-0.5 rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Add emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!content.trim()}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <p className="mx-auto mt-2 hidden max-w-4xl text-[10px] text-muted-foreground sm:block">
                Messages are delivered in real time.
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}