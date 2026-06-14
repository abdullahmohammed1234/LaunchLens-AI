import { auth } from "@/auth";
import { getUnreadNotificationCount } from "@/lib/portfolio/notifications";
import { NavbarClient } from "@/components/layout/navbar-client";

export async function Navbar() {
  const session = await auth();
  const unreadCount = await getUnreadNotificationCount(session!.user.id);

  return (
    <NavbarClient
      user={{
        name: session?.user?.name,
        email: session?.user?.email,
      }}
      unreadCount={unreadCount}
    />
  );
}
