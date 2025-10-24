import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddSongDialog from "@/components/AddSongDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function FloatingAddButton() {
  const [addSongOpen, setAddSongOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Button
        size="lg"
        onClick={() => setAddSongOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-14 w-14 rounded-full shadow-lg z-40"
        data-testid="button-floating-add-song"
      >
        <Plus className="w-6 h-6" />
      </Button>
      
      <AddSongDialog open={addSongOpen} onOpenChange={setAddSongOpen} />
    </>
  );
}
