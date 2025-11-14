import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { generateErrorMessage } from "@/lib/error.ts";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate: updatePassword, isPending: isUpdatePassword } =
    useUpdatePassword({
      onSuccess: () => {
        toast.success("パスワードを変更しました。", { position: "top-center" });
        navigate("/");
      },
      onError: (error) => {
        const errorMessage = generateErrorMessage(error);
        toast.error(errorMessage, {
          position: "top-center",
        });
        setPassword("");
      },
    });

  const handleUpdatePasswordClick = () => {
    if (password.trim() === "") {
      return;
    }
    updatePassword(password);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="text-xl font-bold">パスワード再設定</div>
        <div className="text-muted-foreground">
          新しいパスワードを入力してください。
        </div>
      </div>
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="py-6"
        placeholder="password"
        disabled={isUpdatePassword}
      />
      <Button
        disabled={isUpdatePassword}
        onClick={handleUpdatePasswordClick}
        className="w-full"
      >
        パスワード変更
      </Button>
    </div>
  );
}
