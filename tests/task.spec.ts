import { TASK_STATUS_ENUM } from "@/constant/task";
import { useTaskStore } from "@/store/task";

describe("Task Store", () => {
  it("should ensure correct default value", () => {
    expect(useTaskStore.getState().fetchType).toBe(TASK_STATUS_ENUM.Active);
  });
});
