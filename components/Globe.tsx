import Script from "next/script";

const Globe = () => {
  return (
    <>
      <section className="Satellite z-10">
        <div className="Satellite__globe js-globe"></div>
        <span className="array"></span>
      </section>
      <Script src="/js/stripe-globe.js" strategy="afterInteractive" />
    </>
  );
};

export default Globe;
