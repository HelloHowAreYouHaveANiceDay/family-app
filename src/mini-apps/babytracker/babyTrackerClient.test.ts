import { beforeAll, describe, expect, test } from "vitest";
import { diaperClient, DiaperRecord } from "./BabyTrackerClient";
import supabase from "../../client";

describe("diaperClient tests", () => {
    const test_diaper: DiaperRecord = {
        person_id: 1,
        has_pee: true,
        has_poo: true,
        pee_color: "Light",
        poo_color: "Brown",
        poo_texture: "Solid"
    };

    let record_id: number | undefined = undefined;

    beforeAll(async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email: "tester@tester.com",
            password: "password"
        });
        expect(error).toBeDefined();

    });

    test("insert should pass", async () => {
        const diaper = await diaperClient.insert(test_diaper);
        expect(diaper).toBeDefined();
        expect(diaper.person_id).toBe(test_diaper.person_id);
        expect(diaper.has_pee).toBe(test_diaper.has_pee);
        expect(diaper.has_poo).toBe(test_diaper.has_poo);
        expect(diaper.pee_color).toBe(test_diaper.pee_color);
        expect(diaper.poo_color).toBe(test_diaper.poo_color);
        expect(diaper.poo_texture).toBe(test_diaper.poo_texture);

        record_id = diaper.id;
    });

    test("update should pass", async () => {
        const updated_diaper = await diaperClient.update({ ...test_diaper, id: record_id, pee_color: "Medium" });
        expect(updated_diaper).toBeDefined();
        expect(updated_diaper.pee_color).toBe("Medium");
    });

    test("delete should pass", async () => {
        await diaperClient.delete({ ...test_diaper, id: record_id });
        if (record_id) {
            const record = await diaperClient.select(record_id);
            expect(record.length).toBe(0);
        }
    });
});