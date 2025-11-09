import logo from "@/assets/logo.png";

export default function GlobalLoader() {
  return (
    <div className="bg-muted flex h-[100vh] w-[100vw] flex-col items-center justify-center">
      <div className="mb-15 flex animate-bounce items-center gap-4">
        <img alt="site logo" src={logo} className="w-10" />
        <div className="text-2xl font-bold">Kophergram</div>
      </div>
    </div>
  );
}
