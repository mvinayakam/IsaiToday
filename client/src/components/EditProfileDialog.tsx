import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFirstName?: string | null;
  currentLastName?: string | null;
  currentProfileImageUrl?: string | null;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  currentFirstName,
  currentLastName,
  currentProfileImageUrl,
}: EditProfileDialogProps) {
  const [firstName, setFirstName] = useState(currentFirstName || "");
  const [lastName, setLastName] = useState(currentLastName || "");
  const [profileImageUrl, setProfileImageUrl] = useState(currentProfileImageUrl || "");
  const { toast } = useToast();

  // Update form when props change or dialog opens
  useEffect(() => {
    if (open) {
      setFirstName(currentFirstName || "");
      setLastName(currentLastName || "");
      setProfileImageUrl(currentProfileImageUrl || "");
    }
  }, [open, currentFirstName, currentLastName, currentProfileImageUrl]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", "/api/auth/user", {
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        profileImageUrl: profileImageUrl.trim() || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              data-testid="input-first-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              data-testid="input-last-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Image URL</Label>
            <Input
              id="profile-image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              data-testid="input-profile-image-url"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProfileMutation.isPending}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
