import { useCustomer } from '@/hooks/use-customer';
import React, { FormEventHandler, useState } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import toast from 'react-hot-toast';


export const AddReturnForm = () => {
  const [order_number, setOrderNumber] = useState("")
  const [customer_id, setCustomerId] = useState("")
  const [reason, setReason] = useState("")
  const [status, setStatus] = useState("")
  const [preferred_resolution, setPrefSolution] = useState("")
  const [return_tracking_number, setReturnTracking] = useState("")
  const [refund_amount, setRefundAmount] = useState("")
  const [refund_method, setRefundMethod] = useState("")
  const [gateway_refund_id] = useState("")
  const [payment_id] = useState("")
  const [customerSearchQuery, setSearchCustomerQuery] = useState('');
  const { customerSearchResults,
    customerSearchLoading } = useCustomer('', customerSearchQuery);
  const [openCustomerSearchCombobox, setOpenCustomerSearchCombobox] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  // const next = () => setStep((s) => Math.min(s + 1, 10));
  // const prev = () => setStep((s) => Math.max(s - 1, 1));
  const next = () => {
    setLoading(false);
    setStep((s) => Math.min(s + 1, 7));
  };

  const prev = () => {
    setLoading(false);
    setStep((s) => Math.max(s - 1, 1));
  };

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const fields = {
      "order_number": order_number,
      "customer_id": customer_id,
      "reason": reason,
      "status": status,
      "preferred_resolution": preferred_resolution,
      "return_tracking_number": "-",
      "refund_amount": parseFloat(refund_amount),
      "refund_method": refund_method,
      "gateway_refund_id": "-", // todo: nothing for now, until payment gateway is setup. TODO
      "payment_id": "-" // todo: nothing for now, until payment gateway is setup. TODO

    }

    try {
      setLoading(true);
      setErrors({});
      const { data } = await axios.post("http://localhost:8000/api/returns", fields, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (data) {
        console.log("add return data", data)
        toast(data?.message);
      }
    } catch (error: any) {
      console.error("add return data error", error)
      if (error?.response && error.response.status === 422) {
        setErrors(error?.response.data.errors); // 👈 store backend errors
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <form>
      {
        step === 1 && (
          <div>
            <Label className="block font-medium mb-1">Order number</Label>
            <Input
              type="text"
              name="order_number"
              value={order_number}
              onChange={(e) => setOrderNumber(e.target.value)}

            />
            {errors.order_number && (
              <p className="text-red-500 text-sm">{errors.order_number[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 2 && (
          <div className='w-full'>
            <Label className="block font-medium mb-1">Customer name</Label>

            <Popover open={openCustomerSearchCombobox} onOpenChange={setOpenCustomerSearchCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCustomerSearchCombobox}
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
                  <CommandInput placeholder="Search customer email..." className="h-9" value={customerSearchQuery}
                    onValueChange={setSearchCustomerQuery} />
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
                            setCustomerId(x?.id?.toString()); // Store the corresponding repairshopr ID
                            setOpenCustomerSearchCombobox(false)
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
        step === 3 && (
          <div>
            <Label className="block font-medium mb-1">Reason for refund</Label>
            <Textarea
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}

            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 4 && (
          <div>
            <Label className="block font-medium mb-1">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statuses</SelectLabel>
                  <SelectItem value="pending_review">Pending review</SelectItem>
                  <SelectItem value="awaiting_item">Awaiting item</SelectItem>
                  <SelectItem value="item_received">Item received</SelectItem>
                  <SelectItem value="approved_for_refund">Approved for refund</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
        step === 5 && (
          <div>
            <Label className="block font-medium mb-1">Preferred resolution</Label>
            <Select value={preferred_resolution} onValueChange={setPrefSolution}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Preferred resolutions</SelectLabel>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.preferred_resolution && (
              <p className="text-red-500 text-sm">{errors.preferred_resolution[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 6 && (
          <div>
            <Label className="block font-medium mb-1">Refund amount</Label>
            <Input
              type="text"
              name="refund_amount"
              value={refund_amount}
              onChange={(e) => setRefundAmount(e.target.value)}

            />
            {errors.refund_amount && (
              <p className="text-red-500 text-sm">{errors.refund_amount[0]}</p>
            )}
          </div>
        )
      }
      {
        step === 7 && (
          <div>
            <Label className="block font-medium mb-1">Refund method</Label>
            <Select value={refund_method} onValueChange={setRefundMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Methods</SelectLabel>
                  <SelectItem value="eft">EFT</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.refund_method && (
              <p className="text-red-500 text-sm">{errors.refund_method[0]}</p>
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
            onClick={handleSubmit}
            type='button'
            className="cursor-pointer"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
    </form>
  )
}
