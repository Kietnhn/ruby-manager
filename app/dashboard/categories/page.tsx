import {
    AdjustmentsHorizontalIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import { getCategories } from "@/lib/actions/category";
import ListTableViewCategory from "@/components/view-display/list-table-view-category";
import Wrapper from "@/components/wrapper";

export default async function CategoriesPage() {
    const categories = await getCategories();
    if (!categories) {
        return <p>Somethings wrong at get categories</p>;
    }

    return (
        <Wrapper
            breadcrumbs={[
                {
                    href: "/dashboard/categories",
                    label: "Categories",
                },
            ]}
            navigateButton={
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/categories/measurements">
                        <Button color="success">
                            <AdjustmentsHorizontalIcon className="w-5 h-5" />{" "}
                            Measurement
                        </Button>
                    </Link>
                    <Link href="/dashboard/categories/create">
                        <Button color="primary">
                            <PlusIcon className="w-5 h-5" /> New
                        </Button>
                    </Link>
                </div>
            }
        >
            <ListTableViewCategory
                categories={categories}
                tabs={[
                    {
                        href: "/dashboard/categories",
                        title: "Active",
                    },
                    {
                        href: "/dashboard/categories/deleted",
                        title: "Deleted",
                    },
                ]}
            />
        </Wrapper>
    );
}
