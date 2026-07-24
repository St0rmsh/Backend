import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

function UserAvatar({ user, index }) {
  const initials = (user.name || 'G')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="relative group"
      style={{ marginLeft: index === 0 ? 0 : -8, zIndex: 10 - index }}
      title={user.name}
    >
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="w-7 h-7 rounded-full border-2 border-surface-lowest object-cover"
        />
      ) : (
        <div className="w-7 h-7 rounded-full border-2 border-surface-lowest bg-primary/30 text-primary flex items-center justify-center text-[10px] font-semibold">
          {initials}
        </div>
      )}
      <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-surface-highest border border-white/10 text-[10px] text-on-surface whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
        {user.name}
      </div>
    </div>
  );
}

export default function PresenceBar({ socket }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!socket) {
      setUsers([]);
      return;
    }

    const onPresence = (userList) => {
      setUsers(userList);
    };

    socket.on('presence-update', onPresence);

    return () => {
      socket.off('presence-update', onPresence);
    };
  }, [socket]);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-2">
      <div className="flex items-center">
        {users.slice(0, 4).map((u, i) => (
          <UserAvatar key={u.socketId} user={u} index={i} />
        ))}
      </div>
      {users.length > 4 && (
        <span className="text-[10px] text-on-surface-variant font-mono ml-1">
          +{users.length - 4}
        </span>
      )}
      <div className="flex items-center gap-1 text-[10px] text-on-surface-variant font-mono ml-1">
        <Users size={11} />
        {users.length}
      </div>
    </div>
  );
}