import { getProductById } from "@/lib/actions/product";
import NotFound from "./edit/not-found";
import ProductDetails from "@/components/products/product-details";
import {
    get3LeastestReviewsOfProduct,
    getSummarizePoint,
} from "@/lib/actions/review";

export default async function ProductDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const [product, reviews, summarise] = await Promise.all([
        getProductById(params.id),
        get3LeastestReviewsOfProduct(params.id),
        getSummarizePoint(params.id),
    ]);

    if (!product) {
        return NotFound();
    }
    return (
        <div>
            <div className="max-w-[1200px] mx-auto ">
                <ProductDetails
                    product={product}
                    summarise={summarise}
                    reviews={reviews}
                />
            </div>
            <div className="h-[1000px]">This is another content</div>
        </div>
    );
}
