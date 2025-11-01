import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface Comment {
  comment: {
    id: string;
    songId: string;
    userId: string;
    content: string;
    createdAt: string;
  };
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
}

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

interface CommentSectionProps {
  songId: string;
  currentUserId?: string;
}

export function CommentSection({ songId, currentUserId }: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Fetch comments
  const { data: comments = [], isLoading: loadingComments } = useQuery<Comment[]>({
    queryKey: ["/api/songs", songId, "comments"],
  });

  // Fetch current user
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: !!currentUserId,
  });

  // Search users for mentions
  const { data: userSuggestions = [] } = useQuery<User[]>({
    queryKey: ["/api/users/search", mentionQuery],
    enabled: mentionQuery.length >= 2,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (commentContent: string) => {
      return await apiRequest(`/api/songs/${songId}/comments`, "POST", {
        content: commentContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs", songId, "comments"] });
      setContent("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return await apiRequest(`/api/comments/${commentId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs", songId, "comments"] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    },
  });

  // Handle textarea input for @mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setContent(value);
    setCursorPosition(cursorPos);

    // Check if typing @mention
    const textBeforeCursor = value.slice(0, cursorPos);
    const match = textBeforeCursor.match(/@(\w*)$/);
    
    if (match) {
      setMentionQuery(match[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setMentionQuery("");
    }
  };

  // Insert mention into textarea
  const insertMention = (user: User) => {
    const userName = `${user.firstName} ${user.lastName}`;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    
    // Remove the partial @ mention
    const beforeMention = textBeforeCursor.replace(/@\w*$/, "");
    const newContent = `${beforeMention}@${userName.replace(/\s+/g, "")} ${textAfterCursor}`;
    
    setContent(newContent);
    setShowSuggestions(false);
    setMentionQuery("");
    
    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    createCommentMutation.mutate(content);
  };

  // Parse comment content to make @mentions clickable
  const parseContent = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1);
        return (
          <span key={index} className="text-primary font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4" data-testid="comment-section">
      {/* Comment input */}
      {currentUserId && (
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleInputChange}
              placeholder="Add a comment... (use @ to mention users)"
              className="min-h-20 resize-none"
              data-testid="input-comment"
            />
            
            {/* Mention suggestions */}
            {showSuggestions && userSuggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                {userSuggestions.map((suggestedUser) => (
                  <button
                    key={suggestedUser.id}
                    onClick={() => insertMention(suggestedUser)}
                    className="w-full flex items-center gap-2 p-2 hover-elevate active-elevate-2 text-left"
                    data-testid={`suggestion-user-${suggestedUser.id}`}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={suggestedUser.profileImageUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {suggestedUser.firstName?.[0]}
                        {suggestedUser.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {suggestedUser.firstName} {suggestedUser.lastName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || createCommentMutation.isPending}
            data-testid="button-post-comment"
          >
            {createCommentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Comment
          </Button>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {loadingComments ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8" data-testid="text-no-comments">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(({ comment, user: commentUser }) => (
            <div
              key={comment.id}
              className="flex gap-3 group"
              data-testid={`comment-${comment.id}`}
            >
              <Link href={`/user/${commentUser.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={commentUser.profileImageUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {commentUser.firstName?.[0]}
                    {commentUser.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/user/${commentUser.id}`}
                    className="font-medium text-sm hover:underline"
                    data-testid={`link-user-${commentUser.id}`}
                  >
                    {commentUser.firstName} {commentUser.lastName}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  
                  {currentUserId === comment.userId && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteCommentMutation.mutate(comment.id)}
                      disabled={deleteCommentMutation.isPending}
                      data-testid={`button-delete-comment-${comment.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-foreground" data-testid={`text-comment-content-${comment.id}`}>
                  {parseContent(comment.content)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
