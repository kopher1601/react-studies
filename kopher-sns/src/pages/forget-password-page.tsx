import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useRequestPasswordResetEmail } from "@/hooks/mutations/auth/use-request-password-reset-email.ts";
import { toast } from "sonner";
import { generateErrorMessage } from "@/lib/error.ts";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const {
    mutate: requestPasswordResetEmail,
    isPending: isRequestPasswordResetEmailPending,
  } = useRequestPasswordResetEmail({
    onSuccess: () => {
      toast.info("再設定メールを送信しました。", { position: "top-center" });
      setEmail("");
    },
    onError: (error) => {
      const errorMessage = generateErrorMessage(error);
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });

  const handleSendEmailClick = () => {
    if (email.trim() === "") {
      return;
    }
    requestPasswordResetEmail(email);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="text-xl font-bold">パスワードをお忘れでしょうか？</div>
        <div className="text-muted-foreground">
          パスワードを再設定できるリンクをメールにお送りします。
        </div>
      </div>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="py-6"
        placeholder="example@example.com"
        disabled={isRequestPasswordResetEmailPending}
      />
      <Button
        disabled={isRequestPasswordResetEmailPending}
        onClick={handleSendEmailClick}
        className="w-full"
      >
        再設定メール送信
      </Button>
    </div>
  );
}
