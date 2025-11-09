import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import { useState } from "react";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password.ts";

import GithubIcon from "@/assets/github-mark.svg";
import { useSignInWithOAuth } from "@/hooks/mutations/use-sign-in-with-oauth.ts";
import { toast } from "sonner";
import { generateErrorMessage } from "@/lib/error.ts";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signIn, isPending: isSigningInWithPassword } =
    useSignInWithPassword({
      onError: (error) => {
        const errorMessage = generateErrorMessage(error);
        toast.error(errorMessage, { position: "top-center" });
        setPassword("");
      },
    });
  const { mutate: signInWithOAuth, isPending: isSigningInWithOAuth } =
    useSignInWithOAuth({
      onError: (error) => {
        const errorMessage = generateErrorMessage(error);
        toast.error(errorMessage, { position: "top-center" });
      },
    });

  const handleSignInClick = () => {
    if (email.trim() === "") {
      return;
    }

    if (password.trim() === "") {
      return;
    }

    signIn({ email, password });
  };

  const handleSignInWithOAuthClick = () => {
    signInWithOAuth("github");
  };

  const isPendig = isSigningInWithPassword || isSigningInWithOAuth;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">ログイン</div>
      <div className="flex flex-col gap-2">
        <Input
          className="py-6"
          type="email"
          placeholder="example@abc.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPendig}
        />
        <Input
          className="py-6"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPendig}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleSignInClick}
          disabled={isPendig}
        >
          ログイン
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleSignInWithOAuthClick}
          disabled={isPendig}
        >
          <img src={GithubIcon} alt="Github Icon" className="h-4 w-4" />
          Github ログイン
        </Button>
      </div>
      <div>
        <Link className="text-muted-foreground hover:underline" to="/sign-up">
          アカウントをお持ちではない方は → 会員登録
        </Link>
      </div>
    </div>
  );
}
