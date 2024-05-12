import TabsBar from "../tabs-bar";

export default function ProductTabsBar() {
    return (
        <TabsBar
            tabs={[
                {
                    href: "/dashboard/products",
                    title: "Active",
                },
                {
                    href: "/dashboard/products/unavailable",
                    title: "UnAvailable",
                },
                {
                    href: "/dashboard/products/deleted",
                    title: "Deleted",
                },
            ]}
        />
    );
}
