import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decodeJWT } from "@/lib/utils";
import { JWTUserType } from "@/types/user";
import { getRedirectPathForRole } from "@/utils/enum";

export default async function RootPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (accessToken) {
    try {
      const decoded = decodeJWT<JWTUserType>(accessToken);
      redirect(getRedirectPathForRole(decoded?.RoleId));
    } catch {
      // Token invalid, fall through to default
    }
  }
  redirect("/home");
}
