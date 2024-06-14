import CreateSectionCarouselForm from "@/components/forms/create-form-carousel-section";
import Wrapper from "@/components/wrapper";

export default async function CreateCarouselSectionPage() {
    return (
        <Wrapper
            breadcrumbs={[
                { label: "Sections", href: "/dashboard/sections" },
                { label: "Create Section", href: "/dashboard/sections/create" },
                {
                    label: "Create Carousel Section",
                    href: "/dashboard/sections/create/carousel",
                },
            ]}
            navigateButton={null}
        >
            <CreateSectionCarouselForm />
        </Wrapper>
    );
}
