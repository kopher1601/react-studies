import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import { useState } from "react";
import { useSignUp } from "@/hooks/mutations/use-sign-up.ts";
import { generateErrorMessage } from "@/lib/error.ts";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signUp, isPending: isSigningUp } = useSignUp({
    onError: (error) => {
      const errorMessage = generateErrorMessage(error);
      toast.error(errorMessage, { position: "top-center" });
    },
  });

  const handleSignUpClick = () => {
    if (email.trim() === "") {
      return;
    }

    if (password.trim() === "") {
      return;
    }

    signUp({ email, password });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">会員登録</div>
      <div className="flex flex-col gap-2">
        <Input
          className="py-6"
          type="email"
          placeholder="example@abc.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSigningUp}
        />
        <Input
          className="py-6"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSigningUp}
        />
      </div>
      <div>
        <Button
          className="w-full"
          onClick={handleSignUpClick}
          disabled={isSigningUp}
        >
          会員登録
        </Button>
      </div>
      <div>
        <Link className="text-muted-foreground hover:underline" to="/sign-in">
          既にアカウントをお持ちの方は → ログイン
        </Link>
      </div>
    </div>
  );
}
