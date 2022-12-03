import { useEffect, useState } from "react";

const useDetectDevice = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    setIsMobile(window.innerWidth <= 768);
  }
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return { isMobile, width, height };
};

export default useDetectDevice;
