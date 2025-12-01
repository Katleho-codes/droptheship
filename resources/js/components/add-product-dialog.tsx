import AddProductFile from './add-product-file';
import AddProductForm from './add-product-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type TDialog = {
    open: boolean;
    setOpen: (data: boolean) => void;
}

const AddProductDialog = ({ open, setOpen }: TDialog) => {
    return (
        <>

            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                {/* <Create /> */}
                {/* <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger> */}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add product</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="form">
                        <TabsList>
                            <TabsTrigger value="form">Form</TabsTrigger>
                            <TabsTrigger value="import">Import</TabsTrigger>
                        </TabsList>
                        <TabsContent value="form"><AddProductForm setOpen={setOpen} /></TabsContent>
                        <TabsContent value="import"><AddProductFile /></TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default AddProductDialog