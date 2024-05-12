import Breadcrumbs from "@/components/breadcrumbs";
import CreateFormDiscount from "@/components/forms/create-from-discount";

export default function CreateDiscountPage() {
    return (
        <main>
            <Breadcrumbs
                // wrapper="mb-0"
                breadcrumbs={[
                    { label: "Discounts", href: "/dashboard/discounts" },
                    {
                        label: "Create new discount",
                        href: "/dashboard/discounts/create",
                        active: true,
                    },
                ]}
            />
            <CreateFormDiscount />
        </main>
    );
}
