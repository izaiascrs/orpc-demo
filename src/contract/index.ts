import {
  createTutorialContract,
  getTutorialByIdContract,
  listTutorialsContract,
  updateTutorialContract
} from "./tutorial.contract";

export const contract = {
  tutorial: {
    create: createTutorialContract,
    update: updateTutorialContract,
    list: listTutorialsContract,
    getById: getTutorialByIdContract
  }
}