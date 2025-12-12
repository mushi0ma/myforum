import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Camera, Github, Twitter, Globe, Save, Loader2 } from "lucide-react";

// Zod schema for profile validation
const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  website: z
    .string()
    .regex(/^https?:\/\/.+/, "Please enter a valid URL starting with http:// or https://")
    .optional()
    .or(z.literal("")),
  github: z.string().optional(),
  twitter: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function SettingsProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "Alex Developer",
      username: "alexdev",
      email: "alex@example.com",
      bio: "Full-stack developer passionate about clean code and open source.",
      website: "https://alexdev.io",
      github: "alexdev",
      twitter: "alexdev",
    },
  });

  const bioValue = watch("bio") || "";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large. Please select an image under 2MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please select a JPG, PNG, or GIF image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Profile data:", data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={avatarPreview || "/placeholder-user.jpg"} />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <Button
            type="button"
            size="icon"
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h3 className="font-semibold">Profile Photo</h3>
          <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
          {avatarPreview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setAvatarPreview(null)}
            >
              Remove photo
            </Button>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              {...register("displayName")}
              className={`bg-card border-border ${errors.displayName ? "border-destructive" : ""}`}
            />
            {errors.displayName && <p className="text-xs text-destructive">{errors.displayName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="username"
                {...register("username")}
                className={`bg-card border-border pl-8 ${errors.username ? "border-destructive" : ""}`}
              />
            </div>
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className={`bg-card border-border ${errors.email ? "border-destructive" : ""}`}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            className={`bg-card border-border min-h-[100px] resize-none ${errors.bio ? "border-destructive" : ""}`}
            placeholder="Tell us about yourself..."
          />
          <div className="flex justify-between">
            <p className={`text-xs ${bioValue.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
              {bioValue.length}/160 characters
            </p>
            {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website"
              {...register("website")}
              className={`bg-card border-border pl-10 ${errors.website ? "border-destructive" : ""}`}
              placeholder="https://yoursite.com"
            />
          </div>
          {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="github"
                {...register("github")}
                className="bg-card border-border pl-10"
                placeholder="username"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="twitter"
                {...register("twitter")}
                className="bg-card border-border pl-10"
                placeholder="username"
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="gap-2" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
