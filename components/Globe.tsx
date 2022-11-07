import Script from "next/script";

const Globe = () => {
  return (
    <>
      <section className="Satellite z-10">
        <div className="Satellite__globe js-globe"></div>
        <span className="array"></span>
      </section>
      <Script
        src="https://b.stripecdn.com/site-srv/assets/compiled/js/blog/globe-f22b76d7dcb05af683c3.min.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default Globe;
