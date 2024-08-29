import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createMaterialFormSchema,
  newQuantityAdjustmentActionSchema,
  updateMaterialFormSchema,
  updateMaterialQuantityFormSchema,
} from "~/types/material";

export const materialRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createMaterialFormSchema)
    .mutation(async ({ ctx, input: { vendor, categories, ...rest } }) => {
      return ctx.db.material.create({
        data: {
          ...rest,
          ...(vendor && {
            vendor: {
              connectOrCreate: {
                where: {
                  id: vendor.label,
                },
                create: {
                  name: vendor.label,
                },
              },
            },
          }),
          ...(categories && {
            categories: {
              connectOrCreate: categories.map((category) => ({
                where: { id: category.value },
                create: { name: category.label },
              })),
            },
          }),
          createdBy: { connect: { id: ctx.session.user.id } },
          updatedBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const materials = await ctx.db.material.findMany({
      orderBy: { name: "asc" },
      include: {
        vendor: true,
        categories: true,
      },
    });

    return materials ?? null;
  }),

  update: protectedProcedure
    .input(updateMaterialFormSchema)
    .mutation(async ({ ctx, input: { id, vendor, categories, ...rest } }) => {
      return ctx.db.material.update({
        where: {
          id,
        },
        data: {
          ...rest,
          ...(vendor && {
            vendor: {
              connectOrCreate: {
                where: {
                  id: vendor.value,
                },
                create: {
                  name: vendor.label,
                },
              },
            },
          }),
          ...(categories && {
            categories: {
              set: [], // Remove all
              connectOrCreate: categories.map((category) => ({
                where: { id: category.value },
                create: { name: category.label },
              })),
            },
          }),
          updatedBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  deleteAll: protectedProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.material.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
    }),

  getVendors: protectedProcedure.query(async ({ ctx }) => {
    const vendors = await ctx.db.vendor.findMany({
      orderBy: { name: "asc" },
    });

    return vendors ?? null;
  }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.materialCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories ?? null;
  }),

  createQuantityAdjustmentType: protectedProcedure
    .input(newQuantityAdjustmentActionSchema)
    .mutation(async ({ ctx, input: { name, color, adjustmentAction } }) => {
      const updateType = await ctx.db.materialQuantityUpdateType.create({
        data: {
          type: name,
          color,
          action: adjustmentAction,
        },
      });

      return updateType ?? null;
    }),

  updateQuantity: protectedProcedure
    .input(updateMaterialQuantityFormSchema)
    .mutation(
      async ({
        ctx,
        input: { materialId, type, originalQuantity, adjustedQuantity, notes },
      }) => {
        const prevQuantity = new Prisma.Decimal(originalQuantity);
        const adjustQuantity = new Prisma.Decimal(adjustedQuantity);

        function getNewQuantity() {
          switch (type.value.action) {
            case "DECREASE":
              return prevQuantity.sub(adjustQuantity);
            case "SET":
              return adjustQuantity;
            case "INCREASE":
              return prevQuantity.add(adjustQuantity);
          }
        }

        const newQuantity = getNewQuantity();

        const updateLog = await ctx.db.$transaction([
          ctx.db.material.update({
            where: {
              id: materialId,
            },
            data: {
              quantity: newQuantity,
              updatedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          }),
          ctx.db.materialQuantityUpdateLog.create({
            data: {
              originalQuantity,
              adjustedQuantity,
              type: {
                connect: {
                  id: type.value.id,
                },
              },
              notes,
              createdBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              material: {
                connect: {
                  id: materialId,
                },
              },
            },
          }),
        ]);

        return updateLog ?? null;
      }
    ),

  getQuantityUpdates: protectedProcedure.query(async ({ ctx }) => {
    const updates = await ctx.db.materialQuantityUpdateLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        material: true,
        type: true,
        createdBy: true,
      },
    });

    return updates ?? null;
  }),

  getQuantityUpdateTypes: protectedProcedure.query(async ({ ctx }) => {
    const updateTypes = await ctx.db.materialQuantityUpdateType.findMany({
      orderBy: {
        type: "asc",
      },
    });

    return updateTypes ?? null;
  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const material = await ctx.db.material.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return material ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
