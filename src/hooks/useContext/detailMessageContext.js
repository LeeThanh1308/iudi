import { createContext, useState } from "react";

export const DetailMessageContext = createContext();
function DetailMessageProvider({ children }) {
  const [reRender, setRender] = useState(false);
  const handleSetReder = () => {
    setRender(!reRender);
  };
  return (
    <DetailMessageContext.Provider value={{ reRender, handleSetReder }}>
      {children}
    </DetailMessageContext.Provider>
  );
}

export default DetailMessageProvider;
