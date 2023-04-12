/**
 * @DEV: If the sandbox is throwing dependency errors, chances are you need to clear your browser history.
 * This will trigger a re-install of the dependencies in the sandbox – which should fix things right up.
 * Alternatively, you can fork this sandbox to refresh the dependencies manually.
 */
import React from 'react';
import styled from 'styled-components';


import { Logs, Sidebar, NoProvider } from './components';
import { Props } from './types';
import useProps from './hook/useProps';
// =============================================================================
// Styled Components
// =============================================================================

const StyledApp = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// =============================================================================
// Constants
// =============================================================================

declare global {
  interface Window {
    ethereum: any
  }
}


// =============================================================================
// Typedefs
// =============================================================================


const StatelessApp = React.memo((props: Props) => {
  const { address, connectedMethods, handleConnect,balance, logs, clearLogs } = props;

  return (
    <StyledApp>
      <Sidebar address={address} balance={balance} connectedMethods={connectedMethods} connect={handleConnect} />
      <Logs address={address} logs={logs} clearLogs={clearLogs} />
    </StyledApp>
  );
});

// =============================================================================
// Main Component
// =============================================================================

const App = () => {
  const props = useProps();

  if (!props.provider) {
    return <NoProvider />;
  }

  return <StatelessApp {...props} />;
};

export default App;
