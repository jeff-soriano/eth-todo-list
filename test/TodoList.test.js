const { assert } = require("chai");
const _deploy_contracts = require("../migrations/2_deploy_contracts");

const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed();
    });

    it("deploys successfully", async () => {
        const address = await this.todoList.address;

        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it("lists tasks", async () => {
        const taskCount = await this.todoList.taskCount();
        const task = await this.todoList.tasks(0);
        assert.isBelow(task.id.toNumber(), taskCount.toNumber());
        assert.equal(task.content, "Yoyo this is the first task ya hear");
        assert.equal(task.completed, false);
        assert.equal(taskCount.toNumber(), 1);
    });

    it("creates tasks", async () => {
        const result = await this.todoList.createTask("A new task");
        const taskCount = await this.todoList.taskCount();
        const event = result.logs[0].args;

        assert.equal(taskCount, 2);
        assert.equal(event.id.toNumber(), 1);
        assert.equal(event.content, "A new task");
        assert.equal(event.completed, false);
    });

    it("toggles tasks completion", async () => {
        const result = await this.todoList.toggleCompleted(0);
        const task = await this.todoList.tasks(0);
        const event = result.logs[0].args;

        assert.equal(task.completed, true);
        assert.equal(event.id.toNumber(), 0);
        assert.equal(event.completed, true);
    });
});