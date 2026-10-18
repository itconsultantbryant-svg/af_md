import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { contractSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const contracts = await prisma.contract.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });
    return json({
      contracts: contracts.map((c) => ({
        ...c,
        stages: c.stages ? JSON.parse(c.stages) : [],
      })),
    });
  } catch {
    return error("Forbidden", 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = contractSchema.parse(body);

    const contract = await prisma.contract.create({
      data: {
        clientId: data.clientId,
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        value: data.value,
        currency: data.currency,
        paymentTerms: data.paymentTerms,
        stages: data.stages ? JSON.stringify(data.stages) : null,
        status: data.status || "DRAFT",
      },
      include: { client: true },
    });

    return json({
      contract: {
        ...contract,
        stages: contract.stages ? JSON.parse(contract.stages) : [],
      },
    }, 201);
  } catch {
    return error("Failed to create contract", 500);
  }
}
