import { describe, test, expect } from "vitest";
import supabase from "./client";


describe("supabase client tests", () => {
    describe("supabase should be properly initialized", () => {
            test("supabase should be an object", () => {
                expect(supabase).toBeDefined();
            });
        }
    )

    describe("auth tests", () => {
        test("fake signin should faile", async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email: "poopoohead@memail.com",
                password: "password"
            });
            expect(error).toBeDefined();
            expect(error?.status).toBe(400); // invalid_credentials
        });

        test("test account signin should pass", async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email: "tester@tester.com",
                password: "password"
            });
            expect(error).toBeNull();
        });
    });
});
