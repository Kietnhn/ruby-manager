import { getPublicIdFromUrl, isVideo } from "@/lib/utils";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Image,
    Link,
} from "@nextui-org/react";
import NewCard from "./new-card";
import { getBrands } from "@/lib/actions/brand";

export default async function GridCard() {
    const brands = await getBrands();
    if (!brands || brands.length === 0) {
        return <p>Error at get brands</p>;
    }
    return (
        <div className="flex -mx-2 flex-wrap ">
            {brands.map((brand, index) => (
                <div className="w-1/4 px-2 mb-4">
                    <Card shadow="sm" key={index} className="w-full h-full">
                        <CardHeader className="flex items-center gap-4">
                            <div className="w-10 aspect-square">
                                <Image
                                    className="w-full h-full object-contain"
                                    shadow="sm"
                                    radius="full"
                                    src={brand.logo}
                                    alt={getPublicIdFromUrl(brand.logo)}
                                    classNames={{
                                        wrapper: "h-full",
                                    }}
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <Link href={brand.url} className="text-start">
                                    <b>{brand.name}</b>
                                </Link>
                                <p className="line-clamp-1 text-gray-500 text-start">
                                    {brand.slogan ? brand.slogan : "No slogan"}
                                </p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="">
                            <div className="mb-4">
                                {isVideo(brand.image) ? (
                                    <Card className="w-full h-full relative shadow-none  aspect-video">
                                        <div className="absolute inset-0 bg-video"></div>
                                        <video
                                            src={brand.image}
                                            autoPlay
                                            preload="auto"
                                            loop
                                            className="w-full h-full"
                                        ></video>
                                    </Card>
                                ) : (
                                    <Card className="w-full h-full relative aspect-video">
                                        <Image
                                            shadow="sm"
                                            radius="lg"
                                            width="100%"
                                            alt={getPublicIdFromUrl(
                                                brand.image
                                            )}
                                            className="w-full object-cover h-full"
                                            classNames={{
                                                wrapper: "h-full",
                                            }}
                                            src={brand.image}
                                        />
                                    </Card>
                                )}
                            </div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: brand.description || "",
                                }}
                                className="line-clamp-4"
                            ></div>
                        </CardBody>
                        {/* <CardFooter className="text-small justify-between">
              <b>{brand.namae}</b>
              <p className="text-default-500">{brand.price}</p>
            </CardFooter> */}
                    </Card>
                </div>
            ))}
            <div className="w-1/4 px-2 mb-4 h-full">
                <NewCard />
            </div>
        </div>
    );
}
