import DueDate from "../src/types/DueDate";
import { Group } from "../src/types/types";
import * as should from "should";
import * as sinon from "sinon";
import * as admin from "firebase-admin/app";
import { rotateGroupTasks } from "../src/utilities/groupUtilities";

sinon.stub(admin, "initializeApp");

should(0);

const matchingNumberGroup: Group = {
  name: "matchingGroup",
  resetDay: DueDate.Monday,
  memberEmails: ["a", "b", "c"],
  members: [
    { name: "a", id: "a" },
    { name: "b", id: "b" },
    { name: "c", id: "c" },
  ],
  tasks: [
    {
      name: "1",
      dueDate: DueDate.Tuesday,
      completed: false,
    },
    {
      name: "2",
      dueDate: DueDate.Wednesday,
      completed: false,
    },
    {
      name: "3",
      dueDate: DueDate.Thursday,
      completed: false,
    },
  ],
  admin: "a",
  currentStartDate: "2021-27-01",
};

const moreMembers: Group = {
  name: "matchingGroup",
  resetDay: DueDate.Monday,
  memberEmails: ["a", "b", "c", "d", "e"],
  members: [
    { name: "a", id: "a" },
    { name: "b", id: "b" },
    { name: "c", id: "c" },
    { name: "d", id: "d" },
    { name: "e", id: "e" },
  ],
  tasks: [
    {
      name: "1",
      dueDate: DueDate.Tuesday,
      completed: false,
    },
    {
      name: "2",
      dueDate: DueDate.Wednesday,
      completed: false,
    },
    {
      name: "3",
      dueDate: DueDate.Thursday,
      completed: false,
    },
  ],
  admin: "a",
  currentStartDate: "2021-27-01",
};

const moreTasks: Group = {
  name: "matchingGroup",
  resetDay: DueDate.Monday,
  memberEmails: ["a", "b", "c"],
  members: [
    { name: "a", id: "a" },
    { name: "b", id: "b" },
    { name: "c", id: "c" },
  ],
  tasks: [
    {
      name: "1",
      dueDate: DueDate.Tuesday,
      completed: false,
    },
    {
      name: "2",
      dueDate: DueDate.Wednesday,
      completed: false,
    },
    {
      name: "3",
      dueDate: DueDate.Thursday,
      completed: false,
    },
    {
      name: "4",
      dueDate: DueDate.Friday,
      completed: false,
    },
    {
      name: "5",
      dueDate: DueDate.Saturday,
      completed: false,
    },
  ],
  admin: "a",
  currentStartDate: "2021-27-01",
};

describe("rotateGroupTasks", () => {
  describe("with matching member and task numbers", () => {
    it("rotates through the tasks", async () => {
      const group = { ...matchingNumberGroup };
      const newGroup = rotateGroupTasks(group);
      newGroup.tasks.should.be.instanceOf(Array).and.have.lengthOf(3);
      newGroup.tasks[0].should.have.a.property("assignedId", "a");
      newGroup.tasks[1].should.have.a.property("assignedId", "b");
      newGroup.tasks[2].should.have.a.property("assignedId", "c");
    });

    it("takes into account offsets", async () => {
      const group = { ...matchingNumberGroup };
      group.currentOffset = 1;
      const newGroup = rotateGroupTasks(group);
      newGroup.tasks.should.be.instanceOf(Array).and.have.lengthOf(3);
      newGroup.tasks[0].should.have.a.property("assignedId", "b");
      newGroup.tasks[1].should.have.a.property("assignedId", "c");
      newGroup.tasks[2].should.have.a.property("assignedId", "a");
    });

    it("adjusts currentOffset", async () => {
      const group = { ...matchingNumberGroup };
      group.currentOffset = 1;
      const newGroup = rotateGroupTasks(group);
      newGroup.should.have.property("currentOffset", 2);
    });

    it("adjusts currentOffset when at max", async () => {
      const group = { ...matchingNumberGroup };
      group.currentOffset = 2;
      const newGroup = rotateGroupTasks(group);
      newGroup.should.have.property("currentOffset", 0);
    });
  });
  describe("with more members than tasks", () => {
    it("skips users in an even manner", async () => {
      const group = { ...moreMembers };
      const newGroup = rotateGroupTasks(group);
      newGroup.tasks[0].should.have.a.property("assignedId", "b");
      newGroup.tasks[1].should.have.a.property("assignedId", "c");
      newGroup.tasks[2].should.have.a.property("assignedId", "e");
    });
    it("skips users even with an offset", async () => {
      const group = { ...moreMembers };
      group.currentOffset = 1;
      const newGroup = rotateGroupTasks(group);
      newGroup.tasks[0].should.have.a.property("assignedId", "c");
      newGroup.tasks[1].should.have.a.property("assignedId", "d");
      newGroup.tasks[2].should.have.a.property("assignedId", "a");
    });
  });
  describe("with more tasks than members", () => {
    it("makes certain members do two tasks", async () => {
      const group = { ...moreTasks };
      const newGroup = rotateGroupTasks(group);
      newGroup.tasks[0].should.have.a.property("assignedId", "a");
      newGroup.tasks[1].should.have.a.property("assignedId", "a");
      newGroup.tasks[2].should.have.a.property("assignedId", "b");
      newGroup.tasks[3].should.have.a.property("assignedId", "b");
      newGroup.tasks[4].should.have.a.property("assignedId", "c");
    });

    it("rotates who gets extra tasks with offset", async () => {
      const group = { ...moreTasks };
      group.currentOffset = 1;
      const newGroup = rotateGroupTasks(group);
      newGroup.tasks[0].should.have.a.property("assignedId", "b");
      newGroup.tasks[1].should.have.a.property("assignedId", "b");
      newGroup.tasks[2].should.have.a.property("assignedId", "c");
      newGroup.tasks[3].should.have.a.property("assignedId", "c");
      newGroup.tasks[4].should.have.a.property("assignedId", "a");
    });
  });
});

export default "";
