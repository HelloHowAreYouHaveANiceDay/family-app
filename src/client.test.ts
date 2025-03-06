// @vitest-environment jsdom

import { describe, test, expect, beforeAll } from "vitest";
import supabase from "./client";
import { Database } from "../database.types";


describe("supabase client tests", () => {
    // INITIALIZATION
    describe("supabase should be properly initialized", () => {
            test("supabase should be an object", () => {
                expect(supabase).toBeDefined();
            });
        }
    )

    // AUTH
    describe("auth tests", () => {
        let auth_event: string | null = null;
        supabase.auth.onAuthStateChange((event) => {
            auth_event = event;
            // debug
            // console.log("auth event", event);
        });

        test("fake signin should faile", async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email: "poopoohead@memail.com",
                password: "password"
            });
            expect(error).toBeDefined();
            expect(error?.status).toBe(400); // invalid_credentials
            expect(auth_event).toBe("INITIAL_SESSION");
        });

        test("test account signin should pass", async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email: "tester@tester.com",
                password: "password"
            });
            expect(error).toBeNull();
            expect(auth_event).toBe("SIGNED_IN");
        });

        test("signout should pass", async () => {
            const { error } = await supabase.auth.signOut();
            expect(error).toBeNull();
            expect(auth_event).toBe("SIGNED_OUT");
        });
    });

    // DATABASE
    // Diaper
    describe("babytracker_diapers tests", () => {
        let auth_event: string | null = null;
        supabase.auth.onAuthStateChange((event) => {
            auth_event = event;
            // debug
            // console.log("auth event", event);
        });
        beforeAll(async () => {
            await supabase.auth.signInWithPassword({
                email: "tester@tester.com",
                password: "password"
            });
            expect(auth_event).toBe("SIGNED_IN");
        });

        const test_diaper: Database["public"]["Tables"]["babytracker_diapers"]["Insert"] = {
            person_id: 1,
            has_pee: true,
            has_poo: true,
            pee_color: "yellow",
            poo_color: "brown",
            poo_texture: "solid"
        };

        test("insert diaper should pass", async () => {
            const { data, error } = await supabase.from("babytracker_diapers").insert(test_diaper).select();
            expect(error).toBeNull();
            expect(data).toBeDefined();
            expect(data?.length).toBe(1);
            expect(data?.[0].person_id).toBe(test_diaper.person_id);
            expect(data?.[0].has_pee).toBe(test_diaper.has_pee);
            expect(data?.[0].has_poo).toBe(test_diaper.has_poo);
            expect(data?.[0].pee_color).toBe(test_diaper.pee_color);
            expect(data?.[0].poo_color).toBe(test_diaper.poo_color);
            expect(data?.[0].poo_texture).toBe(test_diaper.poo_texture);
        });
    });
});
