import { Navigate, Route, Routes } from "react-router";

export default function RootRoute() {
  return (
    <Routes>
      <Route path="/sign-in" element={<div>Sign In</div>} />
      <Route path="/sign-up" element={<div>Sign Up</div>} />
      <Route path="/forget-password" element={<div>Forget Password</div>} />

      <Route path="/" />
      <Route path="/post/:postId" />
      <Route path="/profile/:userId" />
      <Route path="/reset-password" />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
