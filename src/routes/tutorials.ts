import { implement } from "@orpc/server";
import { contract } from "../contract";
import { authMiddleware, BaseContext } from "./middleware";

const os = implement(contract).$context<BaseContext>();

export const createTutorial = os.tutorial.create
  .use(authMiddleware)
  .handler(
    async ({ errors }) => {
      const exits = Math.random() > 0.5;

      if(exits) {
        throw errors.CONFLICT({
          data: {
            field: "Tutorial",
            value: "Tutorial"
          }
        })
      }

      return { 
        id: "oaisngoasg",
        content: "tutorial",
        slug: "tutorial",
        status: "Archived",
        title: "tutorial"
      }
    }
  )

export const updateTutorial = os.tutorial.update
  .use(authMiddleware)
  .handler(
    async ({ errors }) => {
      const exits = Math.random() > 0.5;

      if(exits) {
        throw errors.NOT_FOUND({
          data: {
            resourceId: "Tutorial",
            resourceType: "Tutorial"
          }
        })
      }

      return { 
        id: "oaisngoasg",
        content: "tutorial",
        slug: "tutorial",
        status: "Archived",
        title: "tutorial",
      }
    }
  )

export const listTutorials = os.tutorial.list
  .handler(
    async () => {
      return [{ 
        id: "oaisngoasg",
        content: "tutorial",
        slug: "tutorial",
        status: "Archived",
        title: "tutorial",
      }]
    }
  )

export const getTutorialById = os.tutorial.getById
  .use(authMiddleware)
  .handler(
    async ({ input }) => {
      return { 
        id: input.params.id,
        content: "tutorial",
        slug: "tutorial",
        status: "Archived",
        title: "tutorial",
      }
    }
  )
