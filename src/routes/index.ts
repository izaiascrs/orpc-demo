import { implement } from "@orpc/server"
import { contract } from "../contract"
import { BaseContext } from "./middleware"
import { createTutorial, getTutorialById, listTutorials, updateTutorial } from "./tutorials"

const os = implement(contract).$context<BaseContext>()

export const router = os.router({
  tutorial: {
    list: listTutorials,
    create: createTutorial,
    update: updateTutorial,
    getById: getTutorialById
  }
})