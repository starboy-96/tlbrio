import Ambient from "@/components/Ambient";

export default function DarkBackdrop() {
  return (
    <>
      <Ambient blobs={[
        { color: "rgba(148,229,97,0.26)", size: "58vw", top: "-35%", right: "-12%" },
        { color: "rgba(70,130,255,0.2)", size: "50vw", bottom: "-45%", left: "-10%", drift: "b" },
      ]} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black 20%, transparent 75%)",
      }} />
    </>
  );
}
