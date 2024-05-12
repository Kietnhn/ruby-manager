import { getPageById, getPages } from "@/lib/actions/page";
import React from "react";
import NotFound from "@/components/not-found";
import Breadcrumbs from "@/components/breadcrumbs";
import EditPageForm from "@/components/forms/edit-form-page";

export default async function EditPage({ params }: { params: { id: string } }) {
    const [page, pages] = await Promise.all([
        getPageById(params.id),
        getPages(),
    ]);
    if (!page) {
        return <NotFound href="/dashboard/pages" title="page" />;
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Pages", href: "/dashboard/pages" },
                    {
                        label: "Edit page",
                        href: `/dashboard/pages/${params.id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditPageForm pages={pages} currentPage={page} />
        </main>
    );
}
