import { Link, Outlet } from "react-router";
import { SunIcon, User } from "lucide-react";
import logo from "@/assets/logo.png";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <header className="h-15 border-b">
        <div className="m-auto flex h-full w-full max-w-175 justify-between px-4">
          <Link className="flex items-center gap-2" to="/">
            <img alt="サイトロゴ" src={logo} className="h-5" />
            <div className="font-bold">Kophergram</div>
          </Link>
          <div className="flex items-center gap-5">
            <div className="hover:bg-muted cursor-pointer rounded-full p-2">
              <SunIcon />
            </div>
            <User />
          </div>
        </div>
      </header>
      <main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-muted-foreground border-t py-10 text-center">
        @Kopher
      </footer>
    </div>
  );
}
