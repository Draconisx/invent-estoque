import { useState } from 'react';
import type { Tab } from './types';
import { useStock } from './useStock';
import StockTab from './components/StockTab';
import ReportsTab from './components/ReportsTab';
import { Package, BarChart3 } from 'lucide-react';

function App() {
  const [tab, setTab] = useState<Tab>('estoque');
  const stock = useStock();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Gerenciamento de Estoque
          </h1>
          <nav className="flex gap-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setTab('estoque')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                tab === 'estoque' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package className="w-4 h-4" /> Estoque
            </button>
            <button
              onClick={() => setTab('relatorios')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                tab === 'relatorios' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Relatorios
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {tab === 'estoque' ? <StockTab stock={stock} /> : <ReportsTab movements={stock.movements} />}
      </main>
    </div>
  );
}

export default App;
