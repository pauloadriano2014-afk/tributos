import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const novaSimulacao = await prisma.simulacaoHistorico.create({
      data: {
        ncmPesquisado: body.ncm,
        estadoDestino: body.destino,
        mvaAjustada: body.mvaAjustada ? parseFloat(body.mvaAjustada) : null,
        difal: body.difal ? parseFloat(body.difal) : null,
        cst: body.cst,
        cfop: body.cfop,
      },
    });

    return NextResponse.json(novaSimulacao, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return NextResponse.json({ error: "Erro ao salvar simulação no banco de dados" }, { status: 500 });
  }
}