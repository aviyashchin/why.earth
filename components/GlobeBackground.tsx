import Script from "next/script";

const GlobeBackground = () => {
  return (
    <div className="fixed left-0 top-0 w-screen h-screen overflow-hidden z-0">
      <Script src="/globejs/main.js" strategy="afterInteractive" />
    </div>
  );
};

export default GlobeBackground;
