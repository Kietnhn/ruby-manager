import CreateFormVariation from "@/components/forms/create-form-variation";
import EditForm from "@/components/forms/edit-form-variations";
import Wrapper from "@/components/wrapper";
import { getDiscounts } from "@/lib/actions/discounts";
import { getProductById, getVariaionsOfProduct } from "@/lib/actions/product";
import NotFound from "../../edit/not-found";
export default async function CreateVariationOfProductPage({
    params,
}: {
    params: { id: string };
}) {
    const [product, discounts] = await Promise.all([
        getProductById(params.id),
        getDiscounts(),
    ]);
    if (!product) {
        return NotFound();
    }
    return (
        <Wrapper
            breadcrumbs={[
                { label: "Products", href: "/dashboard/products" },
                {
                    label: "Edit product",
                    href: `/dashboard/products/${params.id}/edit`,
                },

                {
                    label: "Create a variation",
                    href: `/dashboard/products/${params.id}/variations/create`,
                },
            ]}
            navigateButton={null}
        >
            <CreateFormVariation product={product} discounts={discounts} />
        </Wrapper>
    );
}
