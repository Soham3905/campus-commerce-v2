import { redirect } from "next/navigation";

/**
 * Root Route (/)
 * Automatically redirects users to the /login page so it acts as the starting window.
 */
export default function HomePage() {
  redirect("/login");
}
