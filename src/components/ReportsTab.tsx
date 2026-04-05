import { useState, useMemo } from 'react';
import type { Movement, ItemDescription } from '../types';
import { Home, Calendar, Clock, ArrowUp, ArrowDown, FileText, List, ClipboardList, ChevronRight, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as store from '../store';

interface Props {
  movements: Movement[];
}

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

type View = 'main' | 'years' | 'months' | 'details' | 'listarYear' | 'listarItems' | 'listagem' | 'listagemDetail';

export default function ReportsTab({ movements }: Props) {
  const [view, setView] = useState<View>('main');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [descriptions, setDescriptions] = useState<ItemDescription[]>(store.getDescriptions);

  // Listar state
  const [listarYear, setListarYear] = useState<number | null>(null);
  const [descModal, setDescModal] = useState<{ movement: Movement } | null>(null);
  const [descText, setDescText] = useState('');

  // Listagem detail
  const [selectedDesc, setSelectedDesc] = useState<ItemDescription | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const years = useMemo(() => {
    const minYear = movements.reduce((min, m) => {
      const y = new Date(m.timestamp).getFullYear();
      return y < min ? y : min;
    }, currentYear);
    const result: number[] = [];
    for (let y = minYear; y <= currentYear; y++) result.push(y);
    return result;
  }, [movements, currentYear]);

  const months = useMemo(() => {
    if (selectedYear === null) return [];
    const maxMonth = selectedYear === currentYear ? currentMonth : 11;
    const result: number[] = [];
    for (let m = 0; m <= maxMonth; m++) result.push(m);
    return result;
  }, [selectedYear, currentYear, currentMonth]);

  const filteredMovements = useMemo(() => {
    if (selectedYear === null || selectedMonth === null) return [];
    return movements
      .filter(m => {
        const d = new Date(m.timestamp);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [movements, selectedYear, selectedMonth]);

  const chartData = useMemo(() => {
    const map: Record<string, { name: string; adicionado: number; removido: number }> = {};
    filteredMovements.forEach(m => {
      if (!map[m.productName]) map[m.productName] = { name: m.productName, adicionado: 0, removido: 0 };
      if (m.type === 'add') map[m.productName].adicionado += m.quantity;
      else map[m.productName].removido += m.quantity;
    });
    return Object.values(map);
  }, [filteredMovements]);

  // Movements for listar year
  const listarMovements = useMemo(() => {
    if (listarYear === null) return [];
    return movements
      .filter(m => new Date(m.timestamp).getFullYear() === listarYear)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [movements, listarYear]);

  // Descriptions with descriptions (for listagem)
  const descriptionsWithContent = useMemo(() => {
    return descriptions.filter(d => d.description.trim().length > 0);
  }, [descriptions]);

  const handleReset = () => {
    setView('main');
    setSelectedYear(null);
    setSelectedMonth(null);
    setListarYear(null);
    setSelectedDesc(null);
  };

  const handleYearSelect = (y: number) => {
    setSelectedYear(y);
    setView('months');
  };

  const handleMonthSelect = (m: number) => {
    setSelectedMonth(m);
    setView('details');
  };

  const handleListarYearSelect = (y: number) => {
    setListarYear(y);
    setView('listarItems');
  };

  const handleSaveDescription = () => {
    if (!descModal || !descText.trim() || listarYear === null) return;
    const desc: ItemDescription = {
      id: store.genId(),
      movementId: descModal.movement.id,
      productName: descModal.movement.productName,
      categoryName: descModal.movement.categoryName,
      description: descText.trim(),
      year: listarYear,
      timestamp: new Date().toISOString(),
    };
    store.addDescription(desc);
    setDescriptions(store.getDescriptions());
    setDescModal(null);
    setDescText('');
  };

  const showBackButton = view !== 'main';

  return (
    <div className="space-y-4 sm:space-y-6">
      {showBackButton && (
        <button onClick={handleReset} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <Home className="w-4 h-4" /> Inicio
        </button>
      )}

      {/* Main view - 3 options */}
      {view === 'main' && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Relatorios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Card Anos */}
            <button
              onClick={() => setView('years')}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5 sm:p-6 text-left active:scale-95 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-gray-800 block">Movimentacoes</span>
                <p className="text-xs text-gray-400 mt-0.5">Visualizar por ano e mes</p>
              </div>
            </button>

            {/* Card Listar */}
            <button
              onClick={() => setView('listarYear')}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all p-5 sm:p-6 text-left active:scale-95 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <List className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-gray-800 block">Listar</span>
                <p className="text-xs text-gray-400 mt-0.5">Listar itens e adicionar descricao</p>
              </div>
            </button>

            {/* Card Listagem */}
            {descriptionsWithContent.length > 0 && (
              <button
                onClick={() => setView('listagem')}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-5 sm:p-6 text-left active:scale-95 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-gray-800 block">Listagem</span>
                  <p className="text-xs text-gray-400 mt-0.5">{descriptionsWithContent.length} itens com descricao</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Year cards (movimentacoes) */}
      {view === 'years' && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Selecione o Ano
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {years.map(y => (
              <button
                key={y}
                onClick={() => handleYearSelect(y)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-4 sm:p-6 text-center active:scale-95"
              >
                <span className="text-2xl sm:text-3xl font-bold text-gray-800">{y}</span>
                <p className="text-xs text-gray-400 mt-1">
                  {movements.filter(m => new Date(m.timestamp).getFullYear() === y).length} movimentacoes
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month cards */}
      {view === 'months' && selectedYear !== null && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> {selectedYear} - Selecione o Mes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {months.map(m => (
              <button
                key={m}
                onClick={() => handleMonthSelect(m)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-4 sm:p-6 text-center active:scale-95"
              >
                <span className="text-base sm:text-xl font-bold text-gray-800">{MONTH_NAMES[m]}</span>
                <p className="text-xs text-gray-400 mt-1">
                  {movements.filter(mv => { const d = new Date(mv.timestamp); return d.getFullYear() === selectedYear && d.getMonth() === m; }).length} movimentacoes
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Movement details + chart */}
      {view === 'details' && selectedYear !== null && selectedMonth !== null && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            {MONTH_NAMES[selectedMonth]} de {selectedYear}
          </h2>
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Movimentacoes</h3>
              {filteredMovements.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhuma movimentacao neste periodo.</p>
              ) : (
                <div className="space-y-2 max-h-[60vh] sm:max-h-[500px] overflow-y-auto pr-1">
                  {filteredMovements.map(m => {
                    const d = new Date(m.timestamp);
                    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    const date = d.toLocaleDateString('pt-BR');
                    return (
                      <div key={m.id} className={`flex items-start sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border ${
                        m.type === 'add' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}>
                        {m.type === 'add' ? (
                          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5 sm:mt-0" />
                        ) : (
                          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5 sm:mt-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{m.productName}</p>
                          <p className="text-xs text-gray-500">{m.categoryName}</p>
                          {m.finalidade && (
                            <p className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                              <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                              <span className="italic break-words">{m.finalidade}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs sm:text-sm font-bold ${m.type === 'add' ? 'text-green-700' : 'text-red-700'}`}>
                            {m.type === 'add' ? '+' : '-'}{m.quantity}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 hidden sm:block" /> <span className="hidden sm:inline">{date}</span> {time}
                          </p>
                          <p className="text-xs text-gray-400 sm:hidden">{date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Grafico de Movimentacoes</h3>
              {chartData.length === 0 ? (
                <p className="text-gray-400 text-sm">Sem dados para exibir.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={35} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="adicionado" fill="#22c55e" name="Adicionado" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="removido" fill="#ef4444" name="Removido" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Listar - Year selection */}
      {view === 'listarYear' && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <List className="w-5 h-5 text-purple-600" /> Listar - Selecione o Ano
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {years.map(y => (
              <button
                key={y}
                onClick={() => handleListarYearSelect(y)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all p-4 sm:p-6 text-center active:scale-95"
              >
                <span className="text-2xl sm:text-3xl font-bold text-gray-800">{y}</span>
                <p className="text-xs text-gray-400 mt-1">
                  {movements.filter(m => new Date(m.timestamp).getFullYear() === y).length} itens
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Listar - Items list */}
      {view === 'listarItems' && listarYear !== null && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <List className="w-5 h-5 text-purple-600" /> Itens de {listarYear}
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
            {listarMovements.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum item encontrado neste ano.</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {listarMovements.map(m => {
                  const d = new Date(m.timestamp);
                  const monthName = MONTH_NAMES[d.getMonth()];
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setDescModal({ movement: m }); setDescText(''); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors hover:shadow-sm active:scale-[0.99] ${
                        m.type === 'add' ? 'border-green-200 bg-green-50 hover:bg-green-100' : 'border-red-200 bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      {m.type === 'add' ? (
                        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                      ) : (
                        <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{m.productName}</p>
                        <p className="text-xs text-gray-500">{m.categoryName} - {monthName}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs sm:text-sm font-bold ${m.type === 'add' ? 'text-green-700' : 'text-red-700'}`}>
                          {m.type === 'add' ? '+' : '-'}{m.quantity}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Listagem - items with descriptions */}
      {view === 'listagem' && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-600" /> Listagem
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {descriptionsWithContent.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDesc(d); setView('listagemDetail'); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left transition-colors active:scale-[0.99]"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{d.productName}</p>
                    <p className="text-xs text-gray-500">{d.categoryName} - {d.year}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Listagem detail */}
      {view === 'listagemDetail' && selectedDesc && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" /> Detalhes do Item
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 max-w-lg">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Produto</p>
                <p className="text-sm sm:text-base font-medium text-gray-800 mt-0.5">{selectedDesc.productName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Categoria</p>
                <p className="text-sm sm:text-base text-gray-700 mt-0.5">{selectedDesc.categoryName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Descricao</p>
                <p className="text-sm sm:text-base text-gray-800 mt-0.5 bg-amber-50 border border-amber-200 rounded-lg p-3">{selectedDesc.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Ano</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedDesc.year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Data e Hora do Registro</p>
                  <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(selectedDesc.timestamp).toLocaleDateString('pt-BR')} {new Date(selectedDesc.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de descricao */}
      {descModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50" onClick={() => setDescModal(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl p-5 sm:p-6 w-full sm:max-w-md" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Adicionar Descricao</h3>
              <button onClick={() => setDescModal(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-800">{descModal.movement.productName}</p>
              <p className="text-xs text-gray-500">{descModal.movement.categoryName}</p>
              <p className="text-xs text-gray-400 mt-1">
                {descModal.movement.type === 'add' ? 'Adicionado' : 'Removido'}: {descModal.movement.quantity} un. - {MONTH_NAMES[new Date(descModal.movement.timestamp).getMonth()]}
              </p>
            </div>
            <label className="block text-sm text-gray-600 mb-1">Descricao (onde foi utilizado, finalidade, etc.):</label>
            <textarea
              value={descText}
              onChange={e => setDescText(e.target.value)}
              autoFocus
              placeholder="Ex: Cruzeta utilizada na rua X para finalidade Y"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setDescModal(null)} className="flex-1 sm:flex-none px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200">
                Cancelar
              </button>
              <button
                onClick={handleSaveDescription}
                disabled={!descText.trim()}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm text-white rounded-lg font-medium bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
