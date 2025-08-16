import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/hooks/useProducts";

interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

interface InvoiceGeneratorProps {
  products: Product[];
}

export const InvoiceGenerator = ({ products }: InvoiceGeneratorProps) => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const { toast } = useToast();

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: "",
      productName: "",
      price: 0,
      quantity: 1,
      total: 0,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === "productId") {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedItem.productName = product.name;
            updatedItem.price = product.price;
            updatedItem.total = product.price * updatedItem.quantity;
          }
        } else if (field === "quantity" || field === "price") {
          updatedItem.total = updatedItem.price * updatedItem.quantity;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const generateInvoice = () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    if (invoiceItems.length === 0) {
      toast({
        title: "Error", 
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    const invoiceData = {
      customer: { name: customerName, phone: customerPhone },
      items: invoiceItems,
      subtotal,
      tax,
      total,
      date: new Date().toLocaleDateString(),
    };

    console.log("Generating invoice:", invoiceData);
    
    toast({
      title: "Invoice Generated!",
      description: `Invoice for ${customerName} has been created successfully`,
    });

    // Reset form
    setInvoiceItems([]);
    setCustomerName("");
    setCustomerPhone("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Invoice Items</h3>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {invoiceItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items added yet. Click "Add Item" to start.
              </div>
            ) : (
              <div className="space-y-4">
                {invoiceItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-muted/50 rounded-lg">
                    <div className="col-span-4">
                      <Label>Product</Label>
                      <Select 
                        value={item.productId} 
                        onValueChange={(value) => updateItem(item.id, "productId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ₹{product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                        readOnly={item.productId !== ""}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <Label>Total</Label>
                      <Input
                        value={`₹${item.total.toFixed(2)}`}
                        readOnly
                        className="font-medium"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoice Summary */}
          {invoiceItems.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          {/* Generate Button */}
          <Button 
            onClick={generateInvoice}
            className="w-full"
            size="lg"
            disabled={!customerName.trim() || invoiceItems.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};