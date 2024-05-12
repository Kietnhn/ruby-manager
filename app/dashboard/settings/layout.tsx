import MenuSettings from "@/components/navigator/menu-settings";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full ">
            <div className="flex-1 flex gap-6 flex-nowrap">
                <div className="w-2/3 h-full overflow-y-auto flex flex-col gap-4">
                    <div className="">
                        <h2 className="text-3xl font-semibold">Settings</h2>
                    </div>
                    <div className="flex-1 p-6">{children}</div>
                </div>
                <div className="w-1/3 ">
                    <MenuSettings />
                </div>
            </div>
        </div>
    );
}
