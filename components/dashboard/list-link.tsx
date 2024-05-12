"use client";
import {
    IOutOfStockProduct,
    IRecentOrder,
    ITopCustomer,
} from "@/lib/definitions";
import { renderPrice } from "@/lib/utils";
import {
    Avatar,
    Image,
    Listbox,
    ListboxItem,
    Tooltip,
} from "@nextui-org/react";
import moment from "moment";
export function ListTopCustomer({ data }: { data: ITopCustomer[] }) {
    return (
        <Listbox variant="flat" items={data} aria-label="top-customer-list">
            {(customer) => (
                <ListboxItem
                    key={customer.id}
                    href={`/dashboard/customers/${customer.id}`}
                    textValue={customer.id}
                >
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Avatar
                                alt={customer.image || undefined}
                                className="flex-shrink-0"
                                size="sm"
                                src={customer.image || undefined}
                            />
                            <div className="flex flex-col">
                                <span className="text-small ">
                                    {customer.name ||
                                        (customer.firstName as string)}
                                </span>
                                {customer.orders.length > 0 && (
                                    <span className="text-tiny text-default-400">
                                        {customer.orders.length} purchase
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-small font-semibold">
                                {customer.score}
                            </p>
                        </div>
                    </div>
                </ListboxItem>
            )}
        </Listbox>
    );
}

export function ListRecentOrders({ data }: { data: IRecentOrder[] }) {
    return (
        <Listbox
            variant="flat"
            items={data}
            aria-label="recent-orders"
            classNames={{ base: "h-full", list: "h-full" }}
        >
            {(product) => (
                <ListboxItem
                    key={product.id}
                    href={`/dashboard/products/${product.id}/edit`}
                    textValue={product.id}
                >
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Image
                                alt={product.gallery[0].image}
                                className="w-14 h-14 object-cover"
                                src={product.gallery[0].image}
                            />
                            <div className="flex flex-col">
                                <span className="text-small font-semibold max-w-52 line-clamp-1 overflow-hidden">
                                    {product.name}
                                </span>
                                <span>
                                    {moment(product.createdAt).fromNow()}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-small font-semibold">
                                {renderPrice(
                                    product.price,
                                    product.priceCurrency
                                )}
                            </p>
                        </div>
                    </div>
                </ListboxItem>
            )}
        </Listbox>
    );
}

export function ListsOutOfStockProducts({
    data,
}: {
    data: IOutOfStockProduct[];
}) {
    return (
        <Listbox variant="flat" items={data} aria-label="recent-orders">
            {(product) => (
                <ListboxItem
                    key={product.id}
                    href={`/dashboard/products/${product.id}/edit`}
                    textValue={product.id}
                >
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Image
                                alt={product.gallery[0].image}
                                className="w-14 h-14 object-cover"
                                src={product.gallery[0].image}
                            />
                            <div className="flex flex-col">
                                <span className="text-small font-semibold max-w-48 line-clamp-1 overflow-hidden">
                                    {product.name}
                                </span>
                                <span className="text-small  max-w-48 line-clamp-1 overflow-hidden">
                                    {product.description}
                                </span>
                            </div>
                        </div>
                        <div>
                            <Tooltip
                                content={`${product._count.variations} variations left`}
                            >
                                <p className="text-small ">
                                    ({product._count.variations})
                                </p>
                            </Tooltip>
                        </div>
                        <div>
                            <p className="text-small font-semibold">
                                {renderPrice(
                                    product.price,
                                    product.priceCurrency
                                )}
                            </p>
                        </div>
                    </div>
                </ListboxItem>
            )}
        </Listbox>
    );
}
function ListItem({
    description,
    imageSrc,
    key,
    title,
}: {
    key: string;
    imageSrc: string | null;
    title: string;
    description?: string;
}) {
    return (
        <ListboxItem key={key} href="/home">
            <div className="flex gap-2 items-center">
                <Avatar
                    alt={imageSrc || undefined}
                    className="flex-shrink-0"
                    size="sm"
                    src={imageSrc || undefined}
                />
                <div className="flex flex-col">
                    <span className="text-small font-semibold">{title}</span>
                    {description && (
                        <span className="text-tiny text-default-400">
                            {description}
                        </span>
                    )}
                </div>
            </div>
        </ListboxItem>
    );
}
