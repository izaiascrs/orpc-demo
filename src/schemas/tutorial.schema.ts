import z from "zod";

export const TutorialStatusEnum = z.enum(["Published", "Draft", "Archived"])

export const TutorialSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  status: TutorialStatusEnum
})

export const CreateTutorialInput = TutorialSchema;
export const UpdateTutorialInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  status: TutorialStatusEnum.optional()
})

export const TutorialOutput = TutorialSchema;
export const TutorialListOutput = z.array(TutorialSchema)

export const GetTutorialByIdInput = z.object({
  id: z.string(),
})

export type Tutorial = z.infer<typeof TutorialSchema>
