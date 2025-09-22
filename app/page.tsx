import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to books page since we want books to be the main content
  redirect("/books")
}
