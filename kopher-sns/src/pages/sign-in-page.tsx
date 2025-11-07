import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import { useState } from "react";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password.ts";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signIn } = useSignInWithPassword();

  const handleSignInClick = () => {
    if (email.trim() === "") {
      return;
    }

    if (password.trim() === "") {
      return;
    }

    signIn({ email, password });
  };

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
        />
        <Input
          className="py-6"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <Button className="w-full" onClick={handleSignInClick}>
          ログイン
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
