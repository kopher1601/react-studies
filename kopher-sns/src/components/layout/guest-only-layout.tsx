import { Navigate, Outlet } from "react-router";
import { useSession } from "@/store/session.ts";

export default function GuestOnlyLayout() {
  const session = useSession();
  if (session) {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
}
