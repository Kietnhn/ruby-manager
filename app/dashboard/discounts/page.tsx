import Breadcrumbs from "@/components/breadcrumbs";
import { getDiscounts } from "@/lib/actions/discounts";
import { hideCode, toCapitalize } from "@/lib/utils";
import {
    GlobeAltIcon,
    PlusIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Link,
    Tooltip,
} from "@nextui-org/react";
import clsx from "clsx";

export default async function DiscountsPage() {
    const discounts = await getDiscounts();
    return (
        <main className="flex flex-col gap-4">
            <div className="flex items-center justify-between ">
                <div className="">
                    <Breadcrumbs
                        // wrapper="mb-0"
                        breadcrumbs={[
                            {
                                href: "/dashboard/discounts",
                                label: "Discounts",
                                active: true,
                            },
                        ]}
                    />
                </div>
                <Link href="/dashboard/discounts/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add discount
                    </Button>
                </Link>
            </div>
            <div className="flex -mx-4  flex-wrap">
                {discounts.length > 0 &&
                    discounts.map((discount) => (
                        <div className="w-1/4 px-2 mb-4" key={discount.id}>
                            <Card
                                key={discount.id}
                                as={Link}
                                href={`/dashboard/discounts/${discount.id}/edit`}
                            >
                                <CardHeader className="flex flex-row  justify-between items-center">
                                    <div className="flex gap-4">
                                        <Tooltip
                                            content={`${toCapitalize(
                                                discount.type
                                            )} discount`}
                                        >
                                            <TicketIcon
                                                className={clsx("w-8 h-8 ", {
                                                    "text-primary-500":
                                                        discount.type ===
                                                        "FIXED",
                                                    "text-red-500":
                                                        discount.type ===
                                                        "PERCENTAGE",
                                                    "text-green-500":
                                                        discount.type ===
                                                        "SHIPPING",
                                                })}
                                                // fill="currentColor"
                                            />
                                        </Tooltip>
                                        <strong className="text-xl">
                                            {hideCode(discount.code)}
                                        </strong>
                                    </div>
                                    {discount.isPublic && (
                                        <GlobeAltIcon className="w-8 h-8 text-primary" />
                                    )}
                                </CardHeader>
                                <CardBody className="flex flex-row justify-between items-center">
                                    <div className="flex flex-col gap-2">
                                        <strong className="text-xl">
                                            {discount.name}
                                        </strong>
                                        <p className="text-small line-clamp-1">
                                            {discount.description}
                                        </p>
                                    </div>
                                    <div className="">
                                        <Tooltip
                                            content={`${discount.quantity} discounts left`}
                                        >
                                            <strong className="text-xl">
                                                {discount.quantity}
                                            </strong>
                                        </Tooltip>
                                    </div>
                                </CardBody>
                                {/* <CardFooter>
                                {discount.start_date.toLocaleString()}-
                                {discount.end_date.toLocaleString()}
                            </CardFooter> */}
                            </Card>
                        </div>
                    ))}
            </div>
        </main>
    );
}
