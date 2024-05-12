import Breadcrumbs from "@/components/breadcrumbs";
import EditFormDiscount from "@/components/forms/edit-from-discount";
import NotFound from "@/components/not-found";
import { getDiscountsById } from "@/lib/actions/discounts";

export default async function EditDiscountPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const discount = await getDiscountsById(params.id);
    if (!discount) {
        return <NotFound href="/dashboard/discounts" title="Discount" />;
    }
    return (
        <main>
            <Breadcrumbs
                // wrapper="mb-0"
                breadcrumbs={[
                    { label: "Discounts", href: "/dashboard/discounts" },
                    {
                        label: "Edit a discount",
                        href: `/dashboard/discounts/${discount.id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditFormDiscount discount={discount} />
        </main>
    );
}
