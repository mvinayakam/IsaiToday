import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface YouTubePlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  youtubeId: string;
  title: string;
}

export default function YouTubePlayerDialog({
  open,
  onOpenChange,
  youtubeId,
  title,
}: YouTubePlayerDialogProps) {
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&modestbranding=1`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0" data-testid="dialog-youtube-player">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={open ? embedUrl : ""}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            data-testid="iframe-youtube-player"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
