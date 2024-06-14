import Wrapper from "@/components/wrapper";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";

export default async function SectionsPage() {
    return (
        <Wrapper
            breadcrumbs={[{ label: "Sections", href: "/dashboard/sections" }]}
            navigateButton={
                <Link href={"/dashboard/sections/create"}>
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add new
                    </Button>
                </Link>
            }
        >
            Sections pages
        </Wrapper>
    );
}
