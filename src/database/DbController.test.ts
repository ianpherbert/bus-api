import { waitFor } from "../utils.ts/testUtils"
import { DbController } from "./DBcontroller"

describe("DbController", () => {
    jest.mock("pg", () => ({
        Client: class TestClass {
            constructor(_: {}) {

            }
            query = () => new Promise((res) => res({ rows: [], rowCount: 0 }))

        }

    }))
    test("should return false for nonexistant value", async () => {
        const controller = new DbController("test");
        await waitFor(async () => {
            const check = await controller.checkValue<{ key: string }>("text", [["key", "value", "eq"]]);
            expect(check).toBeFalsy()
        })

    })
    test("should return empty array for query", async () => {
        const controller = new DbController("test");
        await waitFor(async () => {
            const check = await controller.query<{ key: string }>("text", [["key", "value", "eq"]]);
            expect(check).toStrictEqual([])
        })

    })
    test("should return empty array for custom query", async () => {
        const controller = new DbController("test");
        await waitFor(async () => {
            const check = await controller.customQuery<{ key: string }>("SELECT * from test", [["key", "value", "eq"]]);
            expect(check).toStrictEqual([])
        })

    })
    test("should return names", async () => {
        const controller = new DbController("test");
        const [hello, goodbye] = controller.getTableNames(["hello", "goodbye"])
        expect(hello).toEqual("test.hello");
        expect(goodbye).toEqual("test.goodbye");
    })
})