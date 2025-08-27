import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Create() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [barcode, setBarcode] = useState("")
    const [cost_price, setCostPrice] = useState("")
    const [sale_price, setSalePrice] = useState("")
    const [stock_quantity, setStock] = useState("")
    const [weight_grams, setWeight] = useState("")
    const [status, setStatus] = useState("")





    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        const fields = {
            "name": name,
            "description": description,
            "barcode": barcode,
            "sale_price": sale_price,
            "cost_price": cost_price,
            "stock_quantity": stock_quantity,
            "weight_grams": weight_grams,
            "status": status
        }
        console.log(fields)

        try {
            
            const { data } = await axios.post("http://localhost:8000/api/products", {
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
            console.log("Created product:", data);
        } catch (error) {
            console.error("create product error", error)
        }

    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add Product</h1>
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Barcode</Label>
                        <Input
                            type="text"
                            name="barcode"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Cost Price</Label>
                        <Input
                            type="number"
                            name="cost_price"
                            value={cost_price}
                            onChange={(e) => setCostPrice(e.target.value)}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Sale Price</Label>
                        <Input
                            type="number"
                            name="sale_price"
                            value={sale_price}
                            onChange={(e) => setSalePrice(e.target.value)}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Stock Quantity</Label>
                        <Input
                            type="number"
                            name="stock_quantity"
                            value={stock_quantity}
                            onChange={(e) => setStock(e.target.value)}

                        />
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Weight (grams)</Label>
                        <Input
                            type="number"
                            name="weight_grams"
                            value={weight_grams}
                            onChange={(e) => setWeight(e.target.value)}

                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label className="block font-medium mb-1">Description</Label>
                        <Textarea
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        ></Textarea>
                    </div>

                    <div>
                        <Label className="block font-medium mb-1">Status</Label>
                        <select
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "archived")}

                        >
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
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
}
