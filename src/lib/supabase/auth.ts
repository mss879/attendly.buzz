import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server";

/**
 * Organizer guard for admin pages — redirects to the login screen when
 * there is no valid session. Any authenticated Supabase user is an
 * organizer (accounts are created manually in the Supabase dashboard).
 */
export async function requireAdmin(): Promise<User> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}

/** Session check for admin API routes — returns null instead of redirecting. */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
