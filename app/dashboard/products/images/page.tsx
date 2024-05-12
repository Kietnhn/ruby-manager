"use client";
import StoreImages from "@/components/store-images";
import { StoreImagesSkeleton } from "@/components/skeletons";
import { Suspense } from "react";
import { CldUploadWidget, CldUploadWidgetResults } from "next-cloudinary";
import { Button } from "@nextui-org/react";
import { saveImage } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
const Images = () => {
    const router = useRouter();
    const handleUploaded = async (result: CldUploadWidgetResults) => {
        await saveImage(result);
    };

    return (
        <main className="">
            <div
                className="flex justify-start items-center gap-4
            "
            >
                <Button
                    isIconOnly
                    aria-label="Back"
                    onClick={() => router.back()}
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </Button>
                <h3 className=" text-xl font-semibold">Select images</h3>
            </div>

            <div className="flex justify-end items-center">
                <CldUploadWidget
                    signatureEndpoint="/api/sign-cloudinary-params"
                    options={{ folder: "/ruby" }}
                    onUpload={handleUploaded}
                >
                    {({ open }) => {
                        return <Button onClick={() => open()}>Upload</Button>;
                    }}
                </CldUploadWidget>
            </div>
            {/* <div className="w-full px-4">
                <h3 className="mb-4 text-xl font-semibold">Store images</h3>

                <Suspense fallback={<StoreImagesSkeleton />}>
                    <StoreImages />
                </Suspense>
            </div> */}
        </main>
    );
};

export default Images;
