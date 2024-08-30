import { Prisma } from "@prisma/client";

export function toNumber(decimalValue?: Prisma.Decimal | null | undefined) {
  return decimalValue ? new Prisma.Decimal(decimalValue).toNumber() : undefined;
}
