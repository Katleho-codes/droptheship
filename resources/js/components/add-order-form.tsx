import { useCustomer } from '@/hooks/use-customer';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

export default function AddOrderForm() {

  const [currency, setCurrency] = useState("")
  const [payment_method, setPaymentMethod] = useState("")
  const [payment_status, setPaymentStatus] = useState("")

  const [notes, setNotes] = useState("")
  const [total_amount, setTotalAmount] = useState("")
  const [status, setStatus] = useState("");

  const [query, setQuery] = useState('');
  const [user_id, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [openCombobox, setOpenCombobox] = useState(false);



  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const next = () => setStep((s) => Math.min(s + 1, 8));
  const prev = () => setStep((s) => Math.max(s - 1, 1));
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    const fields = {
      "user_id": user_id,
      "currency": currency,
      "payment_method": payment_method,
      "total_amount": total_amount,
      "payment_status": payment_status,
      "notes": notes,
      "status": status
    }
    console.log(fields)

    try {
      setLoading(true);
      setErrors({});
      const { data } = await axios.post("http://localhost:8000/api/orders", fields, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      console.log("Created order:", data);
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

  // fetch customers when query changes
  const { customerSearchResults,
    customerSearchLoading } = useCustomer('', query);

  console.log("customerSearchResults", customerSearchResults)
  console.log("user_id", user_id)

  return (
    <form onSubmit={handleSubmit}>
      {
        step === 1 && (
          <div className='w-full'>
            <Label className="block font-medium mb-1">Name</Label>

            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {email
                    ? (() => {
                      const customer = customerSearchResults?.find(c => c.email === email);
                      return customer
                        ? `${customer.first_name} ${customer.last_name}`
                        : "Select customer...";
                    })()
                    : "Select customer..."}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search customer email..." className="h-9" value={query}
                    onValueChange={setQuery} />
                  <CommandList>
                    <CommandEmpty>No customer found.</CommandEmpty>
                    <CommandGroup>
                      {customerSearchResults?.map((x) => (
                        <CommandItem

                          key={x.id}
                          value={x.email}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue)
                            setEmail(x.email)
                            setUserId(x?.id?.toString()); // Store the corresponding repairshopr ID
                            setOpenCombobox(false)
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{x.first_name} {x.last_name}</span>
                            <span className="text-xs text-muted-foreground">{x.email} {x.phone && `• ${x.phone}`}</span>
                          </div>
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              email === x.email ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )
      }
      {
        step === 2 && (
          <div>
            <Label className="block font-medium mb-1">Payment method</Label>
            <Select value={payment_method} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Methods</SelectLabel>
                  <SelectItem value="credit_card">Credit card</SelectItem>
                  <SelectItem value="eft">EFT</SelectItem>
                  <SelectItem value="cash_on_delivery">Cash on delivery</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.payment_method && (
              <p className="text-red-500 text-sm">{errors.payment_method[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 3 && (
          <div>
            <Label className="block font-medium mb-1">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statuses</SelectLabel>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 4 && (
          <div>
            <Label className="block font-medium mb-1">Payment status</Label>
            <Select value={payment_status} onValueChange={setPaymentStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statuses</SelectLabel>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.payment_status && (
              <p className="text-red-500 text-sm">{errors.payment_status[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 5 && (
          <div>
            <Label className="block font-medium mb-1">Amount</Label>
            <Input
              type="number"
              name="total_amount"
              value={total_amount}
              onChange={(e) => setTotalAmount(e.target.value)}

            />
            {errors.total_amount && (
              <p className="text-red-500 text-sm">{errors.total_amount[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 6 && (
          <div>
            <Label className="block font-medium mb-1">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currencies</SelectLabel>
                  <SelectItem value="ZAR">ZAR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.currency && (
              <p className="text-red-500 text-sm">{errors.currency[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 7 && (
          <div className="md:col-span-2">
            <Label className="block font-medium mb-1">Notes</Label>
            <Textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            ></Textarea>
            {errors.notes && (
              <p className="text-red-500 text-sm">{errors.notes[0]}</p>
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

        {step < 7 ? (
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
            {loading ? "Saving..." : "Save"}
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
