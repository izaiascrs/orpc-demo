import { oc } from "@orpc/contract";
import z from "zod";
import { CreateTutorialInput, TutorialListOutput, TutorialOutput, UpdateTutorialInput } from "../schemas/tutorial.schema";

export const base = oc.errors({
  UNAUTHORIZED: {
    status: 401,
    message: "Authentication required",
  },
  FORBIDDEN: {
    status: 403,
    message: "You do not have permission to perform this action"
  },
  NOT_FOUND: {
    status: 404,
    message: "Resource not found",
    data: z.object({
      resourceType: z.string(),
      resourceId: z.string(),
    })
  },
  CONFLICT: {
    status: 409,
    message: "Resource conflict",
    data: z.object({
      field: z.string(),
      value: z.string(),
    })
  }
})

export const createTutorialContract = base
  .route({
    method: "POST",
    path: "/tutorials",
    successStatus: 201,
    summary: "Create a new tutorial",
    description: "Create a new tutorial, requires authentication",
    tags: ["Tutorials"]
  })
  .input(CreateTutorialInput)
  .output(TutorialOutput);

export const updateTutorialContract = base
  .route({
    method: "PATCH",
    path: "/tutorials/{id}",
    successStatus: 201,
    summary: "Update a tutorial",
    description: "Partially updates a tutorial, requires authentication",
    tags: ["Tutorials"],
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: z.object({
        id: z.string().describe("The id of the tutorial"),
      }),
      body: UpdateTutorialInput.omit({
        id: true,
      }),
    })
  )
  .output(TutorialOutput);

export const listTutorialsContract = base
  .route({
    method: "GET",
    path: "/tutorials",
    successStatus: 200,
    summary: "List tutorials",
    description: "List of tutorials",
    tags: ["Tutorials"]
  })
  .output(TutorialListOutput);
  
export const getTutorialByIdContract = base
  .route({
    method: "GET",
    path: "/tutorials/{id}",
    successStatus: 200,
    summary: "Get tutorial",
    description: "Get a tutorial by id",
    tags: ["Tutorials"],
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  )
  .output(TutorialOutput);


// contract with params, query and body
// const updateTutorialContract = base
//   .route({
//     method: "PATCH",
//     path: "/tutorials/{id}",
//     inputStructure: "detailed",
//     successStatus: 200,
//   })
//   .input(
//     z.object({
//       params: z.object({
//         id: z.string(),
//       }),
//       query: z.object({
//         publish: z.coerce.boolean().optional(),
//       }).optional(),
//       body: z.object({
//         title: z.string().optional(),
//         content: z.string().optional(),
//         status: TutorialStatusEnum.optional(),
//       }),
//     })
//   )
//   .output(TutorialOutput)
