"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  date: string;
  reactions: { [key: string]: number };
}

export default function Comments({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const storageKey = `comments_${courseSlug}_${lessonSlug}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setComments(JSON.parse(stored));
  }, [storageKey]);

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: session?.user?.name || "Visiteur",
      avatar: session?.user?.image || "",
      text: newComment.trim(),
      date: new Date().toLocaleDateString("fr-FR"),
      reactions: {},
    };
    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewComment("");
  };

  const addReaction = (commentId: string, emoji: string) => {
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        const reactions = { ...c.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...c, reactions };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💬 Commentaires ({comments.length})</h3>

      {/* Add comment */}
      <div className="flex gap-3 mb-6">
        <div className="flex-shrink-0">
          {session?.user?.image ? (
            <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm">👤</div>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={session ? "Partagez votre avis sur cette leçon..." : "Connectez-vous pour commenter"}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={!session}
          />
          <button
            onClick={addComment}
            disabled={!newComment.trim() || !session}
            className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Publier
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex-shrink-0">
              {comment.avatar ? (
                <img src={comment.avatar} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm">👤</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.user}</span>
                <span className="text-xs text-gray-400">{comment.date}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
              <div className="flex gap-1 mt-2">
                {["👍", "❤️", "🎉", "🤔"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(comment.id, emoji)}
                    className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {emoji} {comment.reactions[emoji] || ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">Soyez le premier à commenter cette leçon !</p>
      )}
    </div>
  );
}
