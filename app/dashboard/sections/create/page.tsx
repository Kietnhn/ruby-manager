import CreateSectionForm from "@/components/forms/create-form-section";
import Wrapper from "@/components/wrapper";

export default async function CreateSectionPage() {
    return (
        <Wrapper
            breadcrumbs={[
                { label: "Sections", href: "/dashboard/sections" },
                { label: "Create Section", href: "/dashboard/sections/create" },
            ]}
            navigateButton={null}
        >
            <CreateSectionForm />
        </Wrapper>
    );
}
