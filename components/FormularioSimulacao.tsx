"use client";

import { useState } from "react";
import { ncmRegras, calcularMvaAjustada, calcularDifal, obterCstCfop } from "../utils/tributacao";

export default function FormularioSimulacao() {
  const [ncm, setNcm] = useState("");
  const [destino, setDestino] = useState("");
  const [resultado, setResultado] = useState<any>(null);

  const estadosDestino = [
    { sigla: "PR", interna: 0.195, interestadual: 0 },
    { sigla: "SP", interna: 0.18, interestadual: 0.12 },
    { sigla: "RJ", interna: 0.22, interestadual: 0.12 },
    { sigla: "MG", interna: 0.18, interestadual: 0.12 },
    { sigla: "ES", interna: 0.17, interestadual: 0.07 },
  ];

  const simular = async () => {
    if (!ncm || !destino) return;

    const regra = ncmRegras[ncm];
    const estado = estadosDestino.find((e) => e.sigla === destino);
    if (!regra || !estado) return;

    const interestadual = destino !== "PR";
    const { cst, cfop } = obterCstCfop(regra.mvaOriginal, interestadual);
    
    let mvaAjustada = null;
    let difal = null;

    if (interestadual) {
      mvaAjustada = calcularMvaAjustada(regra.mvaOriginal, estado.interestadual, estado.interna);
      difal = calcularDifal(estado.interna, estado.interestadual);
    } else {
      mvaAjustada = regra.mvaOriginal > 0 ? (regra.mvaOriginal * 100).toFixed(2) : null;
    }

    setResultado({ regra, estado, cst, cfop, mvaAjustada, difal, interestadual });

    // Envia os dados para a nossa rota de API para salvar no banco Neon
    try {
      await fetch("/api/simulacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ncm,
          destino,
          mvaAjustada,
          difal,
          cst,
          cfop,
        }),
      });
    } catch (error) {
      console.error("Erro ao salvar simulação no banco:", error);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg max-w-2xl w-full border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-neon">Simulador Tributário</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Produto (NCM)</label>
          <select 
            className="w-full bg-background border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-neon"
            value={ncm}
            onChange={(e) => setNcm(e.target.value)}
          >
            <option value="">Selecione um produto...</option>
            {Object.values(ncmRegras).map((item) => (
              <option key={item.ncm} value={item.ncm}>
                {item.ncm} - {item.descricao}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Destino (Origem: PR)</label>
          <select 
            className="w-full bg-background border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-neon"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          >
            <option value="">Selecione o estado...</option>
            {estadosDestino.map((est) => (
              <option key={est.sigla} value={est.sigla}>{est.sigla}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={simular}
        className="w-full bg-neon text-background font-bold py-3 rounded hover:bg-[#3cd07d] transition-colors"
      >
        Calcular Impostos
      </button>

      {resultado && (
        <div className="mt-8 p-5 bg-background rounded border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-2">Resultado da Conferência</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-gray-400">CEST: <span className="text-white font-mono">{resultado.regra.cest}</span></div>
            <div className="text-gray-400">CST: <span className="text-neon font-mono font-bold">{resultado.cst}</span></div>
            <div className="text-gray-400">CFOP: <span className="text-neon font-mono font-bold">{resultado.cfop}</span></div>
            <div className="text-gray-400">Alíq. Interna ({resultado.estado.sigla}): <span className="text-white">{resultado.estado.interna * 100}%</span></div>
            
            {resultado.interestadual && (
              <>
                <div className="text-gray-400">Alíq. Interestadual: <span className="text-white">{resultado.estado.interestadual * 100}%</span></div>
                <div className="text-gray-400">DIFAL: <span className="text-white">{resultado.difal}%</span></div>
              </>
            )}
            
            <div className="col-span-2 mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-gray-400">MVA Aplicável: </span>
              <span className="text-neon text-2xl font-bold">
                {resultado.mvaAjustada ? `${resultado.mvaAjustada}%` : "N/A (Sem ST)"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}