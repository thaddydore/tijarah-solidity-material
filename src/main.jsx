import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

const sepoliaAddress = import.meta.env.VITE_SEPOLIA_URL;

const config = createConfig({
	ssr: false, // Make sure to enable this for server-side rendering (SSR) applications.
	chains: [sepolia],
	connectors: [metaMask()],
	transports: {
		[sepolia.id]: http(sepoliaAddress),
	},
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
	<WagmiProvider config={config}>
		<QueryClientProvider client={queryClient}>
			<StrictMode>
				<App />
			</StrictMode>
		</QueryClientProvider>
	</WagmiProvider>
);
