"use client";

import { useState } from "react";
import { ncmRegras } from "../utils/tributacao";

export default function TabelaProdutos() {
  const [busca, setBusca] = useState("");
  const produtos = Object.values(ncmRegras);

  const produtosFiltrados = produtos.filter((item) =>
    item.ncm.includes(busca) ||
    item.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg w-full max-w-4xl mt-8 border border-gray-800 overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-neon">Tabela Geral de Produtos (NCM)</h2>
        
        <input
          type="text"
          placeholder="Pesquisar por NCM ou Descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full sm:w-72 bg-background border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-neon transition-colors"
        />
      </div>
      
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
            <th className="p-4">NCM</th>
            <th className="p-4">CEST</th>
            <th className="p-4">Descrição</th>
            <th className="p-4 text-right">MVA Original</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((item, index) => (
              <tr 
                key={item.ncm} 
                className={`border-b border-gray-800 hover:bg-[#252525] transition-colors ${
                  index % 2 === 0 ? 'bg-background/30' : ''
                }`}
              >
                <td className="p-4 font-mono text-neon font-medium">{item.ncm}</td>
                <td className="p-4 font-mono text-gray-300">{item.cest}</td>
                <td className="p-4 text-white">{item.descricao}</td>
                <td className="p-4 text-gray-300 text-right font-medium">
                  {item.mvaOriginal > 0 ? `${(item.mvaOriginal * 100).toFixed(2).replace('.', ',')}%` : "N/A (Sem ST)"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                Nenhum produto encontrado para "{busca}"
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}