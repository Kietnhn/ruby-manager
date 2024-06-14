import CreateSectionLandscapeForm from "@/components/forms/create-form-landscape-section";
import Wrapper from "@/components/wrapper";

export default async function CreateLandScapeSectionPage() {
    return (
        <Wrapper
            breadcrumbs={[
                { label: "Sections", href: "/dashboard/sections" },
                { label: "Create Section", href: "/dashboard/sections/create" },
                {
                    label: "Create Landscape Section",
                    href: "/dashboard/sections/create/landscape",
                },
            ]}
            navigateButton={null}
        >
            <CreateSectionLandscapeForm />
        </Wrapper>
    );
}
