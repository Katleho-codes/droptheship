import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProduct } from '@/hooks/use-product';
import { useProducts } from '@/hooks/use-products';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function Edit() {
    const [name, setName] = useState<string | undefined>("")
    const [description, setDescription] = useState<string | undefined>("")
    const [barcode, setBarcode] = useState<string | undefined>("")
    const [cost_price, setCostPrice] = useState<number | undefined>()
    const [sale_price, setSalePrice] = useState<number | undefined>()
    const [stock_quantity, setStock] = useState<number | undefined>()
    const [weight_grams, setWeight] = useState<number | undefined>()
    const [status, setStatus] = useState<string | undefined>("")

    const { props } = usePage();
    const { id } = props;
    // console.log("Product ID:", id);
    const { product, productLoading } = useProduct(id);

    useEffect(() => {
        setName(product?.name)
        setDescription(product?.description)
        setBarcode(product?.barcode)
        setCostPrice(product?.cost_price)
        setSalePrice(product?.sale_price)
        setStock(product?.stock_quantity)
        setWeight(product?.weight_grams)
        setStatus(product?.status)
    }, [product?.name, product?.description, product?.barcode, product?.cost_price, product?.sale_price, product?.stock_quantity, product?.weight_grams, product?.status])

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        const fields = {
            "name": name ?? product?.name,
            "description": description ?? product?.description,
            "barcode": barcode ?? product?.barcode,
            "sale_price": sale_price ?? product?.sale_price,
            "cost_price": cost_price ?? product?.cost_price,
            "stock_quantity": stock_quantity ?? product?.stock_quantity,
            "weight_grams": weight_grams ?? product?.weight_grams,
            "status": status ?? product?.status
        }
        console.log(fields)

        try {
            const { data } = await axios.put("http://localhost:8000/api/products/" + id, {
                "name": name,
                "description": description,
                "barcode": barcode,
                "sale_price": sale_price,
                "cost_price": cost_price,
                "stock_quantity": stock_quantity,
                "weight_grams": weight_grams,
                "status": status
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            console.log("updated product:", data);
        } catch (error) {
            console.error("create product error", error)
        }

    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Update Product</h1>
                <Button
                    type="button"
                    className='cursor-pointer'
                >
                    <ChevronLeft size={"10"} />
                    Back
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="block font-medium mb-1">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={name || ""}
                            onChange={(e) => setName(e.target.value)}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Barcode</Label>
                        <Input
                            type="text"
                            name="barcode"
                            value={barcode || ""}
                            onChange={(e) => setBarcode(e.target.value)}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Cost Price</Label>
                        <Input
                            type="number"
                            name="cost_price"
                            value={cost_price ?? ""}
                            onChange={(e) => setCostPrice(Number(e.target.value))}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Sale Price</Label>
                        <Input
                            type="number"
                            name="sale_price"
                            value={sale_price ?? ""}
                            onChange={(e) => setSalePrice(Number(e.target.value))}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Stock Quantity</Label>
                        <Input
                            type="number"
                            name="stock_quantity"
                            value={stock_quantity ?? ""}
                            onChange={(e) => setStock(Number(e.target.value))}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Weight (grams)</Label>
                        <Input
                            type="number"
                            name="weight_grams"
                            value={weight_grams ?? ""}
                            onChange={(e) => setWeight(Number(e.target.value))}

                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label className="block font-medium mb-1">Description</Label>
                        <Textarea
                            name="description"
                            value={description || ""}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        ></Textarea>
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Status</Label>
                        <select
                            name="status"
                            value={status || ""}
                            onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "archived")}

                        >
                            <option value="" disabled>Choose option</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
}
