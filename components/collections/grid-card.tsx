import { getCollections } from "@/lib/actions/collection";
import { getPublicIdFromUrl } from "@/lib/utils";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Image,
    Link,
} from "@nextui-org/react";

export default async function GridCard() {
    const collections = await getCollections();
    if (!collections) {
        return <p>Error at get Collection</p>;
    }
    if (collections.length === 0) {
        return <p>Empty collections</p>;
    }
    return (
        <div className="flex gap-4">
            {collections.map((collection, index) => (
                <div className="w-1/3 mb-4">
                    <Link
                        className="w-full h-full"
                        href={`/dashboard/collections/${collection.id}/edit`}
                    >
                        <Card
                            isPressable
                            shadow="sm"
                            key={index}
                            className="w-full h-full"
                        >
                            <CardBody className="overflow-visible  p-0">
                                <Image
                                    width="100%"
                                    alt={getPublicIdFromUrl(collection.image)}
                                    className="w-full object-cover h-full"
                                    classNames={{
                                        wrapper: "h-full",
                                    }}
                                    src={collection.image}
                                />
                            </CardBody>
                            <CardFooter className="text-small justify-between">
                                <b>{collection.name}</b>
                            </CardFooter>
                        </Card>
                    </Link>
                </div>
            ))}
        </div>
    );
}
