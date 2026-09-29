export interface RegraTributaria {
  ncm: string;
  cest: string;
  descricao: string;
  mvaOriginal: number;
}

// Base de dados estática extraída da planilha
export const ncmRegras: Record<string, RegraTributaria> = {
  "1704.90.10": { ncm: "1704.90.10", cest: "17.001.00", descricao: "Chocolate branco / Doces", mvaOriginal: 0.389 },
  "1806.31.10": { ncm: "1806.31.10", cest: "17.003.00", descricao: "Chocolates em barra", mvaOriginal: 0.389 },
  "1806.32.10": { ncm: "1806.32.10", cest: "17.003.00", descricao: "Chocolates (recheados)", mvaOriginal: 0.389 },
  "1806.90.00": { ncm: "1806.90.00", cest: "17.009.00", descricao: "Creme de cacau", mvaOriginal: 0.389 },
  "1905.90.20": { ncm: "1905.90.20", cest: "17.062.02", descricao: "Alfajor / Biscoitos", mvaOriginal: 0.40 },
  "2106.90.90": { ncm: "2106.90.90", cest: "28.062.00", descricao: "Marshmallow", mvaOriginal: 0.45 },
  "2005.20.00": { ncm: "2005.20.00", cest: "17.032.00", descricao: "Batata Frita", mvaOriginal: 0.5312 },
  "1904.20.00": { ncm: "1904.20.00", cest: "17.042.00", descricao: "Banana / Cereais", mvaOriginal: 0.4613 },
  "2008.11.00": { ncm: "2008.11.00", cest: "17.094.00", descricao: "Pasta de amendoim", mvaOriginal: 0.40 },
  "2007.99.90": { ncm: "2007.99.90", cest: "17.009.00", descricao: "Creme de pistache", mvaOriginal: 0.389 },
  "2106.10.00": { ncm: "2106.10.00", cest: "S/ CEST", descricao: "Barra Proteica", mvaOriginal: 0.0 },
  "2106.90.30": { ncm: "2106.90.30", cest: "S/ CEST", descricao: "Whey Protein", mvaOriginal: 0.0 },
  "1904.10.00": { ncm: "1904.10.00", cest: "17.030.00", descricao: "Provolone (Cereal)", mvaOriginal: 0.4613 },
  "0406.10.90": { ncm: "0406.10.90", cest: "17.024.00", descricao: "Provolone (Queijo)", mvaOriginal: 0.28 },
};

/**
 * Calcula a MVA Ajustada para operações interestaduais.
 * @param mvaOriginal Margem de Valor Agregado original (decimal)
 * @param alqInter Alíquota interestadual (decimal, ex: 0.12 ou 0.07)
 * @param alqIntra Alíquota interna do estado de destino (decimal, ex: 0.18, 0.22)
 * @returns MVA Ajustada em formato percentual ou null se não houver ST
 */
export function calcularMvaAjustada(mvaOriginal: number, alqInter: number, alqIntra: number): number | null {
  if (mvaOriginal === 0) return null; 
  const mvaAjustada = (((1 + mvaOriginal) * (1 - alqInter)) / (1 - alqIntra)) - 1;
  return Number((mvaAjustada * 100).toFixed(2));
}

/**
 * Calcula o Diferencial de Alíquota (DIFAL).
 * @param alqIntra Alíquota interna do estado de destino (decimal)
 * @param alqInter Alíquota interestadual (decimal)
 * @returns DIFAL em formato percentual
 */
export function calcularDifal(alqIntra: number, alqInter: number): number {
  return Number(((alqIntra - alqInter) * 100).toFixed(2));
}

/**
 * Retorna CST e CFOP baseados na existência de Substituição Tributária.
 */
export function obterCstCfop(mvaOriginal: number, interestadual: boolean) {
  const temSt = mvaOriginal > 0;
  return {
    cst: temSt ? "010" : "000",
    cfop: temSt ? (interestadual ? "6401" : "5401") : (interestadual ? "6101" : "5101"),
  };
}