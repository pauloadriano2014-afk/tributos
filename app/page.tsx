import FormularioSimulacao from "../components/FormularioSimulacao";
import TabelaProdutos from "../components/TabelaProdutos";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Painel de Conferência Fiscal</h1>
        <p className="text-gray-400 text-lg">Validação automatizada de ST, DIFAL e MVA</p>
      </div>
      
      <FormularioSimulacao />
      <TabelaProdutos />
      
    </main>
  );
}