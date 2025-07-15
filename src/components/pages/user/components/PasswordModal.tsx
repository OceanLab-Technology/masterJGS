"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconKey } from "@tabler/icons-react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useUserStore, type User } from "@/store/useUserStore";

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function PasswordModal({ isOpen, onClose, user }: PasswordModalProps) {
  const { changePassword } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await changePassword(user.id, {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password changed successfully!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 rounded-lg shadow-xl">
        <div>
          <DialogHeader>
            <div className="flex items-center justify-between space-x-4 p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-muted p-3 rounded-lg flex-shrink-0 mt-1">
                  <IconKey className="h-7 w-7" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    Change Password
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 mt-1">
                    Change password for user: {user?.nickname}
                  </DialogDescription>
                </div>
              </div>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-full border flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 self-center"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
            <Separator className="mb-6" />
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...form.register("newPassword")}
                  placeholder="Enter new password"
                />
                {form.formState.errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...form.register("confirmPassword")}
                  placeholder="Confirm new password"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}