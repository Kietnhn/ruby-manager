import AccessForbidden from "@/components/access-forbidden";
import { getUserRole } from "@/lib/actions/user";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userRole = await getUserRole();
    if (!userRole || userRole === "EMPLOYEE") {
        return <AccessForbidden />;
    }
    return <div className="max-w-[1200px] mx-auto ">{children}</div>;
}
