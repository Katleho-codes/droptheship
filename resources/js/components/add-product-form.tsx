import axios from 'axios';
import { FormEventHandler, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { productStatuses, returnOrderStatuses } from '@/lib/status';
import { toast } from 'react-hot-toast';
import { useProductCategories } from '@/hooks/use-product-categories';


export default function AddProductForm({ setOpen }: { setOpen: (value: boolean) => void }) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [barcode, setBarcode] = useState("")
  const [cost_price, setCostPrice] = useState("")
  const [sale_price, setSalePrice] = useState("")
  const [stock_quantity, setStock] = useState("")
  const [weight_grams, setWeight] = useState("")
  const [main_image_url, setMainImageUrl] = useState("")
  const [image_one, setImageOne] = useState("")
  const [image_two, setImageTwo] = useState("")
  const [image_three, setImageThree] = useState("")
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const next = () => setStep((s) => Math.min(s + 1, 13));
  const prev = () => setStep((s) => Math.max(s - 1, 1));
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const {
    productCategories, pagination,
    setPagination, fetchCategories } = useProductCategories();

  useEffect(() => {
    fetchCategories(pagination.pageIndex + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);

    // Reset custom category if the user selects something other than "other"
    if (val !== 'other') {
      setCustomCategory('');
    }
  };



  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const finalCategoryValue = category === 'other' ? customCategory : category;
    const fields = {
      "name": name,
      "description": description,
      "category": finalCategoryValue,
      "barcode": barcode,
      "sale_price": sale_price,
      "cost_price": cost_price,
      "stock_quantity": stock_quantity,
      "weight_grams": weight_grams,
      "main_image_url": main_image_url,
      "image_one": image_one,
      "image_two": image_two,
      "image_three": image_three,
      "status": status
    }
    console.log("fields", fields)

    try {
      setLoading(true);
      setErrors({});
      const { data } = await axios.post("http://localhost:8000/api/products", fields, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (data) {
        setOpen(!open);
        toast(data?.message);
      }
    } catch (error: any) {
      console.error("add product error", error)
      if (error?.response?.data?.message) toast.error(error?.response.data.message);
      if (error?.response && error.response.status === 422) setErrors(error?.response.data.errors);
    } finally {
      setLoading(false)
    }

  };

  return (
    <form>
      {
        step === 1 && (
          <div>
            <Label className="block font-medium mb-1">Name</Label>
            <Input
              type="text"
              name="name"
              placeholder='Running sneaker'
              value={name}
              onChange={(e) => setName(e.target.value)}

            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 2 && (
          <div className="md:col-span-2">
            <Label className="block font-medium mb-1">Description</Label>
            <Textarea
              name="description"
              className='resize-none'
              placeholder='The running sneaker that feels comfortable'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            ></Textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 3 && (
          <div className="md:col-span-2">
            <Label className="block font-medium mb-1">Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {
                    productCategories?.map((cat) => (
                      <SelectItem key={cat?.id} value={cat?.category}>{cat?.category}</SelectItem>

                    ))
                  }
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* Conditional Rendering for the 'Other' input */}
            {category === 'other' ? (
              <>
                <Label className="block font-medium mb-1">Custom category</Label>
                <Input
                  type="text"
                  placeholder="Please specify"
                  name="category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}

                />
              </>
            ) : null}

            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 4 && (
          <div>
            <Label className="block font-medium mb-1">Barcode</Label>
            <Input
              type="text"
              placeholder='ABC-abc-1234'
              name="barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}

            />
            {errors.barcode && (
              <p className="text-red-500 text-sm">{errors.barcode[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 5 && (
          <div>
            <Label className="block font-medium mb-1">Cost Price</Label>
            <Input
              type="number"
              name="cost_price"
              placeholder='300'
              value={cost_price}
              onChange={(e) => setCostPrice(e.target.value)}

            />
            {errors.cost_price ? (
              <p className="text-red-500 text-sm">{errors.cost_price[0]}</p>
            ) : <p className="text-gray-500 text-sm">Has to be equal or lower than sale price</p>}
          </div>
        )
      }
      {
        step === 6 && (
          <div>
            <Label className="block font-medium mb-1">Sale Price</Label>
            <Input
              type="number"
              name="sale_price"
              placeholder='350'
              value={sale_price}
              onChange={(e) => setSalePrice(e.target.value)}

            />
            {errors.sale_price ? (
              <p className="text-red-500 text-sm">{errors.sale_price[0]}</p>
            ) : <p className="text-gray-500 text-sm">Has to be equal or higher than cost price</p>}
          </div>
        )
      }
      {
        step === 7 && (
          <div>
            <Label className="block font-medium mb-1">Stock Quantity</Label>
            <Input
              type="number"
              name="stock_quantity"
              placeholder='10'
              value={stock_quantity}
              onChange={(e) => setStock(e.target.value)}

            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm">{errors.stock_quantity[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 8 && (
          <div>
            <Label className="block font-medium mb-1">Weight (grams)</Label>
            <Input
              type="number"
              name="weight_grams"
              placeholder='10'
              value={weight_grams}
              onChange={(e) => setWeight(e.target.value)}

            />
            {errors.weight_grams && (
              <p className="text-red-500 text-sm">{errors.weight_grams[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 9 && (
          <div>
            <Label className="block font-medium mb-1">Main image url</Label>
            <Input
              type="text"
              name="main_image_url"
              placeholder="https://example.com/image"
              value={main_image_url}
              onChange={(e) => setMainImageUrl(e.target.value)}

            />
            {errors.main_image_url && (
              <p className="text-red-500 text-sm">{errors.main_image_url[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 10 && (
          <div>
            <Label className="block font-medium mb-1">Product image one</Label>
            <Input
              type="text"
              name="image_one"
              placeholder="https://example.com/image"
              value={image_one}
              onChange={(e) => setImageOne(e.target.value)}

            />
            {errors.image_two && (
              <p className="text-red-500 text-sm">{errors.image_two[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 11 && (
          <div>
            <Label className="block font-medium mb-1">Product image two</Label>
            <Input
              type="text"
              name="image_two"
              placeholder="https://example.com/image"
              value={image_two}
              onChange={(e) => setImageTwo(e.target.value)}

            />
            {errors.image_two && (
              <p className="text-red-500 text-sm">{errors.image_two[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 12 && (
          <div>
            <Label className="block font-medium mb-1">Product image three</Label>
            <Input
              type="text"
              name="image_three"
              placeholder="https://example.com/image"
              value={image_three}
              onChange={(e) => setImageThree(e.target.value)}

            />
            {errors.image_three && (
              <p className="text-red-500 text-sm">{errors.image_three[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 13 && (
          <div>
            <Label className="block font-medium mb-1">Status</Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {
                  productStatuses?.map((x) => (

                    <SelectItem key={x?.id} value={x?.name}>{x?.title}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status[0]}</p>
            )}

          </div>
        )
      }

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <Button
            onClick={prev}
            className="cursor-pointer"
            type='button'

          >
            Back
          </Button>
        ) : (
          <span />
        )}

        {step < 13 ? (
          <Button
            type='button'
            onClick={next}
            className="cursor-pointer"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            type='button'
            className="cursor-pointer"
            disabled={!status}
          >
            {loading ? "Saving..." : "Finish"}
          </Button>
        )}
      </div>
    </form>
  )
}
