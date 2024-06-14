import {
    Address,
    Brand,
    Cart,
    Category,
    Collection,
    Employee,
    Gallery,
    Gender,
    Image,
    Measurement,
    Notification,
    Order,
    OrderProduct,
    Page,
    Product,
    Property,
    SectionSource,
    User,
    UserKind,
    Variation,
} from "@prisma/client";

import colors from "color-name";
export type RegisterFrom = {
    name: string;
    email: string;
    password: string;
};
export type State = {
    errors?: {};
    sucess?: boolean;
    message?: string | null;
};

export interface ITopCustomer extends User {
    orders: Order[];
}
export interface ICategory extends Category {
    parent: ICategory | null;
    measurement?: Measurement;
}
export interface PageContainParent extends Page {
    parent?: Page;
}

export type UserNoPassword = Omit<User, "password">;
export interface IAdminUser {
    id: string;
    name: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    gender: Gender | null;
    kind: UserKind;
    employee: Employee | null;
}
// product
export interface VariationNoImages {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    stock: number;
    size: string;
    color: string;
    productId: string;
}
export type VariationData = {
    gallery: Image[];
    sizes: string[];
    quantity: number;
};
export interface FullOrderProduct extends OrderProduct {
    variation: Variation | null;
    product: ProductVariation;
}
export interface ProductVariation extends Product {
    variations: Variation[];
}
export interface IFindProduct extends Product {
    variations: Variation[];
    category: Category | null;
}
export interface DeepProduct extends Product {
    variations: Variation[];
    category: ICategory | null;
    brand: Brand | null;
    properties: Property[];
}
export interface FullProduct extends Product {
    variations: Variation[];
    category: Category | null;
    brand: Brand | null;
    properties: Property[];
}
export interface FullEmployee extends Employee {
    user: User;
}
export interface UploadProduct {
    name: string;
    sku: string;
    weight: string;
    gender: string;
    description: string;
    price: string;
    unitPrice: string;
    fit: string;
    material: string;
    style: string;
    gallery: string;
}
export interface FullOrder extends Order {
    employee: FullEmployee;
    user: User; //customer
    orderProducts: FullOrderProduct[];
}
export interface OrderEmployeeCustomer extends Order {
    employee: FullEmployee;
    user: User; //customer
}
export interface OrderOrderProductVariation extends Order {
    employee: FullEmployee;
    user: User; //customer
    orderProducts: orderProductsVariation[];
}
export interface orderProductsVariation extends OrderProduct {
    variation: OrderVariation;
}
export interface OrderVariation extends Variation {
    product: Product;
}

export type FullVariationNoId = {
    description: string | null;
    quantity: number;
    size: string | null;
    fit: string | null;
    color: string | null;
    material: string | null;
    style: string | null;
    images: string[];
};
export type FlatProduct = {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: string | null;
    categoryCode: string | null;

    brandCode: string | null;
    brand: string | null;
    variationsLength: number;

    gender: string;

    gallery: Gallery[];
    properties: Property[];
    releaseAt: Date | null;
    createdAt: Date;
    updatedAt?: Date;
};

export type ColorData = {
    id: number;
    name: string;
    color: colors.RGB;
};
export interface SelectOption {
    value: string;
    label: string;
}
export interface ISelectColorsData {
    value: string;
    label: string;
    color: colors.RGB;
}
export interface Select {
    id: number;
    option: string;
    values: string[];
}
export type TypeFilter = {
    id: string;
    value: string | string[];
};
export interface IInternalNotification extends Notification {
    variation: Variation | null;
}
// actions dashboard
export interface ITopSelling {
    quantity: number;
    id: string;
    name: string;
    gallery: Gallery[];
    category: {
        name: string;
    } | null;
    sku: string;
}
export interface IRecentOrder {
    id: string;
    name: string;
    price: number;
    priceCurrency: string;
    gallery: Gallery[];
    createdAt: Date;
}
export interface IOutOfStockProduct {
    id: string;
    name: string;
    description: string | null;
    price: number;
    priceCurrency: string;
    gallery: Gallery[];
    _count: {
        variations: number;
    };
}
// country and flag
export type Country = {
    flags: {
        png: string;
        svg: string;
        alt: string;
    };
    name: {
        common: string;
        official: string;
        nativeName: {
            ell: {
                official: string;
                common: string;
            };
            tur: {
                official: string;
                common: string;
            };
        };
    };
    flag: string;
};
export interface ICart {
    product: IFindProduct;
    productId: string;
    userId: string | null;
    variationId: string;
    variation: Variation;
    quantity: number;
}
export interface UserCustomer extends User {
    address: Address;
    orders: Order[];
}
export interface createAddress {
    city?: string;
    country: string;
    postalCode: string;
    addressLine: string;
    state?: string;
}
export interface UserEmployee extends User {
    employee: Employee | null;
}

//collections
export interface FullCollection extends Collection {
    products: Product[];
}
export interface CollectionProductVariation extends Collection {
    products: FullProduct[];
}
export type dataEditProduct = {
    productId: string;
    variations: Variation[];
};
export type GroupedProperties = {
    name: string;
    values: Property[];
};
export type LinkType = {
    name: string;
    href: string;
    icon: any;
    sublinks: LinkType[];
};

// slice
export type TGallery = { color: string; images: string[] };
// section
export type TSectionState = {
    title: string;
    handle: string;
    description: string;
};
export interface TSectionSource extends SectionSource {
    id: string;
}
export interface ISectionCarouselData extends TSectionState {
    sources: SectionSource[];
}

export interface ISectionLandscapeData {
    title: string;
    subTitle?: string;
    description?: string;
    handle: string;
    source: SectionSource;
}
