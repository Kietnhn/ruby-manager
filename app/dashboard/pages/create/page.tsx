import Breadcrumbs from "@/components/breadcrumbs";
import CreatePageForm from "@/components/forms/create-form-page";
import { getPages } from "@/lib/actions/page";
import React from "react";
export default async function CreateNewPage() {
    const pages = await getPages();

    if (!pages) return <p>No pages</p>;

    return (
        <main className="flex flex-col ">
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Pages", href: "/dashboard/pages" },
                    {
                        label: "Create new page",
                        href: "/dashboard/pages/create",
                        active: true,
                    },
                ]}
                wrapper="mb-4"
            />
            <div className="flex-grow">
                <CreatePageForm pages={pages} />
            </div>
        </main>
    );
}
