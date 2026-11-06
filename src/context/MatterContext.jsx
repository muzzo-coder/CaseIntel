/* eslint-disable react-refresh/only-export-components */
/**
 * MatterContext — Active Matter context shared across the app
 */
import { createContext, useContext, useState } from 'react';
import { MOCK_MATTER } from '../mocks/data';

const MatterContext = createContext(null);

export function MatterProvider({ children }) {
  const [activeMatter, setActiveMatter] = useState(MOCK_MATTER);

  return (
    <MatterContext.Provider value={{ activeMatter, setActiveMatter }}>
      {children}
    </MatterContext.Provider>
  );
}

export function useMatter() {
  return useContext(MatterContext);
}
