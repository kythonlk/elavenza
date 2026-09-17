import { Suspense } from "react";
import { getCachedCategories, getCachedProducts } from "@/lib/cache";
import ProductsClientShell from "@/components/storefront/ProductsClientShell";
export const metadata = {
    title: "Shop botanical wellness",
    description:
        "Explore essential oils, carrier oils, skincare and home wellbeing. Filter by collection, price, availability and customer rating.",
    alternates: { canonical: "/products" },
};
export const dynamic = "force-dynamic";
export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const params = await searchParams;
    const value = (key: string) =>
        typeof params[key] === "string" ? (params[key] as string) : "";
    const number = (key: string) => {
        const n = Number(value(key));
        return value(key) !== "" && Number.isFinite(n) && n >= 0
            ? n
            : undefined;
    };
    const page = Math.min(10000, Math.max(1, Math.floor(number("page") || 1)));
    const filters = {
        category: value("category"),
        search: value("search").slice(0, 150),
        sort: value("sort") || "created_at",
        order: value("order") || "desc",
        minPrice: number("min"),
        maxPrice: number("max"),
        inStock: value("stock") === "true",
        onSale: value("sale") === "true",
        minRating: Math.min(5, number("rating") || 0),
    };
    const [data, categories] = await Promise.all([
        getCachedProducts({ ...filters, limit: 12, offset: (page - 1) * 12 }),
        getCachedCategories(),
    ]);
    return (
        <Suspense
            fallback={
                <div className="wrap section">Gathering your botanicals…</div>
            }
        >
            <ProductsClientShell
                products={data.products}
                total={data.total}
                categories={categories}
                page={page}
            />
        </Suspense>
    );
}
