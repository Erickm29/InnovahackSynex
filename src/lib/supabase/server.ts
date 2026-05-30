import type { SupabaseClient } from "@supabase/supabase-js";

import { supabaseClient } from "./supabaseClient.js";
import type { TrayectoriaResiduo } from "./types";

export type FundaresSupabase = SupabaseClient;

export function createServerClient(): FundaresSupabase | null {
  return supabaseClient;
}

export type { TrayectoriaResiduo };
