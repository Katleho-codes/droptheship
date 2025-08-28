import axios from 'axios';
import { FormEventHandler, useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';


export default function AddProductForm({ setOpen }: { setOpen: (value: boolean) => void }) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [barcode, setBarcode] = useState("")
  const [cost_price, setCostPrice] = useState("")
  const [sale_price, setSalePrice] = useState("")
  const [stock_quantity, setStock] = useState("")
  const [weight_grams, setWeight] = useState("")
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const next = () => setStep((s) => Math.min(s + 1, 8));
  const prev = () => setStep((s) => Math.max(s - 1, 1));
  const totalSteps = 8;
  const [errors, setErrors] = useState<Record<string, string[]>>({});
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
      setLoading(true);
      setErrors({});
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
      if (data?.success === true) {
        setOpen(!open);
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
          {
            step === 1 && (
              <div>
                <Label className="block font-medium mb-1">Name</Label>
                <Input
                  type="text"
                  name="name"
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
              <div>
                <Label className="block font-medium mb-1">Barcode</Label>
                <Input
                  type="text"
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
            step === 3 && (
              <div>
                <Label className="block font-medium mb-1">Cost Price</Label>
                <Input
                  type="number"
                  name="cost_price"
                  value={cost_price}
                  onChange={(e) => setCostPrice(e.target.value)}

                />
                {errors.cost_price && (
                  <p className="text-red-500 text-sm">{errors.cost_price[0]}</p>
                )}
              </div>
            )
          }
          {
            step === 4 && (
              <div>
                <Label className="block font-medium mb-1">Sale Price</Label>
                <Input
                  type="number"
                  name="sale_price"
                  value={sale_price}
                  onChange={(e) => setSalePrice(e.target.value)}

                />
                {errors.sale_price && (
                  <p className="text-red-500 text-sm">{errors.sale_price[0]}</p>
                )}
              </div>
            )
          }
          {
            step === 5 && (
              <div>
                <Label className="block font-medium mb-1">Stock Quantity</Label>
                <Input
                  type="number"
                  name="stock_quantity"
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
            step === 6 && (
              <div>
                <Label className="block font-medium mb-1">Weight (grams)</Label>
                <Input
                  type="number"
                  name="weight_grams"
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
            step === 7 && (
              <div className="md:col-span-2">
                <Label className="block font-medium mb-1">Description</Label>
                <Textarea
                  name="description"
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
            step === 8 && (
              <div>
                <Label className="block font-medium mb-1">Status</Label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">-- Select Status --</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>

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

            {step < 8 ? (
              <Button
                type='button'
                onClick={next}
                className="cursor-pointer"
              >
                Next
              </Button>
            ) : (
              <Button
                type='submit'
                className="cursor-pointer"
                disabled={!status}
              >
                {loading ? "Saving..." : "Finish"}
              </Button>
            )}
          </div>

          {/* <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Product
            </button>
          </div> */}
        </form>
  )
}
