import CreateFormReview from "@/components/forms/create-form-review";
import Wrapper from "@/components/wrapper";

export default async function CreateReview({
    params,
}: {
    params: { id: string };
}) {
    return (
        // <Wrapper
        // breadcrumbs={[{ href: "/dashboard/products", label: "Products" },
        //     { href: "/dashboard/products", label: "Products" },
        //     { href: "/dashboard/products", label: "Products" }
        //     ,{ href: "/dashboard/products", label: "Products" }
        // ]}

        // >
        //     {/* <CreateFormReview/> */}
        // </Wrapper>
        <div className="">CreateReview {params.id}</div>
    );
}
