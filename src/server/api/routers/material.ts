import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createMaterialFormSchema } from "~/types/material";

export const materialRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createMaterialFormSchema)
    .mutation(async ({ ctx, input: { name, categories } }) => {
      return ctx.db.material.create({
        data: {
          name,
          categories: {
            create: categories.map((category) => ({
              category: {
                create: {
                  name: category.label,
                },
              },
            })),
          },
          createdBy: { connect: { id: ctx.session.user.id } },
          updatedBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const materials = await ctx.db.material.findMany({
      orderBy: { name: "asc" },
      include: {
        categories: {
          include: { category: { select: { name: true } } },
        },
      },
    });

    return materials ?? null;
  }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.materialCategory.findMany({
      orderBy: { category: { name: "asc" } },
      include: { category: { select: { name: true } } },
    });

    return categories ?? null;
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
