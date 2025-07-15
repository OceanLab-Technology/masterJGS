"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUserStore, type User } from "@/store/useUserStore";

const userSchema = z.object({
  nickname: z.string().min(3, "Nickname must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  enabled: z.boolean().optional(),
  locked: z.boolean().optional(),
});

interface UserFormProps {
  mode: "create" | "update";
  user?: User | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function UserForm({ mode, user, onCancel, onSuccess }: UserFormProps) {
  const { createUser, updateUser } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreateMode = mode === "create";

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: isCreateMode
      ? {
          nickname: "",
          password: "",
        }
      : {
          nickname: user?.nickname || "",
          enabled: user?.enabled || false,
          locked: user?.locked || false,
        },
  });

  const onSubmit = async (data: any) => {
    if (isCreateMode && !data.password) {
      form.setError("password", { message: "Password is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        await createUser({
          nickname: data.nickname,
          password: data.password,
        });
        toast.success("User created successfully!");
      } else if (user) {
        await updateUser(user.id, {
          nickname: data.nickname,
          enabled: data.enabled,
          locked: data.locked,
        });
        toast.success("User updated successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="space-y-7">
        <div>
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            className="mt-3"
            {...form.register("nickname")}
            placeholder="Enter nickname"
          />
          {form.formState.errors.nickname && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.nickname.message}
            </p>
          )}
        </div>

        {isCreateMode ? (
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="mt-3"
              {...form.register("password")}
              placeholder="Enter password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                id="enabled"
                checked={form.watch("enabled")}
                onCheckedChange={(checked) => form.setValue("enabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="locked">Locked</Label>
              <Switch
                id="locked"
                checked={form.watch("locked")}
                onCheckedChange={(checked) => form.setValue("locked", checked)}
                disabled={!form.watch("locked")}
              />
            </div>
          </>
        )}

        <div>
          <Label>Type</Label>
          <Input value="Client" disabled className="bg-muted mt-3" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isCreateMode
              ? "Creating..."
              : "Updating..."
            : isCreateMode
            ? "Create User"
            : "Update User"}
        </Button>
      </div>
    </form>
  );
}