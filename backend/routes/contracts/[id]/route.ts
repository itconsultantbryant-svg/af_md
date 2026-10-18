import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { contractSchema } from "@/lib/validations";
import { json, error } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = contractSchema.partial().parse(body);

    const contract = await prisma.contract.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.currency && { currency: data.currency }),
        ...(data.paymentTerms !== undefined && { paymentTerms: data.paymentTerms }),
        ...(data.stages && { stages: JSON.stringify(data.stages) }),
        ...(data.status && { status: data.status }),
        ...(data.clientId && { clientId: data.clientId }),
      },
      include: { client: true },
    });

    return json({
      contract: {
        ...contract,
        stages: contract.stages ? JSON.parse(contract.stages) : [],
      },
    });
  } catch {
    return error("Failed to update contract", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await prisma.contract.delete({ where: { id: params.id } });
    return json({ success: true });
  } catch {
    return error("Failed to delete contract", 500);
  }
}
