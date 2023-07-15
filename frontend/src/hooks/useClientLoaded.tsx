import { useEffect, useState } from "react";

const useClientLoaded = () => {
  const [clientLoaded, setClientLoaded] = useState(false);

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  return clientLoaded;
};

export default useClientLoaded;
