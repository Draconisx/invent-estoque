import { useState } from 'react';
import type { Category, Product } from '../types';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, FolderPlus, PackagePlus } from 'lucide-react';

interface Props {
  stock: {
    categories: Category[];
    products: Product[];
    addCategory: (name: string) => void;
    removeCategory: (id: string) => void;
    addProduct: (categoryId: string, name: string, quantity: number) => void;
    removeProduct: (id: string) => void;
    adjustQuantity: (productId: string, delta: number, type: 'add' | 'remove', finalidade: string) => void;
  };
}

export default function StockTab({ stock }: Props) {
  const [newCat, setNewCat] = useState('');
  const [newProd, setNewProd] = useState('');
  const [newProdQty, setNewProdQty] = useState(1);
  const [selectedCat, setSelectedCat] = useState('');
  const [adjustModal, setAdjustModal] = useState<{ productId: string; type: 'add' | 'remove' } | null>(null);
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustFinalidade, setAdjustFinalidade] = useState('');

  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    stock.addCategory(newCat.trim());
    setNewCat('');
  };

  const handleAddProduct = () => {
    if (!newProd.trim() || !selectedCat || newProdQty < 1) return;
    stock.addProduct(selectedCat, newProd.trim(), newProdQty);
    setNewProd('');
    setNewProdQty(1);
  };

  const handleAdjust = () => {
    if (!adjustModal || adjustQty < 1) return;
    stock.adjustQuantity(adjustModal.productId, adjustQty, adjustModal.type, adjustFinalidade.trim());
    setAdjustModal(null);
    setAdjustQty(1);
    setAdjustFinalidade('');
  };

  const getCategoryName = (id: string) => stock.categories.find(c => c.id === id)?.name || '';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Adicionar Categoria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-blue-600" /> Categorias
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            placeholder="Nome da categoria"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleAddCategory} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {stock.categories.map(cat => (
            <span key={cat.id} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
              {cat.name}
              <button onClick={() => stock.removeCategory(cat.id)} className="text-blue-400 hover:text-red-500 ml-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {stock.categories.length === 0 && <p className="text-gray-400 text-sm">Nenhuma categoria cadastrada.</p>}
        </div>
      </div>

      {/* Adicionar Produto */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <PackagePlus className="w-5 h-5 text-green-600" /> Adicionar Produto
        </h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione a categoria</option>
            {stock.categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            value={newProd}
            onChange={e => setNewProd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddProduct()}
            placeholder="Nome do produto"
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={newProdQty}
              onChange={e => setNewProdQty(Math.max(1, Number(e.target.value)))}
              className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Qtd"
            />
            <button onClick={handleAddProduct} className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Produtos - Cards no mobile, tabela no desktop */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Produtos em Estoque</h2>
        {stock.products.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum produto cadastrado.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 font-medium">Produto</th>
                    <th className="pb-2 font-medium">Categoria</th>
                    <th className="pb-2 font-medium text-center">Quantidade</th>
                    <th className="pb-2 font-medium text-center">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.products.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="py-3 text-gray-600">{getCategoryName(p.categoryId)}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block min-w-[40px] px-2 py-0.5 rounded-full text-xs font-bold ${
                          p.quantity === 0 ? 'bg-red-100 text-red-700' : p.quantity <= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => { setAdjustModal({ productId: p.id, type: 'add' }); setAdjustQty(1); setAdjustFinalidade(''); }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Adicionar itens"
                          >
                            <ArrowUpCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { setAdjustModal({ productId: p.id, type: 'remove' }); setAdjustQty(1); setAdjustFinalidade(''); }}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg" title="Remover itens"
                          >
                            <ArrowDownCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => stock.removeProduct(p.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {stock.products.map(p => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{getCategoryName(p.categoryId)}</p>
                    </div>
                    <span className={`ml-2 shrink-0 inline-block min-w-[40px] px-2 py-0.5 rounded-full text-xs font-bold text-center ${
                      p.quantity === 0 ? 'bg-red-100 text-red-700' : p.quantity <= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {p.quantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                    <button
                      onClick={() => { setAdjustModal({ productId: p.id, type: 'add' }); setAdjustQty(1); setAdjustFinalidade(''); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-green-600 bg-green-50 rounded-lg text-xs font-medium"
                    >
                      <ArrowUpCircle className="w-4 h-4" /> Adicionar
                    </button>
                    <button
                      onClick={() => { setAdjustModal({ productId: p.id, type: 'remove' }); setAdjustQty(1); setAdjustFinalidade(''); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-orange-600 bg-orange-50 rounded-lg text-xs font-medium"
                    >
                      <ArrowDownCircle className="w-4 h-4" /> Remover
                    </button>
                    <button
                      onClick={() => stock.removeProduct(p.id)}
                      className="p-1.5 text-red-500 bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de ajuste de quantidade */}
      {adjustModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50" onClick={() => setAdjustModal(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl p-5 sm:p-6 w-full sm:max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {adjustModal.type === 'add' ? 'Adicionar itens' : 'Remover itens'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Produto: <strong>{stock.products.find(p => p.id === adjustModal.productId)?.name}</strong>
            </p>
            <label className="block text-sm text-gray-600 mb-1">Quantidade:</label>
            <input
              type="number"
              min={1}
              value={adjustQty}
              onChange={e => setAdjustQty(Math.max(1, Number(e.target.value)))}
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm text-gray-600 mb-1">Finalidade (onde/para que foi utilizado):</label>
            <textarea
              value={adjustFinalidade}
              onChange={e => setAdjustFinalidade(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdjust(); } }}
              placeholder="Ex: Utilizado na rua X para finalidade Y"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setAdjustModal(null)} className="flex-1 sm:flex-none px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200">
                Cancelar
              </button>
              <button
                onClick={handleAdjust}
                className={`flex-1 sm:flex-none px-4 py-2.5 text-sm text-white rounded-lg font-medium ${
                  adjustModal.type === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
                }`}
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
