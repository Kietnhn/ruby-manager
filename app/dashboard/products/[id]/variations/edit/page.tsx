import EditForm from "@/components/forms/edit-form-variations";
import Wrapper from "@/components/wrapper";
import { getVariaionsOfProduct } from "@/lib/actions/product";

export default async function EditVariationsOfProductPage({
    params,
}: {
    params: { id: string };
}) {
    console.log({ params });

    const variationsOfProduct = await getVariaionsOfProduct(params.id);
    return (
        <Wrapper
            breadcrumbs={[
                { label: "Products", href: "/dashboard/products" },
                {
                    label: "Edit product",
                    href: `/dashboard/products/${params.id}/edit`,
                },
                {
                    label: "Edit variants",
                    href: `/dashboard/products/${params.id}/variations/edit`,
                },
            ]}
            navigateButton={null}
        >
            <EditForm initVariations={variationsOfProduct} />
        </Wrapper>
    );
}
