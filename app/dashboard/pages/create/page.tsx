import Breadcrumbs from "@/components/breadcrumbs";
import CreatePageForm from "@/components/forms/create-form-page";
import Wrapper from "@/components/wrapper";
import { getPages } from "@/lib/actions/page";
import React from "react";
export default async function CreateNewPage() {
    const pages = await getPages();

    if (!pages) return <p>No pages</p>;

    return (
        <Wrapper
            breadcrumbs={[
                { label: "Pages", href: "/dashboard/pages" },
                {
                    label: "Create new page",
                    href: "/dashboard/pages/create",
                },
            ]}
            navigateButton={null}
        >
            <CreatePageForm pages={pages} />
        </Wrapper>
    );
}
