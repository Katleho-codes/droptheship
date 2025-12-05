import axios from 'axios';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function AddProductCategoryForm() {

    const [category, setCategory] = useState("")
    const [subcategory, setSubCategory] = useState("")
    const [addSubcategoryLoading, setLoading] = useState(false)

    const [errors, setErrors] = useState<Record<string, string[]>>({});


    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        const fields = {
            "category": category,
            "subcategory": subcategory,

        }

        try {
            setLoading(true);
            setErrors({});
            const { data } = await axios.post("http://localhost:8000/api/categories", fields, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            if (data?.success === true) {
                toast(data?.message);
            }
        } catch (error: any) {
            if (error?.response && error.response.status === 422) {
                setErrors(error?.response.data.errors); // 👈 store backend errors
            }
        } finally {
            setLoading(false)
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Label className="block font-medium mb-1">Category</Label>
                <Input
                    type="text"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}

                />
                {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category[0]}</p>
                )}
            </div>
            <div>
                <Label className="block font-medium mb-1">Subcategory</Label>
                <Input
                    type="text"
                    name="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubCategory(e.target.value)}

                />
                {errors.subcategory && (
                    <p className="text-red-500 text-sm">{errors.subcategory[0]}</p>
                )}
            </div>


            <Button
                type='submit'
                className="cursor-pointer"
            >
                {addSubcategoryLoading ? "Saving..." : "Save"}
            </Button>


        </form>
    )
}
