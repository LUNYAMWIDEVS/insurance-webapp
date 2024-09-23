import React, { createContext, useContext, useState } from 'react';

const AmendedPolicyContext = createContext({});

export default function AmendedPolicyProvider({ children }) {
  const [policy, setAmendedPolicy] = useState();
  return (
    <AmendedPolicyContext.Provider value={{ policy, setAmendedPolicy }}>
      {children}
    </AmendedPolicyContext.Provider>
  );
}

export function useAmendedPolicy() {
	const context = useContext(AmendedPolicyContext);
	if(!context) {
		throw new Error('No amended policy context')
	}

	return context
}
