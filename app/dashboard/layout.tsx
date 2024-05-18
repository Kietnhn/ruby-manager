import MainNav from "@/components/dashboard/main-nav";
import SideNav from "@/components/dashboard/sidenav";
import { protectedAction } from "@/lib/actions/user";
import ClientLayout from "./client-layout";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await protectedAction();
    return (
        <div className="flex min-h-screen flex-col md:flex-row ">
            <SideNav user={user} />
            <ClientLayout>
                <MainNav user={user} />
                <div className="flex-grow p-6  md:p-12 md:pt-0 relative">
                    {children}
                </div>
            </ClientLayout>
        </div>
    );
}
